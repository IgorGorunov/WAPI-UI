import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {
    AmazonPrepOrderParamsType,
    AmazonPrepOrderProductWithTotalInfoType,
    SingleAmazonPrepOrderFormType,
    SingleAmazonPrepOrderType,
    WarehouseType,
} from "@/types/amazonPrep";
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNTRIES} from "@/types/countries";
import {sendAmazonPrepData} from '@/services/amazonePrep';
import {DetailsFields, GeneralFields, ReceiverFields} from "./AmazonPrepFormFields";
import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import Icon from "@/components/Icon";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import StatusHistory from "./StatusHistory";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {Table} from "antd";
import DropZone from "@/components/Dropzone";
import {ApiResponseType} from '@/types/api';
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import Services from "./Services";
import WarehouseStatusHistory from "./WarehouseStatusHistory";
import ProductsTotal from "./ProductsTotal";
import {toast, ToastContainer} from '@/components/Toast';
import Pallets from "@/screens/AmazonPrepPage/components/AmazonPrepForm/Pallets";
import {TabFields, TabTitles} from "./AmazonPrepFormTabs";
import {useTabsState} from "@/hooks/useTabsState";
import Loader from "@/components/Loader";
import {AttachedFilesType, STATUS_MODAL_TYPES} from "@/types/utility";
import ProductSelection, {SelectedProductType} from "@/components/ProductSelection";
import Modal from "@/components/Modal";
import useNotifications from "@/context/notificationContext";
import {NOTIFICATION_OBJECT_TYPES, NOTIFICATION_STATUSES, NotificationType} from "@/types/notifications";
import DocumentTickets from "@/components/DocumentTickets";
import SingleDocument from "@/components/SingleDocument";
import {formatDateStringToDisplayString} from "@/utils/date";
import {TICKET_OBJECT_TYPES} from "@/types/tickets";
import CardWithHelpIcon from "@/components/CardWithHelpIcon";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import {AmazonPrepHints} from "@/screens/AmazonPrepPage/amazonPrepHints.constants";
import {CommonHints} from "@/constants/commonHints";
import {sendUserBrowserInfo} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import {isTabAllowed} from "@/utils/tabs";

type AmazonPrepFormType = {
    amazonPrepOrderData?: SingleAmazonPrepOrderType;
    amazonPrepOrderParameters: AmazonPrepOrderParamsType;
    docUuid?: string | null;
    closeAmazonPrepOrderModal: ()=>void;
    refetchDoc: ()=>void;
    forbiddenTabs: string[];
}

const getBoxesAmount = (quantityOld :number, quantityBoxOld: number, quantityNew: number) => {
    const koefficient = quantityOld / quantityBoxOld;
    if (koefficient === Math.round(koefficient)) {
        const newQuantityBox = quantityNew / koefficient;
        if (newQuantityBox === Math.round(newQuantityBox)) {
            return newQuantityBox;
        }
    }
    return 0;
}

const AmazonPrepFormComponent: React.FC<AmazonPrepFormType> = ({amazonPrepOrderParameters, amazonPrepOrderData, docUuid, closeAmazonPrepOrderModal, refetchDoc, forbiddenTabs}) => {
    const { tenantData: { alias, orderTitles }} = useTenant();
    const { token, currentDate, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList, sellersListActive } = useAuth();
    const {notifications} = useNotifications();

    const [isDisabled, setIsDisabled] = useState(!!docUuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);

    //product selection modal
    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);

    //countries
    const countries = useMemo(()=>COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()})),[]);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        closeAmazonPrepOrderModal();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    //tickets
    const [showTicketForm, setShowTicketForm] = useState(false);
    const handleCreateTicket = () => {
        setShowTicketForm(true)
    }

    const warehouses = useMemo(() => {
        if (amazonPrepOrderParameters?.warehouses) {
            const uniqueWarehouses = amazonPrepOrderParameters.warehouses.filter(
                (warehouse, index, self) =>
                    index === self.findIndex(w => w.warehouse.trim() === warehouse.warehouse.trim())
            );

            return uniqueWarehouses
                .map((item: WarehouseType) => ({
                    label: item.warehouse.trim(),
                    value: item.warehouse.trim()
                } as OptionType))
                .sort((a, b) => a.label.localeCompare(b.label)); // Сортировка по метке
        }

        return [];
    }, [amazonPrepOrderParameters]);

    //deliveryMethodOptions
    const deliveryMethodOptions = useMemo(()=>amazonPrepOrderParameters?.deliveryMethod.map(item => ({label: item, value: item})),[amazonPrepOrderParameters]);

    //carrierTypeOptions
    const carrierTypeOptions = useMemo(()=>amazonPrepOrderParameters?.carrierTypes ? amazonPrepOrderParameters?.carrierTypes.map(item => ({label: item, value: item})) : [{label: orderTitles.carrierTitle || 'Company carrier', value: 'WAPI carrier'}, {label: 'Customer carrier', value: 'Customer carrier'}],[amazonPrepOrderParameters, orderTitles]);

    //boxTypesOptions
    const boxesTypeOptions = useMemo(()=> amazonPrepOrderParameters?.boxesTypes ? amazonPrepOrderParameters.boxesTypes.map(item => ({label: item as string, value: item as string})) : [],[amazonPrepOrderParameters]);

    //form
    const defaultFormValues = useMemo(()=>({
        asnNumber: amazonPrepOrderData?.asnNumber || '',
        clientOrderID: amazonPrepOrderData?.clientOrderID || '',
        courierService: amazonPrepOrderData?.courierService || '',
        courierServiceTrackingNumber: amazonPrepOrderData?.courierServiceTrackingNumber || '',
        date: amazonPrepOrderData?.date || currentDate.toISOString(),
        deliveryMethod: amazonPrepOrderData?.deliveryMethod || amazonPrepOrderParameters?.deliveryMethod[0] || "",
        incomingDate: amazonPrepOrderData?.incomingDate || '',
        preferredDeliveryDate: amazonPrepOrderData?.preferredDeliveryDate || '0001-01-01T00:00:00.000Z',
        receiverAddress: amazonPrepOrderData?.receiverAddress || '',
        receiverCity: amazonPrepOrderData?.receiverCity || '',
        receiverComment: amazonPrepOrderData?.receiverComment || '',
        receiverCountry: amazonPrepOrderData?.receiverCountry || '',
        receiverEMail: amazonPrepOrderData?.receiverEMail || '',
        receiverFullName: amazonPrepOrderData?.receiverFullName || '',
        receiverPhone: amazonPrepOrderData?.receiverPhone || '',
        receiverZip: amazonPrepOrderData?.receiverZip || '',
        status: amazonPrepOrderData?.status || '',
        statusAdditionalInfo: amazonPrepOrderData?.statusAdditionalInfo || '',
        trackingLink: amazonPrepOrderData?.trackingLink || '',
        uuid: amazonPrepOrderData?.uuid || '',
        comment: amazonPrepOrderData?.comment || '',
        wapiTrackingNumber: amazonPrepOrderData?.wapiTrackingNumber || '',
        warehouse: amazonPrepOrderData?.warehouse || '',
        carrierType: amazonPrepOrderData?.carrierType || (amazonPrepOrderParameters?.carrierTypes && amazonPrepOrderParameters?.carrierTypes.length && amazonPrepOrderParameters?.carrierTypes[0]) || "",
        multipleLocations: amazonPrepOrderData?.multipleLocations || false,
        boxesType: amazonPrepOrderData?.boxesType || (boxesTypeOptions && boxesTypeOptions.length ? boxesTypeOptions[0].value : '') || '',
        seller: amazonPrepOrderData?.seller || '',
        products:
            amazonPrepOrderData && amazonPrepOrderData?.products && amazonPrepOrderData.products.length
                ? amazonPrepOrderData.products.map((product, index: number) => (
                    {
                        key: `${product.product.uuid} ${Date.now().toString()}_${index}` || `product-${Date.now().toString()}_${index}`,
                        selected: false,
                        product: product.product.uuid || '',
                        quantity: product.quantity || 0,
                        boxesQuantity: product.boxesQuantity || 0,
                        // unitOfMeasure: product.unitOfMeasure.toLowerCase() || '',
                    }))
                : [],
    }),[amazonPrepOrderData]);

    const {control, handleSubmit, formState: { errors }, setError, clearErrors, getValues, setValue, watch} = useForm({
        mode: 'onSubmit',
        defaultValues: defaultFormValues,
    });

    const { append: appendProduct, remove: removeProduct } = useFieldArray({ control, name: 'products' });
    const products = watch('products');

    //products
    const [selectAllProducts, setSelectAllProducts] = useState(false);
    const [productsTotalInfo, setProductsTotalInfo] = useState<AmazonPrepOrderProductWithTotalInfoType>({
        pallets: 0,
        weightNet: 0,
        weightGross: 0,
        volume:0,
    });

    const updateTotalProducts = () => {
        const rez = {
            pallets: amazonPrepOrderData?.pallets?.length || 0,
            weightNet: 0,
            weightGross: 0,
            volume:0,
        };
        getValues('products').forEach(item => {
            const prodInfo = amazonPrepOrderParameters ? amazonPrepOrderParameters?.products.filter(product=>product.uuid === item.product) : [];
            if (prodInfo?.length) {
                rez.weightNet += prodInfo[0].weightNet * Number(item.quantity);
                rez.weightGross += prodInfo[0].weightGross * Number(item.quantity);
                rez.volume += prodInfo[0].volume * Number(item.quantity);
            }
        })

        setProductsTotalInfo(rez);
    };

    useEffect(()=>{
        updateTotalProducts();
    },[products]);

    //form fields
    const warehouse = watch('warehouse');

    const getCourierServices = useCallback((warehouse: string) => {
        if (amazonPrepOrderParameters?.warehouses) {
            if (!warehouse.trim()) {
                const uniqueCourierServices = Array.from(
                    new Set(
                        amazonPrepOrderParameters.warehouses
                            .filter((item: WarehouseType) => item.courierService.trim() !== '')
                            .map((item: WarehouseType) => item.courierService.trim())
                    )
                );

                return uniqueCourierServices
                    .map((courierService: string) => ({
                        label: courierService,
                        value: courierService
                    } as OptionType))
                    .sort((a, b) => a.label.localeCompare(b.label)); // Сортировка по метке
            } else {
                const filteredWarehouses = amazonPrepOrderParameters.warehouses.filter(
                    (item: WarehouseType) => item.warehouse.trim() === warehouse.trim()
                );

                const uniqueCourierServices = Array.from(
                    new Set(
                        filteredWarehouses
                            .filter((item: WarehouseType) => item.courierService.trim() !== '')
                            .map((item: WarehouseType) => item.courierService.trim())
                    )
                );

                return uniqueCourierServices
                    .map((courierService: string) => ({
                        label: courierService,
                        value: courierService
                    } as OptionType))
                    .sort((a, b) => a.label.localeCompare(b.label));
            }
        }
        return [];
    }, [amazonPrepOrderParameters]);

    const handleWarehouseChange = () => {
        // setSelectedWarehouse(selectedOption);
        // setSelectedCourierService('');
        setValue('courierService', '');
        // setValue('products', []);
    }

    // useEffect(() => {
    //     //setValue('products', []);
    // }, [warehouse]);

    const multipleLocations = watch('multipleLocations');

    const linkToTrack = amazonPrepOrderData && amazonPrepOrderData.trackingLink ? <a href={amazonPrepOrderData?.trackingLink} target='_blank'>{amazonPrepOrderData?.trackingLink}</a> : null;

    const generalFields = useMemo(()=> GeneralFields(!amazonPrepOrderData?.uuid, orderTitles), [amazonPrepOrderData])
    const detailsFields = useMemo(()=>DetailsFields({newObject: !amazonPrepOrderData?.uuid, warehouses: warehouses, courierServices: getCourierServices(warehouse), handleWarehouseChange:handleWarehouseChange, linkToTrack, deliveryMethodOptions, carrierTypeOptions}), [warehouse, amazonPrepOrderParameters]);
    const receiverFields = useMemo(()=>ReceiverFields({countries, multipleLocations}),[countries,multipleLocations ])
    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(amazonPrepOrderData?.attachedFiles || []);

    const handleFilesChange = (files: AttachedFilesType[]) => {
        setSelectedFiles(files);
    };

    // const productOptions = useMemo(() =>{
    //     return amazonPrepOrderParameters ? amazonPrepOrderParameters.products.map((item)=>{return {label: `${item.name}`, value:item.uuid}}) : [];
    // },[amazonPrepOrderParameters, warehouse]);

    const selectedSeller = watch('seller');

    const handleSelectedSellerChange = (val:string) => {
        if (val != selectedSeller) setValue('products', []);
    }

    const productOptions = useMemo(() =>{

        let sellersProducts = amazonPrepOrderParameters ? amazonPrepOrderParameters.products : [];
        if (needSeller()) {
            sellersProducts = selectedSeller ? sellersProducts.filter(item=>item.seller===selectedSeller) : [];
        }

        return sellersProducts.map((item)=> ({label: `${item.name}`, value: item.uuid}));

    },[amazonPrepOrderParameters, warehouse, selectedSeller]);


    const getProductColumns = (control: any) => {
        return [
            {
                title: (
                    <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                        <FieldBuilder
                            name={'selectedAllUnits'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked ={selectAllProducts}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllProducts(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.products;
                                fields &&
                                fields.forEach((field, index) => {
                                    setValue(`products.${index}.selected`, e.target.checked);
                                });
                            }}
                        /></div>

                ),
                dataIndex: 'selected',
                width: '40px',
                key: 'selected',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                                <FieldBuilder
                                    name={`products.${index}.selected`}
                                    fieldType={FormFieldTypes.CHECKBOX}
                                    {...field}
                                    disabled={isDisabled}
                                />
                            </div>
                        )}
                    />
                ),
            },

            {
                title: 'Product',
                dataIndex: 'product',
                width: '100%',
                key: 'product',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.product`}
                        control={control}
                        defaultValue={record.product}
                        render={({ field }) => (
                            <div style={{}}>
                                <FieldBuilder
                                    name={`products.${index}.product`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productOptions}
                                    disabled={isDisabled}
                                    onChange={(selectedValue) => {
                                        field.onChange(selectedValue);
                                        updateTotalProducts();
                                    }}
                                />
                            </div>
                        )}
                    />
                ),
            },

            {
                title: 'Qty | units',
                dataIndex: 'quantity',
                key: 'quantity',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '80px'}}>
                                <FieldBuilder
                                    name={`products.${index}.quantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    onChange={(newValue: string) => {field.onChange(newValue);updateTotalProducts();
                                    }}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                title: 'Qty | boxes',
                dataIndex: 'boxesQuantity',
                key: 'quantity',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.boxesQuantity`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '80px'}}>
                                <FieldBuilder
                                    name={`products.${index}.boxesQuantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    onChange={(newValue: string) => {field.onChange(newValue);updateTotalProducts();
                                    }}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                title: '',
                key: 'action',
                minWidth: 50,
                render: (text, record, index) => (
                    <button disabled={isDisabled} className='action-btn' onClick={() => removeProduct(index)}>
                        <Icon name='waste-bin' />
                    </button>
                ),
            },
        ];
    }

    const removeProducts = () => {
        setValue('products', products.filter(item => !item.selected));
        setSelectAllProducts(false);
    }

    //product selection
    const handleProductSelection = () => {
        setShowProductSelectionModal(true);
    }

    const handleAddSelection = (selectedProducts: SelectedProductType[]) => {
        setShowProductSelectionModal(false);

        //make copy of existing products
        const productsBeforeSelection = [...products];
        const fixedRows = [];
        setValue('products', []);

        //add selected products
        selectedProducts.forEach((selectedProduct, index) => {
            //check if product is already here (check key
            const existingProducts = productsBeforeSelection.filter(item => item.product === selectedProduct.product);
            if (existingProducts.length) {
                const sourceRow = existingProducts.length===1 ? existingProducts : existingProducts.filter(item => item.key === selectedProduct.key) ;
                let boxQuantity;
                if (sourceRow.length) {
                    fixedRows.push(selectedProduct.key);
                    boxQuantity = sourceRow[0].boxesQuantity!==0 ? sourceRow[0].boxesQuantity === sourceRow[0].quantity ? Number(selectedProduct.quantity) : getBoxesAmount(Number(sourceRow[0].quantity), Number(sourceRow[0].boxesQuantity), selectedProduct.quantity) : 0;
                    appendProduct({selected: false, key: sourceRow[0].key, product: sourceRow[0].product, quantity: Number(selectedProduct.quantity), boxesQuantity: boxQuantity});

                } else {
                    //change what we have
                    boxQuantity = existingProducts[0].boxesQuantity ? existingProducts[0].boxesQuantity === existingProducts[0].quantity ? Number(selectedProduct.quantity) : getBoxesAmount(Number(existingProducts[0].quantity), Number(existingProducts[0].boxesQuantity), selectedProduct.quantity):  0;
                    appendProduct({selected: false, key: existingProducts[0].key, product: existingProducts[0].product, quantity: selectedProduct.quantity, boxesQuantity: boxQuantity});
                }
                setValue(`products.${index}.quantity`, Number(selectedProduct.quantity));
                setValue(`products.${index}.boxesQuantity`, Number(boxQuantity));

            } else {
                //add new row
                appendProduct(
                    {
                        key: selectedProduct.key,
                        product: selectedProduct.product,
                        quantity: selectedProduct.quantity,
                        selected: false,
                        boxesQuantity: 0,
                    }
                );
            }

        });

        updateTotalProducts();
    }

    //notifications
    let amazonPrepNotifications: NotificationType[] = [];
    if (amazonPrepOrderData && amazonPrepOrderData.uuid && notifications && notifications.length) {
        amazonPrepNotifications = notifications.filter(item => item.objectUuid === amazonPrepOrderData.uuid && item.status !== NOTIFICATION_STATUSES.READ)
        // orderNotifications = notifications.filter(item => item.objectUuid === orderData.uuid)
    }

    const tabTitleArray =  TabTitles(!!amazonPrepOrderData?.uuid, !!(amazonPrepOrderData?.tickets && amazonPrepOrderData?.tickets.length), forbiddenTabs);
    const {tabTitles, updateTabTitles, clearTabTitles, resetTabTables} = useTabsState(tabTitleArray, TabFields);

    useEffect(() => {
        resetTabTables(tabTitleArray);
    }, [amazonPrepOrderData]);

    const onSubmitForm = async (data: SingleAmazonPrepOrderFormType) => {
        const curAction = amazonPrepOrderData ? AccessActions.EditObject : AccessActions.CreateObject;

        console.log()
        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], curAction)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateAmazonPrep', AccessObjectTypes["Orders/AmazonPrep"], curAction), body: {uuid: amazonPrepOrderData?.uuid || ''}});
            } catch {}

            return null;
        }

        setIsLoading(true);
        clearTabTitles();
        //const sendData = {...data, draft: isDraft, selectedFiles: selectedFiles };
        data.draft = isDraft;
        data.attachedFiles = selectedFiles;

        try {
            const requestData = {
                token: token,
                orderData: data,
                alias,
            };

            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateAmazonPrep'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await sendAmazonPrepData(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                if (res.data && 'errorMessage' in res.data) {
                    setModalStatusInfo({
                        statusModalType: STATUS_MODAL_TYPES.WARNING,
                        title: "Warning",
                        subtitle: `Please pay attention, the order has some troubles!`,
                        text: res.data.errorMessage,
                        onClose: closeSuccessModal
                    })
                    setShowStatusModal(true);
                } else {
                    setModalStatusInfo({
                        statusModalType: STATUS_MODAL_TYPES.SUCCESS,
                        title: "Success",
                        subtitle: `Order is successfully ${amazonPrepOrderData?.uuid ? 'edited' : 'created'}!`,
                        onClose: closeSuccessModal
                    })
                    setShowStatusModal(true);
                }

            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Order isn't ${amazonPrepOrderData?.uuid ? 'edited' : 'created'}! There are some errors:!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const onError = (props: any) => {
        const curAction = amazonPrepOrderData ? AccessActions.EditObject : AccessActions.CreateObject;
        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], curAction)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateAmazonPrep', AccessObjectTypes["Orders/AmazonPrep"], curAction), body: {uuid: amazonPrepOrderData?.uuid || ''}});
            } catch {}

            return null;
        }

        // if (isDraft) {
        //     clearErrors();
        //     const formData = getValues();
        //
        //     return onSubmitForm(formData as SingleAmazonPrepOrderFormType);
        // }

        if (isDraft) {
            clearErrors();

            if (needSeller() && props.seller) {
                setError('seller', {
                    type: 'manual',
                    message: 'Seller is required!',
                });

                toast.warn(`Seller is required for draft orders!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                updateTabTitles(['seller']);

            } else {
                const formData = getValues();
                return onSubmitForm(formData as SingleAmazonPrepOrderFormType);
            }
        } else {
            let fieldNames = Object.keys(props);

            if (fieldNames.length > 0) {
                toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            updateTabTitles(fieldNames);
        }


        // const fieldNames = Object.keys(props);
        //
        // if (fieldNames.length > 0) {
        //     toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
        //         position: "top-right",
        //         autoClose: 1000,
        //     });isActionIsAccessible
        // }
        // updateTabTitles(fieldNames);
    };

    const handleEditClick = () => {
        // ()=>
        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('EditAmazonPrep', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.EditObject), body: {uuid: amazonPrepOrderData?.uuid || ''}});
            } catch {}
        } else {
            setIsDisabled(!(amazonPrepOrderData?.canEdit || !amazonPrepOrderData?.uuid))
        }
    }

    return <div className='amazon-prep-info'>
        {(isLoading || !amazonPrepOrderParameters) && <Loader />}
        <ToastContainer />
        {amazonPrepOrderParameters ? <><form onSubmit={handleSubmit(onSubmitForm, onError)}>
            <Tabs id='amazon-prep-tabs' tabTitles={tabTitles} classNames='inside-modal' notifications={amazonPrepNotifications} >
                {isTabAllowed('General', forbiddenTabs) ? <div key='general-tab' className='general-tab'>
                    <>
                        {needSeller() ? (
                            <div className='form-wrapper--seller card'>
                                <div className='grid-row'>
                                    <Controller
                                        key='seller'
                                        name='seller'
                                        control={control}
                                        render={(
                                            {
                                                field: {...props},
                                                fieldState: {error}
                                            }) => (
                                            <FieldBuilder
                                                // disabled={!!isDisabled}
                                                {...props}
                                                name='seller'
                                                label='Seller* : '
                                                fieldType={FormFieldTypes.SELECT}
                                                options={(amazonPrepOrderData?.status !=='Draft' && !!amazonPrepOrderData) ? sellersList : sellersListActive}
                                                placeholder={''}
                                                errorMessage={error?.message}
                                                errors={errors}
                                                disabled={isDisabled || (amazonPrepOrderData?.status !=='Draft' && !!amazonPrepOrderData)}
                                                width={WidthType.w50}
                                                classNames={'seller-filter'}
                                                isClearable={false}
                                                onChange={(val: string)=>{
                                                    handleSelectedSellerChange(val);
                                                    props.onChange(val);
                                                }}
                                            />
                                        )}
                                        rules = {{required: "Required field"}}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <CardWithHelpIcon classNames='card amazon-prep-info--general'>
                            <h3 className='amazon-prep-info__block-title'>
                                <Icon name='general' />
                                General
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors} isDisabled={isDisabled}/>
                            </div>
                        </CardWithHelpIcon>
                    </>
                </div> : null }
                {isTabAllowed('Delivery info', forbiddenTabs) ? <div key='delivery-tab' className='delivery-tab'>
                    <CardWithHelpIcon classNames='card amazon-prep-info--details'>
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='additional' />
                            Details
                        </h3>
                        <div className='grid-row check-box-bottom'>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </CardWithHelpIcon>
                    <CardWithHelpIcon classNames='card amazon-prep-info--receiver'>
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='receiver' />
                            Receiver
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </CardWithHelpIcon>
                </div> : null }
                {isTabAllowed('Products', forbiddenTabs) ? <div key='product-tab' className='product-tab'>
                    <CardWithHelpIcon classNames="card min-height-600 amazon-prep-info--products">
                        {/*<TutorialHintTooltip hint={AmazonPrepHints['products'] || ''} position='left' >*/}
                            <h3 className='amazon-prep-info__block-title'>
                                <Icon name='goods' />
                                Products
                            </h3>
                        {/*</TutorialHintTooltip>*/}

                        <div className='grid-row '>
                            <div className='amazon-prep-info--order-btns  width-100'>
                                {/*<div className='grid-row'>*/}
                                <div className='amazon-prep-info--btns small-paddings width-100'>
                                    <div className='amazon-prep-info--btns__radio'>
                                        <Controller
                                            key='boxesType'
                                            name='boxesType'
                                            control={control}
                                            render={(
                                                {
                                                    field: { ...props},
                                                    fieldState: {error}
                                                }) => (
                                                <FieldBuilder
                                                    disabled={!!isDisabled}
                                                    {...props}
                                                    name='boxesType'
                                                    label=''
                                                    fieldType={FormFieldTypes.RADIO}
                                                    options={boxesTypeOptions}
                                                    errorMessage={error?.message}
                                                    errors={errors}
                                                    // width={WidthType.w50}
                                                    hint={AmazonPrepHints['boxTypes'] || ''}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className='amazon-prep-info--btns__table-btns'>
                                        <TutorialHintTooltip hint={AmazonPrepHints['selection'] || ''} forBtn >
                                            <Button type="button" icon='selection' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={() => handleProductSelection()} classNames='selection-btn' >
                                                Add from List
                                            </Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn >
                                            <Button type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={() => appendProduct({ key: `product-${Date.now().toString()}`, selected: false, product: '', quantity:0, boxesQuantity: 0})}>
                                                Add by SKU
                                            </Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn >
                                            <Button type="button" icon='remove-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeProducts}>
                                                Remove selected
                                            </Button>
                                        </TutorialHintTooltip>
                                    </div>
                                </div>
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className='amazon-prep-info--table table-form-fields form-table'>
                            <Table
                                columns={getProductColumns(control)}
                                dataSource={getValues('products')?.map((field, index) => ({ key: field.product+'-'+index, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />
                            <ProductsTotal productsInfo={productsTotalInfo} />
                        </div>
                    </CardWithHelpIcon>
                </div> : null }
                {amazonPrepOrderData?.uuid && isTabAllowed('Pallets', forbiddenTabs) &&
                    <div key='pallets-tab' className='pallets-tab'>
                        <div className="card min-height-600 amazon-prep-info--pallets">
                            <h3 className='amazon-prep-info__block-title'>
                                <Icon name='bundle' />
                                Pallets
                            </h3>
                            <Pallets pallets={amazonPrepOrderData?.pallets} />
                        </div>
                    </div>
                }
                {amazonPrepOrderData?.uuid && isTabAllowed('Services', forbiddenTabs) &&
                    <div key='services-tab' className='services-tab'>
                        <div className="card min-height-600 amazon-prep-info--services">
                            <h3 className='amazon-prep-info__block-title'>
                                <Icon name='bundle' />
                                Services
                            </h3>
                            <Services services={amazonPrepOrderData?.services} />
                        </div>
                    </div>
                }
                {amazonPrepOrderData?.uuid && isTabAllowed('Status history', forbiddenTabs) &&
                    <div key='status-history-tab' className='status-history-tab'>
                        <div className="card amazon-prep-info--history">
                            <h3 className='amazon-prep-info__block-title'>
                                <Icon name='history'/>
                                Status history
                            </h3>
                            <StatusHistory statusHistory={amazonPrepOrderData?.statusHistory}/>
                        </div>

                        {amazonPrepOrderData?.warehouseStatusHistory && amazonPrepOrderData?.warehouseStatusHistory.length ? <div className="card amazon-prep-info--history">
                            <h3 className='amazon-prep-info__block-title'>
                                <Icon name='warehouse'/>
                                Warehouse status history
                            </h3>
                            <WarehouseStatusHistory statusHistory={amazonPrepOrderData?.warehouseStatusHistory}/>
                        </div> : null}
                    </div>
                }
                {amazonPrepOrderData?.uuid && amazonPrepOrderData.tickets.length && isTabAllowed('Tickets', forbiddenTabs) ?
                    <div key='tickets-tab' className='tickets-tab'>
                        <div className="card min-height-600 amazon-prep-info--tickets">
                            <h3 className='amazon-prep-info__block-title'>
                                <Icon name='ticket'/>
                                Tickets
                            </h3>
                            <DocumentTickets tickets={amazonPrepOrderData.tickets}/>
                        </div>
                    </div> : null}
                {isTabAllowed('Files', forbiddenTabs) ? <div key='files-tab' className='files-tab'>
                    <CardWithHelpIcon classNames="card min-height-600 amazon-prep-info--files">
                        <TutorialHintTooltip hint={AmazonPrepHints['files'] || ''} position='left' >
                            <h3 className='amazon-prep-info__block-title title-small'>
                                <Icon name='files' />
                                Files
                            </h3>
                        </TutorialHintTooltip>
                        <div className='dropzoneBlock'>
                            <DropZone readOnly={!!isDisabled} files={selectedFiles} onFilesChange={handleFilesChange} docUuid={amazonPrepOrderData?.canEdit ? amazonPrepOrderData?.uuid : ''} hint="Product labels, Carton labels, Pallet labels, Excel file and any other files related to the order. Available formats: pdf, xls, xlsx." banCSV={true}/>
                        </div>
                    </CardWithHelpIcon>
                </div> : null }
            </Tabs>

            <div className='form-submit-btn'>
                {amazonPrepOrderData && amazonPrepOrderData.uuid && isTabAllowed('Tickets', forbiddenTabs) ? <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight onClick={handleCreateTicket}>Create ticket</Button> : null}
                {isDisabled && amazonPrepOrderData?.canEdit && <Button type="button" disabled={false} onClick={handleEditClick} variant={ButtonVariant.PRIMARY}>Edit</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY} onClick={()=>setIsDraft(true)}>Save as draft</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={()=>setIsDraft(false)}  variant={ButtonVariant.PRIMARY} >Save</Button>}
            </div>
            </form>
                {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
                {showProductSelectionModal && <Modal title={`Product selection`} onClose={()=>setShowProductSelectionModal(false)} noHeaderDecor >
                    <ProductSelection alreadyAdded={products as SelectedProductType[]} handleAddSelection={handleAddSelection} selectedDocWarehouse={warehouse} needOnlyOneWarehouse={false}/>
                </Modal>}
                {showTicketForm && <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} subjectType={TICKET_OBJECT_TYPES.AmazonPrep} subjectUuid={docUuid} subject={`AmazonPrep ${amazonPrepOrderData?.wapiTrackingNumber} ${amazonPrepOrderData?.date ? formatDateStringToDisplayString(amazonPrepOrderData.date) : ''}`} onClose={()=>{setShowTicketForm(false); refetchDoc();}} seller={needSeller() ? amazonPrepOrderData.seller : ''}/>}
            </>
        :null}
    </div>
}

export default AmazonPrepFormComponent;
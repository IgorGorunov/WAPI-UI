import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth from "@/context/authContext";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNTRIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {DetailsFields, GeneralFields} from "./StockMovementFormFields";
import {TabFields, TabTitles} from "./StockMovementFormTabs";
import {FormFieldTypes, OptionType} from "@/types/forms";
import Icon from "@/components/Icon";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import StatusHistory from "./StatusHistory";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {Table, Tooltip} from "antd";
import DropZone from "@/components/Dropzone";
import Services from "./Services";
import {useTabsState} from "@/hooks/useTabsState";
import Loader from "@/components/Loader";
import {toast, ToastContainer} from '@/components/Toast';
import {
    SingleStockMovementFormType,
    SingleStockMovementType,
    STOCK_MOVEMENT_DOC_SUBJECT,
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementParamsType
} from "@/types/stockMovements";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {sendInboundData, updateInboundData} from "@/services/stockMovements";
import {ApiResponseType} from "@/types/api";
import {SingleOrderProductFormType} from "@/types/orders";
import Modal from "@/components/Modal";
import ImportFilesBlock from "@/components/ImportFilesBlock";
import {ImportFilesType} from "@/types/importFiles";
import ProductsTotal from "@/screens/StockMovementsPage/components/StockMovementForm/ProductsTotal";
import {AttachedFilesType, STATUS_MODAL_TYPES} from "@/types/utility";
import ProductSelection, {SelectedProductType} from "@/components/ProductSelection";
import DocumentTickets from "@/components/DocumentTickets";
import SingleDocument from "@/components/SingleDocument";
import {NOTIFICATION_OBJECT_TYPES, NOTIFICATION_STATUSES, NotificationType} from "@/types/notifications";
import {TICKET_OBJECT_TYPES} from "@/types/tickets";
import {formatDateStringToDisplayString} from "@/utils/date";
import CardWithHelpIcon from "@/components/CardWithHelpIcon";
import {StockMovementsHints} from "@/screens/StockMovementsPage/stockMovementsHints.constants";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import {docNamesSingle} from "@/screens/StockMovementsPage";
import {CommonHints} from "@/constants/commonHints";
import useNotifications from "@/context/notificationContext";
import {camelCaseToSentence} from "@/utils/textMessage";


type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';



type StockMovementFormType = {
    docType: STOCK_MOVEMENT_DOC_TYPE,
    docData?: SingleStockMovementType;
    docParameters?: StockMovementParamsType;
    closeDocModal: ()=>void;
    refetchDoc: ()=>void;
}

const CONTAINER = 'Container';
const transportationTypesDefault = [CONTAINER,'FullTrack', 'PalletsOrBoxes'];

const StockMovementFormComponent: React.FC<StockMovementFormType> = ({docType, docData, docParameters, closeDocModal, refetchDoc}) => {
    const [isDisabled, setIsDisabled] = useState(!!docData?.uuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [isJustETA, setIsJustETA] = useState(false);
    const [isFinished, setIsFinished] = useState(docData?.status === 'Finished');

    const isOutboundOrStockMovement = docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT;

    //product selection
    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);

    const { token, currentDate, superUser, ui } = useAuth();
    const {notifications} = useNotifications();

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback((isImport=false)=>{
        setShowStatusModal(false);
        !isImport && closeDocModal();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    //tickets
    const [showTicketForm, setShowTicketForm] = useState(false);
    const handleCreateTicket = () => {
        setShowTicketForm(true)
    }

    //form
    const {control, handleSubmit,trigger, formState: { errors }, getValues, setValue, watch, clearErrors} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            //date: docData?.date || currentDate.toISOString(),
            number: docData?.number || '',
            incomingDate: docData?.incomingDate || currentDate.toISOString(),
            incomingNumber: docData?.incomingNumber || '',
            deliveryMethod: docData?.deliveryMethod || '',
            transportationType: docData?.transportationType || '',
            container20Amount: docData?.container20Amount || 0,
            container40Amount: docData?.container40Amount || 0,
            labelingNeeds: docData?.labelingNeeds || false,
            mixedCarton: docData?.mixedCarton || false,
            sender: docData?.sender || (docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || docType===STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE ? 'Customer' : ''),
            senderCountry: docData?.senderCountry || '',
            receiver: docData?.receiver || (docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType===STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE ? 'Customer' : ''),
            receiverCountry: docData?.receiverCountry || '',
            estimatedTimeArrives: docData?.estimatedTimeArrives || '0001-01-01T00:00:00',
            uuid: docData?.uuid || '',
            courierServiceTrackingNumber: docData?.courierServiceTrackingNumber || '',
            comment: docData?.comment || '',
            status: docData?.status || '',
            statusAdditionalInfo: docData?.statusAdditionalInfo || '',

            products:
                docData && docData?.products && docData.products.length
                    ? docData.products.map((product, index: number) => (
                        {
                            key: product.product.uuid || `product-${Date.now().toString()}_${index}`,
                            selected: false,
                            product: product.product.uuid || '',
                            quantityPlan: product.quantityPlan || '',
                            quantity: product.quantity || '',
                            unitOfMeasure: product.unitOfMeasure || '',
                            quality: product.quality || '',
                        }))
                    : [],
        }
    });


    const { append: appendProduct, remove: removeProduct } = useFieldArray({ control, name: 'products' });
    const products = watch('products');
    //const currencyOptions = useMemo(()=>{return docParameters && docParameters?.currencies.length ? createOptions(docParameters?.currencies) : []},[]);

    const sender = watch('sender');
    const receiver = watch('receiver');
    const [importType, setImportType] = useState('');

    //countries
    const allCountries = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    //sender
    const senderOptions = docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || !docParameters.sender ? [] : docParameters.sender.map(item => ({label: item.warehouse, value: item.warehouse}));
    const onSenderChange = (newSender: string) => {
        if (docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || docType===STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE) return;
        const newSenderCountry = docParameters.sender ? docParameters.sender.filter(item=>item.warehouse===newSender) : [];
        setValue('senderCountry',newSenderCountry.length ? newSenderCountry[0].country : '', { shouldValidate: true });
    }

    //receiver
    const receiverOptions = docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || !docParameters.receiver ? [] : docParameters.receiver.map(item => ({label: item.warehouse, value: item.warehouse}));
    const onReceiverChange = (newReceiver: string) => {
        if (docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType===STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE) return;
        const newReceiverCountry = docParameters.receiver ? docParameters.receiver.filter(item=>item.warehouse===newReceiver) : [];
        setValue('receiverCountry',newReceiverCountry.length ? newReceiverCountry[0].country : '', { shouldValidate: true });
    }

    //products
    const [selectAllProducts, setSelectAllProducts] = useState(false);

    const productQualityOptions = createOptions(docParameters.quality);
    //temporarily
    if (!docParameters.quality.includes('Saleable')) {
        productQualityOptions.push({label: 'Saleable', value: 'Saleable'});
    }

    const productOptions = useMemo(() =>{
        return docParameters.products.map((item)=>{return {label: `${item.name}`, value:item.uuid} });
    },[docParameters]);

    const checkSelectedProductValue = (selectedValue) => {
        //console.log('selected val:', selectedValue, productOptions.filter(item=>item.value===selectedValue))

    }

    //deliveryMethodOptions
    //const deliveryMethodOptions = useMemo(()=>docParameters?.deliveryMethod.map(item => ({label: item, value: item})),[docParameters]);
    const deliveryMethodOptions = useMemo(()=>['PLL','SPD'].map(item => ({label: item, value: item} as OptionType)),[]);
    const container20 = watch('container20Amount');
    const container40 = watch('container40Amount');

    useEffect(() => {
        if (container20 || container40) {
            trigger('container20Amount');
            trigger('container40Amount');
        }

    }, [container20, container40]);


    //transportation type
    const transportationTypeOptions = useMemo(()=>transportationTypesDefault.map(item => ({label: camelCaseToSentence(item), value: item} as OptionType)),[]);
    const transportationType = watch('transportationType');

    const setQuantityActual = (record: SingleOrderProductFormType, index: number) => {
        const product = getValues('products')[index];
        setValue(`products.${index}.quantity`, +product.quantityPlan === 0 ?'': product.quantityPlan, { shouldValidate: true });
        setValue(`products.${index}.quantityPlan`, +product.quantityPlan === 0 ?'': product.quantityPlan, { shouldValidate: true });
    }

    const isQuantityActualHidden = !(docData?.status && docData?.status.toLowerCase() === 'finished');

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
                        />
                    </div>
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
                // title: 'Product*',
                title: <Tooltip title="Select the product" >
                            <span>Product*</span>
                       </Tooltip>,
                dataIndex: 'product',
                width: '100%',
                key: 'product',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.product`}
                        control={control}
                        defaultValue={record.product}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{minWidth: '150px'}}>
                                <FieldBuilder
                                    name={`products.${index}.product`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productOptions}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(selectedValue) => {
                                        field.onChange(selectedValue);
                                        checkSelectedProductValue(selectedValue);
                                        //updateTotalProducts();
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                //title: 'Quantity plan*',
                title: <Tooltip title="Quantity of the product in pcs" >
                    <span>Quantity plan*</span>
                </Tooltip>,
                dataIndex: 'quantityPlan',
                key: 'quantityPlan',
                minWidth: 50,
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.quantityPlan`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '70px'}}>
                                <FieldBuilder
                                    name={`products.${index}.quantityPlan`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        setQuantityActual(record, index);
                                    }}
                                    classNames={!isQuantityActualHidden && record.quantity !==record.quantityPlan ? 'highlight-error' : ''}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Quantity actual*',
                dataIndex: 'quantity',
                key: 'quantity',
                minWidth: 50,
                className: `${isQuantityActualHidden ? 'hidden-column' : ''}`,
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.quantity`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '70px'}}>
                                <FieldBuilder
                                    name={`products.${index}.quantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={true}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        // calcProductTotal(record, index);
                                    }}
                                    classNames={!isQuantityActualHidden && record.quantity !==record.quantityPlan ? 'highlight-error' : ''}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Unit of measure',
                dataIndex: 'unitOfMeasure',
                key: 'unitOfMeasure',
                minWidth: 70,
                //responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.unitOfMeasure`}
                        control={control}
                        render={({ field, fieldState: {error}}) => (
                            <div style={{minWidth: '70px', maxWidth: '70px'}}>
                                <FieldBuilder
                                    name={`products.${index}.unitOfMeasure`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    //options={getUnitsOptions(index)}
                                    disabled={true}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                //title: 'Quality',
                title: <Tooltip title="Quality of the product" >
                    <span>Quality*</span>
                </Tooltip>,
                dataIndex: 'quality',
                key: 'quality',
                minWidth: 150,
                responsive: ['md'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.quality`}
                        control={control}
                        render={({ field, fieldState: {error}}) => (
                            <div style={{minWidth: '140px', maxWidth: '150px'}}>
                                <FieldBuilder
                                    name={`products.${index}.quality`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productQualityOptions}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
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
                minWidth: 500,
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

                if (sourceRow.length) {
                    fixedRows.push(selectedProduct.key);
                    appendProduct({...sourceRow[0], quantity: selectedProduct.quantity});
                } else {
                    //change what we have
                    appendProduct({...existingProducts[0], quantity: selectedProduct.quantity});
                }
                setValue(`products.${index}.quantity`, selectedProduct.quantity);
                setValue(`products.${index}.quantityPlan`, selectedProduct.quantity);
            } else {
                //add new row
                appendProduct(
                    {
                        key: selectedProduct.key,
                        product: selectedProduct.product,
                        quantity: selectedProduct.quantity,
                        selected: false,
                        quantityPlan: selectedProduct.quantity,
                        unitOfMeasure:'pcs',
                        quality: 'Saleable'
                    }
                );
            }

        });

        //set sender warehouse if needed
        if (selectedProducts.length && isOutboundOrStockMovement) {

            setValue('sender', selectedProducts[0].warehouse);
            if (receiver === selectedProducts[0].warehouse) {
                setValue('receiver', '');
                setValue('receiverCountry', '');
            }
            onSenderChange(selectedProducts[0].warehouse);
        }
    }

    const [isSenderDisabled, setIsSenderDisabled] = useState<boolean>(isOutboundOrStockMovement && !!(docData && docData?.products && docData.products.length && sender));

    useEffect(() => {
        if (products.length && sender && isOutboundOrStockMovement) {
            //make field not clickable
            setIsSenderDisabled(true)
        } else {
            setIsSenderDisabled(false)
        }
    }, [products, sender]);

    //notifications
    let docNotifications: NotificationType[] = [];
    if (docData && docData.uuid && notifications && notifications.length) {
        docNotifications = notifications.filter(item => item.objectUuid === docData.uuid && item.status !== NOTIFICATION_STATUSES.READ)
    }


    //form fields
    const generalFields = useMemo(()=> GeneralFields(
        {
            newObject: !docData?.uuid,
            docType: docType,
            canEditATA: !!(docData?.uuid && !docData.canEdit && !isFinished),
            // transportationTypeOptions: transportationTypeOptions,
            // isContainer: (transportationType === 'Container'),
            // deliveryMethodOptions: deliveryMethodOptions,
            // container20Value: container20,
            // container40Value: container40,
        }
    ), [docData]);

    const detailsFields = useMemo(()=>DetailsFields(
        {
            newObject: !docData?.uuid,
            docType: docType,
            countryOptions: allCountries,
            senderOptions, receiverOptions,
            onSenderChange, onReceiverChange,
            canEditETA:!!(docData?.uuid && !docData.canEdit && !isFinished),
            senderHide: !!docData?.senderHide,
            receiverHide: !!docData?.receiverHide,
            sender: sender, receiver:receiver,
            isSenderDisabled: isSenderDisabled,
            transportationTypeOptions: transportationTypeOptions,
            isContainer: (transportationType === CONTAINER),
            deliveryMethodOptions: deliveryMethodOptions,
            container20Value: container20,
            container40Value: container40,
        }), [docData, products, sender, receiver, isSenderDisabled, transportationType, container20, container40]);
    //const productsTotalFields = useMemo(()=>ProductsTotalFields(), [docData]);


    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(docData?.attachedFiles || []);

    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    //import files modal
    const addImportedProducts = (importedProducts) => {

        if (!importedProducts || !Array.isArray(importedProducts)) return;
        const existedRows = products.length;

        for (let i=0; i < importedProducts.length; i++) {
            appendProduct({
                key: `product-${Date.now().toString()}_${existedRows+i}`,
                selected: false,
                product: importedProducts[i].product ? importedProducts[i].product.uuid || '' : '',
                quantityPlan: importedProducts[i].quantityPlan || '',
                quantity: importedProducts[i].quantity || importedProducts[i].quantityPlan || '',
                unitOfMeasure: importedProducts[i].unitOfMeasure || 'psc',
                quality: importedProducts[i].quality || 'Saleable',
            })
        }
    }

    const [importResponse, setImportResponse] = useState<ApiResponseType|null>(null);

    useEffect(() => {

        if (!importResponse) return;

        //check if it is an error
        if (importResponse?.status === 200) {
            //imported successfully

            //import data
            addImportedProducts(importResponse?.data?.data || importResponse?.data || []);

            //show success message
            const modalSubTitle = importType === 'fillByStock' ? 'Document filled by stock successfully' : 'Products are successfully imported';
            setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: modalSubTitle, onClose: ()=>closeSuccessModal(true)})
            setShowStatusModal(true);
        } else {
            //there are errors

            //import what we can
            addImportedProducts(importResponse?.response?.data?.data);

            //show error message
            const errorMessages = importResponse?.response?.data?.errorMessage || [];

            setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR,title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal})
            setShowStatusModal(true);

        }
    }, [importResponse]);


    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }
    const handleImportXLS = () => {
        setImportType('importXLS');
        setShowImportModal(true)
    }

    //const [showFillModal, setShowFillModal] = useState(false);
    // const onFillModalClose = () => {
    //     setShowFillModal(false);
    // }
    // const handleFillByStock = () => {
    //     setImportType('fillByStock');
    //     setShowFillModal(true)
    // }

    const tabTitleArray =  TabTitles(!!docData?.uuid, !!(docData?.tickets && docData?.tickets.length));
    const {tabTitles, updateTabTitles, clearTabTitles, resetTabTables} = useTabsState(tabTitleArray, TabFields);

    useEffect(() => {
        resetTabTables(tabTitleArray);
    }, [docData]);

    const sendJustETA = async(data) => {
        const requestData = {
            token,
            documentData: {
                uuid: data.uuid,
                estimatedTimeArrives: data.estimatedTimeArrives,
                courierServiceTrackingNumber: data.courierServiceTrackingNumber,
            },
        };
        return await updateInboundData(superUser && ui ? {...requestData, ui} : requestData);
    }

    const sendDocument = async(data) => {
        const requestData = {
            token,
            documentType: docType,
            documentData: data,
        };
        return await sendInboundData(superUser && ui ? {...requestData, ui} : requestData);
    }

    const onSubmitForm = async (data) => {
        clearTabTitles();
        setIsLoading(true);

        data.draft = isDraft;
        data.attachedFiles= selectedFiles;
        data.products.forEach(item => item.quality = item.quality || 'Saleable');
        if (data?.transportationType !== CONTAINER) {
            data.container20Amount = 0;
            data.container40Amount = 0;
        }

        try {
            const res = isJustETA ? await sendJustETA(data) : await sendDocument(data);

            if (res && "status" in res) {
                if (res?.status === 200) {
                    //success
                    setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Document is successfully ${ docData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal})
                    setShowStatusModal(true);
                }
            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
            setIsJustETA(false);
        }
    }

    const onError = (props: any) => {
        if (isDraft || isJustETA) {
            clearErrors();
            const formData = getValues();
            return onSubmitForm(formData as SingleStockMovementFormType);
        }

        const fieldNames = Object.keys(props);

        if (fieldNames.length > 0) {
            toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }

        updateTabTitles(fieldNames);
    };

    return <div className={`stock-movement is-${docType}`}>
        {isLoading && <Loader />}
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
            <input autoComplete="false" name="hidden" type="text" style={{display:'none'}} />
            <Tabs id='stock-movement-tabs' tabTitles={tabTitles} classNames='inside-modal' notifications={docNotifications}>
                <div key='general-tab' className='general-tab'>
                    <CardWithHelpIcon classNames='card stock-movement--general'>
                        <h3 className='stock-movement__block-title'>
                            <Icon name='general' />
                            General
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </CardWithHelpIcon>
                    <CardWithHelpIcon classNames='card stock-movement--details'>
                        <h3 className='stock-movement__block-title'>
                            <Icon name='additional' />
                            Details
                        </h3>
                        <div className='grid-row '>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </CardWithHelpIcon>
                </div>

                <div key='product-tab' className='product-tab'>
                    <CardWithHelpIcon classNames="card min-height-600 stock-movement--products">
                        <h3 className='stock-movement__block-title '>
                            <Icon name='goods' />
                            Products
                        </h3>
                        <div className='grid-row mb-md'>
                            <div className='stock-movement--btns width-100'>
                                <div className='grid-row'>
                                    <div className='stock-movement--table-btns form-table--btns small-paddings width-100'>
                                        {/*{(isOutboundOrStockMovement) ? <TutorialHintTooltip hint={StockMovementsHints(docNamesSingle[docType])['importProducts'] || ''} forBtn >*/}
                                        {/*    <Button type="button" icon="fill-doc" iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled || !sender} onClick={handleFillByStock}>Fill by stock</Button>*/}
                                        {/*</TutorialHintTooltip> : null}*/}
                                        <TutorialHintTooltip hint={StockMovementsHints(docNamesSingle[docType])['importProducts'] || ''} forBtn >
                                            <Button type="button" icon="import-file" iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} onClick={handleImportXLS}>Import from xls</Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={StockMovementsHints(docNamesSingle[docType])['selection'] || ''} forBtn >
                                            <Button type="button" icon='selection' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={() => handleProductSelection()} classNames='selection-btn' >
                                                Add from List
                                            </Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn >
                                            <Button type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={() => appendProduct({ key: `product-${Date.now().toString()}`, selected: false, product: '',quantityPlan:'', quantity:'', unitOfMeasure:'pcs', quality: 'Saleable' })}>
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
                            </div>
                        </div>
                        <div className='stock-movement--table table-form-fields form-table'>
                            <Table
                                columns={getProductColumns(control)}
                                dataSource={getValues('products')?.map((field, index) => ({ key: field.product+'-'+index, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />
                        </div>
                        <div className='grid-row stock-movement--products-total'>
                            {/*<FormFieldsBlock control={control} fieldsArray={productsTotalFields} errors={errors} isDisabled={isDisabled}/>*/}
                            <ProductsTotal weightGross={docData?.weightGross || 0} weightNet={docData?.weightNet|| 0} volume={docData?.volume || 0} palletAmount={docData?.palletAmount || 0} packages={docData?.packages || 0} />
                        </div>
                    </CardWithHelpIcon>
                </div>
                {docData?.uuid && <div key='services-tab' className='services-tab'>
                    <div className="card min-height-600 stock-movement--history">
                        <h3 className='stock-movement__block-title'>
                            <Icon name='bundle' />
                            Services
                        </h3>
                        <Services services={docData?.services} />
                    </div>
                </div>}
                {docData?.uuid && <div key='status-history-tab' className='status-history-tab'>
                    <div className="card min-height-600 stock-movement--history">
                        <h3 className='stock-movement__block-title'>
                            <Icon name='history' />
                            Status history
                        </h3>
                        <StatusHistory statusHistory={docData?.statusHistory} />
                    </div>
                </div>}
                {docData?.uuid && docData.tickets.length ? <div key='tickets-tab' className='tickets-tab'>
                    <div className="card min-height-600 stock-movement--tickets">
                        <h3 className='stock-movement__block-title'>
                            <Icon name='ticket' />
                            Tickets
                        </h3>
                        <DocumentTickets tickets={docData.tickets}/>
                    </div>
                </div> : null}
                <div key='files-tab' className='files-tab'>
                    <CardWithHelpIcon classNames="card min-height-600 stock-movement--files">
                    {/*<div className="card min-height-600 stock-movement--products">*/}
                        <TutorialHintTooltip hint={StockMovementsHints('')['files'] || ''} position='left' >
                            <h3 className='stock-movement__block-title title-small'>
                                <Icon name='files' />
                                Files
                            </h3>
                        </TutorialHintTooltip>
                        <div className='dropzoneBlock'>
                            <DropZone readOnly={!!isDisabled} files={selectedFiles} docUuid={docData?.canEdit ? '' : docData?.uuid} onFilesChange={handleFilesChange} />
                        </div>
                    </CardWithHelpIcon>
                </div>
            </Tabs>

            <div className='form-submit-btn'>
                {docData && docData.uuid ? <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight onClick={handleCreateTicket}>Create ticket</Button> : null}
                {isDisabled && docData?.canEdit && <Button type="button" disabled={false} onClick={()=>setIsDisabled(!(docData?.canEdit || !docData?.uuid))} variant={ButtonVariant.PRIMARY}>Edit</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY} onClick={()=>setIsDraft(true)}>Save as draft</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={()=>setIsDraft(false)}  variant={ButtonVariant.PRIMARY}>Send</Button>}
                {isDisabled && docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS && !docData?.canEdit && !isFinished && <Button type="submit" onClick={()=>setIsJustETA(true)}  variant={ButtonVariant.PRIMARY}>Send</Button>}
            </div>
        </form>
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        {showImportModal &&
            <Modal title={`Import xls`} onClose={onImportModalClose} >
                <ImportFilesBlock file='Products import.xlsx' importFilesType={ImportFilesType.STOCK_MOVEMENTS_PRODUCTS} setResponseData={setImportResponse} closeModal={()=>setShowImportModal(false)}/>
            </Modal>
        }
        {/*{showFillModal &&*/}
        {/*    <Modal title={`Choose required quality`} onClose={onFillModalClose} >*/}
        {/*        <FillByStock qualityList={docParameters?.quality} warehouse={sender} setResponseData={setImportResponse} onClose={()=>setShowFillModal(false)}/>*/}
        {/*    </Modal>*/}
        {/*}*/}
        {showProductSelectionModal && <Modal title={`Product selection`} onClose={()=>setShowProductSelectionModal(false)} noHeaderDecor >
            <ProductSelection alreadyAdded={products as SelectedProductType[]} handleAddSelection={handleAddSelection} selectedDocWarehouse={isOutboundOrStockMovement ? sender : ""} needWarehouses={isOutboundOrStockMovement}/>
        </Modal>}
        {showTicketForm && <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} subjectType={TICKET_OBJECT_TYPES[docType]} subjectUuid={docData?.uuid} subject={`${STOCK_MOVEMENT_DOC_SUBJECT[docType]} ${docData?.number} ${docData?.date ? formatDateStringToDisplayString(docData.date) : ''}`} onClose={()=>{setShowTicketForm(false); refetchDoc();}} />}
    </div>
}

export default StockMovementFormComponent;
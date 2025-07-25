import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth, {AccessActions} from "@/context/authContext";
import useHintsTracking from "@/context/hintsContext";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNTRIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {CargoFields, DetailsFields, GeneralFields} from "./StockMovementFormFields";
import {TabFields, TabTitles} from "./StockMovementFormTabs";
import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
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
import {cancelStockMovement, sendInboundData, updateInboundData} from "@/services/stockMovements";
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
import {docNamesSingle, getAccessActionObject} from "@/screens/StockMovementsPage";
import {CommonHints} from "@/constants/commonHints";
import useNotifications from "@/context/notificationContext";
import ConfirmModal from "@/components/ModalConfirm";
import {sendUserBrowserInfo} from "@/services/userInfo";
import HintsModal from "@/screens/StockMovementsPage/components/StockMovementForm/HintsModal";
import useTenant from "@/context/tenantContext";
import {isTabAllowed} from "@/utils/tabs";


type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';


type StockMovementFormType = {
    docType: STOCK_MOVEMENT_DOC_TYPE,
    docData?: SingleStockMovementType;
    docParameters?: StockMovementParamsType;
    closeDocModal: ()=>void;
    refetchDoc: ()=>void;
    forbiddenTabs: string[] | null;
}

export enum DELIVERY_METHODS {
    CONTAINER ='Container',
    FULL_TRACK = 'Full track',
    PLL = 'PLL',
    CARTONS = 'Cartons'
}

//const deliveryTypesDefault = [CONTAINER,'FullTrack', 'PLL', 'Cartons'];
const deliveryMethodOptions = [
    {value: DELIVERY_METHODS.CONTAINER, label: 'Container'},
    {value: DELIVERY_METHODS.FULL_TRACK, label: 'Full track'},
    {value: DELIVERY_METHODS.PLL, label: 'PLL'},
    {value: DELIVERY_METHODS.CARTONS, label: 'Cartons'}
];



const StockMovementFormComponent: React.FC<StockMovementFormType> = ({docType, docData, docParameters, closeDocModal, refetchDoc, forbiddenTabs}) => {
    const { tenantData: { alias, orderTitles }} = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList, sellersListActive } = useAuth();
    const {notifications} = useNotifications();

    const [isDisabled, setIsDisabled] = useState(!!docData?.uuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [isJustETA, setIsJustETA] = useState(false);
    const [isFinished, setIsFinished] = useState(docData?.status === 'Finished');

    const isOutboundOrStockMovement = docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT;

    //
    const {visitedStockMovements, setStockMovementsAsVisited, addInboundsNumber, cancelHintsNumber, addCancelHintsNumber} = useHintsTracking();

    const [showHintQuestion, setShowHintQuestion] = useState(false);
    const handleCancelHints = () => {
        setShowHintQuestion(false);
        addCancelHintsNumber();

    }
    const [showAllHints, setShowAllHints] = useState(false);
    useEffect(() => {
        if (docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS && !visitedStockMovements && cancelHintsNumber<2) {
            setShowHintQuestion(true);
        }
    }, []);
    const showHints = () => {
        setShowHintQuestion(false);
        setShowAllHints(true);
    }

    const deliveryTypeOptions: OptionType[] = useMemo(() => [
        {value: 'Standart', label: orderTitles.stockMovStandardDeliveryTitle},
        {value: 'Express', label: orderTitles.stockMovExpressDeliveryTitle},
        {value: 'Customer Carrier', label: 'Customer Carrier'}
    ],[orderTitles]);

    //product selection
    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);

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

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleConfirmCancelDoc = async () => {
        setShowConfirmModal(false);
        await handleCancelOrder();
    }

    const handleCancelOrder = async() => {
        try {
            const requestData = {token, alias, uuid: docData?.uuid};

            try {
                sendUserBrowserInfo({...getBrowserInfo('CancelStockMovement/'+docType), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await cancelStockMovement(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Document is successfully canceled!`, onClose: closeSuccessModal})
                setShowStatusModal(true);
            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Document can not be canceled!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    //tickets
    const [showTicketForm, setShowTicketForm] = useState(false);
    const handleCreateTicket = () => {
        setShowTicketForm(true)
    }

    //tab titles
    const tabTitleArray =  TabTitles(!!docData?.uuid, !!(docData?.tickets && docData?.tickets.length), forbiddenTabs);
    const {tabTitles, updateTabTitles, clearTabTitles, resetTabTables} = useTabsState(tabTitleArray, TabFields);


    //form
    const {control, handleSubmit, setError, trigger, formState: { errors }, getValues, setValue, watch, clearErrors} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            //date: docData?.date || currentDate.toISOString(),
            number: docData?.number || '',
            incomingDate: docData?.incomingDate || '',
            incomingNumber: docData?.incomingNumber || '',
            deliveryType: docData?.deliveryType || '',
            deliveryMethod: docData?.deliveryMethod || '',
            container20Amount: docData?.container20Amount || 0,
            container40Amount: docData?.container40Amount || 0,
            palletsAmount: docData?.palletsAmount || 0,
            cartonsAmount: docData?.cartonsAmount || 0,
            volume: docData?.volume,
            weightTotalGross: docData?.weightTotalGross,
            weightTotalNet: docData?.weightTotalNet,
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
            seller: docData?.seller || '',

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

    const selectedSeller = watch('seller');

    //countries
    const allCountries = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    //sender
    const senderOptions = useMemo(() => {
        if (docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || !docParameters.sender || needSeller() && !selectedSeller) return [];
        if (needSeller()) {
            const senderWarehouses = docParameters.sender.filter(item=>item.seller===selectedSeller).map(item => item.warehouse)
            return Array.from(new Set(senderWarehouses)).map(item => ({label: item, value: item}));
        } else {
            const senderWarehouses = docParameters.sender.map(item => item.warehouse)
            return Array.from(new Set(senderWarehouses)).map(item => ({label: item, value: item}));
        }
    }, [docParameters, selectedSeller]);
    const onSenderChange = (newSender: string) => {
        if (docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || docType===STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE) return;
        const newSenderCountry = docParameters.sender ? docParameters.sender.filter(item=>item.warehouse===newSender) : [];
        setValue('senderCountry',newSenderCountry.length ? newSenderCountry[0].country : '', { shouldValidate: true });
    }

    //receiver
    // const receiverOptions = docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || !docParameters.receiver ? [] : docParameters.receiver.map(item => ({label: item.warehouse, value: item.warehouse}));
    const receiverOptions = useMemo(() => {
        if (docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || !docParameters.receiver || needSeller() && !selectedSeller) return [];
        if (needSeller()) {
            const receiverWarehouses = docParameters.receiver.filter(item=>item.seller===selectedSeller).map(item => item.warehouse)
            return Array.from(new Set(receiverWarehouses)).map(item => ({label: item, value: item}));
        } else {
            const receiverWarehouses = docParameters.receiver.map(item => item.warehouse)
            return Array.from(new Set(receiverWarehouses)).map(item => ({label: item, value: item}));
        }
    }, [docParameters, selectedSeller]);
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

        let sellersProducts = docParameters ? docParameters.products : [];
        if (needSeller()) {
            sellersProducts = selectedSeller ? sellersProducts.filter(item=>item.seller===selectedSeller) : [];
        }

        return sellersProducts.map((item)=> ({label: `${item.name}`, value: item.uuid}));

    },[docParameters, selectedSeller]);

    const checkSelectedProductValue = (selectedValue) => {
        //console.log('selected val:', selectedValue, productOptions.filter(item=>item.value===selectedValue))

    }

    //deliveryMethodOptions
    //const deliveryMethodOptions = useMemo(()=>docParameters?.deliveryMethod.map(item => ({label: item, value: item})),[docParameters]);
    //const deliveryMethodOptions = useMemo(()=>['PLL','SPD'].map(item => ({label: item, value: item} as OptionType)),[]);
    const deliveryMethod = watch('deliveryMethod');
    const container20 = watch('container20Amount');
    const container40 = watch('container40Amount');
    const palletsAmount = watch('palletsAmount');
    const cartonsAmount = watch('cartonsAmount');

    useEffect(() => {
        if (container20 || container40) {
            trigger('container20Amount');
            trigger('container40Amount');
        }

    }, [container20, container40]);


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
                                    type={'number'}
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
                                    onlyWholeNumbers={true}
                                    classNames={!isQuantityActualHidden && record.quantity !==record.quantityPlan ? 'highlight-error' : ''}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required',
                            pattern: {
                                value: /^\d+$/, // Allows only digits (0-9)
                                message: "Only whole numbers are allowed",
                            },}}
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

    const handleSelectedSellerChange = (val:string) => {
        if (val != selectedSeller) {
            setValue('products', []);
            if (docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT) {
                setValue('sender', '');
                setValue('senderCountry', '');
            }
            if (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT) {
                setValue('receiver', '');
                setValue('receiverCountry', '');
            }
        }
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

    useEffect(() => {
        if (products.length) {
            clearErrors('products');
            //trigger();
            //updateTabTitles([...tabTitles.filter(item=> item.title !='products' ).map(item=>item.title)])
        }
    }, [products]);


    //form fields
    const generalFields = useMemo(()=> GeneralFields(
        {
            newObject: !docData?.uuid,
            docType: docType,
            canEditATA: !!(docData?.uuid && !docData.canEdit && !isFinished),
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
        }), [docData, products, sender, receiver, isSenderDisabled]);
    //const productsTotalFields = useMemo(()=>ProductsTotalFields(), [docData]);

    const cargoFields = useMemo(()=>CargoFields(
        {
            newObject: !docData?.uuid,
            docType: docType,
            deliveryTypeOptions,
            deliveryMethod,
            deliveryMethodOptions: deliveryMethodOptions,
            container20Value: container20,
            container40Value: container40,
            palletsAmount,
            cartonsAmount,
            canDisplayCargoInfo: !!docData,
            canEdit: !!docData?.canEdit,
            //canDisplayCargoInfo: !!(docData && docData.deliveryMethod),
            //canDisplayCargoInfo: !!(docData && docData.status.toLowerCase()!=='draft' && docData.status.toLowerCase()!=='pending'),
        }), [docData, deliveryMethod, container20, container40, palletsAmount, cartonsAmount]);


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

    useEffect(() => {
        resetTabTables(tabTitleArray);
    }, [docData]);

    const sendJustETA = async(data) => {
        const requestData = {
            token,
            alias,
            documentData: {
                uuid: data.uuid,
                estimatedTimeArrives: data.estimatedTimeArrives,
                courierServiceTrackingNumber: data.courierServiceTrackingNumber,
            },
        };

        try {
            sendUserBrowserInfo({...getBrowserInfo('UpdateStockMovement/'+docType), body: superUser && ui ? {...requestData, ui} : requestData})
        } catch {}

        return await updateInboundData(superUser && ui ? {...requestData, ui} : requestData);
    }

    const sendDocument = async(data) => {
        const requestData = {
            token,
            alias,
            documentType: docType,
            documentData: data,
        };
        try {
            sendUserBrowserInfo({...getBrowserInfo('CreateStockMovement/'+docType), body: superUser && ui ? {...requestData, ui} : requestData})
        } catch {}
        return await sendInboundData(superUser && ui ? {...requestData, ui} : requestData);
    }

    const onSubmitForm = async (data) => {
        const curAction = docData ? AccessActions.EditObject : AccessActions.CreateObject;
        if (!isActionIsAccessible(getAccessActionObject(docType), curAction)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateStockMovement', getAccessActionObject(docType), curAction), body: {uuid: data?.uuid || ''}});
            } catch {}

            return null;
        }

        clearTabTitles();
        clearErrors();
        if (data.products.length === 0 && !isDraft && !isJustETA) {
            setError("products", { type: "manual", message: "Document needs to have at least one product" });
            updateTabTitles(['products']);
            return;
        }

        if (!data.incomingDate) {
            data.incomingDate = (new Date()).toISOString();
        }

        setIsLoading(true);

        data.draft = isDraft;
        data.attachedFiles= selectedFiles;
        data.products.forEach(item => item.quality = item.quality || 'Saleable');

        if (data?.deliveryMethod !== DELIVERY_METHODS.CONTAINER) {
            data.container20Amount = 0;
            data.container40Amount = 0;
        }
        if (data?.deliveryMethod === DELIVERY_METHODS.CARTONS) {
            data.palletsAmount = 0;
        }

        try {
            const res = isJustETA ? await sendJustETA(data) : await sendDocument(data);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Document is successfully ${ docData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal})
                setShowStatusModal(true);

                if (!docData) {
                    setStockMovementsAsVisited(true);
                    if (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS) {
                        addInboundsNumber();
                    }
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
        const curAction = docData ? AccessActions.EditObject : AccessActions.CreateObject;
        if (!isActionIsAccessible(getAccessActionObject(docType), curAction)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateStockMovement', getAccessActionObject(docType), curAction), body: {uuid: docData?.uuid || ''}});
            } catch {}

            return null;
        }

        if (isDraft || isJustETA) {
            clearErrors();
            clearTabTitles();

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
                return onSubmitForm(formData as SingleStockMovementFormType);
            }
        } else {
            let fieldNames = Object.keys(props);

            if (fieldNames.length > 0) {
                toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            if (!products.length) {
                setError('products', {
                    type: 'manual',
                    message: 'Products are empty! Document needs to have at least 1 product!',
                });

                toast.warn(`Document needs to have at least 1 product!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                fieldNames.push('products');
            }

            updateTabTitles(fieldNames);
        }
    };

    const handleEditClick = () => {
    //     () => setIsDisabled(!(docData?.canEdit || !docData?.uuid))

        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('EditDoc/'+docType, getAccessActionObject(docType), AccessActions.EditObject), body:{}})
            } catch {}
            return;
        } else {
            setIsDisabled(!(docData?.canEdit || !docData?.uuid))
        }
    }

    const handleCancelDocClick = () => {
        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CancelDoc/'+docType, getAccessActionObject(docType), AccessActions.EditObject), body: {uuid: docData?.uuid || ''}});
            } catch {}
            return;
        } else {
            setShowConfirmModal(true)
        }
    }

    return <div className={`stock-movement is-${docType}`}>
        {isLoading && <Loader />}
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
            <input autoComplete="false" name="hidden" type="text" style={{display:'none'}} />
            <Tabs id='stock-movement-tabs' tabTitles={tabTitles} classNames='inside-modal'
                  notifications={docNotifications}>
                {isTabAllowed('General', forbiddenTabs) ? <div key='general-tab' className='general-tab'>
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
                                            label='Seller: '
                                            fieldType={FormFieldTypes.SELECT}
                                            options={(docData?.status !=='Draft' && !!docData) ? sellersList : sellersListActive}
                                            placeholder={''}
                                            errorMessage={error?.message}
                                            errors={errors}
                                            disabled={isDisabled || (docData?.status !=='Draft' && !!docData)}
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
                            {!selectedSeller && <p className={'seller-notice'}>Select Seller to access Products and Sender/Receiver options </p>}
                        </div>
                    ) : null}
                    <CardWithHelpIcon classNames='card stock-movement--general' showHintsByDefault={showAllHints}>
                        <h3 className='stock-movement__block-title'>
                            <Icon name='general'/>
                            General
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors}
                                             isDisabled={isDisabled}/>
                        </div>
                    </CardWithHelpIcon>
                    <CardWithHelpIcon classNames='card stock-movement--details' showHintsByDefault={showAllHints}>
                        <h3 className='stock-movement__block-title'>
                            <Icon name='additional'/>
                            Details
                        </h3>
                        <div className='grid-row '>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors}
                                             isDisabled={isDisabled}/>
                        </div>
                    </CardWithHelpIcon>
                </div> : null }
                {isTabAllowed('Cargo info', forbiddenTabs) ? <div key='cargo-tab' className='cargo-tab'>
                    <CardWithHelpIcon classNames='card stock-movement--cargo' showHintsByDefault={showAllHints}>
                        <h3 className='stock-movement__block-title'>
                            <Icon name='shipping'/>
                            Cargo info
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={cargoFields} errors={errors}
                                             isDisabled={isDisabled}/>
                        </div>
                    </CardWithHelpIcon>
                </div> : null}

                {isTabAllowed('Products', forbiddenTabs) ? <div key='product-tab' className='product-tab'>
                    <CardWithHelpIcon classNames="card min-height-600 stock-movement--products" showHintsByDefault={showAllHints}>
                        <h3 className='stock-movement__block-title '>
                            <Icon name='goods'/>
                            Products
                        </h3>
                        <div className='grid-row mb-md'>
                            <div className='stock-movement--btns width-100'>
                                <div className='grid-row'>
                                    <div
                                        className='stock-movement--table-btns form-table--btns small-paddings width-100'>
                                        {/*{(isOutboundOrStockMovement) ? <TutorialHintTooltip hint={StockMovementsHints(docNamesSingle[docType])['importProducts'] || ''} forBtn >*/}
                                        {/*    <Button type="button" icon="fill-doc" iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled || !sender} onClick={handleFillByStock}>Fill by stock</Button>*/}
                                        {/*</TutorialHintTooltip> : null}*/}
                                        <TutorialHintTooltip
                                            hint={StockMovementsHints(docNamesSingle[docType])['importProducts'] || ''}
                                            forBtn>
                                            <Button type="button" icon="import-file" iconOnTheRight
                                                    size={ButtonSize.SMALL} disabled={isDisabled}
                                                    onClick={handleImportXLS}>Import from xls</Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip
                                            hint={StockMovementsHints(docNamesSingle[docType])['selection'] || ''}
                                            forBtn>
                                            <Button type="button" icon='selection' iconOnTheRight
                                                    size={ButtonSize.SMALL} disabled={isDisabled}
                                                    variant={ButtonVariant.SECONDARY}
                                                    onClick={() => handleProductSelection()} classNames='selection-btn'>
                                                Add from List
                                            </Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn>
                                            <Button type="button" icon='add-table-row' iconOnTheRight
                                                    size={ButtonSize.SMALL} disabled={isDisabled}
                                                    variant={ButtonVariant.SECONDARY} onClick={() => appendProduct({
                                                key: `product-${Date.now().toString()}`,
                                                selected: false,
                                                product: '',
                                                quantityPlan: '',
                                                quantity: '',
                                                unitOfMeasure: 'pcs',
                                                quality: 'Saleable'
                                            })}>
                                                Add by SKU
                                            </Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn>
                                            <Button type="button" icon='remove-table-row' iconOnTheRight
                                                    size={ButtonSize.SMALL} disabled={isDisabled}
                                                    variant={ButtonVariant.SECONDARY} onClick={removeProducts}>
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
                                dataSource={getValues('products')?.map((field, index) => ({key: field.product + '-' + index, ...field})) || []}
                                pagination={false}
                                rowKey="key"
                                className={errors.products ? 'has-error-decor' : ''}
                            />
                            {errors.products && <p className={'error-message'}>{errors.products.message}</p>}

                        </div>
                        <div className='grid-row stock-movement--products-total'>
                            {/*<FormFieldsBlock control={control} fieldsArray={productsTotalFields} errors={errors} isDisabled={isDisabled}/>*/}
                            <ProductsTotal weightGross={docData?.weightTotalGross || 0}
                                           weightNet={docData?.weightTotalNet || 0} volume={docData?.volume || 0}
                                           palletAmount={docData?.palletsAmount || 0}
                                           packages={docData?.cartonsAmount || 0}/>
                        </div>
                    </CardWithHelpIcon>
                </div> : null }
                {docData?.uuid && isTabAllowed('Services', forbiddenTabs) &&  <div key='services-tab' className='services-tab'>
                    <div className="card min-height-600 stock-movement--history">
                        <h3 className='stock-movement__block-title'>
                            <Icon name='bundle'/>
                            Services
                        </h3>
                        <Services services={docData?.services}/>
                    </div>
                </div>}
                {docData?.uuid && isTabAllowed('Status history', forbiddenTabs) && <div key='status-history-tab' className='status-history-tab'>
                    <div className="card min-height-600 stock-movement--history">
                        <h3 className='stock-movement__block-title'>
                            <Icon name='history'/>
                            Status history
                        </h3>
                        <StatusHistory statusHistory={docData?.statusHistory}/>
                    </div>
                </div>}
                {docData?.uuid && docData.tickets.length && isTabAllowed('Tickets', forbiddenTabs) ? <div key='tickets-tab' className='tickets-tab'>
                    <div className="card min-height-600 stock-movement--tickets">
                        <h3 className='stock-movement__block-title'>
                            <Icon name='ticket'/>
                            Tickets
                        </h3>
                        <DocumentTickets tickets={docData.tickets}/>
                    </div>
                </div> : null}
                {isTabAllowed('Files', forbiddenTabs) ? <div key='files-tab' className='files-tab'>
                    <CardWithHelpIcon classNames="card min-height-600 stock-movement--files" showHintsByDefault={showAllHints}>
                        {/*<div className="card min-height-600 stock-movement--products">*/}
                        <TutorialHintTooltip hint={StockMovementsHints('')['files'] || ''} position='left'>
                            <h3 className='stock-movement__block-title title-small'>
                                <Icon name='files'/>
                                Files
                            </h3>
                        </TutorialHintTooltip>
                        <div className='dropzoneBlock'>
                            <DropZone readOnly={!!isDisabled} files={selectedFiles}
                                      docUuid={docData?.canEdit ? '' : docData?.uuid}
                                      onFilesChange={handleFilesChange}
                                      // allowOnlyFormats={['pdf']}
                                      // hint={'The supported file formats: PDF'}
                            />
                        </div>
                    </CardWithHelpIcon>
                </div> : null }
            </Tabs>

            <div className='form-submit-btn'>
                {docData && docData.uuid && isTabAllowed('Tickets', forbiddenTabs) ?
                    <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight
                            onClick={handleCreateTicket}>Create ticket</Button> : null}
                {docData?.uuid && docData?.status && docData?.status.toLowerCase() =='draft' ?
                    <Button type='button' variant={ButtonVariant.PRIMARY} onClick={handleCancelDocClick}>Cancel
                        document</Button> : null}
                {isDisabled && docData?.canEdit && <Button type="button" disabled={false}
                                                           onClick={handleEditClick}
                                                           variant={ButtonVariant.PRIMARY}>Edit</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY}
                                        onClick={() => setIsDraft(true)}>Save as draft</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={() => setIsDraft(false)}
                                        variant={ButtonVariant.PRIMARY}>Send</Button>}
                {isDisabled && docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS && !docData?.canEdit && !isFinished &&
                    <Button type="submit" onClick={() => setIsJustETA(true)}
                            variant={ButtonVariant.PRIMARY}>Send</Button>}
            </div>
        </form>
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        {showImportModal &&
            <Modal title={`Import xls`} onClose={onImportModalClose} >
                <ImportFilesBlock file='Products import.xlsx' importFilesType={ImportFilesType.STOCK_MOVEMENTS_PRODUCTS} setResponseData={setImportResponse} closeModal={()=>setShowImportModal(false)}/>
            </Modal>
        }
        {showProductSelectionModal && <Modal title={`Product selection`} onClose={()=>setShowProductSelectionModal(false)} noHeaderDecor >
            <ProductSelection alreadyAdded={products as SelectedProductType[]} handleAddSelection={handleAddSelection} selectedDocWarehouse={isOutboundOrStockMovement ? sender : ""} needWarehouses={isOutboundOrStockMovement} seller={selectedSeller}/>
        </Modal>}
        {showTicketForm && <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} subjectType={TICKET_OBJECT_TYPES[docType]} subjectUuid={docData?.uuid} subject={`${STOCK_MOVEMENT_DOC_SUBJECT[docType]} ${docData?.number} ${docData?.date ? formatDateStringToDisplayString(docData.date) : ''}`} onClose={()=>{setShowTicketForm(false); refetchDoc();}} seller={needSeller() ? docData.seller : ''} />}
        {showConfirmModal && <ConfirmModal
            // actionText='Are you sure you want to cancel this document?'
            actionText='cancel this document?'
            onOk={handleConfirmCancelDoc}
            onCancel={()=>setShowConfirmModal(false)}
        />}
        {showHintQuestion && <HintsModal docName="Inbounds" onClose={handleCancelHints} onOk={showHints} />}
    </div>
}

export default StockMovementFormComponent;
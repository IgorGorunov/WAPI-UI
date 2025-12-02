import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {
    CreateOrderRequestType,
    OrderParamsType,
    OrderProductWithTotalInfoType,
    PickupPointsType,
    SingleOrderFormType,
    SingleOrderProductFormType,
    SingleOrderType
} from "@/types/orders";
import {AttachedFilesType, STATUS_MODAL_TYPES, WarehouseType} from "@/types/utility";
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNTRIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {cancelOrder, getOrderPickupPoints, sendAddressData, sendOrderData} from '@/services/orders';
import {DetailsFields, GeneralFields, PickUpPointFields, ReceiverFields} from "./OrderFormFields";
import {TabFields, TabTitles} from "./OrderFormTabs";
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
import ProductsTotal from "./ProductsTotal";
import {toast, ToastContainer} from '@/components/Toast';
import {useTabsState} from "@/hooks/useTabsState";
import Modal from "@/components/Modal";
import SendComment from "./SendCommentBlock";
import SmsHistory from "./SmsHistory";
import Loader from "@/components/Loader";
import Claims from "@/screens/OrdersPage/components/OrderForm/Claims";
import ProductSelection, {SelectedProductType} from "@/components/ProductSelection";
import useNotifications from "@/context/notificationContext";
import {NOTIFICATION_OBJECT_TYPES, NotificationType} from "@/types/notifications";
import SingleDocument from "@/components/SingleDocument";
import DocumentTickets from "@/components/DocumentTickets";
import {addCurrentTimeToDate, formatDateStringToDisplayString} from "@/utils/date";
import {TICKET_OBJECT_TYPES} from "@/types/tickets";
import ConfirmModal from "@/components/ModalConfirm";
import NotesList from "@/components/NotesList";
import CardWithHelpIcon from "@/components/CardWithHelpIcon";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import {OrderHints} from "@/screens/OrdersPage/ordersHints.constants";
import {CommonHints} from "@/constants/commonHints";
import {sendUserBrowserInfo} from "@/services/userInfo";
import ImageSlider from "@/components/ImageSlider";
import CustomerReturns from "./CustomerReturns";
import useTenant from "@/context/tenantContext";
import {isTabAllowed} from "@/utils/tabs";

type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type OrderFormType = {
    orderData?: SingleOrderType;
    orderParameters: OrderParamsType;
    orderUuid?: string;
    closeOrderModal: ()=>void;
    refetchDoc: ()=>void;
    forbiddenTabs: string[] | null;
}

const receiverFieldsPickUpPoint = [
    'receiverPickUpAddress',
    'receiverPickUpCity',
    'receiverPickUpDescription',
    'receiverPickUpID',
    'receiverPickUpName',
    'receiverPickUpCountry'
];

const getCorrectNotifications = (record: SingleOrderType, notifications: NotificationType[]) => {
    const orderNotifications = notifications && notifications.length ? notifications.filter(item => item.objectUuid === record.uuid) : [];

    if (record.status.toLowerCase().includes('error')) {
        return orderNotifications.filter(item => !item.message.toLowerCase().includes('error'));
    }
    return orderNotifications;
}

const OrderFormComponent: React.FC<OrderFormType> = ({orderData, orderParameters, orderUuid, refetchDoc, closeOrderModal, forbiddenTabs}) => {
    const {notifications} = useNotifications();
    const { tenantData: { alias, orderTitles }} = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList, sellersListActive } = useAuth();
    const currentDate = new Date();

    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(!!orderUuid);
    const [isAddressAllowed, setIsAddressAllowed] = useState(!orderUuid);
    const [isAddressChange, setIsAddressChange] = useState(false);
    const [addressWasChanged, setAddressWasChanged] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [curPickupPoints, setCurPickupPoints] = useState<PickupPointsType[]>(null);
    const [pickupOptions, setPickupOptions] = useState<OptionType[]>(null);
    const [selectedPickupPoint, setSelectedPickupPoint] = useState<string | null>(null);
    //const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedCourierService, setSelectedCourierService] = useState<string | null>(null);

    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);

    const fetchPickupPoints = useCallback(async (courierService: string) => {
        try {
            setIsLoading(true);
            const requestData = {token, alias, courierService};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetPickupPoints'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await getOrderPickupPoints(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setCurPickupPoints(res.data)
                setPickupOptions(createPickupOptions(res.data));
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token]);



    const fetchPickupPointsForCreatedOrder = useCallback(async (courierService: string) => {
        try {
            const requestData = {token, alias, courierService};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetPickupPoints'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await getOrderPickupPoints(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setCurPickupPoints(res.data);
                const pickUpPoints = res.data;
                // if (pickUpPoints.length && pickUpPoints.filter(item => item.ID === orderData.receiverPickUpID).length == 0) {
                //     pickUpPoints.unshift({
                //         address: orderData.receiverPickUpAddress,
                //         city: orderData.receiverPickUpCity,
                //         country: orderData.receiverPickUpCountry,
                //         description: orderData.receiverPickUpID,
                //         id: orderData.receiverPickUpID,
                //         name: orderData.receiverPickUpName,
                //     })
                // }
                setPickupOptions(createPickupOptions(pickUpPoints));
                //setSelectedPickupPoint(orderData.receiverPickUpID);
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token]);

    useEffect(() => {
        if (orderData && (!isDisabled || isAddressAllowed) && orderData?.preferredCourierService) {
            fetchPickupPointsForCreatedOrder(orderData?.preferredCourierService);
            // setSelectedPickupPoint(orderData?.receiverPickUpID);
        }
    }, [isDisabled, isAddressAllowed]);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        closeOrderModal();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    //send comment modal
    const [showSendCommentModal, setShowSendCommentModal] = useState(false);
    const [commentHasBeenSent, setCommentHasBeenSent] = useState(orderData?.commentTodayWasSent || false);
    const handleShowCommentModal = () => {
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('SendComment', AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject), body: {uuid: orderData?.uuid}});
            } catch {}
        } else {
            if (orderData && orderData.commentTodayWasSent || commentHasBeenSent) {
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.MESSAGE, title: "Warning", subtitle: `Comment for this order has already been sent!
            There needs to be at least 48 hours between comments for the same order.`, onClose: ()=>setShowStatusModal(false)})
                setShowStatusModal(true);
            }
            else if (orderData && orderData.commentCourierServiceFunctionsList) {
                setShowSendCommentModal(true);
            } else {
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.MESSAGE, title: "Warning", subtitle: `Sending comment for this order is unavailable!`, onClose: ()=>setShowStatusModal(false)})
                setShowStatusModal(true);
            }
        }
    }

    const warehouses = useMemo(() => {
        if (orderParameters?.warehouses) {
            const uniqueWarehouses = orderParameters.warehouses.filter(
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
    }, [orderParameters?.warehouses]);

    //form
    const defaultFormValues = useMemo(() => ({
        clientOrderID: orderData?.clientOrderID || '',
        codAmount: orderData?.codAmount || '',
        codCurrency: orderData?.codCurrency || '',
        courierService: orderData?.courierService || '',
        courierServiceTrackingNumber: orderData?.courierServiceTrackingNumber || '',
        courierServiceTrackingNumberCurrent: orderData?.courierServiceTrackingNumberCurrent || '',
        //date: orderData?.date || addCurrentTimeToDate(currentDate).toISOString(),
        date: orderData?.date || addCurrentTimeToDate(currentDate).toISOString(),
        incomingDate: orderData?.incomingDate || '',
        preferredCourierService: orderData?.preferredCourierService || '',
        preferredCourierServiceMandatory: orderData?.preferredCourierServiceMandatory || false,
        preferredDeliveryDate: orderData?.preferredDeliveryDate || currentDate.toISOString(),
        preferredWarehouse: orderData?.preferredWarehouse || '',
        preferredWarehouseMandatory: orderData?.preferredWarehouseMandatory || '',
        receiverAddress: orderData?.receiverAddress || '',
        priceCurrency: orderData?.priceCurrency || '',
        receiverCity: orderData?.receiverCity || '',
        receiverComment: orderData?.receiverComment || '',
        receiverCountry: orderData?.receiverCountry || '',
        receiverCounty: orderData?.receiverCounty || '',
        receiverEMail:orderData?.receiverEMail || '',
        receiverFullName: orderData?.receiverFullName || '',
        receiverPhone: orderData?.receiverPhone || '',
        receiverPickUpAddress: orderData?.receiverPickUpAddress || '',
        receiverPickUpCity: orderData?.receiverPickUpCity || '',
        receiverPickUpCountry: orderData?.receiverPickUpCountry || '',
        receiverPickUpDescription: orderData?.receiverPickUpDescription || '',
        receiverPickUpID: orderData?.receiverPickUpID || '',
        receiverPickUpName: orderData?.receiverPickUpName || '',
        receiverZip: orderData?.receiverZip || '',
        status: orderData?.status || '',
        statusAdditionalInfo: orderData?.statusAdditionalInfo || '',
        trackingLink: orderData?.trackingLink || '',
        uuid: orderData?.uuid || '',
        wapiTrackingNumber: orderData?.wapiTrackingNumber || '',
        warehouse: orderData?.warehouse || '',
        seller: orderData?.seller && needSeller() ? orderData.seller : '',
        products:
            orderData && orderData?.products && orderData.products.length
                ? orderData.products.map((product, index: number) => (
                    {
                        key: product.product.uuid || `product-${Date.now().toString()}_${index}`,
                        selected: false,
                        sku: product.product.sku || '',
                        product: product.product.uuid || '',
                        analogue: product.analogue.uuid || '',
                        quantity: product.quantity || '',
                        price: product.price || '',
                        discount: product.discount || '',
                        tax: product.tax || '',
                        total: product.total || '',
                        cod: product.cod || '',
                        connectionKey: product?.connectionKey || '',
                    }))
                : [],
    }),[orderData]);

    const {control, handleSubmit, formState: { errors }, getValues, setValue, watch, clearErrors, setError} = useForm({
        mode: 'onSubmit',
        defaultValues: defaultFormValues,
    });

    const { append: appendProduct, remove: removeProduct } = useFieldArray({ control, name: 'products' });
    const products = watch('products');
    const currencyOptions = useMemo(()=>{return orderParameters && orderParameters?.currencies.length ? createOptions(orderParameters?.currencies) : []},[]);

    const preferredWarehouse = watch('preferredWarehouse');
    //const selectedWarehouse = watch('warehouse');

    useEffect(() => {
        // console.log('products: ', products);
    }, [products]);

    //tickets
    const [showTicketForm, setShowTicketForm] = useState(false);

    //countries
    const allCountries = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    const getCountryOptions = () =>  {
        let filteredCountries = orderParameters ? [...orderParameters.warehouses] : [];

        if (preferredWarehouse)  {
            filteredCountries = filteredCountries.filter(item=>item.warehouse===preferredWarehouse);
        }

        if (selectedCourierService) {
            filteredCountries = filteredCountries.filter(item=>item.courierService===selectedCourierService);
        }

        const countryArr =  filteredCountries.map(item => item.country);

        return allCountries.filter(item=> countryArr.includes(item.value));
    }

    const [countries, setCountries] = useState<OptionType[]>(getCountryOptions);

    useEffect(() =>  {
        setCountries(getCountryOptions());
    }, [preferredWarehouse, selectedCourierService]);

    //pickup points
    const createPickupOptions = useCallback((curPickupPoints: PickupPointsType[]) => {
        if (curPickupPoints && curPickupPoints.length) {
            if (orderData && orderData.addressEditAllowedOnly) {
                if (orderData.receiverPickUpCountry) {
                    //filter by this country
                    return curPickupPoints.filter(item=>item.country==orderData.receiverPickUpCountry).map((item: PickupPointsType)=>{return {label:`${item.id} (${item.description})`, value: item.id} as OptionType})
                } else if (orderData.receiverCountry) {
                    //filter by receiverCountry
                    return curPickupPoints.filter(item=>item.country==orderData.receiverCountry).map((item: PickupPointsType)=>{return {label:`${item.id} (${item.description})`, value: item.id} as OptionType})
                }
            }
            return curPickupPoints.map((item: PickupPointsType)=>{return {label:`${item.id} (${item.description})`, value: item.id} as OptionType})
        }
        return [];
    }, [orderData]);

    const createdPickupPoints = useMemo(() => {
        return createPickupOptions(curPickupPoints);
    },[orderData, curPickupPoints, preferredWarehouse, selectedCourierService])



    useEffect(() => {
        if (curPickupPoints && curPickupPoints.length) {
            const pickupPoints = curPickupPoints.filter((item:PickupPointsType)=>item.id===selectedPickupPoint);

            if (pickupPoints.length) {
                setValue('receiverPickUpName', pickupPoints[0].name );
                setValue('receiverPickUpCountry', pickupPoints[0].country );
                setValue('receiverPickUpCity', pickupPoints[0].city );
                setValue('receiverPickUpAddress', pickupPoints[0].address );
                setValue('receiverPickUpDescription', pickupPoints[0].description );
            }
        }
    }, [selectedPickupPoint]);

    const clearPickUpPoint = useCallback(() => {
        setValue('receiverPickUpID', '');
        setValue('receiverPickUpName', '');
        setValue('receiverPickUpCountry', '');
        setValue('receiverPickUpCity', '');
        setValue('receiverPickUpAddress', '');
        setValue('receiverPickUpDescription', '');
    }, []);


    //products
    const [selectAllProducts, setSelectAllProducts] = useState(false);
    const [productsTotalInfo, setProductsTotalInfo] = useState<OrderProductWithTotalInfoType>({
        cod: 0,
        weightNet: 0,
        weightGross: 0,
        volume:0,
        volumeWeight: 0,
    });

    const updateTotalProducts = () => {
        const rez = {
            cod: 0,
            weightNet: 0,
            weightGross: 0,
            volume: 0,
            volumeWeight: 0,
            currency: getValues('codCurrency'),
        };
        getValues('products').forEach(item => {
            const prodInfo = orderParameters && orderParameters.products ? orderParameters.products.filter(product=>product.uuid === item.product) : [];
            if (prodInfo?.length) {
                rez.cod += Number(item.cod);
                rez.weightNet += prodInfo[0].weightNet * Number(item.quantity);
                rez.weightGross += prodInfo[0].weightGross * Number(item.quantity);
                rez.volume += prodInfo[0].volume * Number(item.quantity);
                rez.volumeWeight += prodInfo[0].volumeWeight ? prodInfo[0].volumeWeight * Number(item.quantity) : 0;
            }
        })

        setProductsTotalInfo(rez);
    };

    useEffect(()=>{
        updateTotalProducts();
    },[products]);

    const selectedSeller = watch('seller');

    const handleSelectedSellerChange = (val:string) => {
        if (val != selectedSeller) setValue('products', []);
    }

    const getProductSku = (productUuid: string) => {
        const product = orderParameters.products.find(item => item.uuid === productUuid);
        if (product && needSeller()) {
            return product.seller === selectedSeller ? product?.sku : '';
        }
        return product?.sku || '';
    }

    const productOptions = useMemo(() =>{

        let sellersProducts = orderParameters ? orderParameters.products : [];
        if (needSeller()) {
            sellersProducts = selectedSeller ? sellersProducts.filter(item=>item.seller===selectedSeller) : [];
        }

        return sellersProducts.map((item)=> ({label: `${item.name}`, value: item.uuid, extraSearch: item.sku}));

    },[orderParameters, selectedSeller]);

    const calcProductTotal = (index: number) => {
        const product = getValues('products')[index];
        const total = (Math.floor(((+product.quantity) * (+product.price) - (+product.discount))*100)/100).toString();
        setValue(`products.${index}.total`, total === '0' ? '' : total, { shouldValidate: true });
        setValue(`products.${index}.quantity`, +product.quantity === 0 ?'': product.quantity, { shouldValidate: true });
        setValue(`products.${index}.price`, +product.price === 0 ? '' : product.price, { shouldValidate: true });
    }

    const getProductColumns = (control: any) => {
        return [
            {
                title: (
                    <div style={{width: '30px', justifyContent: 'center', alignItems: 'center'}}>
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
                width: '30px',
                key: 'selected',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '30px', justifyContent: 'center', alignItems: 'center'}}>
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
                title: 'SKU',
                dataIndex: 'sku',
                key: 'sku',
                minWidth: 100,
                responsive: ['md'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.sku`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '110px'}}>
                                <FieldBuilder
                                    name={`products.${index}.sku`}
                                    fieldType={FormFieldTypes.TEXT_AREA}
                                    {...field}
                                    disabled={true}
                                    rows={1}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                title: 'Product*',
                dataIndex: 'product',
                width: '100%',
                minWidth: 200,
                key: 'product',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.product`}
                        control={control}
                        defaultValue={record.product}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{}}>
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
                                        const sku = getProductSku(selectedValue as string);
                                        record.sku = getProductSku(selectedValue as string);
                                        setValue(`products.${index}.sku`, sku);
                                        updateTotalProducts();
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Analogue',
                dataIndex: 'analogue',
                key: 'analogue',
                width: 150,
                minWidth: 150,
                responsive: ['lg'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.analogue`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '180px'}}>
                                <FieldBuilder
                                    name={`products.${index}.analogue`}
                                    fieldType={FormFieldTypes.TEXT_AREA}
                                    {...field}
                                    options={productOptions}
                                    disabled={true}
                                    rows={1}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                title: 'Quantity*',
                dataIndex: 'quantity',
                key: 'quantity',
                minWidth: 50,
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.quantity`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products.${index}.quantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        updateTotalProducts();
                                        calcProductTotal(index);
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Price*',
                dataIndex: 'price',
                key: 'price',
                minWidth: 50,
                responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.price`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products.${index}.price`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        calcProductTotal(index);
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Discount',
                dataIndex: 'discount',
                key: 'discount',
                minWidth: 50,
                responsive: ['lg'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.discount`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products.${index}.discount`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        calcProductTotal(index);
                                    }}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                title: 'Tax',
                dataIndex: 'tax',
                key: 'tax',
                minWidth: 50,
                responsive: ['md'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.tax`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products.${index}.tax`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                minWidth: 60,
                responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.total`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '60px'}}>
                                <FieldBuilder
                                    name={`products.${index}.total`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                />
                            </div>
                        )}
                        // rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'COD',
                dataIndex: 'cod',
                key: 'cod',
                minWidth: 50,
                responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.cod`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '70px'}}>
                                <FieldBuilder
                                    name={`products.${index}.cod`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    onChange={(newValue: string) => {field.onChange(newValue); updateTotalProducts(); }}
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

    //form fields
    //const warehouse = watch('preferredWarehouse');

    const getCourierServices = (warehouse: string) => {
        if (orderParameters?.warehouses) {
            if (!warehouse.trim()) {
                const uniqueCourierServices = Array.from(
                    new Set(
                        orderParameters.warehouses
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
                const filteredWarehouses = orderParameters.warehouses.filter(
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
    };

    const informUserAboutPickUpPointClearing = (message: string) => {
        if (getValues('receiverPickUpID') || getValues('receiverPickUpName')) {
            toast.warn(message, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }

    const handleCourierServiceChange = (selectedOption: string) => {
        setSelectedCourierService(selectedOption);
        //let user know that pickUp point info is cleared
        informUserAboutPickUpPointClearing('PickUp point is cleared! Please, fill this info for chosen courier service (if needed)')
        fetchPickupPoints(selectedOption);
        clearPickUpPoint();
    }

    const handleWarehouseChange = (selectedOption: string) => {
        //setSelectedWarehouse(selectedOption);
        //let user know that pickUp point info is cleared
        informUserAboutPickUpPointClearing('PickUp point is cleared! Please, choose courier service and fill PickUp point info (if needed)')
        clearPickUpPoint();
        setSelectedCourierService('');
        setValue('preferredCourierService', '');
        setCurPickupPoints([]);
    }

    //notifications
    let orderNotifications: NotificationType[] = [];
    if (orderData && orderData.uuid && notifications && notifications.length) {
        //orderNotifications = notifications.filter(item => item.objectUuid === orderData.uuid && item.status !== NOTIFICATION_STATUSES.READ)
        // orderNotifications = notifications.filter(item => item.objectUuid === orderData.uuid)
        orderNotifications = getCorrectNotifications(orderData, notifications);
    }

    //address fields
    const checkRequisiteChanged = useCallback((field:string, data:SingleOrderFormType)=>{
        return !!(orderData[field] || data[field]) && orderData[field] !== data[field]
    }, [orderData]);

    const getChangedAddressFields = useCallback((data: SingleOrderFormType)=>{
        const receiverFieldsMain = [
            'receiverAddress',
            // 'receiverCity',
            'receiverComment',
            'receiverCounty',
            'receiverEMail',
            'receiverFullName',
            'receiverPhone',
            // 'receiverZip'
        ];

        const changedFields = {}

        receiverFieldsMain.forEach(field => {
            if (checkRequisiteChanged(field, data)) {
                changedFields[field] = data[field] || '';
            }
        })

        //add check for city and zip
        if (checkRequisiteChanged('receiverCity', data) || checkRequisiteChanged('receiverZip', data)) {
            changedFields['receiverCity'] = data['receiverCity'] || '';
            changedFields['receiverZip'] = data['receiverZip'] || '';
        }


        //pickUp point
        let pickUpPointChanged = false;

        receiverFieldsPickUpPoint.forEach(field => {
            if (checkRequisiteChanged(field, data)) {
                pickUpPointChanged = true;
            }
        });

        if (pickUpPointChanged) {
            receiverFieldsPickUpPoint.forEach(field => {
                changedFields[field] = data[field] || '';
            });

            if (!data.receiverPickUpCountry) {
                changedFields['receiverPickUpCountry'] = data.receiverCountry || '';
            }
        }

        return changedFields;
    }, [orderData]);

    const hasChangedAddressFields = useCallback(() => {
        if (orderData && orderData.addressEditAllowedOnly) {
            const data = getValues() as SingleOrderFormType;

            if (Object.keys(getChangedAddressFields(data)).length > 0) {
                setAddressWasChanged(true);
            } else {
                setAddressWasChanged(false)
            }
        }
    },[orderData,  isAddressAllowed, setAddressWasChanged, getChangedAddressFields, getValues]);

    const [atLeastOneFieldIsFilled, setAtLeastOneFieldIsFilled] = useState(false);
    const hasAtLeastOnePickUpPointFieldIsFilled = useCallback(() => {
        const data = getValues() as SingleOrderFormType;

        let isFilled = false
        receiverFieldsPickUpPoint.forEach(field => {
            if (data[field]) {
                isFilled = true;
            }
        });
        setAtLeastOneFieldIsFilled(isFilled);

    },[setAtLeastOneFieldIsFilled, getValues]);


    const linkToTrack = orderData && orderData.trackingLink && orderData.trackingLink.at(-1) != '=' ? <a href={orderData?.trackingLink} target='_blank'>{orderData?.trackingLink}</a> : null;

    const generalFields = useMemo(()=> GeneralFields(!orderData?.uuid, orderTitles), [orderData, orderTitles])
    const detailsFields = useMemo(()=>DetailsFields({warehouses, courierServices: getCourierServices(preferredWarehouse), handleWarehouseChange:handleWarehouseChange, handleCourierServiceChange: handleCourierServiceChange, linkToTrack: linkToTrack, newObject: !orderData?.uuid }), [preferredWarehouse]);
    const receiverFields = useMemo(()=>ReceiverFields({countries, isDisabled, isAddressAllowed: orderData?.receiverCountry ? isAddressAllowed : false, onChangeFn: hasChangedAddressFields}),[curPickupPoints, pickupOptions, countries, preferredWarehouse,selectedCourierService, isAddressAllowed, isDisabled, hasChangedAddressFields ])
    const pickUpPointFields = useMemo(()=>PickUpPointFields({countries, isDisabled, isAddressAllowed: (orderData?.receiverPickUpID || orderData?.receiverPickUpName) ? isAddressAllowed : false, onChangeFn: ()=>{hasChangedAddressFields(); hasAtLeastOnePickUpPointFieldIsFilled()}, atLeastOneFieldIsFilled}),[countries, preferredWarehouse,selectedCourierService, isDisabled, isAddressAllowed, hasChangedAddressFields, atLeastOneFieldIsFilled, pickupOptions])
    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(orderData?.attachedFiles || []);


    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    //check receiverCountry + zip (France with zip 98000 - 98099 is Monaco)
    const receiverCountry = watch('receiverCountry');
    const receiverZip = watch('receiverZip');
    const isCountryInCorrect = (receiverCountry, receiverZip) => {
        return (receiverCountry === 'FR' && (receiverZip >= 98000 && receiverZip <= 98099));
    }
    const isMonacoAvailable = (countries: OptionType[]) => {
        return countries.filter(item => item.value === 'MC').length > 0;
    }

    useEffect(() => {
        if (isCountryInCorrect(receiverCountry, receiverZip)) {
            setError('receiverCountry', {
                type: 'manual',
                message: `Zip code ${receiverZip} belongs to Monaco, not France. ${isMonacoAvailable(countries) ? 'Please, select Monaco!' : 'Please, contact your support manager'}`,
            });
        } else {
            clearErrors('receiverCountry');
        }
    }, [receiverZip, receiverCountry]);

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

        const codCurrency = getValues('codCurrency');
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
                calcProductTotal(index);
                if (codCurrency && products[index].total) {
                    setValue(`products.${index}.cod`, getValues(`products.${index}.total`));
                }
            } else {
                //add new row
                appendProduct(
                    {
                        key: selectedProduct.key,
                        product: selectedProduct.product,
                        quantity: selectedProduct.quantity,
                        sku: getProductSku(selectedProduct.product),
                        selected: false,
                        analogue: '',
                        price: 0,
                        cod: 0,
                        tax: 0,
                        discount: 0,
                        total: 0,
                        connectionKey: '',
                    }
                );
            }

        });
        updateTotalProducts();
    }

    const tabTitleArray =  TabTitles(!!orderData?.uuid, !!(orderData?.claims && orderData.claims.length), !!(orderData?.customerReturns && orderData.customerReturns.length), !!(orderData?.tickets && orderData.tickets.length), forbiddenTabs);
    const {tabTitles, updateTabTitles, clearTabTitles, resetTabTables} = useTabsState(tabTitleArray, TabFields);

    useEffect(() => {
        resetTabTables(tabTitleArray);
    }, [orderData]);

    const handleCreateTicket = () => {
        setShowTicketForm(true)
    }


    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleConfirmCancelOrder = async () => {
        setShowConfirmModal(false);
        await handleCancelOrder();
    }

    const handleCancelOrder = async() => {
        try {
            const requestData = {token, alias, uuid: orderData?.uuid};

            try {
                sendUserBrowserInfo({...getBrowserInfo('CancelOrder', AccessObjectTypes["Orders/Fullfillment"], AccessActions.EditObject), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}
            if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.EditObject)) {
                return null;
            }

            const res: ApiResponseType = await cancelOrder(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Order is successfully canceled!`, onClose: closeSuccessModal})
                setShowStatusModal(true);
            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Order can not be canceled!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const sendAddressChangedData = async(data) => {

        let changedFields = {
            uuid: orderData.uuid,
            clientOrderID: orderData.clientOrderID,
            ...getChangedAddressFields(data)
        };

        try {
            const requestData = {token, alias, addressData: changedFields};

            try {
                sendUserBrowserInfo({...getBrowserInfo('UpdateAddressShipmentOrder'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await sendAddressData(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Order's address is successfully edited!`, onClose: closeSuccessModal})
                setShowStatusModal(true);
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
        }
    }

    const onSubmitForm = async (data) => {
        const curAction = orderData ? AccessActions.EditObject : AccessActions.CreateObject;
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], curAction)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateOrder', AccessObjectTypes["Orders/Fullfillment"], curAction), body: {uuid: data?.uuid || ''}});
            } catch {}

            return null;
        }

        clearTabTitles();

        const errorTabs: string[] = [];

        if (!isDraft) {
            if (!products.length) {
                setError('products', {
                    type: 'manual',
                    message: 'Products are empty! Order needs to have at least 1 product!',
                });

                toast.warn(`Order needs to have at least 1 product!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                errorTabs.push('products');
            }
            if (isCountryInCorrect(receiverCountry, receiverZip)) {
                setError('receiverCountry', {
                    type: 'manual',
                    message: `Zip code ${receiverZip} belongs to Monaco, not France. ${isMonacoAvailable(countries) ? 'Please, select Monaco!' : 'Please, contact your support manager'}`,
                })
                toast.warn(`Zip code ${receiverZip} belongs to Monaco, not France. ${isMonacoAvailable(countries) ? 'Please, select Monaco as a receiver country!' : 'Please, contact your support manager'}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
                errorTabs.push('receiverCountry');

            }

            if (errorTabs.length) {
                updateTabTitles(errorTabs);
                return null;
            }
        }

        setIsLoading(true);
        data.draft = isDraft;
        data.attachedFiles= selectedFiles;

        if (isAddressChange) {
            return sendAddressChangedData(data);
        }

        try {
            const requestData: CreateOrderRequestType = {
                token: token,
                alias,
                orderData: data
            };

            if (data.seller) {
                requestData.seller = data.seller;
            }

            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateOrder'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await sendOrderData(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Order is successfully ${ orderData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal})
                setShowStatusModal(true);
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
        }
    }

    const onError = (props: any) => {
        const curAction = orderData ? AccessActions.EditObject : AccessActions.CreateObject;
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], curAction)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateOrder', AccessObjectTypes["Orders/Fullfillment"], curAction), body: {uuid: orderData?.uuid || ''}});
            } catch {}

            return null;
        }

        if (isDraft) {
            clearErrors();
            clearTabTitles();

            const fieldNames: string[] = [];

            if (needSeller() && props.seller) {
                setError('seller', {
                    type: 'manual',
                    message: 'Seller is required!',
                });

                toast.warn(`Seller is required for draft orders!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                fieldNames.push('seller');
                // updateTabTitles(['seller']);

            }

            if (fieldNames.length > 0) {
                updateTabTitles(['seller']);
                return null;
            } else {
                const formData = getValues();
                return onSubmitForm(formData as SingleOrderFormType);
            }
        } else {
            let fieldNames = Object.keys(props);

            if (isCountryInCorrect(receiverCountry, receiverZip)) {
                setError('receiverCountry', {
                    type: 'manual',
                    message: `Zip code ${receiverZip} belongs to Monaco, not France. ${isMonacoAvailable(countries) ? 'Please, select Monaco!' : 'Please, contact your support manager'}`,
                })
                toast.warn(`Zip code ${receiverZip} belongs to Monaco, not France. ${isMonacoAvailable(countries) ? 'Please, select Monaco as a receiver country!' : 'Please, contact your support manager'}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
                fieldNames.push('receiverCountry');
            }

            if (fieldNames.length > 0) {
                toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            if (!products.length) {
                setError('products', {
                    type: 'manual',
                    message: 'Products are empty! Order needs to have at least 1 product!',
                });

                toast.warn(`Order needs to have at least 1 product!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                fieldNames.push('products');
            }

            updateTabTitles(fieldNames);
        }
    };

    //validation function for codCurrency field
    const checkOrderHasCod = useCallback((products: SingleOrderProductFormType[]) => {
        if (products.length) {
            let i = 0;
            while (i<products.length) {
                if (products[i].cod) return true;
                i++;
            }
        }
        return false;
    }, []);

    const handleEditClick = () => {
        // () => setIsDisabled(!(orderData?.canEdit || !orderData?.uuid))
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('EditOrder', AccessObjectTypes["Orders/Fullfillment"], AccessActions.EditObject), body: {uuid: orderData?.uuid || ''}});
            } catch {}
        } else {
            setIsDisabled(!(orderData?.canEdit || !orderData?.uuid));

        }
    }

    const handleCancelOrderClick = () => {
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CancelOrder', AccessObjectTypes["Orders/Fullfillment"], AccessActions.EditObject), body: {uuid: orderData?.uuid || ''}});
            } catch {}
        } else {
            setShowConfirmModal(true);
        }
    }

    const handleEditAddressClick = () => {
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('EditAddressOrder', AccessObjectTypes["Orders/Fullfillment"], AccessActions.EditObject), body: {uuid: orderData?.uuid || ''}});
            } catch {}
        } else {
            setIsAddressAllowed(true)
        }
    }

    const [showWarehousePhotos, setShowWarehousePhotos] = useState(false);

    return <div className='order-info'>
        {(isLoading || !orderParameters) && <Loader />}
        <ToastContainer />
        {orderParameters && (orderUuid && orderData || !orderUuid) ? <>
            <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
                <input autoComplete="false" name="hidden" type="text" style={{display:'none'}} />
                <Tabs id='order-tabs' tabTitles={tabTitles} classNames='inside-modal'
                      notifications={orderNotifications}
                      extraInfo={(orderData?.logisticComment || orderData?.warehouseAdditionalInfo) && isTabAllowed('Logistic comment', forbiddenTabs) ?
                        <div className='order-info--comments-wrapper'>
                            {orderData?.logisticComment ? <div className='order-info--logistic-comment-wrapper'>
                                <p className='order-info--logistic-comment-text'>{orderData?.logisticComment}</p>
                            </div>: null}
                            {orderData?.warehouseAdditionalInfo ? <div className='order-info--address-comment-wrapper'>
                                <p className='order-info--address-comment-text'>{orderData?.warehouseAdditionalInfo}</p>
                            </div>: null}
                        </div> : null}>
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
                                                options={(orderData?.status !=='Draft' && !!orderData) ? sellersList : sellersListActive}
                                                placeholder={''}
                                                errorMessage={error?.message}
                                                errors={errors}
                                                disabled={isDisabled || (orderData?.status !=='Draft' && !!orderData)}
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
                        <CardWithHelpIcon classNames='card order-info--general'>
                            <h3 className='order-info__block-title'>
                                <Icon name='general'/>
                                General
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors}
                                                 isDisabled={isDisabled}/>
                            </div>
                            {orderData?.warehouseAssemblyPhotos && orderData?.warehouseAssemblyPhotos.length>0 ? (
                                <>
                                    <div className={`order-info--warehouse-photos`} onClick={()=>setShowWarehousePhotos(true)}>
                                        <Icon name={'webcam'} />
                                        <span>Photos from warehouse</span>
                                    </div>
                                </>
                            ) : null}
                        </CardWithHelpIcon>
                        <CardWithHelpIcon classNames='card order-info--details'>
                            <h3 className='order-info__block-title'>
                                <Icon name='additional'/>
                                Details
                            </h3>
                            <div className='grid-row check-box-bottom'>
                                <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors}
                                                 isDisabled={isDisabled}/>
                            </div>
                        </CardWithHelpIcon>
                    </div> : null}
                    {isTabAllowed('Delivery info', forbiddenTabs) ? <div key='delivery-tab' className='delivery-tab'>
                        <div className='card order-info--receiver'>
                            <h3 className='order-info__block-title'>
                                <Icon name='receiver'/>
                                Receiver
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors}
                                                 // isDisabled={isDisabled}/>
                                />
                            </div>
                        </div>
                        <div className='card order-info--pick-up-point'>
                            <h3 className='order-info__block-title'>
                                <Icon name='general'/>
                                Pick up point
                            </h3>
                            <div className='grid-row'>
                                <Controller
                                    key='receiverPickUpID'
                                    name='receiverPickUpID'
                                    control={control}
                                    render={(
                                        {
                                            field: {...props},
                                            fieldState: {error}
                                        }) => (
                                        <FieldBuilder
                                            // disabled={!!isDisabled}
                                            {...props}
                                            name='receiverPickUpID'
                                            label='ID'
                                            fieldType={curPickupPoints && curPickupPoints.length && createdPickupPoints.length ? FormFieldTypes.SELECT : FormFieldTypes.TEXT}
                                            options={createdPickupPoints}
                                            placeholder={curPickupPoints && curPickupPoints.length ? 'Select' : ''}
                                            errorMessage={error?.message}
                                            errors={errors}
                                            disabled={isDisabled && !((orderData?.receiverPickUpID || orderData?.receiverPickUpName) && isAddressAllowed)}
                                            onChange={(selectedOption) => {
                                                setSelectedPickupPoint(selectedOption as string);
                                                props.onChange(selectedOption);
                                                hasChangedAddressFields();
                                                hasAtLeastOnePickUpPointFieldIsFilled();
                                            }}
                                            width={WidthType.w25}
                                        />
                                    )}
                                    rules = {{required: atLeastOneFieldIsFilled ? "Required field" : false}}
                                />
                                <FormFieldsBlock control={control} fieldsArray={pickUpPointFields} errors={errors} />
                            </div>
                        </div>
                    </div> : null }
                    {isTabAllowed('Products', forbiddenTabs) ? <div key='product-tab' className='product-tab'>
                        <CardWithHelpIcon classNames="card min-height-600 order-info--products">
                            <h3 className='order-info__block-title '>
                                <Icon name='goods'/>
                                Products
                            </h3>
                            <div className='grid-row mb-md'>
                                <div className='order-info--cod-currency width-33 grid-row'>
                                    <Controller
                                        name="codCurrency"
                                        control={control}
                                        render={({field, fieldState: {error}}) => (
                                            <FieldBuilder
                                                fieldType={FormFieldTypes.SELECT}
                                                name='codCurrency'
                                                label='COD currency'
                                                {...field}
                                                options={currencyOptions}
                                                placeholder=""
                                                errorMessage={error?.message}
                                                errors={errors}
                                                disabled={isDisabled}
                                                width={WidthType.w50}
                                                hint={OrderHints['codCurrency']}
                                            />
                                        )}
                                        rules={{
                                            validate: (value) => {
                                                if (checkOrderHasCod(products)) {
                                                    return value ? true : 'This field is required';
                                                }
                                                return true;
                                            },
                                        }}
                                    />
                                    <Controller
                                        name="priceCurrency"
                                        control={control}
                                        render={({field, fieldState: {error}}) => (
                                            <FieldBuilder
                                                fieldType={FormFieldTypes.SELECT}
                                                name='priceCurrency'
                                                label='Price currency'
                                                {...field}
                                                options={currencyOptions}
                                                placeholder=""
                                                errorMessage={error?.message}
                                                errors={errors}
                                                disabled={isDisabled}
                                                width={WidthType.w50}
                                                hint={OrderHints['priceCurrency']}
                                            />
                                        )}
                                        rules={{required: 'Field is required'}}
                                    />
                                </div>
                                <div className='order-info--order-btns width-67'>
                                    <div className='grid-row'>
                                        <div
                                            className='order-info--table-btns form-table--btns small-paddings width-100'>
                                            <TutorialHintTooltip hint={OrderHints['selection'] || ''} forBtn >
                                                <Button type="button" icon='selection' iconOnTheRight
                                                    size={ButtonSize.SMALL} disabled={isDisabled}
                                                    variant={ButtonVariant.SECONDARY}
                                                    onClick={() => handleProductSelection()} classNames='selection-btn'>
                                                    Add from List
                                                </Button>
                                            </TutorialHintTooltip>
                                            <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn >
                                                <Button type="button" icon='add-table-row' iconOnTheRight
                                                        size={ButtonSize.SMALL} disabled={isDisabled}
                                                        variant={ButtonVariant.SECONDARY}
                                                        onClick={() => appendProduct({
                                                            key: `product-${Date.now().toString()}`,
                                                            selected: false,
                                                            sku: '',
                                                            product: '',
                                                            analogue: '',
                                                            quantity: '',
                                                            price: '',
                                                            discount: '',
                                                            tax: '',
                                                            total: '',
                                                            cod: '',
                                                            connectionKey: '',
                                                        })}
                                                >
                                                    Add by SKU
                                                </Button>
                                            </TutorialHintTooltip>
                                            <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn >
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
                            <div className='order-info--table table-form-fields form-table'>
                                <div className={`products-wrapper${errors?.products ? ' empty-table-error' : ''}`}>
                                    <Table
                                        columns={getProductColumns(control)}
                                        dataSource={getValues('products')?.map((field, index) => ({key: field.product + '-' + index, ...field})) || []}
                                        pagination={false}
                                        rowKey="key"
                                    />
                                </div>
                                {errors?.products ? <p className={'error-message'}>{errors.products.message}</p> : null}
                                <ProductsTotal productsInfo={productsTotalInfo}/>
                            </div>
                        </CardWithHelpIcon>
                    </div> : null}
                    {orderData?.uuid && isTabAllowed('Services', forbiddenTabs) && <div key='services-tab' className='services-tab'>
                        <div className="card min-height-600 order-info--history">
                            <h3 className='order-info__block-title'>
                                <Icon name='bundle'/>
                                Services
                            </h3>
                            <Services services={orderData?.services}/>
                        </div>
                    </div>}
                    {orderData?.uuid && isTabAllowed('Status history', forbiddenTabs) && <div key='status-history-tab' className='status-history-tab'>
                        <div className="min-height-600 order-info--history">
                            <div className='card'>
                                <h3 className='order-info__block-title'>
                                    <Icon name='history'/>
                                    Status history
                                </h3>
                                <StatusHistory statusHistory={orderData?.statusHistory}/>
                            </div>
                        </div>
                    </div>}
                    {orderData?.uuid && isTabAllowed('SMS history', forbiddenTabs) && <div key='sms-history-tab' className='sms-history-tab'>
                        <div className="card min-height-600 order-info--sms-history">
                            <h3 className='order-info__block-title'>
                                <Icon name='message'/>
                                SMS history
                            </h3>
                            <SmsHistory smsHistory={orderData?.smsHistory}/>
                        </div>
                    </div>}
                    {orderData?.uuid && orderData?.claims.length && isTabAllowed('Claims', forbiddenTabs) ? <div key='claims-tab' className='claims-tab'>
                        <div className="card min-height-600 order-info--claims">
                            <h3 className='order-info__block-title'>
                                <Icon name='complaint'/>
                                Claims
                            </h3>
                            <Claims claims={orderData.claims}/>
                        </div>
                    </div> : null}
                    {/*customer returns*/}
                    {orderData?.uuid && orderData?.customerReturns.length && isTabAllowed('Customer returns', forbiddenTabs) ? <div key='customer-returns-tab' className='customer-returns-tab'>
                        <div className="card min-height-600 order-info--customer-returns">
                            <h3 className='order-info__block-title'>
                                <Icon name='package-return'/>
                                Customer returns
                            </h3>
                            <CustomerReturns customerReturns={orderData.customerReturns}/>
                        </div>
                    </div> : null}
                    {/*-----*/}
                    {orderData?.uuid && orderData.tickets.length && isTabAllowed('Tickets', forbiddenTabs) ? <div key='tickets-tab' className='tickets-tab'>
                        <div className="card min-height-600 order-info--tickets">
                            <h3 className='order-info__block-title'>
                                <Icon name='ticket'/>
                                Tickets
                            </h3>
                            <DocumentTickets tickets={orderData.tickets}/>
                        </div>
                    </div> : null}
                    {orderData?.uuid && isTabAllowed('Notes', forbiddenTabs) ? <div key='notes-tab' className='notes-tab'>
                        <div className="card min-height-600 order-info--files">
                            <h3 className='order-info__block-title'>
                                <Icon name='edit'/>
                                Notes
                            </h3>
                            <div className='notes'>
                                <NotesList object={orderData?.uuid} notes={orderData?.notes} refetch={refetchDoc} />
                            </div>
                        </div>
                    </div> : null}
                    {isTabAllowed('Files', forbiddenTabs) ? <div key='files-tab' className='files-tab'>
                        <CardWithHelpIcon classNames="card min-height-600 order-info--files">
                            <TutorialHintTooltip hint={OrderHints['files'] || ''} position='left' classNames='mb-md'>
                                <h3 className='order-info__block-title  title-small' >
                                    <Icon name='files'/>
                                    Files
                                </h3>
                            </TutorialHintTooltip>
                            <div className='dropzoneBlock'>
                                <DropZone readOnly={!!isDisabled} files={selectedFiles}
                                          onFilesChange={handleFilesChange}
                                          docUuid={orderData?.canEdit ? orderData?.uuid : ''}
                                          allowOnlyFormats={['pdf']}
                                          hint={'The supported file formats: PDF'}
                                />
                            </div>
                        </CardWithHelpIcon>
                    </div> : null}
                </Tabs>

                <div className='form-submit-btn'>
                    {orderData && orderData.uuid && isTabAllowed('Tickets', forbiddenTabs) ?
                        <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight
                                onClick={handleCreateTicket}>Create ticket</Button> : null}
                    {orderData?.uuid && orderData?.canEdit ?
                        <Button type='button' variant={ButtonVariant.PRIMARY} onClick={handleCancelOrderClick}>Cancel
                            order</Button> : null}
                    {isDisabled && orderData?.canEdit && !orderData?.addressEditAllowedOnly && <Button type="button" disabled={false}
                                                                 onClick={handleEditClick}
                                                                 variant={ButtonVariant.PRIMARY}>Edit</Button>}
                    {isDisabled && orderData?.addressEditAllowedOnly && !isAddressAllowed && isTabAllowed('Logistic comment', forbiddenTabs) && <Button type="button" disabled={false}
                                                                                                      onClick={handleEditAddressClick}
                                                                                                      variant={ButtonVariant.PRIMARY}>Edit address</Button>}
                    {orderData?.uuid && orderData?.status==="In transit" && isTabAllowed('Comment to courier service', forbiddenTabs) && <Button type="button" disabled={false} onClick={handleShowCommentModal} variant={ButtonVariant.PRIMARY}>Send comment</Button>}
                    {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY} onClick={()=>setIsDraft(true)}>Save as draft</Button>}
                    {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={()=>setIsDraft(false)}  variant={ButtonVariant.PRIMARY}>Send</Button>}
                    {isDisabled && orderData?.addressEditAllowedOnly && isAddressAllowed && isTabAllowed('Logistic comment', forbiddenTabs) && <Button type="submit" disabled={!isAddressAllowed || !addressWasChanged} onClick={()=>setIsAddressChange(true)}  variant={ButtonVariant.PRIMARY}>Send address</Button>}
                    </div>
            </form>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
            {showSendCommentModal && <Modal title={`Send comment for order ${orderData?.wapiTrackingNumber}`} onClose={()=>{setShowSendCommentModal(false)}} >
                <SendComment orderData={orderData} countryOptions={countries} closeSendCommentModal={()=>setShowSendCommentModal(false)} onSuccess={()=>setCommentHasBeenSent(true)}/>
            </Modal>}
            {showProductSelectionModal && <Modal title={`Product selection`} onClose={()=>setShowProductSelectionModal(false)} noHeaderDecor >
                {/*<ProductSelection alreadyAdded={products as SelectedProductType[]} handleAddSelection={handleAddSelection}/>*/}
                <ProductSelection alreadyAdded={products as SelectedProductType[]} handleAddSelection={handleAddSelection} selectedDocWarehouse={preferredWarehouse} needOnlyOneWarehouse={false} seller={selectedSeller}/>

            </Modal>}

            {showTicketForm && <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} subjectType={TICKET_OBJECT_TYPES.Fullfilment} subjectUuid={orderUuid} subject={`Fullfilment ${orderData?.wapiTrackingNumber} ${orderData?.date ? formatDateStringToDisplayString(orderData.date) : ''}`} onClose={()=>{setShowTicketForm(false); refetchDoc();}} seller={needSeller() ? orderData.seller : ''} />}

            {showConfirmModal && <ConfirmModal
                actionText='Are you sure you want to cancel this order?'
                onOk={handleConfirmCancelOrder}
                onCancel={()=>setShowConfirmModal(false)}
            />}
        </> : null}
        {showWarehousePhotos ? <ImageSlider  images={orderData?.warehouseAssemblyPhotos || []} show={showWarehousePhotos} setShow={setShowWarehousePhotos}/> : null}
    </div>
}

export default OrderFormComponent;
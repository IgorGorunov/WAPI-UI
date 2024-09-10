import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {
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
import useAuth from "@/context/authContext";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNTRIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {cancelOrder, getOrderPickupPoints, sendOrderData} from '@/services/orders';
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
import {NOTIFICATION_OBJECT_TYPES, NOTIFICATION_STATUSES, NotificationType} from "@/types/notifications";
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

type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type OrderFormType = {
    orderData?: SingleOrderType;
    orderParameters: OrderParamsType;
    orderUuid?: string;
    closeOrderModal: ()=>void;
    refetchDoc: ()=>void;
}

const OrderFormComponent: React.FC<OrderFormType> = ({orderData, orderParameters, orderUuid, refetchDoc, closeOrderModal}) => {
    const {notifications} = useNotifications();

    const [isDisabled, setIsDisabled] = useState(!!orderUuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [curPickupPoints, setCurPickupPoints] = useState<PickupPointsType[]>(null);
    const [pickupOptions, setPickupOptions] = useState<OptionType[]>(null);
    const [selectedPickupPoint, setSelectedPickupPoint] = useState<string | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedCourierService, setSelectedCourierService] = useState('');

    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);

    const { token, currentDate, superUser, ui } = useAuth();

    //tickets
    const [showTicketForm, setShowTicketForm] = useState(false);

    //countries
    const allCountries = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    const getCountryOptions = () =>  {
        let filteredCountries = orderParameters ? [...orderParameters.warehouses] : [];

        if (selectedWarehouse)  {
            filteredCountries = filteredCountries.filter(item=>item.warehouse===selectedWarehouse);
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
    }, [selectedWarehouse, selectedCourierService]);

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
                    }))
                : [],
    }),[orderData]);

    const {control, handleSubmit, formState: { errors }, getValues, setValue, watch, clearErrors} = useForm({
        mode: 'onSubmit',
        defaultValues: defaultFormValues,
    });

    const { append: appendProduct, remove: removeProduct } = useFieldArray({ control, name: 'products' });
    const products = watch('products');
    const currencyOptions = useMemo(()=>{return orderParameters && orderParameters?.currencies.length ? createOptions(orderParameters?.currencies) : []},[]);

    const preferredWarehouse = watch('preferredWarehouse');

    //pickup points
    const createPickupOptions = () => {
        if (curPickupPoints && curPickupPoints.length) {
            return curPickupPoints.map((item: PickupPointsType)=>{return {label:item.id, value: item.id} as OptionType})
        }
        return [];
    }

    const fetchPickupPoints = useCallback(async (courierService: string) => {
        try {
            setIsLoading(true);
            const requestData = {token, courierService};
            const res: ApiResponseType = await getOrderPickupPoints(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setCurPickupPoints(res.data)
                setPickupOptions(createPickupOptions());
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
        const pickupPoints = curPickupPoints && curPickupPoints.length ? curPickupPoints.filter((item:PickupPointsType)=>item.id===selectedPickupPoint) : [];

        if (pickupPoints.length) {
            setValue('receiverPickUpName', pickupPoints[0].name );
            setValue('receiverPickUpCountry', pickupPoints[0].country );
            setValue('receiverPickUpCity', pickupPoints[0].city );
            setValue('receiverPickUpAddress', pickupPoints[0].address );
        } else {
            setValue('receiverPickUpName', orderData?.receiverPickUpName || '' );
            setValue('receiverPickUpCountry', orderData?.receiverPickUpCountry || '' );
            setValue('receiverPickUpCity', orderData?.receiverPickUpCity || '' );
            setValue('receiverPickUpAddress', orderData?.receiverPickUpAddress || '' );
        }
    }, [selectedPickupPoint, curPickupPoints]);


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



    const getProductSku = (productUuid: string) => {
        const product = orderParameters.products.find(item => item.uuid === productUuid);
        return product?.sku || '';
    }
    const productOptions = useMemo(() =>{
        return orderParameters ? orderParameters.products.map((item)=> ({label: `${item.name}`, value: item.uuid})) : [];
    },[orderParameters]);

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
                            <div style={{maxWidth: '130px'}}>
                                <FieldBuilder
                                    name={`products.${index}.sku`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    disabled={true}
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
                width: 200,
                minWidth: 200,
                responsive: ['lg'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.analogue`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '200px'}}>
                                <FieldBuilder
                                    name={`products.${index}.analogue`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    options={productOptions}
                                    disabled={true}
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

    //form fields
    const warehouse = watch('preferredWarehouse');

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

    const handleCourierServiceChange = (selectedOption: string) => {
        setSelectedCourierService(selectedOption);
        fetchPickupPoints(selectedOption);
    }

    const handleWarehouseChange = (selectedOption: string) => {
        setSelectedWarehouse(selectedOption);
        setSelectedCourierService('')
    }



    //notifications
    let orderNotifications: NotificationType[] = [];
    if (orderData && orderData.uuid && notifications && notifications.length) {
        orderNotifications = notifications.filter(item => item.objectUuid === orderData.uuid && item.status !== NOTIFICATION_STATUSES.READ)
        // orderNotifications = notifications.filter(item => item.objectUuid === orderData.uuid)
    }


    const linkToTrack = orderData && orderData.trackingLink ? <a href={orderData?.trackingLink} target='_blank'>{orderData?.trackingLink}</a> : null;


    const generalFields = useMemo(()=> GeneralFields(!orderData?.uuid), [orderData])
    const detailsFields = useMemo(()=>DetailsFields({warehouses, courierServices: getCourierServices(warehouse), handleWarehouseChange:handleWarehouseChange, handleCourierServiceChange: handleCourierServiceChange, linkToTrack: linkToTrack, newObject: !orderData?.uuid }), [warehouse]);
    const receiverFields = useMemo(()=>ReceiverFields({countries}),[curPickupPoints, pickupOptions, countries, selectedWarehouse,selectedCourierService ])
    const pickUpPointFields = useMemo(()=>PickUpPointFields({countries}),[countries, selectedWarehouse,selectedCourierService])
    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(orderData?.attachedFiles || []);

    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

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
                        total: 0
                    }
                );
            }

        });
        updateTotalProducts();
    }

    const tabTitleArray =  TabTitles(!!orderData?.uuid, !!(orderData?.claims && orderData.claims.length), !!(orderData?.tickets && orderData.tickets.length));
    const {tabTitles, updateTabTitles, clearTabTitles, resetTabTables} = useTabsState(tabTitleArray, TabFields);

    useEffect(() => {
        resetTabTables(tabTitleArray);
    }, [orderData]);

    const handleCreateTicket = () => {
        setShowTicketForm(true)
    }


    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const handleConfirmCancelOrder = () => {
        setShowConfirmModal(false);
        handleCancelOrder();
    }

    const handleCancelOrder = async() => {
        try {
            const res: ApiResponseType = await cancelOrder(
                {
                    token: token,
                    uuid: orderData?.uuid,
                }
            );

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

    const onSubmitForm = async (data) => {
        clearTabTitles();
        setIsLoading(true);
        data.draft = isDraft;
        data.attachedFiles= selectedFiles;

        try {
            const requestData = {
                token: token,
                orderData: data
            };
            const res: ApiResponseType = await sendOrderData(superUser && ui ? {...requestData, ui} : requestData);
            //console.log('order res: ', res)
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

        if (isDraft) {
            clearErrors();
            const formData = getValues();

            return onSubmitForm(formData as SingleOrderFormType);
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

    return <div className='order-info'>
        {(isLoading || !orderParameters) && <Loader />}
        <ToastContainer />
        {orderParameters && (orderUuid && orderData || !orderUuid) ? <>
            <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
                <input autoComplete="false" name="hidden" type="text" style={{display:'none'}} />
                <Tabs id='order-tabs' tabTitles={tabTitles} classNames='inside-modal'
                      notifications={orderNotifications} extraInfo={orderData.logisticComment ?
                        <div className='order-info--logistic-comment-wrapper'>
                            <p className='order-info--logistic-comment-text'>{orderData.logisticComment}</p></div> : null}>
                    <div key='general-tab' className='general-tab'>
                        <CardWithHelpIcon classNames='card order-info--general'>
                            <h3 className='order-info__block-title'>
                                <Icon name='general'/>
                                General
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors}
                                                 isDisabled={isDisabled}/>
                            </div>
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
                    </div>
                    <div key='delivery-tab' className='delivery-tab'>
                        <div className='card order-info--receiver'>
                            <h3 className='order-info__block-title'>
                                <Icon name='receiver'/>
                                Receiver
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors}
                                                 isDisabled={isDisabled}/>
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
                                            disabled={!!isDisabled}
                                            {...props}
                                            name='receiverPickUpID'
                                            label='Code'
                                            fieldType={curPickupPoints && curPickupPoints.length ? FormFieldTypes.SELECT : FormFieldTypes.TEXT}
                                            options={createPickupOptions()}
                                            placeholder={curPickupPoints && curPickupPoints.length ? 'Select' : ''}
                                            errorMessage={error?.message}
                                            errors={errors}
                                            onChange={(selectedOption) => {
                                                setSelectedPickupPoint(selectedOption as string);
                                                props.onChange(selectedOption);
                                            }}
                                            width={WidthType.w25}
                                        />)}
                                />
                                <FormFieldsBlock control={control} fieldsArray={pickUpPointFields} errors={errors}
                                                 isDisabled={isDisabled}/>
                            </div>
                        </div>
                    </div>
                    <div key='product-tab' className='product-tab'>
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
                                                            cod: ''
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
                                <Table
                                    columns={getProductColumns(control)}
                                    dataSource={getValues('products')?.map((field, index) => ({key: field.product + '-' + index, ...field})) || []}
                                    pagination={false}
                                    rowKey="key"
                                />
                                <ProductsTotal productsInfo={productsTotalInfo}/>
                            </div>
                        </CardWithHelpIcon>
                    </div>
                    {orderData?.uuid && <div key='services-tab' className='services-tab'>
                        <div className="card min-height-600 order-info--history">
                            <h3 className='order-info__block-title'>
                                <Icon name='bundle'/>
                                Services
                            </h3>
                            <Services services={orderData?.services}/>
                        </div>
                    </div>}
                    {orderData?.uuid && <div key='status-history-tab' className='status-history-tab'>
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
                    {orderData?.uuid && <div key='sms-history-tab' className='sms-history-tab'>
                        <div className="card min-height-600 order-info--sms-history">
                            <h3 className='order-info__block-title'>
                                <Icon name='message'/>
                                SMS history
                            </h3>
                            <SmsHistory smsHistory={orderData?.smsHistory}/>
                        </div>
                    </div>}
                    {orderData?.uuid && orderData?.claims.length ? <div key='claims-tab' className='claims-tab'>
                        <div className="card min-height-600 order-info--claims">
                            <h3 className='order-info__block-title'>
                                <Icon name='complaint'/>
                                Claims
                            </h3>
                            <Claims claims={orderData.claims}/>
                        </div>
                    </div> : null}
                    {orderData?.uuid && orderData.tickets.length ? <div key='tickets-tab' className='tickets-tab'>
                        <div className="card min-height-600 order-info--tickets">
                            <h3 className='order-info__block-title'>
                                <Icon name='ticket'/>
                                Tickets
                            </h3>
                            <DocumentTickets tickets={orderData.tickets}/>
                        </div>
                    </div> : null}
                    {orderData?.uuid ? <div key='notes-tab' className='notes-tab'>
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
                    <div key='files-tab' className='files-tab'>
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
                                          docUuid={orderData?.canEdit ? '' : orderData?.uuid}/>
                            </div>
                        </CardWithHelpIcon>
                    </div>
                </Tabs>

                <div className='form-submit-btn'>
                    {orderData && orderData.uuid ?
                        <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight
                                onClick={handleCreateTicket}>Create ticket</Button> : null}
                    {orderData?.uuid && orderData?.canEdit ?
                        <Button type='button' variant={ButtonVariant.PRIMARY} onClick={() => setShowConfirmModal(true)}>Cancel
                            order</Button> : null}
                    {isDisabled && orderData?.canEdit && <Button type="button" disabled={false}
                                                                 onClick={() => setIsDisabled(!(orderData?.canEdit || !orderData?.uuid))}
                                                                 variant={ButtonVariant.PRIMARY}>Edit</Button>}
                    {orderData?.uuid && orderData?.status==="In transit" && <Button type="button" disabled={false} onClick={handleShowCommentModal} variant={ButtonVariant.PRIMARY}>Send comment</Button>}
                    {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY} onClick={()=>setIsDraft(true)}>Save as draft</Button>}
                    {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={()=>setIsDraft(false)}  variant={ButtonVariant.PRIMARY}>Send</Button>}
                    </div>
            </form>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
            {showSendCommentModal && <Modal title={`Send comment for order ${orderData?.wapiTrackingNumber}`} onClose={()=>{setShowSendCommentModal(false)}} >
                <SendComment orderData={orderData} countryOptions={countries} closeSendCommentModal={()=>setShowSendCommentModal(false)} onSuccess={()=>setCommentHasBeenSent(true)}/>
            </Modal>}
            {showProductSelectionModal && <Modal title={`Product selection`} onClose={()=>setShowProductSelectionModal(false)} noHeaderDecor >
                {/*<ProductSelection alreadyAdded={products as SelectedProductType[]} handleAddSelection={handleAddSelection}/>*/}
                <ProductSelection alreadyAdded={products as SelectedProductType[]} handleAddSelection={handleAddSelection} selectedDocWarehouse={preferredWarehouse} needOnlyOneWarehouse={false}/>

            </Modal>}

            {showTicketForm && <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} subjectType={TICKET_OBJECT_TYPES.Fullfilment} subjectUuid={orderUuid} subject={`Fullfilment ${orderData?.wapiTrackingNumber} ${orderData?.date ? formatDateStringToDisplayString(orderData.date) : ''}`} onClose={()=>{setShowTicketForm(false); refetchDoc();}} />}

            {showConfirmModal && <ConfirmModal
                actionText='cancel this order?'
                onOk={handleConfirmCancelOrder}
                onCancel={()=>setShowConfirmModal(false)}
            />}
        </> : null}
    </div>
}

export default OrderFormComponent;
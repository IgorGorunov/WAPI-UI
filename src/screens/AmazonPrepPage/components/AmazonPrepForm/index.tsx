import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {
    OrderParamsType,
    OrderProductType,
    SingleOrderType,
    OrderProductWithTotalInfoType,
    WarehouseType,
    PickupPointsType
} from "@/types/orders";
import "./styles.scss";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import {verifyToken} from "@/services/auth";
import Skeleton from "@/components/Skeleton/Skeleton";
import useAuth from "@/context/authContext";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNTRIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {getOrderPickupPoints, sendOrderData} from '@/services/orders';
import {
    DetailsFields,
    GeneralFields,
    PickUpPointFields,
    ReceiverFields
} from "@/screens/OrdersPage/components/OrderForm/OrderFormFields";
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
import ProductsTotal from "@/screens/OrdersPage/components/OrderForm/ProductsTotal";
import {toast, ToastContainer} from '@/components/Toast';


type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type AmazonPrepFormType = {
    orderData?: SingleOrderType;
    orderParameters?: OrderParamsType;
    closeOrderModal: ()=>void;
}

const AmazonPrepForm: React.FC<AmazonPrepFormType> = ({orderData, orderParameters, closeOrderModal}) => {
    const Router = useRouter();
    const [isDisabled, setIsDisabled] = useState(!!orderData?.uuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [curPickupPoints, setCurPickupPoints] = useState<PickupPointsType[]>(null);
    const [pickupOptions, setPickupOptions] = useState<OptionType[]>(null);
    const [selectedPickupPoint, setSelectedPickupPoint] = useState<string | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedCourierService, setSelectedCourierService] = useState('');

    const { token } = useAuth();

    //countries
    const allCountries = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    const getCountryOptions = () =>  {
        let filteredCountries = [...orderParameters.warehouses];

        if (selectedWarehouse)  {
            filteredCountries = filteredCountries.filter(item=>item.warehouse===warehouse);
        }

        if (selectedCourierService) {
            filteredCountries = filteredCountries.filter(item=>item.courierService===selectedCourierService);
        }

        const countryArr =  filteredCountries.map(item => item.country);

        console.log('cc', countryArr, orderParameters.warehouses)

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
    const {control, handleSubmit, formState: { errors }, getValues, setValue, watch} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            clientOrderID: orderData?.clientOrderID || '',
            codAmount: orderData?.codAmount || '',
            codCurrency: orderData?.codCurrency || '',
            commentCourierService: orderData?.commentWarehouse || '',
            commentWarehouse: orderData?.commentWarehouse || '',
            courierService: orderData?.courierService || '',
            courierServiceTrackingNumber: orderData?.courierServiceTrackingNumber || '',
            courierServiceTrackingNumberCurrent: orderData?.courierServiceTrackingNumberCurrent || '',
            date: orderData?.date || new Date().toISOString(),
            incomingDate: orderData?.incomingDate || '',
            preferredCourierService: orderData?.preferredCourierService || '',
            preferredCourierServiceMandatory: orderData?.preferredCourierServiceMandatory || false,
            preferredDeliveryDate: orderData?.preferredDeliveryDate || '',
            preferredWarehouse: orderData?.preferredWarehouse || '',
            preferredWarehouseMandatory: orderData?.preferredWarehouseMandatory || '',
            receiverAddress: orderData?.receiverAddress || '',
            receiverCity: orderData?.receiverCity || '',
            receiverComment: orderData?.receiverComment || '',
            receiverCountry: orderData?.receiverCountry || '',
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
        }
    });

    const { append: appendProduct } = useFieldArray({ control, name: 'products' });
    const products = watch('products');
    const currencyOptions = useMemo(()=>{return orderParameters && orderParameters?.currencies.length ? createOptions(orderParameters?.currencies) : []},[]);

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

            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await getOrderPickupPoints(
                {token, courierService}
            );

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
            setValue('receiverPickUpName', '' );
            setValue('receiverPickUpCountry', '' );
            setValue('receiverPickUpCity', '' );
            setValue('receiverPickUpAddress', '' );
        }
    }, [selectedPickupPoint, curPickupPoints]);


    //products
    const [selectAllProducts, setSelectAllProducts] = useState(false);
    const [productsTotalInfo, setProductsTotalInfo] = useState<OrderProductWithTotalInfoType>({
        cod: 0,
        weightNet: 0,
        weightGross: 0,
        volume:0,
    });

    const updateTotalProducts = () => {
        const rez = {
            cod: 0,
            weightNet: 0,
            weightGross: 0,
            volume:0,
            currency: getValues('codCurrency'),
        };
        getValues('products').forEach(item => {
            const prodInfo = orderParameters.products.filter(product=>product.uuid = item.product);
            if (prodInfo?.length) {
                rez.cod += Number(item.cod);
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



    const getProductSku = (productUuid: string) => {
        const product = orderParameters.products.find(item => item.uuid === productUuid);
        return product?.sku || '';
    }
    const productOptions = useMemo(() =>{
        return orderParameters.products.map((item: OrderProductType)=>{return {label: `${item.name} (available: ${item.available} in ${item.warehouse})`, value:item.uuid, extraInfo: item.name}});
    },[orderParameters]);

    // const productsHeaderWidth = [40, 130, 'auto', 200, 50, 50, 50, 50, 50, 50];
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
                                    name={'products.${index}.selected'}
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
                                /></div>
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
                        name={`products[${index}].product`}
                        control={control}
                        defaultValue={record.product}
                        render={({ field }) => (
                            <div style={{}}>
                                <FieldBuilder
                                    name={`products[${index}].product`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productOptions}
                                    disabled={isDisabled}
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
                        name={`products[${index}].analogue`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '200px'}}>
                                <FieldBuilder
                                    name={`products[${index}].analogue`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    options={productOptions}
                                    disabled={true}

                                /></div>
                        )}
                    />
                ),
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                minWidth: 50,
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].quantity`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products[${index}].quantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    onChange={(newValue: string) => {field.onChange(newValue);updateTotalProducts();
                                    }}
                                /></div>

                        )}

                    />
                ),
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                minWidth: 50,
                responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].price`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products[${index}].price`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                /></div>

                        )}
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
                        name={`products[${index}].discount`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products[${index}].discount`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                /></div>

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
                        name={`products[${index}].tax`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products[${index}].tax`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                minWidth: 50,
                responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].total`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '50px'}}>
                                <FieldBuilder
                                    name={`products[${index}].total`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                /></div>

                        )}
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
                        name={`products[${index}].cod`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '70px'}}>
                                <FieldBuilder
                                    name={`products[${index}].cod`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    onChange={(newValue: string) => {field.onChange(newValue); updateTotalProducts(); }}
                                /></div>

                        )}
                    />
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

    const generalFields = useMemo(()=> GeneralFields(), [])
    const detailsFields = useMemo(()=>DetailsFields({warehouses, courierServices: getCourierServices(warehouse), handleWarehouseChange:handleWarehouseChange, handleCourierServiceChange: handleCourierServiceChange}), [warehouse]);
    const receiverFields = useMemo(()=>ReceiverFields({countries}),[curPickupPoints, pickupOptions, countries, selectedWarehouse,selectedCourierService ])
    const pickUpPointFields = useMemo(()=>PickUpPointFields({countries}),[countries, selectedWarehouse,selectedCourierService])
    const [selectedFiles, setSelectedFiles] = useState(orderData?.attachedFiles);

    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    const onSubmitForm = async (data) => {
        setIsLoading(true);
        data.draft = isDraft;
        data.attachedFiles= selectedFiles;
        try {
            //verify token
            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await sendOrderData(
                {
                    token: token,
                    orderData: data
                }
            );

            if (res && "status" in res) {
                if (res?.status === 200) {
                    //success
                    setModalStatusInfo({isSuccess: true, title: "Success", subtitle: `Order is successfully ${ orderData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal})
                    setShowStatusModal(true);
                }
            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal})
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

        const fieldNames = Object.keys(props);

        if (fieldNames.length > 0) {
            toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
                position: "top-right",
                autoClose: 1000,
            });
        }
    };

    return <div className='amazon-prep-info'>

        {isLoading && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                zIndex: 1000
            }}>
                <Skeleton type="round" width="500px" height="300px" />
            </div>
        )}
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmitForm, onError)}>
            <Tabs id='amazon-prep-tabs' tabTitles={['General', 'Delivery info', 'Products', 'Services', 'Status history', 'Files']} classNames='inside-modal' >
                <div key='general-tab' className='general-tab'>
                    <div className='card amazon-prep-info--general'>
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='general' />
                            General
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card amazon-prep-info--details'>
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='additional' />
                            Details
                        </h3>
                        <div className='grid-row check-box-bottom'>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                </div>
                <div key='delivery-tab' className='delivery-tab'>
                    <div className='card amazon-prep-info--receiver'>
                        <h3 className='order-info__block-title'>
                            <Icon name='receiver' />
                            Receiver
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card amazon-prep-info--pick-up-point'>
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='general' />
                            Pick up point
                        </h3>
                        <div className='grid-row'>
                            <Controller
                                key='receiverPickUpID'
                                name='receiverPickUpID'
                                control={control}
                                render={(
                                    {
                                        field: { ...props},
                                        fieldState: {error}
                                    }) => (
                                    <FieldBuilder
                                        disabled={!!isDisabled}
                                        {...props}
                                        name='receiverPickUpID'
                                        label='ID'
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
                                    /> )}
                            />
                            <FormFieldsBlock control={control} fieldsArray={pickUpPointFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                </div>
                <div key='product-tab' className='product-tab'>
                    <div className="card min-height-600 amazon-prep-info--products">
                        <h3 className='order-info__block-title '>
                            <Icon name='goods' />
                            Products
                        </h3>
                        <div className='grid-row mb-md'>
                            <div className='amazon-prep-info--cod-currency width-25'>
                                <Controller
                                    name="codCurrency"
                                    control={control}
                                    render={({ field }) => (
                                        <FieldBuilder
                                            fieldType={FormFieldTypes.SELECT}
                                            name='codCurrency'
                                            label='COD currency'
                                            {...field}
                                            options={currencyOptions}
                                            placeholder=""
                                            errors={errors}
                                            disabled={isDisabled}
                                        />
                                    )}
                                />
                            </div>
                            <div className='amazon-prep-info--order-btns width-75'>
                                <div className='grid-row'>
                                    <div className='amazon-prep-info--table-btns small-paddings width-100'>
                                        <Button type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={() => appendProduct({ key: `product-${Date.now().toString()}`, selected: false, sku: '', product: '', analogue:'',quantity:'', price:'',discount:'',tax:'',total:'', cod:'' })}>
                                            Add
                                        </Button>
                                        <Button type="button" icon='remove-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeProducts}>
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='amazon-prep-info--table table-form-fields'>
                            <Table
                                columns={getProductColumns(control)}
                                dataSource={getValues('products')?.map((field, index) => ({ key: field.product+'-'+index, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />
                            <ProductsTotal productsInfo={productsTotalInfo} />
                        </div>
                    </div>
                </div>
                <div key='services-tab' className='services-tab'>
                    <div className="card min-height-600 amazon-prep-info--history">
                        <h3 className='order-info__block-title'>
                            <Icon name='bundle' />
                            Services
                        </h3>
                        <Services services={orderData?.services} />
                    </div>
                </div>
                <div key='status-history-tab' className='status-history-tab'>
                    <div className="card min-height-600 amazon-prep-info--history">
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='history' />
                            Status history
                        </h3>
                        <StatusHistory statusHistory={orderData?.statusHistory} />
                    </div>
                </div>
                <div key='files-tab' className='files-tab'>
                    <div className="card min-height-600 amazon-prep-info--files">
                        <h3 className='order-info__block-title'>
                            <Icon name='files' />
                            Files
                        </h3>
                        <div className='dropzoneBlock'>
                            <DropZone readOnly={!!isDisabled} files={selectedFiles} onFilesChange={handleFilesChange} />
                        </div>
                    </div>
                </div>
            </Tabs>

            <div className='form-submit-btn'>
                {isDisabled && orderData?.canEdit && <Button type="button" disabled={false} onClick={()=>setIsDisabled(!(orderData?.canEdit || !orderData?.uuid))} variant={ButtonVariant.PRIMARY}>Edit</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY} onClick={()=>setIsDraft(true)}>Save as draft</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={()=>setIsDraft(false)}  variant={ButtonVariant.PRIMARY}>Save</Button>}
            </div>
        </form>
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
    </div>
}

export default AmazonPrepForm;
import React, {ChangeEvent, useCallback, useMemo, useState} from 'react';
import {
    OrderParamsType,
    OrderProductType,
    SingleOrderType,
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

type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type OrderFormType = {
    orderData?: SingleOrderType;
    orderParams?: OrderParamsType;
    closeOrderModal: ()=>void;
}

const OrderForm: React.FC<OrderFormType> = ({orderData, orderParams, closeOrderModal}) => {
    const Router = useRouter();
    const [isDisabled, setIsDisabled] = useState(!!orderData?.uuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [curPickupPoints, setCurPickupPoints] = useState<PickupPointsType[]>(null);

    const { token } = useAuth();

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

    const countries = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    const warehouses = useMemo(() => {
        if (orderParams?.warehouses) {
            const uniqueWarehouses = orderParams.warehouses.filter(
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
    }, [orderParams?.warehouses]);

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
            preferredWarehouse: orderData?.preferredWarehouse || new Date().toISOString(),
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
                    : [
                        {
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
                        }
                    ],
        }
    })

    const { append: appendProduct } = useFieldArray({ control, name: 'products' });
    const products = watch('products');
    const currencyOptions = useMemo(()=>{return orderParams && orderParams?.currencies.length ? createOptions(orderParams?.currencies) : []},[]);

    //pickup points
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
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token]);
    const createPickupOptions = () => {
        if (curPickupPoints && curPickupPoints.length) {
            return curPickupPoints.map((item: PickupPointsType)=>{return {label:item.id, value: item.id} as OptionType})
        }
        return [];
    }
    const handlePickupPointData = (selectedOption: string) => {
        const pickupPoints = curPickupPoints.filter((item:PickupPointsType)=>item.id===selectedOption);
        if (pickupPoints.length) {
            setValue('receiverPickUpName', pickupPoints[0].name );
            setValue('receiverPickUpCountry', pickupPoints[0].country );
            setValue('receiverPickUpCity', pickupPoints[0].city );
            setValue('receiverPickUpAddress', pickupPoints[0].address );
        }
    }


    //products
    const [selectAllProducts, setSelectAllProducts] = useState(false);

    const getProductSku = (productUuid: string) => {
        const product = orderParams.products.find(item => item.uuid === productUuid);
        return product?.sku || '';
    }
    const productOptions = useMemo(() =>{
        return orderParams.products.map((item: OrderProductType)=>{return {label: `${item.name} (available: ${item.available} in ${item.warehouse})`, value:item.uuid, extraInfo: item.name}});
    },[]);
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
                responsive: ['md'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`sku[${index}].name`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '130px'}}>
                                <FieldBuilder
                                    name={`products[${index}].sku`}
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
                                        //handleProductChange(selectedValue,index)
                                        //console.log("1111", record);
                                        const sku = getProductSku(selectedValue as string);
                                        console.log("sku: ",getProductSku(selectedValue as string));
                                        record.sku = getProductSku(selectedValue as string);
                                        setValue(`products.${index}.sku`, sku)
                                        //console.log("222", selectedValue);
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
                                /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
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
        if (orderParams?.warehouses) {
            if (!warehouse.trim()) {
                const uniqueCourierServices = Array.from(
                    new Set(
                        orderParams.warehouses
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
                const filteredWarehouses = orderParams.warehouses.filter(
                    (item: WarehouseType) => item.warehouse.trim() === warehouse.trim()
                );

                return filteredWarehouses
                    .map((item: WarehouseType) => ({
                        label: item.courierService,
                        value: item.courierService
                    } as OptionType))
                    .sort((a, b) => a.label.localeCompare(b.label)); // Сортировка по метке
            }
        }
        return [];
    };

    const handleCourierServiceChange = (selectedOption: string) => {
        fetchPickupPoints(selectedOption);
    }

    const generalFields = useMemo(()=> GeneralFields(), [])
    const detailsFields = useMemo(()=>DetailsFields({warehouses, courierServices: getCourierServices(warehouse), handleCourierServiceChange: handleCourierServiceChange}), [warehouse]);
    const receiverFields = useMemo(()=>ReceiverFields({countries}),[])
    const pickUpPointFields = useMemo(()=>PickUpPointFields({countries}),[])
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

                    setModalStatusInfo({ title: "Error", subtitle: `Please, fix these errors!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return <div className='order-info'>

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
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <Tabs id='order-tabs' tabTitles={['General', 'Delivery info', 'Products', 'Services', 'Status history', 'Files']} classNames='inside-modal' >
                <div className='general-tab'>
                    <div className='card order-info--general'>
                        <h3 className='order-info__block-title'>
                            <Icon name='general' />
                            General
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card order-info--details'>
                        <h3 className='order-info__block-title'>
                            <Icon name='additional' />
                            Details
                        </h3>
                        <div className='grid-row check-box-bottom'>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                </div>
                <div className='delivery-tab'>
                    <div className='card order-info--receiver'>
                        <h3 className='order-info__block-title'>
                            <Icon name='receiver' />
                            Receiver
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card order-info--pick-up-point'>
                        <h3 className='order-info__block-title'>
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
                                            props.onChange(selectedOption);
                                            curPickupPoints && curPickupPoints.length && handlePickupPointData(selectedOption as string);
                                        }}
                                        width={WidthType.w25}
                                    /> )}
                            />
                            <FormFieldsBlock control={control} fieldsArray={pickUpPointFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                </div>
                <div className='product-tab'>
                    <div className="card min-height-600 order-info--products">
                        <h3 className='order-info__block-title '>
                            <Icon name='goods' />
                            Products
                        </h3>
                        <div className='grid-row mb-md'>
                            <div className='order-info--cod-currency width-25'>
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
                            <div className='order-info--order-btns width-75'>
                                <div className='grid-row'>
                                    <div className='order-info--table-btns small-paddings width-100'>
                                        <Button type="button" icon='remove' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeProducts}>
                                            Remove
                                        </Button>
                                        <Button type="button" icon='add' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  onClick={() => appendProduct({ key: `product-${Date.now().toString()}`, selected: false, sku: '', product: '', analogue:'',quantity:'', price:'',discount:'',tax:'',total:'', cod:'' })}>
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='order-info--table table-form-fields'>
                            <Table
                                columns={getProductColumns(control)}
                                dataSource={getValues('products')?.map((field, index) => ({ key: field.product+'-'+index, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />
                        </div>
                    </div>
                </div>
                <div className='services-tab'>
                    <div className="card min-height-600 order-info--history">
                        <h3 className='order-info__block-title'>
                            <Icon name='bundle' />
                            Services
                        </h3>
                        <Services services={orderData?.services} />
                    </div>
                </div>
                <div className='status-history-tab'>
                    <div className="card min-height-600 order-info--history">
                        <h3 className='order-info__block-title'>
                            <Icon name='history' />
                            Status history
                        </h3>
                        <StatusHistory statusHistory={orderData?.statusHistory} />
                    </div>
                </div>
                <div className='files-tab'>
                    <div className="card min-height-600 order-info--files">
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
                <Button type="button" disabled={false} onClick={()=>setIsDisabled(!(orderData?.canEdit || !orderData?.uuid))} variant={ButtonVariant.SECONDARY}>Edit</Button>
                <Button type="submit" disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={()=>setIsDraft(true)}>Save as draft</Button>
                <Button type="submit" disabled={isDisabled} onClick={()=>setIsDraft(false)} >Save</Button>
            </div>
        </form>
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
    </div>
}

export default OrderForm;
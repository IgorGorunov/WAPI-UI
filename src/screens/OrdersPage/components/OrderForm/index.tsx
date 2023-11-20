import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {OrderParamsType, SingleOrderType, WarehouseType, OrderProductType} from "@/types/orders";
import "./styles.scss";
import Skeleton from "@/components/Skeleton/Skeleton";
import useAuth from "@/context/authContext";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNRTIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {DetailsFields, GeneralFields, ReceiverFields} from "@/screens/OrdersPage/components/OrderForm/OrderFormFields";
import {FormFieldTypes, OptionType} from "@/types/forms";
import Icon from "@/components/Icon";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import StatusHistory from "./StatusHistory";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {Table} from "antd";

const enum SendStatusType {
    DRAFT = 'draft',
    PENDING = 'pending',
}

type OrderFormType = {
    orderData?: SingleOrderType;
    orderParams?: OrderParamsType;
    closeOrderModal: ()=>void;
}

const OrderForm: React.FC<OrderFormType> = ({orderData, orderParams, closeOrderModal}) => {
    console.log('order data: ', orderData,'--', orderParams);

    const [isDisabled, setIsDisabled] = useState(!!orderData?.uuid);
    const [isLoading, setIsLoading] = useState(false);

    const { token, setToken } = useAuth();
    const countries = COUNRTIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));
    const warehouses = useMemo( () => orderParams?.warehouses.map((item: WarehouseType) => {return {label: item.warehouse.trim(), value: item.warehouse.trim()} as OptionType}), []);

    //form
    const {control, handleSubmit, formState: { errors }, trigger, getValues, setValue, watch} = useForm({
        defaultValues: {
            clientOrderID: orderData?.clientOrderID || '',
            codAmount: orderData?.codAmount || '',
            codCurrency: orderData?.codCurrency || '',
            commentCourierService: orderData?.commentWarehouse || '',
            commentWarehouse: orderData?.commentWarehouse || '',
            courierService: orderData?.courierService || '',
            courierServiceTrackingNumber: orderData?.courierServiceTrackingNumber || '',
            courierServiceTrackingNumberCurrent: orderData?.courierServiceTrackingNumberCurrent || '',
            date: orderData?.date || '',
            exportReason: orderData?.exportReason || '',
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
            selfCollect: orderData?.selfCollect || '',
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

    const { append: appendProduct, update: updateProduct, remove: removeProduct } = useFieldArray({ control, name: 'products' });
    const products = watch('products');
    //const [productOptions, setProductOptions] = useState<string[]>([]);


    //products
    const [selectAllProducts, setSelectAllProducts] = useState(false);
    const handleProductChange=(product, index) => {
        const productSKU = product ? '12345' : "";
        updateProduct(index, {...products[index], sku: productSKU});
        console.log('updated: ', products);
    }
    const productOptions = useMemo(() =>{
        return orderParams.products.map((item: OrderProductType)=>{return {label: `${item.name} (available: ${item.available} in ${item.warehouse})`, value:item.uuid}});
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
                render: (text, record, index) => (
                    <Controller
                        name={`sku[${index}].name`}
                        control={control}

                        render={({ field }) => (
                            <div style={{width: '130px'}}>
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
                key: 'product',
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].product`}
                        control={control}

                        render={({ field }) => (
                            <div style={{width: '220px'}}>
                                <FieldBuilder
                                    name={`products[${index}].product`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productOptions}
                                    disabled={isDisabled}
                                    //onChange={(newValue: string) => {field.onChange(newValue); handleProductChange(newValue, index)}}

                                /></div>
                        )}
                    />
                ),
            },
            {
                title: 'Analogue',
                dataIndex: 'analogue',
                key: 'analogue',
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].analogue`}
                        control={control}

                        render={({ field }) => (
                            <div style={{width: '220px'}}>
                                <FieldBuilder
                                    name={`products[${index}].product`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productOptions}
                                    disabled={isDisabled}
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
                            <div style={{width: '50px'}}>
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
                        name={`products[${index}].width`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '50px'}}>
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
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].discount`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '50px'}}>
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
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].tax`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '50px'}}>
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
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].total`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '50px'}}>
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
                title: 'COD (EUR)',
                dataIndex: 'cod',
                key: 'cod',
                render: (text, record, index) => (
                    <Controller
                        name={`products[${index}].cod`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '50px'}}>
                                <FieldBuilder
                                    name={`products[${index}]cod`}
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
    const warehouse = watch('warehouse');
    const getCourierServices = (warehouse: string) => {
        return orderParams.warehouses.filter((item:WarehouseType)=>item.warehouse.trim() || !warehouse).map((item:WarehouseType)=>{return {label: item.warehouse.trim(), value: item.warehouse.trim()} as OptionType})
    }


    const generalFields = useMemo(()=> GeneralFields(), [])
    const detailsFields = useMemo(()=>DetailsFields({warehouses, courierServices: getCourierServices(warehouse)}), [warehouse]);
    const receiverFields = useMemo(()=>ReceiverFields({countries}),[])



    const onSubmitForm = (data) => {
        console.log("submit: ", data);
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
                            <Icon name='general' />
                            Details
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                </div>
                <div className='delivery-tab'>
                    <div className='card order-info--receiver'>
                        <h3 className='order-info__block-title'>
                            <Icon name='general' />
                            Receiver
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card order-info--receiver'>
                        <h3 className='order-info__block-title'>
                            <Icon name='general' />
                            Receiver
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card order-info--receiver'>
                        <h3 className='order-info__block-title'>
                            <Icon name='general' />
                            Receiver
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                </div>
                <div className='product-tab'>
                    <div className="card min-height-600 order-info--products">
                        <div className='  grid-row mb-md'>
                            <h3 className='product-info__block-title width-50 '>
                                <Icon name='goods' />
                                Products
                            </h3>
                            <div className='product-info--products-btns width-50'>
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
                <div className='services-tab'></div>
                <div className='status-history-tab'>
                    <div className="card min-height-600 order-info--history">
                        <h3 className='order-info__block-title'>
                            <Icon name='history' />
                            Status history
                        </h3>
                        <StatusHistory statusHistory={orderData?.statusHistory} />
                    </div>
                </div>
                <div className='files-tab'></div>
            </Tabs>

            <div className='form-submit-btn'>
                <Button type="button" disabled={false} onClick={()=>setIsDisabled(false)} variant={ButtonVariant.SECONDARY}>Edit</Button>
                <Button type="submit" disabled={isDisabled}>Save</Button>
            </div>

        </form>


    </div>
}

export default OrderForm;
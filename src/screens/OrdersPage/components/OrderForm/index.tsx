import React, {useMemo, useState} from 'react';
import {OrderParamsType, SingleOrderType, WarehouseType, OrderProductType} from "@/types/orders";
import "./styles.scss";
import Skeleton from "@/components/Skeleton/Skeleton";
import useAuth from "@/context/authContext";
import {useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonVariant} from "@/components/Button/Button";
import {COUNRTIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {DetailsFields, GeneralFields, ReceiverFields} from "@/screens/OrdersPage/components/OrderForm/OrderFormFields";
import {OptionType} from "@/types/forms";
import Icon from "@/components/Icon";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import StatusHistory from "./StatusHistory";

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
    const [sendStatus, setSendStatus] = useState(SendStatusType.DRAFT);

    const { token, setToken } = useAuth();
    const countries = COUNRTIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));
    const warehouses = useMemo( () => orderParams?.warehouses.map((item: WarehouseType) => {return {label: item.warehouse, value: item.warehouse} as OptionType}), []);

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
                            product: product.product.name || '',
                            analogue: product.analogue.name || '',
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


    //form fields
    const generalFields = useMemo(()=> GeneralFields(), [])
    const detailsFields = useMemo(()=>DetailsFields({warehouses}), []);
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
                <div className='product-tab'></div>
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
                <Button type="submit" disabled={isDisabled} onClick={()=>setSendStatus(SendStatusType.DRAFT)} variant={ButtonVariant.SECONDARY}>Save as draft</Button>
                <Button type="submit" disabled={isDisabled} onClick={()=>setSendStatus(SendStatusType.PENDING)} >Send to approve</Button>
            </div>

        </form>


    </div>
}

export default OrderForm;
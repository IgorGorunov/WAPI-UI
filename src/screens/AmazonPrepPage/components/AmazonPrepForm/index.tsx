import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {
    AmazonPrepOrderParamsType,
    AmazonPrepOrderProductType,
    AmazonPrepOrderProductWithTotalInfoType,
    SingleAmazonPrepOrderType,
    WarehouseType,
} from "@/types/amazonPrep";
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
import ProductsTotal from "./ProductsTotal";
import {toast, ToastContainer} from '@/components/Toast';
import Pallets from "@/screens/AmazonPrepPage/components/AmazonPrepForm/Pallets";
import {TabFields, TabTitles} from "./AmazonPrepFormTabs";
import {useTabsState} from "@/hooks/useTabsState";

type AmazonPrepFormType = {
    amazonPrepOrderData?: SingleAmazonPrepOrderType;
    amazonPrepOrderParameters?: AmazonPrepOrderParamsType;
    closeAmazonPrepOrderModal: ()=>void;

}

const AmazonPrepForm: React.FC<AmazonPrepFormType> = ({amazonPrepOrderData, amazonPrepOrderParameters, closeAmazonPrepOrderModal}) => {
    const Router = useRouter();
    const [isDisabled, setIsDisabled] = useState(!!amazonPrepOrderData?.uuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);

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
    const carrierTypeOptions = useMemo(()=>amazonPrepOrderParameters?.carrierTypes ? amazonPrepOrderParameters?.carrierTypes.map(item => ({label: item, value: item})) : [{label: 'WAPI carrier', value: 'WAPI carrier'}, {label: 'Customer carrier', value: 'Customer carrier'}],[amazonPrepOrderParameters]);

    //boxTypesOptions
    const boxesTypeOptions = useMemo(()=> amazonPrepOrderParameters.boxesTypes ? amazonPrepOrderParameters.boxesTypes.map(item => ({label: item as string, value: item as string})) : [],[amazonPrepOrderParameters]);

    //form
    const {control, handleSubmit, formState: { errors }, getValues, setValue, watch} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            asnNumber: amazonPrepOrderData?.asnNumber || '',
            clientOrderID: amazonPrepOrderData?.clientOrderID || '',
            commentCourierService: amazonPrepOrderData?.commentWarehouse || '',
            commentWarehouse: amazonPrepOrderData?.commentWarehouse || '',
            courierService: amazonPrepOrderData?.courierService || '',
            courierServiceTrackingNumber: amazonPrepOrderData?.courierServiceTrackingNumber || '',
            date: amazonPrepOrderData?.date || new Date().toISOString(),
            deliveryMethod: amazonPrepOrderData?.deliveryMethod || amazonPrepOrderParameters.deliveryMethod[0] || "",
            incomingDate: amazonPrepOrderData?.incomingDate || '',
            preferredDeliveryDate: amazonPrepOrderData?.preferredDeliveryDate || '',
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
            wapiTrackingNumber: amazonPrepOrderData?.wapiTrackingNumber || '',
            warehouse: amazonPrepOrderData?.warehouse || '',
            carrierType: amazonPrepOrderData?.carrierType || (amazonPrepOrderParameters?.carrierTypes && amazonPrepOrderParameters?.carrierTypes.length && amazonPrepOrderParameters?.carrierTypes[0]) || "",
            multipleLocations: amazonPrepOrderData?.multipleLocations || false,
            boxesType: amazonPrepOrderData?.boxesType || boxesTypeOptions[0].value || '',
            products:
                amazonPrepOrderData && amazonPrepOrderData?.products && amazonPrepOrderData.products.length
                    ? amazonPrepOrderData.products.map((product, index: number) => (
                        {
                            key: `${product.product.uuid} ${Date.now().toString()}_${index}` || `product-${Date.now().toString()}_${index}`,
                            selected: false,
                            product: product.product.uuid || '',
                            quantity: product.quantity || '',
                            boxesQuantity: product.boxesQuantity || '',
                            // unitOfMeasure: product.unitOfMeasure.toLowerCase() || '',
                        }))
                    : [],
        }
    });

    const { append: appendProduct } = useFieldArray({ control, name: 'products' });
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
            const prodInfo = amazonPrepOrderParameters ? amazonPrepOrderParameters.products.filter(product=>product.uuid === item.product) : [];
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

    // const getProductUnit = useCallback((index:number) => {
    //     const curProduct = products[index].product;
    //
    //     const productsParams = amazonPrepOrderParameters ? amazonPrepOrderParameters.products.filter(item => item.uuid===curProduct) : [];
    //     if (curProduct && productsParams.length) {
    //         return productsParams[0].unitOfMeasures.map(unit => ({label: unit.toLowerCase(), value: unit.toLowerCase()} as OptionType));
    //     }
    //     return [] as OptionType[];
    // },[amazonPrepOrderParameters, products]);

    const productOptions = useMemo(() =>{
        return amazonPrepOrderParameters ? amazonPrepOrderParameters.products.map((item: AmazonPrepOrderProductType)=>{return {label: `${item.name} (available: ${item.available} in ${item.warehouse})`, value:item.uuid, extraInfo: item.name}}) : [];
    },[amazonPrepOrderParameters]);

    const carrierType = watch('carrierType');

    useEffect(() => {

    }, [carrierType]);

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
                        name={`products[${index}].quantity`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '80px'}}>
                                <FieldBuilder
                                    name={`products[${index}].quantity`}
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
                        name={`products[${index}].boxesQuantity`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '80px'}}>
                                <FieldBuilder
                                    name={`products[${index}].boxesQuantity`}
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
            // {
            //     title: 'Unit',
            //     dataIndex: 'unitOfMeasure',
            //     key: 'unitOfMeasure',
            //     width: '20%',
            //     render: (text, record, index) => (
            //         <Controller
            //             name={`products[${index}].unitOfMeasure`}
            //             control={control}
            //             render={({ field }) => (
            //                 <div style={{}}>
            //                     <FieldBuilder
            //                         name={`products[${index}].unitOfMeasure`}
            //                         fieldType={FormFieldTypes.SELECT}
            //                         {...field}
            //                         disabled={isDisabled}
            //                         options={getProductUnit(index)}
            //
            //                     />
            //                 </div>
            //             )}
            //         />
            //     ),
            // },
        ];
    }

    const removeProducts = () => {
        setValue('products', products.filter(item => !item.selected));
        setSelectAllProducts(false);
    }

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

    const handleWarehouseChange = (selectedOption: string) => {
        // setSelectedWarehouse(selectedOption);
        // setSelectedCourierService('');
        setValue('courierService', '');
    }

    const multipleLocations = watch('multipleLocations');

    const linkToTrack = amazonPrepOrderData && amazonPrepOrderData.trackingLink ? <a href={amazonPrepOrderData?.trackingLink} target='_blank'>{amazonPrepOrderData?.trackingLink}</a> : null;

    const generalFields = useMemo(()=> GeneralFields(!amazonPrepOrderData?.uuid), [])
    const detailsFields = useMemo(()=>DetailsFields({warehouses: warehouses, courierServices: getCourierServices(warehouse), handleWarehouseChange:handleWarehouseChange, linkToTrack, deliveryMethodOptions, carrierDisabled: (carrierType!=='WAPI carrier'), carrierTypeOptions}), [warehouse, carrierType, amazonPrepOrderParameters]);
    const receiverFields = useMemo(()=>ReceiverFields({countries, multipleLocations}),[countries,multipleLocations ])
    const [selectedFiles, setSelectedFiles] = useState(amazonPrepOrderData?.attachedFiles);

    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    const tabTitleArray =  TabTitles(!!amazonPrepOrderData?.uuid);
    const {tabTitles, updateTabTitles, clearTabTitles} = useTabsState(tabTitleArray, TabFields);

    const onSubmitForm = async (data: SingleAmazonPrepOrderType) => {
        setIsLoading(true);
        clearTabTitles();
        data.draft = isDraft;
        data.attachedFiles = selectedFiles;
        const { token } = useAuth();
        try {
            //verify token
            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await sendAmazonPrepData(
                {
                    token: token,
                    orderData: data
                }
            );

            if (res && "status" in res) {
                if (res?.status === 200) {
                    //success
                    setModalStatusInfo({isSuccess: true, title: "Success", subtitle: `Order is successfully ${ amazonPrepOrderData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal})
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
        updateTabTitles(fieldNames);
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
            <Tabs id='amazon-prep-tabs' tabTitles={tabTitles} classNames='inside-modal' >
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

                </div>
                <div key='delivery-tab' className='delivery-tab'>
                    <div className='card amazon-prep-info--details'>
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='additional' />
                            Details
                        </h3>
                        <div className='grid-row check-box-bottom'>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card amazon-prep-info--receiver'>
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='receiver' />
                            Receiver
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>

                </div>
                <div key='product-tab' className='product-tab'>
                    <div className="card min-height-600 amazon-prep-info--products">
                        <h3 className='amazon-prep-info__block-title '>
                            <Icon name='goods' />
                            Products
                        </h3>
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

                                                        width={WidthType.w50}
                                                    /> )}
                                            />
                                        </div>
                                        <div className='amazon-prep-info--btns__table-btns'>
                                            <Button type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={() => appendProduct({ key: `product-${Date.now().toString()}`, selected: false, product: '', quantity:'', boxesQuantity: ''})}>
                                                Add
                                            </Button>
                                            <Button type="button" icon='remove-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeProducts}>
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                {/*</div>*/}
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
                {amazonPrepOrderData?.uuid &&
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
                {amazonPrepOrderData?.uuid &&
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
                {amazonPrepOrderData?.uuid &&
                    <div key='status-history-tab' className='status-history-tab'>
                        <div className="card min-height-600 amazon-prep-info--history">
                            <h3 className='amazon-prep-info__block-title'>
                                <Icon name='history' />
                                Status history
                            </h3>
                            <StatusHistory statusHistory={amazonPrepOrderData?.statusHistory} />
                        </div>
                    </div>
                }
                <div key='files-tab' className='files-tab'>
                    <div className="card min-height-600 amazon-prep-info--files">
                        <h3 className='amazon-prep-info__block-title'>
                            <Icon name='files' />
                            Files
                        </h3>
                        <div className='dropzoneBlock'>
                            <DropZone readOnly={!!isDisabled} files={selectedFiles} onFilesChange={handleFilesChange} hint="Hint! Product labels, Carton labels, Pallet labels, Excel file any other file related to the order" />
                        </div>
                    </div>
                </div>
            </Tabs>

            <div className='form-submit-btn'>
                {isDisabled && amazonPrepOrderData?.canEdit && <Button type="button" disabled={false} onClick={()=>setIsDisabled(!(amazonPrepOrderData?.canEdit || !amazonPrepOrderData?.uuid))} variant={ButtonVariant.PRIMARY}>Edit</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY} onClick={()=>setIsDraft(true)}>Save as draft</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={()=>setIsDraft(false)}  variant={ButtonVariant.PRIMARY}>Save</Button>}
            </div>
        </form>
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
    </div>
}

export default AmazonPrepForm;
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import "./styles.scss";
import '@/styles/forms.scss';
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNTRIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {DetailsFields, GeneralFields} from "./StockMovementFormFields";
import {TabFields, TabTitles} from "./StockMovementFormTabs";
import {FormFieldTypes} from "@/types/forms";
import Icon from "@/components/Icon";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import StatusHistory from "./StatusHistory";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {Table} from "antd";
import DropZone from "@/components/Dropzone";
import Services from "./Services";
import {useTabsState} from "@/hooks/useTabsState";
import Loader from "@/components/Loader";
import {toast, ToastContainer} from '@/components/Toast';
import {
    ProductInfoType,
    SingleStockMovementFormType,
    SingleStockMovementType,
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementParamsType
} from "@/types/stockMovements";
import {verifyToken} from "@/services/auth";
import {verifyUser} from "@/utils/userData";
import {Routes} from "@/types/routes";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {sendInboundData} from "@/services/inbounds";
import {ApiResponseType} from "@/types/api";
import {SingleOrderProductFormType} from "@/types/orders";
import Modal from "@/components/Modal";
import ImportFilesBlock from "@/components/ImportFilesBlock";
import {ImportFilesType} from "@/types/importFiles";
import ProductsTotal from "@/screens/StockMovementsPage/components/StockMovementForm/ProductsTotal";
import {AttachedFilesType} from "@/types/utility";


type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';



type StockMovementFormType = {
    docType: STOCK_MOVEMENT_DOC_TYPE,
    docData?: SingleStockMovementType;
    docParameters?: StockMovementParamsType;
    closeDocModal: ()=>void;
}

const StockMovementForm: React.FC<StockMovementFormType> = ({docType, docData, docParameters, closeDocModal}) => {
    const Router = useRouter();
    const [isDisabled, setIsDisabled] = useState(!!docData?.uuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);

    const { token, currentDate } = useAuth();

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

    //form
    const {control, handleSubmit, formState: { errors }, getValues, setValue, watch, clearErrors} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            //date: docData?.date || currentDate.toISOString(),
            incomingDate: docData?.incomingDate || currentDate.toISOString(),
            incomingNumber: docData?.incomingNumber || '',
            sender: docData?.sender || (docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS ? 'Customer' : ''),
            senderCountry: docData?.senderCountry || '',
            receiver: docData?.receiver || (docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND ? 'Customer' : ''),
            receiverCountry: docData?.receiverCountry || '',
            freightSupplier: docData?.freightSupplier || '',
            estimatedTimeArrives: docData?.estimatedTimeArrives || '0001-01-01T00:00:00',
            uuid: docData?.uuid || '',
            courierServiceTrackingNumber: docData?.courierServiceTrackingNumber || '',
            wapiTrackingNumber: docData?.wapiTrackingNumber || '',
            warehouseTrackingNumber: docData?.warehouseTrackingNumber || '',
            comment: docData?.comment || '',
            status: docData?.status || '',
            // packages: docData?.packages || '',
            // palletAmount: docData?.palletAmount || '',
            // volume: docData?.volume || '',
            // weightGross:docData?.weightGross || '',
            // weightNet: docData?.weightNet || '',

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

    //countries
    const allCountries = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    //sender
    const senderOptions = docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || !docParameters.sender ? [] : docParameters.sender.map(item => ({label: item.warehouse, value: item.warehouse}));
    const onSenderChange = (newSender: string) => {
        if (docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS) return;
        const newSenderCountry = docParameters.sender ? docParameters.sender.filter(item=>item.warehouse===newSender) : [];
        setValue('senderCountry',newSenderCountry.length ? newSenderCountry[0].country : '', { shouldValidate: true });
    }

    //receiver
    const receiverOptions = docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || !docParameters.receiver ? [] : docParameters.receiver.map(item => ({label: item.warehouse, value: item.warehouse}));
    const onReceiverChange = (newReceiver: string) => {
        if (docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND) return;
        const newReceiverCountry = docParameters.receiver ? docParameters.receiver.filter(item=>item.warehouse===newReceiver) : [];
        setValue('receiverCountry',newReceiverCountry.length ? newReceiverCountry[0].country : '', { shouldValidate: true });
    }

    //products
    const [selectAllProducts, setSelectAllProducts] = useState(false);

    // const getUnitsOptions = (index) => {
    //     const curProduct = products[index].product;
    //     if (docParameters.products.length ) {
    //         const units = docParameters.products.filter(item => item.uuid === curProduct);
    //
    //         if (units.length) return createOptions(units[0].unitOfMeasures);
    //     }
    //     return [];
    // }

    const productQualityOptions = createOptions(docParameters.quality);
    //temporarily
    if (!docParameters.quality.includes('Saleable')) {
        productQualityOptions.push({label: 'Saleable', value: 'Saleable'});
    }

    const productOptions = useMemo(() =>{
        return docParameters.products.map((item: ProductInfoType)=>{return {label: `${item.name}`, value:item.uuid}});
    },[docParameters]);

    const checkSelectedProductValue = (selectedValue) => {
        //console.log('selected val:', selectedValue, productOptions.filter(item=>item.value===selectedValue))

    }

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
                title: 'Quantity plan*',
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
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Unit of measure*',
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
                title: 'Quality',
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
                                    isRequired={false}
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
                    <button disabled={isDisabled} className='remove-table-row' onClick={() => removeProduct(index)}>
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
    const generalFields = useMemo(()=> GeneralFields(!docData?.uuid), [docData])
    const detailsFields = useMemo(()=>DetailsFields({newObject: !docData?.uuid, docType: docType, countryOptions: allCountries, senderOptions, receiverOptions, onSenderChange, onReceiverChange }), [docData]);
    //const productsTotalFields = useMemo(()=>ProductsTotalFields(), [docData]);


    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(docData?.attachedFiles || []);

    const handleFilesChange = (files) => {
        console.log('files!', files)
        setSelectedFiles(files);
    };

    //import files modal
    const addImportedProducts = (importedProducts) => {
        if (!importedProducts || !Array.isArray(importResponse)) return;
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
            addImportedProducts(importResponse?.data?.data || []);

            //show success message
            setModalStatusInfo({isSuccess: true, title: "Success", subtitle: `Products are successfully imported`, onClose: ()=>closeSuccessModal(true)})
            setShowStatusModal(true);
        } else {
            //there are errors

            //import what we can
            addImportedProducts(importResponse?.response?.data?.data);

            //show error message
            const errorMessages = importResponse?.response?.data?.errorMessage || [];

            setModalStatusInfo({ title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal})
            setShowStatusModal(true);

        }
    }, [importResponse]);


    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }
    const handleImportXLS = () => {
        setShowImportModal(true)
    }

    const tabTitleArray =  TabTitles(!!docData?.uuid);
    const {tabTitles, updateTabTitles, clearTabTitles} = useTabsState(tabTitleArray, TabFields);

    const onSubmitForm = async (data) => {
        clearTabTitles();
        setIsLoading(true);
        data.draft = isDraft;
        data.attachedFiles= selectedFiles;

        try {

            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await sendInboundData(
                docType,
                {
                    token,
                    documentType: docType,
                    documentData: data,
                }
            );

            if (res && "status" in res) {
                if (res?.status === 200) {
                    //success
                    setModalStatusInfo({isSuccess: true, title: "Success", subtitle: `Document is successfully ${ docData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal})
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

        if (isDraft) {
            clearErrors();
            const formData = getValues();
            console.log('Form data on error:', formData);

            return onSubmitForm(formData as SingleStockMovementFormType);
        }

        const fieldNames = Object.keys(props);

        if (fieldNames.length > 0) {
            toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
                position: "top-right",
                autoClose: 3000,
            });
        }

        console.log("validation errors: ", fieldNames, props)

        updateTabTitles(fieldNames);
    };

    return <div className={`stock-movement is-${docType}`}>
        {isLoading && <Loader />}
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
            <input autoComplete="false" name="hidden" type="text" style={{display:'none'}} />
            <Tabs id='stock-movement-tabs' tabTitles={tabTitles} classNames='inside-modal' >
                <div key='general-tab' className='general-tab'>
                    <div className='card stock-movement--general'>
                        <h3 className='stock-movement__block-title'>
                            <Icon name='general' />
                            General
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card stock-movement--details'>
                        <h3 className='stock-movement__block-title'>
                            <Icon name='additional' />
                            Details
                        </h3>
                        <div className='grid-row '>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors} isDisabled={isDisabled}/>

                        </div>
                    </div>
                </div>

                <div key='product-tab' className='product-tab'>
                    <div className="card min-height-600 stock-movement--products">
                        <h3 className='stock-movement__block-title '>
                            <Icon name='goods' />
                            Products
                        </h3>
                        <div className='grid-row mb-md'>

                            <div className='stock-movement--btns width-100'>
                                <div className='grid-row'>
                                    <div className='stock-movement--table-btns form-table--btns small-paddings width-100'>
                                        <Button type="button" icon="import-file" iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} onClick={handleImportXLS}>Import from xls</Button>
                                        <Button type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={() => appendProduct({ key: `product-${Date.now().toString()}`, selected: false, product: '',quantityPlan:'', quantity:'', unitOfMeasure:'pcs', quality: 'Saleable' })}>
                                            Add
                                        </Button>
                                        <Button type="button" icon='remove-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeProducts}>
                                            Remove selected
                                        </Button>
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
                    </div>
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

                <div key='files-tab' className='files-tab'>
                    <div className="card min-height-600 stock-movement--files">
                        <h3 className='stock-movement__block-title'>
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
                {isDisabled && docData?.canEdit && docData?.status==='Draft' && <Button type="button" disabled={false} onClick={()=>setIsDisabled(!(docData?.canEdit || !docData?.uuid))} variant={ButtonVariant.PRIMARY}>Edit</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY} onClick={()=>setIsDraft(true)}>Save as draft</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={()=>setIsDraft(false)}  variant={ButtonVariant.PRIMARY}>Send</Button>}
            </div>
        </form>
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        {showImportModal &&
            <Modal title={`Import xls`} onClose={onImportModalClose} >
                <ImportFilesBlock file='Products import.xlsx' importFilesType={ImportFilesType.STOCK_MOVEMENTS_PRODUCTS} setResponseData={setImportResponse} closeModal={()=>setShowImportModal(false)}/>
            </Modal>
        }
    </div>
}

export default StockMovementForm;
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {FormFieldTypes, WidthType} from "@/types/forms";
import {COUNRTIES} from "@/types/countries";
import "./styles.scss";
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import Cookie from "js-cookie";
import {ProductParamsType, SingleProductType} from "@/types/products";
import {
    FormFieldsAdditional1,
    FormFieldsAdditional2,
    FormFieldsGeneral,
    FormFieldsSKU,
    FormFieldsWarehouse,
    PRODUCT
} from "./FroductFormFields";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {createOptions} from "@/utils/selectOptions";
import {Table} from 'antd';
import FormFieldsBlock from "./FormFieldsBlock";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import {verifyToken} from "@/services/auth";
import {Routes} from "@/types/routes";
import {getProductParameters, getProducts, sendProductInfo} from "@/services/products";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";

const enum SendStatusType {
    DRAFT = 'draft',
    PENDING = 'pending',
}

type ProductPropsType = {
    isEdit?: boolean;
    isAdd?: boolean;
    uuid?: string | null;
    productParams: ProductParamsType;
    productData?: SingleProductType | null;
    closeProductModal: ()=>void;
}
const ProductForm:React.FC<ProductPropsType> = ({isEdit= false, isAdd, uuid, productParams, productData, closeProductModal}) => {
    //get parameters to setup form


    const isDisabled = (productData?.status !== 'Draft' && productData?.status !=='Pending');


    console.log("uuid: ", uuid, productData)

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        closeProductModal();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])


    const [isLoading, setIsLoading] = useState(false);
    const [sendStatus, setSendStatus] = useState(SendStatusType.DRAFT);

    const countryArr = COUNRTIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));



    type ApiResponse = {
        data: any;
    };

    // useEffect(() => {
    //     fetchData();
    // }, [token]);

    console.log("product params: ", productParams);
    console.log("product data: ", productData);

    const {control, handleSubmit, formState: { errors }, trigger, getValues, setValue, watch} = useForm({
        defaultValues: {
            [PRODUCT.uuid]: productData?.uuid || uuid || '',
            [PRODUCT.name]: productData?.name || '',
            [PRODUCT.fullName]: productData?.fullName || '',
            [PRODUCT.countryOfOrigin]: productData?.countryOfOrigin || '',
            [PRODUCT.purchaseValue]: productData?.purchaseValue || '',
            [PRODUCT.SKU]: productData?.sku || '',
            [PRODUCT.AmazonSKU]: productData?.amazonSku || '',
            [PRODUCT.hsCode]: productData?.hsCode || '',
            [PRODUCT.typeOfStorage]: productData?.typeOfStorage || '',
            [PRODUCT.salesPackingMaterial] : productData?.salesPackingMaterial || '',
            [PRODUCT.specialTemperatureControl]: productData?.specialTemperatureControl || '',
            [PRODUCT.specialDeliveryStorageRequest]: productData?.specialDeliveryOrStorageRequirements || '',
            [PRODUCT.whoProvidesPackagingMaterial]: productData?.whoProvideExtraPacking || '',
            [PRODUCT.expiringTerm]: '',
            [PRODUCT.liquid]: productData?.liquid,
            [PRODUCT.glass]: productData?.glass,
            [PRODUCT.fragile]: productData?.fragile,
            [PRODUCT.fireproof]: productData?.fireproof,
            [PRODUCT.packingBox]: productData?.packingBox,
            [PRODUCT.hazmat]: productData?.hazmat,
            unitOfMeasure: productData?.unitOfMeasure || '',
            unitOfMeasures:
                productData && productData.unitOfMeasures
                    ? productData.unitOfMeasures.map((unit, index) => (
                        {
                            key: `unit-${unit.name}_${index}`,
                            selected: false,
                            [PRODUCT.unitOfMeasuresFields.unitName]: unit.name || '',
                            [PRODUCT.unitOfMeasuresFields.unitCoefficient]: unit.coefficient || '',
                            [PRODUCT.unitOfMeasuresFields.unitWidth]: unit.width || '',
                            [PRODUCT.unitOfMeasuresFields.unitLength]: unit.length || '',
                            [PRODUCT.unitOfMeasuresFields.unitHeight]: unit.height || '',
                            [PRODUCT.unitOfMeasuresFields.unitWeightGross]: unit.weightGross || '',
                            [PRODUCT.unitOfMeasuresFields.unitWeightNet]: unit.weightNet || '',
                        }))
                    : [
                        {
                            key: `unit-${Date.now().toString()}`,
                            selected: false,
                            [PRODUCT.unitOfMeasuresFields.unitName]: '',
                            [PRODUCT.unitOfMeasuresFields.unitCoefficient]: '',
                            [PRODUCT.unitOfMeasuresFields.unitWidth]: '',
                            [PRODUCT.unitOfMeasuresFields.unitLength]: '',
                            [PRODUCT.unitOfMeasuresFields.unitHeight]:  '',
                            [PRODUCT.unitOfMeasuresFields.unitWeightGross]: '',
                            [PRODUCT.unitOfMeasuresFields.unitWeightNet]: '',
                        }
                    ],
            barcodes:
                productData && productData?.barcodes && productData.barcodes.length
                    ? productData.barcodes.map((code, index: number) => (
                        {
                            key: code || `barcode-${Date.now().toString()}_${index}`,
                            selected: false,
                            barcode: code || '',
                        }))
                    : [
                        {
                            key: `barcode-${Date.now().toString()}`,
                            selected: false,
                            barcode: '',
                        }
                    ],
            aliases:
                productData && productData?.aliases && productData.aliases.length
                    ? productData.aliases.map((alias, index: number) => (
                        {
                            key: alias || `alias-${Date.now().toString()}_${index}`,
                            selected: false,
                            alias: alias || '',
                        }))
                    : [
                        {
                            key: `alias-${Date.now().toString()}`,
                            selected: false,
                            alias: '',
                        }
                    ],

        }
    })
    const { fields, append, update, remove } = useFieldArray({ control, name: 'unitOfMeasures' });
    const { fields: fieldsBarcodes, append: appendBarcode,  remove: removeBarcode } = useFieldArray({ control, name: 'barcodes' });
    const { fields: fieldsAliases, append: appendAlias, remove: removeAlias } = useFieldArray({ control, name: 'aliases' });
    const unitOfMeasures = watch('unitOfMeasures');
    const [unitOfMeasureOptions, setUnitOfMeasureOptions] = useState<string[]>([]);


    const getOptions = () => {
        // Extract names from unitOfMeasures array
        return unitOfMeasureOptions.map((item) => ({ value: item, label: item }));
    };

    useEffect(() => {
        // Update the select options when the unitOfMeasures array changes
        const names: string[] = unitOfMeasures.map((row) => row.name as string);
        setUnitOfMeasureOptions(names);
    }, [unitOfMeasures, setUnitOfMeasureOptions]);

    const [selectAllUnits, setSelectAllUnits] = useState(false);

    const handleUnitNameChange = (newValue: string, index: number) => {
        // Update the unitOfMeasureOptions based on the changed "Unit Name"
        setUnitOfMeasureOptions(prevState => {
            const arr = [...prevState];
            arr[index]=newValue;
            return arr;
        });
    };

    const getUnitsColumns = (control: any) => {
        return [
            {
                title: (
                    <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                    <FieldBuilder
                        name={'selectedAllUnits'}
                        fieldType={FormFieldTypes.CHECKBOX}
                        checked ={selectAllUnits}
                        disabled={isDisabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setSelectAllUnits(e.target.checked);
                            // Update the values of all checkboxes in the form when "Select All" is clicked
                            const values = getValues();
                            const fields = values.unitOfMeasures;
                            fields &&
                            fields.forEach((field, index) => {
                                setValue(`unitOfMeasures.${index}.selected`, e.target.checked);
                            });
                        }}
                    /></div>

                ),
                dataIndex: 'selected',
                key: 'selected',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                                <FieldBuilder
                                    name={'unitOfMeasures.${index}.selected'}
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
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].name`}
                        control={control}

                        render={({ field }) => (
                            <div style={{width: '250px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].name`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    onChange={(newValue: string) => {field.onChange(newValue); handleUnitNameChange(newValue, index)}}
                                    disabled={isDisabled}
                                /></div>
                        )}
                        rules={{required: "Name couldn't be empty!",}}
                    />
                ),
            },
            {
                title: 'Quantity',
                dataIndex: 'coefficient',
                key: 'coefficient',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].quantity`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '110px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].quantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Width | mm',
                dataIndex: 'width',
                key: 'width',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].width`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '110px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].width`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
                                disabled={isDisabled}
                            /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Length | mm',
                dataIndex: 'length',
                key: 'length',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].length`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '110px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].length`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
                                disabled={isDisabled}
                            /></div>
                        )}
                    />
                ),
            },
            {
                title: 'Height | mm',
                dataIndex: 'height',
                key: 'height',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].height`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '110px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].height`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
                                disabled={isDisabled}
                            /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Weight gross | kg',
                dataIndex: 'weightGross',
                key: 'weightGross',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].weightGross`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '110px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].weightGross`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
                                disabled={isDisabled}
                            /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Weight net | kg',
                dataIndex: 'Weight net',
                key: 'weightNet',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].weightNet`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '110px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].weightNet`}
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

    const removeDimensions = () => {
        const newUnitsArr = unitOfMeasures.filter(item => !item.selected);
        setValue('unitOfMeasures', newUnitsArr);
        setSelectAllUnits(false);
    }


    //Barcodes
    const barcodes = watch('barcodes');

    const [selectAllBarcodes, setSelectAllBarcodes] = useState(false);

    const getBarcodesColumns = (control: any) => {

        return [
            {
                title: (
                    <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                        <FieldBuilder
                            name={'selectedAllBarcodes'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked ={selectAllBarcodes}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllBarcodes(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.barcodes;
                                fields &&
                                fields.forEach((field, index) => {
                                    setValue(`barcodes.${index}.selected`, e.target.checked);
                                });
                            }}
                        />
                    </div>

                ),
                dataIndex: 'selected',
                key: 'selected',
                render: (text, record, index) => (
                    <Controller
                        name={`barcodes.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                                <FieldBuilder
                                    name={'barcodes.${index}.selected'}
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
                title: 'Barcode',
                dataIndex: 'barcode',
                key: 'barcode',
                render: (text, record, index) => (
                    <Controller
                        name={`barcodes[${index}].barcode`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '1000px'}}>
                                <FieldBuilder
                                    name={`barcodes.${index}.barcode`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    disabled={isDisabled}
                                /></div>
                        )}
                    />
                ),
            },
        ];
    }

    const removeBarcodes = () => {
        const newBarcodesArr = barcodes.filter(item => !item.selected);
        setValue('barcodes', newBarcodesArr);
        // console.log("barcodes", barcodes, barcodes.length);
        // for (let i=barcodes.length-1; i>=0; i-- ) {
        //     if (barcodes[i].selected) removeBarcodes();
        // }
        console.log("barcodes: ",getValues('barcodes'));

        setSelectAllBarcodes(false);
    }


    //Aliases
    const aliases = watch('aliases');
    const [selectAllAliases, setSelectAllAliases] = useState(false);

    const getAliasesColumns = (control: any) => {
        return [
            {
                title: (
                    <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                        <FieldBuilder
                            name={'selectedAllAliases'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked ={selectAllAliases}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllAliases(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.aliases;
                                fields &&
                                fields.forEach((field, index) => {
                                    setValue(`aliases.${index}.selected`, e.target.checked);
                                });
                            }}
                        />
                    </div>

                ),
                dataIndex: 'selected',
                key: 'selected',
                render: (text, record, index) => (
                    <Controller
                        name={`aliases.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                                <FieldBuilder
                                    name={'aliases.${index}.selected'}
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
                title: 'Alias',
                dataIndex: 'alias',
                key: 'alias',
                render: (text, record, index) => (
                    <Controller
                        name={`aliases[${index}].alias`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '1000px'}}>
                                <FieldBuilder
                                    name={`aliases.${index}.alias`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    disabled={isDisabled}
                                /></div>
                        )}
                    />
                ),
            },
        ];
    }

    const removeAliases = () => {
        setValue('aliases', aliases.filter(item => !item.selected ));

        setSelectAllAliases(false);
    }


    const prepareProductDataForSending = (data) => {
        return {
            ...data,
            aliases: data.aliases.map(item => item.alias).filter(item => item !== ""),
            barcodes: data.barcodes.map(item => item.barcode).filter(item => item !== ""),
        }
    }
    //
    const onSubmitForm = async (data: any) => {
        console.log("it is form submit ");

        const isValid = await trigger();
        if (isValid) console.log("form is valid!", data);

        data.status = sendStatus;

        console.log("send: ", prepareProductDataForSending(data));

        try {
            setIsLoading(true);
            //verify token
            if (!await verifyToken(token)) {
                console.log("token is wrong");
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await sendProductInfo(
                {
                    token: token,
                    productData: prepareProductDataForSending(data)
                }
            );

            console.log("send response: ", res);

            if (res && "status" in res) {
                if (res?.status === 200) {
                    //success
                    setModalStatusInfo({isSuccess: true, title: "Success", subtitle: `Product is successfully ${ productData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal})
                    setShowStatusModal(true);
                }
            } else if (res && 'response' in res ) {
                const errResponse = res.response;
                console.log('errorMessages1', errResponse)

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;
                    console.log('errorMessages', errorMessages)

                    setModalStatusInfo({ title: "Error", subtitle: `Please, fix these errors!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    }

    const generalFields = useMemo(()=> FormFieldsGeneral({countries: countryArr}), [COUNRTIES])
    const skuFields = useMemo(()=>FormFieldsSKU(), []);
    const warehouseFields = useMemo(()=>FormFieldsWarehouse({typeOfStorage: createOptions(productParams.typeOfStorage), salesPackingMaterial:createOptions(productParams.salesPackingMaterial), specialDeliveryOrStorageRequirements: createOptions(productParams.specialDeliveryOrStorageRequirements)}),[productParams])
    const additionalFields = useMemo(()=> FormFieldsAdditional1({whoProvidesPackagingMaterial: createOptions(productParams.whoProvideExtraPacking)}), [])
    const additionalCheckboxes = useMemo(()=>FormFieldsAdditional2(), []);

    return <div className='product-info'>
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <Tabs id='tabs-iddd' tabTitles={['Primary','Dimensions', 'Barcodes', 'Aliases']} classNames='inside-modal'>
                <div className='primary-tab'>
                    <div className='card product-info--general'>
                        <h3 className='product-info__block-title'>
                            <Icon name='general' />
                            General
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card product-info--sku'>
                        <h3 className='product-info__block-title'>
                            <Icon name='sku' />
                            SKU
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={skuFields}  errors={errors} isDisabled={isDisabled}/>
                        </div>
                    </div>
                    <div className='card product-info--warehouse'>
                        <h3 className='product-info__block-title'>
                            <Icon name='warehouse' />
                            Warehouse
                        </h3>
                        <div className='grid-row'>
                            <FormFieldsBlock control={control} fieldsArray={warehouseFields} errors={errors} isDisabled={isDisabled} />
                        </div>
                    </div>
                    <div className='card product-info--additional'>
                        <h3 className='product-info__block-title'>
                            <Icon name='additional' />
                            Additional
                        </h3>
                        <div className='grid-row'>
                            <div className='additional-selects width-33'>
                                <FormFieldsBlock control={control} fieldsArray={additionalFields} errors={errors} isDisabled={isDisabled} />
                            </div>
                            <div className='dropzone width-33'></div>
                            <div className='checkboxes width-33'>
                                <div className='grid-row'>
                                    {additionalCheckboxes.map((curField, index) => (
                                        <div key={curField.name} className={`${curField.width ? 'width-'+curField.width : ''}`}>
                                            <Controller name={curField.name} control={control} render={({field: {value, ...props}, fieldState: {error}}) => (
                                                <FieldBuilder
                                                    {...props}
                                                    label={curField.label}
                                                    fieldType={curField.fieldType}
                                                    errorMessage={error?.message}
                                                    disabled={!!isDisabled}
                                                    checked={!!value}
                                                /> )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dimensions-tab">
                    <div className="card product-info--unitOfMeasures">
                        <h3 className='product-info__block-title'>
                            <Icon name='dimensions' />
                            Dimensions
                        </h3>
                        <div className='product-info--unitOfMeasures-select'>
                            <div className='grid-row'>
                            {/*    <div className='width-67 grid-row'>*/}
                                <Controller
                                    name="unitOfMeasure"
                                    control={control}
                                    render={({ field }) => (
                                        <FieldBuilder
                                            fieldType={FormFieldTypes.SELECT}
                                            name='unitOfMeasure'
                                            label='Default unit'
                                            {...field}
                                            options={getOptions() || []}
                                            placeholder="Select Name"
                                            width={WidthType.w33}
                                            errors={errors}
                                            disabled={isDisabled}
                                        />
                                    )}
                                />
                                {/*</div>*/}
                                <div className='product-info--table-btns width-67'>
                                    <Button type="button" icon='remove' iconOnTheRight size={ButtonSize.SMALL} variant={ButtonVariant.SECONDARY} onClick={removeDimensions}>
                                        Remove
                                    </Button>
                                    <Button type="button" icon='add' iconOnTheRight size={ButtonSize.SMALL}  onClick={() => append({  key: `unit-${Date.now().toString()}`, selected: false, name: '', coefficient:'', width: '', length: '', height: '', weightGross:'', weightNet: '' })}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='product-info--table table-form-fields'>
                            <Table
                                columns={getUnitsColumns(control)}
                                dataSource={getValues('unitOfMeasures')?.map((field, index) => ({ key: field.name, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />

                        </div>
                    </div>
                </div>
                <div className="barcodes-tab">
                    <div className="card product-info--barcodes">
                        <h3 className='product-info__block-title title-small'>
                            <Icon name='barcodes' />
                            Barcodes
                        </h3>
                        <div className='product-info--barcodes-btns'>
                            <div className='grid-row'>
                                <div className='product-info--table-btns small-paddings width-100'>
                                    <Button type="button" icon='remove' iconOnTheRight size={ButtonSize.SMALL}  variant={ButtonVariant.SECONDARY} onClick={removeBarcodes}>
                                        Remove
                                    </Button>
                                    <Button type="button" icon='add' iconOnTheRight size={ButtonSize.SMALL}  onClick={() => appendBarcode({ key: `barcode-${Date.now().toString()}`, selected: false, barcode: '' })}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='product-info--table table-form-fields'>
                            <Table
                                columns={getBarcodesColumns(control)}
                                dataSource={getValues('barcodes')?.map((field, index) => ({ key: field.barcode, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />

                        </div>
                    </div>
                </div>
                <div className="aliases-tab">
                    <div className="card product-info--aliases">
                        <h3 className='product-info__block-title title-small'>
                            <Icon name='aliases' />
                            Aliases
                        </h3>
                        <div className='product-info--aliases-btns'>
                            <div className='grid-row'>
                                <div className='product-info--table-btns small-paddings width-100'>
                                    <Button type="button" icon='remove' iconOnTheRight size={ButtonSize.SMALL}  variant={ButtonVariant.SECONDARY} onClick={removeAliases}>
                                        Remove
                                    </Button>
                                    <Button type="button" icon='add' iconOnTheRight size={ButtonSize.SMALL}  onClick={() => appendAlias({ key: `barcode-${Date.now().toString()}`, selected: false, alias: '' })}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='product-info--table table-form-fields'>
                            <Table
                                columns={getAliasesColumns(control)}
                                dataSource={getValues('aliases')?.map((field, index) => ({ key: field.alias, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />

                        </div>
                    </div>
                </div>
            </Tabs>
            <div className='form-submit-btn'>
                <Button type="submit" disabled={isDisabled} onClick={()=>setSendStatus(SendStatusType.DRAFT)} variant={ButtonVariant.SECONDARY}>Save as draft</Button>
                <Button type="submit" disabled={isDisabled} onClick={()=>setSendStatus(SendStatusType.PENDING)} >Send to approve</Button>
            </div>
        </form>

        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}

    </div>
}

export default ProductForm;
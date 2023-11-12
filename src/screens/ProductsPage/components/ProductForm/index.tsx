import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
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

type ProductPropsType = {
    isEdit?: boolean;
    isAdd?: boolean;
    uuid?: string;
    productParams: ProductParamsType;
    productData?: SingleProductType | null;
}
const ProductForm:React.FC<ProductPropsType> = ({isEdit= false, isAdd, uuid, productParams, productData}) => {
    //get parameters to setup form

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [isLoading, setIsLoading] = useState(false);

    const countryArr = COUNRTIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    type ApiResponse = {
        data: any;
    };

    // useEffect(() => {
    //     fetchData();
    // }, [token]);

    console.log("product params: ", productParams);
    console.log("product data: ", productData);

    const tabsArray = [
        {title: 'tab1', content: []},
        {title: 'tab2', content: []},
        {title: 'tab3', content: []}
    ];


    const {control, handleSubmit, formState: { errors }, trigger, getValues, setValue, watch} = useForm({
        defaultValues: {
            [PRODUCT.name]: productData?.name || '',
            [PRODUCT.fullName]: productData?.fullName || '',
            [PRODUCT.aliases]: productData?.aliases || '',
            [PRODUCT.countryOfOrigin]: productData?.countryOfOrigin || '',
            [PRODUCT.purchaseValue]: productData?.purchaseValue || '',
            [PRODUCT.SKU]: productData?.sku || '',
            [PRODUCT.AmazonSKU]: productData?.amazonSku || '',
            [PRODUCT.WarehouseSKU]: productData?.warehouseSku || '',
            [PRODUCT.hsCode]: productData?.hsCode || '',
            [PRODUCT.typeOfStorage]: productData?.typeOfStorage || '',
            [PRODUCT.salesPackingMaterial] : productData?.salesPackingMaterial || '',
            [PRODUCT.specialTemperatureControl]: productData?.specialTemperatureControl || '',
            [PRODUCT.specialDeliveryStorageRequest]: productData?.specialDeliveryOrStorageRequirements || '',
            [PRODUCT.whoProvidesPackagingMaterial]: productData?.whoProvideExtraPacking || '',
            [PRODUCT.expiringTerm]: '',
            [PRODUCT.bundle]: productData?.bundle,
            [PRODUCT.liquid]: productData?.liquid,
            [PRODUCT.glass]: productData?.glass,
            [PRODUCT.insurance]: productData?.insurance,
            [PRODUCT.fragile]: productData?.fragile,
            [PRODUCT.fireproof]: productData?.fireproof,
            [PRODUCT.packingBox]: productData?.packingBox,
            [PRODUCT.hazmat]: productData?.hazmat,
            unitOfMeasure: productData?.unitOfMeasure || '',
            boxUnitOfMeasure: productData?.boxUnitOfMeasure || '',
            unitOfMeasures:
                productData && productData.unitOfMeasures
                    ? productData.unitOfMeasures.map(unit => (
                        {
                            selected: false,
                            [PRODUCT.unitOfMeasuresFields.unitName]: unit.name || '',
                            [PRODUCT.unitOfMeasuresFields.unitWidth]: unit.width || '',
                            [PRODUCT.unitOfMeasuresFields.unitLength]: unit.length || '',
                            [PRODUCT.unitOfMeasuresFields.unitHeight]: unit.height || '',
                            [PRODUCT.unitOfMeasuresFields.unitWeightGross]: unit.weightGross || '',
                            [PRODUCT.unitOfMeasuresFields.unitWeightNet]: unit.weightNet || '',
                        }))
                    : [
                        {
                            selected: false,
                            name: '',
                            width: '',
                            length: '',
                            height:  '',
                            weightGross: '',
                            weightNet: '',
                        }
                    ],
            barcodes:
                productData && productData?.barcodes && productData.barcodes.length
                    ? productData.barcodes.map(code => (
                        {
                            selected: false,
                            barcode: code || '',
                        }))
                    : [
                        {
                            selected: false,
                            barcode: '',
                        }
                    ]

        }
    })
    const { fields, append, update, remove } = useFieldArray({ control, name: 'unitOfMeasures' });
    const { fields: fieldsBarcodes, append: appendBarcode, update: updateBarcode, remove: removeBarcode } = useFieldArray({ control, name: 'barcodes' });
    const unitOfMeasures = watch('unitOfMeasures');
    const [unitOfMeasureOptions, setUnitOfMeasureOptions] = useState<string[]>([]);


    console.log('form-errors: ', errors);

    const getOptions = () => {
        // Extract names from unitOfMeasures array
        return unitOfMeasureOptions.map((item) => ({ value: item, label: item }));
    };

    useEffect(() => {
        // Update the select options when the unitOfMeasures array changes
        const names: string[] = unitOfMeasures.map((row) => row.name as string);
        console.log("options units: ", unitOfMeasures, names);
        setUnitOfMeasureOptions(names);
    }, [unitOfMeasures, setUnitOfMeasureOptions]);

    const [selectAllUnits, setSelectAllUnits] = useState(false);

    const handleUnitNameChange = (newValue: string, index: number) => {
        // Update the unitOfMeasureOptions based on the changed "Unit Name"
        const updatedOptions = [...unitOfMeasureOptions];
        updatedOptions[index] = newValue;
        setUnitOfMeasureOptions(updatedOptions);
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
                            <div style={{width: '505px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].name`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    onChange={(newValue: string) => {field.onChange(newValue); handleUnitNameChange(newValue, index)}}
                                /></div>
                        )}
                        rules={{required: "Name couldn't be empty!",}}
                    />
                ),
            },
            {
                title: 'Width',
                dataIndex: 'width',
                key: 'width',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].width`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '85px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].width`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
                            /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Length',
                dataIndex: 'length',
                key: 'length',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].length`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '85px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].length`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
                            /></div>
                        )}
                    />
                ),
            },
            {
                title: 'Height',
                dataIndex: 'height',
                key: 'height',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].height`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '85px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].height`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
                            /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Weight gross',
                dataIndex: 'weightGross',
                key: 'weightGross',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].weightGross`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '85px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].weightGross`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
                            /></div>

                        )}
                    />
                ),
            },
            {
                title: 'Weight net',
                dataIndex: 'Weight net',
                key: 'weightNet',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].weightNet`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '85px'}}>
                            <FieldBuilder
                                name={`unitOfMeasures[${index}].weightNet`}
                                fieldType={FormFieldTypes.NUMBER}
                                {...field}
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
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                title: 'ID',
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
        setSelectAllBarcodes(false);
    }


    const onSubmitForm = async (data: any) => {
        console.log("it is form submit ");

        const isValid = await trigger();
        if (isValid) console.log("form is valid!");
    }

    const generalFields = useMemo(()=> FormFieldsGeneral({countries: countryArr}), [COUNRTIES])
    const skuFields = useMemo(()=>FormFieldsSKU(), []);
    const warehouseFields = useMemo(()=>FormFieldsWarehouse({typeOfStorage: createOptions(productParams.typeOfStorage), salesPackingMaterial:createOptions(productParams.salesPackingMaterial), specialDeliveryOrStorageRequirements: createOptions(productParams.specialDeliveryOrStorageRequirements)}),[productParams])
    const additionalFields = useMemo(()=> FormFieldsAdditional1({whoProvidesPackagingMaterial: createOptions(productParams.whoProvideExtraPacking)}), [])
    const additionalCheckboxes = useMemo(()=>FormFieldsAdditional2(), []);

    return <div className='product-info'>

            <form onSubmit={handleSubmit(onSubmitForm)}>
                <Tabs id='tabs-iddd' tabTitles={['Primary','Dimensions', 'Barcodes']} classNames='inside-modal'>
                    <div className='primary-tab'>
                        <div className='card product-info--general'>
                            <h3 className='product-info__block-title'>
                                <Icon name='general' />
                                General
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors}/>
                            </div>
                        </div>
                        <div className='card product-info--sku'>
                            <h3 className='product-info__block-title'>
                                <Icon name='sku' />
                                SKU
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={skuFields}  errors={errors}/>
                            </div>
                        </div>
                        <div className='card product-info--warehouse'>
                            <h3 className='product-info__block-title'>
                                <Icon name='warehouse' />
                                Warehouse
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={warehouseFields} errors={errors} />
                            </div>
                        </div>
                        <div className='card product-info--additional'>
                            <h3 className='product-info__block-title'>
                                <Icon name='additional' />
                                Additional
                            </h3>
                            <div className='grid-row'>
                                <div className='additional-selects width-33'>
                                    <FormFieldsBlock control={control} fieldsArray={additionalFields} errors={errors} />
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
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="boxUnitOfMeasure"
                                        control={control}
                                        render={({ field }) => (
                                            <FieldBuilder
                                                fieldType={FormFieldTypes.SELECT}
                                                name='boxUnitOfMeasure'
                                                label='Box unit'
                                                {...field}
                                                options={getOptions() || []}
                                                placeholder="Select unit"
                                                width={WidthType.w33}
                                            />
                                        )}
                                    />
                                    {/*</div>*/}
                                    <div className='product-info--unitOfMeasures-table-btns width-33'>
                                        <Button type="button" icon='remove' iconOnTheRight size={ButtonSize.SMALL} variant={ButtonVariant.SECONDARY} onClick={removeDimensions}>
                                            Remove
                                        </Button>
                                        <Button type="button" icon='add' iconOnTheRight size={ButtonSize.SMALL}  onClick={() => append({ selected: false, name: '', width: '', length: '', height: '', weightGross:'', weightNet: '' })}>
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='product-info--unitOfMeasures-table table-form-fields'>

                                <Table
                                    columns={getUnitsColumns(control)}
                                    dataSource={getValues('unitOfMeasures')?.map((field, index) => ({ key: index, ...field })) || []}
                                    pagination={false}
                                    rowKey="key"
                                />

                            </div>
                        </div>
                    </div>
                    <div className="barcodes-tab">
                        <div className="card product-info--barcodes">
                            <h3 className='product-info__block-title'>
                                <Icon name='barcodes' />
                                Barcodes
                            </h3>
                            <div className='product-info--barcodes-btns'>
                                <div className='grid-row'>
                                    <h3 className='width-67'>Barcodes</h3>
                                    <div className='product-info--unitOfMeasures-table-btns width-33'>
                                        <Button type="button" icon='remove' iconOnTheRight size={ButtonSize.SMALL}  variant={ButtonVariant.SECONDARY} onClick={removeBarcodes}>
                                            Remove
                                        </Button>
                                        <Button type="button" icon='add' iconOnTheRight size={ButtonSize.SMALL}  onClick={() => appendBarcode({ selected: false, barcode: '' })}>
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='product-info--unitOfMeasures-table table-form-fields'>

                                <Table
                                    columns={getBarcodesColumns(control)}
                                    dataSource={getValues('barcodes')?.map((field, index) => ({ key: index, ...field })) || []}
                                    pagination={false}
                                    rowKey="key"
                                />

                            </div>
                        </div>
                    </div>
                </Tabs>
                <div className='form-submit-btn'>
                    <Button type="submit">Save</Button>
                </div>
            </form>

    </div>
}

export default ProductForm;
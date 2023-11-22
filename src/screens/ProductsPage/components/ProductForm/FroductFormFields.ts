import {FormFieldTypes, WidthType} from "@/types/forms";
import {OptionType} from "@/types/forms";

export const PRODUCT = {
    uuid: 'uuid',
    name: 'name',
    fullName: 'fullName',
    countryOfOrigin: 'countryOfOrigin',
    purchaseValue: 'purchaseValue',
    SKU: 'sku',
    AmazonSKU: 'amazonSku',
    hsCode: 'hsCode',
    typeOfStorage: 'typeOfStorage',
    salesPackingMaterial: 'salesPackingMaterial',
    specialDeliveryStorageRequest: 'specialDeliveryStorageRequest',
    whoProvidesPackagingMaterial: 'whoProvidesPackagingMaterial',
    specialTemperatureControl: 'specialTemperatureControl',
    expiringTerm: 'expiringTerm',
    fragile: 'fragile',
    hazmat: 'hazmat',
    glass: 'glass',
    fireproof: 'fireproof',
    liquid: 'liquid',
    packingBox: 'packingBox',
    unitOfMeasure: 'unitOfMeasure',
    unitOfMeasures: 'UnitOfMeasures',
    unitOfMeasuresFields: {
        unitName: "name",
        unitCoefficient: 'coefficient',
        unitWidth: "width",
        unitLength: 'length',
        unitHeight: 'height',
        unitWeightGross: 'weightGross',
        unitWeightNet: 'weightNet',
    },
    barcodes: 'barcodes',
    barcodeFields: {
        barcode: 'barcode',
    },
    aliases: 'aliases',
    aliasFields: {
        alias: 'alias',
    },
    analogs: 'analogs',
    analogFields: {
        analog: 'analog',
    }

} as const;

export const FormFieldsGeneral = ({countries}: { countries: OptionType[] }) => [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.name,
            label: "Name",
            placeholder: "",
            rules: {
                required: "Name of the product couldn't be empty!",
            },
            errorMessage: "Name of the product couldn't be empty!",
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: PRODUCT.countryOfOrigin,
            label: 'Country of origin',
            placeholder: "",
            rules: {
                required: "Country of origin origin couldn't be empty!",
            },
            options: countries,
            errorMessage: "Country of origin origin couldn't be empty!",
            width: WidthType.w25,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.NUMBER,
            type: "number",
            name: PRODUCT.purchaseValue,
            label: "Purchase value",
            rules: {
                required: "Purchase value of the product couldn't be empty!",
            },
            placeholder: "0",
            width: WidthType.w25,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.fullName,
            label: "Full name",
            placeholder: "",
            rules: {
                required: "Full name of the product couldn't be empty!",
            },
            errorMessage: "Full name of the product couldn't be empty!",
            width: WidthType.w100,
            classNames: "",
        },


    ];

export const FormFieldsSKU = () => [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.SKU,
            label: "SKU",
            placeholder: "",
            rules: {
                required: "Product's SKU couldn't be empty!",
            },
            errorMessage: "Product's SKU couldn't be empty!!!!",
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.AmazonSKU,
            label: "Amazon SKU",
            placeholder: "",
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.hsCode,
            label: "HS code",
            placeholder: "",
            width: WidthType.w33,
            classNames: "",
        },
    ];


export const FormFieldsWarehouse = ({typeOfStorage, salesPackingMaterial, specialDeliveryOrStorageRequirements}) => [
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: PRODUCT.typeOfStorage,
            label: "Type of storage",
            placeholder: '',
            options: typeOfStorage,
            rules: {
                required: "Type of storage couldn't be empty!",
            },
            errorMessage: "Type of storage couldn't be empty!",
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: PRODUCT.salesPackingMaterial,
            label: "Primary sales packing material",
            placeholder: '',
            options: salesPackingMaterial,
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: PRODUCT.specialDeliveryStorageRequest,
            label: "Special delivery / storage request",
            placeholder: '',
            options: specialDeliveryOrStorageRequirements,
            width: WidthType.w33,
            classNames: "",
        }
    ];


export const FormFieldsAdditional1 = ({whoProvidesPackagingMaterial}) => [
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: PRODUCT.whoProvidesPackagingMaterial,
            label: "Who provides packaging material",
            placeholder: "",
            options: whoProvidesPackagingMaterial,
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.specialTemperatureControl,
            label: "Special temperature control",
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.expiringTerm,
            label: "Expiring term (month)",
            width: WidthType.w33,
            classNames: "",
        },
    ];
export const FormFieldsAdditional2 = () => [
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.fragile,
            label: "Fragile",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.hazmat,
            label: "Hazmat",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.glass,
            label: "Glass",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.fireproof,
            label: "Fireproof",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.liquid,
            label: "Liquid",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.packingBox,
            label: "Packing box",
            width: WidthType.w17,
            classNames: "",
        },
    ];

export const FormFieldsUnitsOfMeasures =  [
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'width',
        placeholder: "0",
        label: "Width",
    },
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'length',
        label: "Length",
        placeholder: "0",
    },{
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'height',
        placeholder: "0",
        label: "Height",
    },
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'weightGross',
        label: "Weight gross",
        placeholder: "0",
    },
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'weightNet',
        label: 'Weight net',
        placeholder: "0",
    },
]


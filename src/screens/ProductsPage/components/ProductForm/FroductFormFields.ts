import {FormFieldTypes, WidthType} from "@/types/forms";
import {OptionType} from "@/types/forms";

export const PRODUCT = {
    uuid: 'uuid',
    name: 'name',
    fullName: 'fullName',
    aliases: 'aliases',
    countryOfOrigin: 'countryOfOrigin',
    purchaseValue: 'purchaseValue',
    SKU: 'SKU',
    AmazonSKU: 'AmazonSKU',
    WarehouseSKU: 'warehouseSKU',
    hsCode: 'hsCode',
    typeOfStorage: 'typeOfStorage',
    salesPackingMaterial: 'salesPackingMaterial',
    specialDeliveryStorageRequest: 'specialDeliveryStorageRequest',
    whoProvidesPackagingMaterial: 'whoProvidesPackagingMaterial',
    specialTemperatureControl: 'specialTemperatureControl',
    expiringTerm: 'expiringTerm',
    bundle: 'bundle',
    fragile: 'fragile',
    hazmat: 'hazmat',
    glass: 'glass',
    fireproof: 'fireproof',
    insurance:'insurance',
    liquid: 'liquid',
    packingBox: 'packingBox',
    unitOfMeasure: 'unitOfMeasure',
    boxUnitOfMeasure: 'boxUnitOfMeasure',
    unitOfMeasures: 'UnitOfMeasures',
    unitOfMeasuresFields: {
        unitName: "name",
        unitWidth: "width",
        unitLength: 'length',
        unitHeight: 'height',
        unitWeightGross: 'weightGross',
        unitWeightNet: 'weightNet',
    },
    barcodes: 'barcodes',
    barcodeFields: {
        barcode: 'barcode',
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
            width: WidthType.w33,
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
            //errorMessage: "Name of the product couldn't be empty!",
            width: WidthType.w67,
            classNames: "",
        },

        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.aliases,
            label: "Aliases",
            placeholder: "",
            //errorMessage: "Name of the product couldn't be empty!",
            isFullWidth: false,
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: PRODUCT.countryOfOrigin,
            label: 'Country of origin',
            placeholder: "Select country",
            options: countries,
            errorMessage: "Country of product's origin couldn't be empty!",
            width: WidthType.w25,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.NUMBER,
            type: "number",
            name: PRODUCT.purchaseValue,
            label: "Purchase value",
            placeholder: "0",

            errorMessage: "Product's purchase value couldn't be empty!",
            width: WidthType.w25,
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
            width: WidthType.w25,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.AmazonSKU,
            label: "Amazon SKU",
            placeholder: "",

            errorMessage: "Amazon SKU couldn't be empty!",
            width: WidthType.w25,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.WarehouseSKU,
            label: "Warehouse SKU",
            placeholder: "",
            //errorMessage: "Warehouse SKU couldn't be empty!",
            width: WidthType.w25,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.hsCode,
            label: "hs code",
            placeholder: "",
            //errorMessage: "... couldn't be empty!",
            width: WidthType.w25,
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
            // rules: {
            //     required: "Type of storage couldn't be empty!",
            // },
            errorMessage: "Type of storage couldn't be empty!",
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: PRODUCT.salesPackingMaterial,
            label: "Sales packing material",
            placeholder: '',
            options: salesPackingMaterial,
            errorMessage: "Sales packing material couldn't be empty!",
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
            //errorMessage: "Provider of packaging material couldn't be empty!",
            width: WidthType.w100,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.specialTemperatureControl,
            label: "Special temperature control",
            width: WidthType.w100,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: PRODUCT.expiringTerm,
            label: "Expiring term (month)",
            width: WidthType.w100,
            classNames: "",
        },
    ];
export const FormFieldsAdditional2 = () => [
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.bundle,
            label: "Bundle",
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.fragile,
            label: "Fragile",
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.hazmat,
            label: "Hazmat",
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.glass,
            label: "Glass",
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.fireproof,
            label: "Fireproof",
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.insurance,
            label: "Insurance",
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.liquid,
            label: "Liquid",
            width: WidthType.w50,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.CHECKBOX,
            name: PRODUCT.packingBox,
            label: "packing box",
            width: WidthType.w50,
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


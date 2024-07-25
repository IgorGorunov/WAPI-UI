import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import {ProductHints} from "@/screens/ProductsPage/productsHints.constants";

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



export const FormFieldsGeneral = ({countries, isNew=false}: { countries: OptionType[], isNew: boolean }) => {
    return [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'name',
            label: "Name",
            placeholder: "",
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            width: WidthType.w50,
            classNames: "",
            hint: ProductHints['name'] || '',
            onlyAllowedSymbols: true,
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'countryOfOrigin',
            label: 'Country of origin',
            placeholder: "",
            rules: {
                required: "Required field",
            },
            options: countries,
            errorMessage: "Required field",
            width: WidthType.w25,
            classNames: "",
            hint: ProductHints['countryOfOrigin'] || '',
            onlyAllowedSymbols: true,
        },
        {
            fieldType: FormFieldTypes.NUMBER,
            type: "number",
            name: 'purchaseValue',
            label: "Purchase value",
            rules: {
                required: "Required field",
            },
            placeholder: "0",
            width: WidthType.w25,
            classNames: "",
            hint: ProductHints['purchaseValue'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'fullName',
            label: "Full name",
            placeholder: "",
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            width: isNew ? WidthType.w100 : WidthType.w75,
            classNames: "",
            hint: ProductHints['fullName'] || '',
            onlyAllowedSymbols: true,
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'status',
            label: "Status",
            width: WidthType.w25,
            classNames: "",
            hint: ProductHints['status'] || '',
            isDisplayed: !isNew,
            disabled: true,
        },

    ];
}

export const FormFieldsSKU = () => [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'sku',
            label: "SKU",
            placeholder: "",
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['sku'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'amazonSku',
            label: "Amazon SKU",
            placeholder: "",
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['amazonSku'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'hsCode',
            label: "HS code",
            placeholder: "",
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['hsCode'] || '',
        },
    ];


export const FormFieldsWarehouse = ({typeOfStorage, salesPackingMaterial, specialDeliveryOrStorageRequirements}) => [
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'typeOfStorage',
            label: "Type of storage",
            placeholder: '',
            options: typeOfStorage,
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['typeOfStorage'] || '',
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'salesPackingMaterial',
            label: "Primary sales packing material",
            placeholder: '',
            options: salesPackingMaterial,
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['salesPackingMaterial'] || '',
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'specialDeliveryStorageRequest',
            label: "Special delivery / storage request",
            placeholder: '',
            options: specialDeliveryOrStorageRequirements,
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['specialDeliveryStorageRequest'] || '',
        }
    ];


export const FormFieldsAdditional1 = ({whoProvidesPackagingMaterial}) => [
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'whoProvidesPackagingMaterial',
            label: "Who provides packaging material",
            placeholder: "",
            options: whoProvidesPackagingMaterial,
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['whoProvidesPackagingMaterial'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'specialTemperatureControl',
            label: "Special temperature control",
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['specialTemperatureControl'] || '',
            onlyAllowedSymbols: true,
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'expiringTerm',
            label: "Expiring term (month)",
            width: WidthType.w33,
            classNames: "",
            hint: ProductHints['expiringTerm'] || '',
            onlyAllowedSymbols: true,
        },
    ];
export const FormFieldsAdditional2 = () => [
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'fragile',
            label: "Fragile",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'hazmat',
            label: "Hazmat",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'glass',
            label: "Glass",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'fireproof',
            label: "Fireproof",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'liquid',
            label: "Liquid",
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'packingBox',
            label: "Packing box",
            width: WidthType.w17,
            classNames: "",
            hint: ProductHints['packingBox'] || '',
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


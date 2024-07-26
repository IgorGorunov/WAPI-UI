import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const FormFieldsGeneral = ({t, requiredFieldText, countries, isNew=false}: { t: any, requiredFieldText: string, countries: OptionType[], isNew: boolean }) => {
    return [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'name',
            label: t("name"),
            placeholder: "",
            rules: {
                required: requiredFieldText,
            },
            errorMessage: requiredFieldText,
            width: WidthType.w50,
            classNames: "",
            hint: t('nameHint'),//ProductHints['name'] || '',
            onlyAllowedSymbols: true,
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'countryOfOrigin',
            label: t('countryOfOrigin'),
            placeholder: "",
            rules: {
                required: requiredFieldText,
            },
            options: countries,
            errorMessage: requiredFieldText,
            width: WidthType.w25,
            classNames: "",
            hint: t('countryOfOriginHint'), //ProductHints['countryOfOrigin'] || '',
            onlyAllowedSymbols: true,
        },
        {
            fieldType: FormFieldTypes.NUMBER,
            type: "number",
            name: 'purchaseValue',
            label: t('purchaseValue'),
            rules: {
                required: requiredFieldText,
            },
            placeholder: "0",
            width: WidthType.w25,
            classNames: "",
            hint: t('purchaseValueHint')//ProductHints['purchaseValue'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'fullName',
            label: t('fullName'),
            placeholder: "",
            rules: {
                required: requiredFieldText,
            },
            errorMessage: requiredFieldText,
            width: isNew ? WidthType.w100 : WidthType.w75,
            classNames: "",
            hint: t('fullNameHint'),//ProductHints['fullName'] || '',
            onlyAllowedSymbols: true,
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'status',
            label: t('status'),
            width: WidthType.w25,
            classNames: "",
            hint: t('statusHint'), //ProductHints['status'] || '',
            isDisplayed: !isNew,
            disabled: true,
        },

    ];
}

export const FormFieldsSKU = (t, requiredFieldText) => [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'sku',
            label: t('sku'),
            placeholder: "",
            rules: {
                required: requiredFieldText,
            },
            errorMessage: requiredFieldText,
            width: WidthType.w33,
            classNames: "",
            hint: t('skuHint')//ProductHints['sku'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'amazonSku',
            label: t('amazonSku'),
            placeholder: "",
            width: WidthType.w33,
            classNames: "",
            hint: t('amazonSkuHint')//ProductHints['amazonSku'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'hsCode',
            label: t('hsCode'),
            placeholder: "",
            width: WidthType.w33,
            classNames: "",
            hint: t('hsCodeHint')//ProductHints['hsCode'] || '',
        },
    ];


export const FormFieldsWarehouse = ({t, requiredFieldText, typeOfStorage, salesPackingMaterial, specialDeliveryOrStorageRequirements}) => [
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'typeOfStorage',
            label: t('typeOfStorage'),
            placeholder: '',
            options: typeOfStorage,
            rules: {
                required: requiredFieldText,
            },
            errorMessage: requiredFieldText,
            width: WidthType.w33,
            classNames: "",
            hint: t('typeOfStorageHint')//ProductHints['typeOfStorage'] || '',
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'salesPackingMaterial',
            label: t('salesPackingMaterial'),
            placeholder: '',
            options: salesPackingMaterial,
            width: WidthType.w33,
            classNames: "",
            hint: t('salesPackingMaterialHint'),//ProductHints['salesPackingMaterial'] || '',
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'specialDeliveryStorageRequest',
            label: t('specialDeliveryStorageRequest'),
            placeholder: '',
            options: specialDeliveryOrStorageRequirements,
            width: WidthType.w33,
            classNames: "",
            hint: t('specialDeliveryStorageRequestHint'), //ProductHints['specialDeliveryStorageRequest'] || '',
        }
    ];


export const FormFieldsAdditional1 = ({whoProvidesPackagingMaterial, t}) => [
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'whoProvidesPackagingMaterial',
            label: t('whoProvidesPackagingMaterial'),
            placeholder: "",
            options: whoProvidesPackagingMaterial,
            width: WidthType.w33,
            classNames: "",
            hint: t('whoProvidesPackagingMaterialHint'), //ProductHints['whoProvidesPackagingMaterial'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'specialTemperatureControl',
            label: t('specialTemperatureControl'),
            width: WidthType.w33,
            classNames: "",
            hint: t('specialTemperatureControlHint'), //ProductHints['specialTemperatureControl'] || '',
            onlyAllowedSymbols: true,
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'expiringTerm',
            label: t('expiringTerm'),
            width: WidthType.w33,
            classNames: "",
            hint: t('expiringTermHint'), //ProductHints['expiringTerm'] || '',
            onlyAllowedSymbols: true,
        },
    ];
export const FormFieldsAdditional2 = (t) => [
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'fragile',
            label: t('fragile'),
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'hazmat',
            label: t('hazmat'),
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'glass',
            label: t('glass'),
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'fireproof',
            label: t('fireproof'),
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'liquid',
            label: t('liquid'),
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'packingBox',
            label: t('packingBox'),
            width: WidthType.w17,
            classNames: "",
            hint: t('packingBoxHint'), //ProductHints['packingBox'] || '',
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


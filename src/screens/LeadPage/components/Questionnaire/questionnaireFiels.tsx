import {FormFieldTypes, WidthType} from "@/types/forms";

export const CompanyNameField = (t, requiredFieldMessage) => ({
    fieldType: FormFieldTypes.TEXT,
    type: "text",
    name: 'companyName',
    label: t('companyName'),
    placeholder: t('companyNamePlaceholder'),
    width: WidthType.w50,
    classNames: "",
    rules: {
        required: requiredFieldMessage,
    },
});

export const CompanyWebpageField = (t) => ({
    fieldType: FormFieldTypes.TEXT,
    type: "text",
    name: 'companyWebpage',
    label: t('companyWebpage'),
    placeholder: t('companyWebpagePlaceholder'),
    width: WidthType.w50,
    classNames: "",
});

export const SalesVolumePerMonthField = (t, requiredFieldMessage) => ({
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'salesVolumePerMonth',
    label: t('salesVolumePerMonth'),
    placeholder: '0',
    width: WidthType.w50,
    classNames: "",
    rules: {
        required: requiredFieldMessage,
    },
});

export const SkusField = (t, requiredFieldMessage) => ({
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'skus',
    label: t('skus'),
    placeholder: '0',
    width: WidthType.w50,
    classNames: "",
    rules: {
        required: requiredFieldMessage,
    },
});

export const DimensionsField = (t) => ({
    fieldType: FormFieldTypes.TEXT,
    type: "text",
    name: 'dimensionsOfLargestProduct',
    label: t('dimensionsOfLargestProduct'),
    placeholder: "100x500x50",
    width: WidthType.w50,
    classNames: "",
});

export const WeightField = (t) => ({
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'weightOfHeaviestProduct',
    label: t('weightOfHeaviestProduct'),
    placeholder: "0",
    width: WidthType.w50,
    classNames: "",
});

export const PackagingField = (t) => ({
    fieldType: FormFieldTypes.TOGGLE,
    name: 'additionalPackagingForLastMileDelivery',
    label: t('additionalPackagingForLastMileDelivery'),
    width: WidthType.w50,
    classNames: "",
});

export const CodField = (t) => ({
    fieldType: FormFieldTypes.TOGGLE,
    name: 'needsCOD',
    label: t('needsCOD'),
    width: WidthType.w50,
    classNames: "",
});
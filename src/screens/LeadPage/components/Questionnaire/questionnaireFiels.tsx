import {FormFieldTypes, WidthType} from "@/types/forms";

export const CompanyNameField = {
    fieldType: FormFieldTypes.TEXT,
    type: "text",
    name: 'companyName',
    label: "Please provide your company name",
    placeholder: "name of your company",
    width: WidthType.w50,
    classNames: "",
    rules: {
        required: "Required field",
    },
    errorMessage: "Required field",
};

export const CompanyWebpageField = {
    fieldType: FormFieldTypes.TEXT,
    type: "text",
    name: 'companyWebpage',
    label: "Please provide your company's webpage (optional)",
    placeholder: "www.mycompany.com",
    width: WidthType.w50,
    classNames: "",
};

export const SalesVolumePerMonthField = {
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'salesVolumePerMonth',
    label: "Please specify the monthly sales volume (orders)",
    placeholder: '0',
    width: WidthType.w50,
    classNames: "",
    rules: {
        required: "Required field",
    },
};

export const SkusField = {
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'skus',
    label: "Please enter the number of references (SKUs)",
    placeholder: '0',
    width: WidthType.w50,
    classNames: "",
    rules: {
        required: "Required field",
    },
};

export const DimensionsField = {
    fieldType: FormFieldTypes.TEXT,
    type: "text",
    name: 'dimensionsOfLargestProduct',
    label: "Please provide dimensions for the largest product in millimeters (mm)",
    placeholder: "100x500x50",
    width: WidthType.w50,
    classNames: "",
};

export const WeightField = {
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'weightOfHeaviestProduct',
    label: "Please write the weight of the heaviest product in kilograms (kg)",
    placeholder: "0",
    width: WidthType.w50,
    classNames: "",
};

export const PackagingField = {
    fieldType: FormFieldTypes.TOGGLE,
    name: 'additionalPackagingForLastMileDelivery',
    label: "Please click if you need additional package for last mile delivery",
    width: WidthType.w50,
    classNames: "",
};

export const CodField = {
    fieldType: FormFieldTypes.TOGGLE,
    name: 'needsCOD',
    label: "Please click if you need COD",
    width: WidthType.w50,
    classNames: "",
};
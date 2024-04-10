import {FormFieldTypes, WidthType} from "@/types/forms";

export const CompanyNameField = {
    fieldType: FormFieldTypes.TEXT,
    type: "text",
    name: 'companyName',
    label: "Company name",
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
    label: "Company webpage (optional)",
    placeholder: "www.mycompany.com",
    width: WidthType.w50,
    classNames: "",
};

export const SalesVolumePerMonthField = {
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'salesVolumePerMonth',
    label: "Sales volume per month (orders)",
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
    label: "Number of references (SKUs)",
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
    label: "Dimensions of the largest product, mm",
    placeholder: "100x500x50",
    width: WidthType.w50,
    classNames: "",
};

export const WeightField = {
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'weightOfHeaviestProduct',
    label: "Weight of the heaviest product, kg",
    placeholder: "0",
    width: WidthType.w50,
    classNames: "",
};

export const PackagingField = {
    fieldType: FormFieldTypes.TOGGLE,
    name: 'additionalPackagingForLastMileDelivery',
    label: "Additional package for last mile delivery",
    width: WidthType.w50,
    classNames: "",
};

export const CodField = {
    fieldType: FormFieldTypes.TOGGLE,
    name: 'needsCOD',
    label: "Needs COD",
    width: WidthType.w50,
    classNames: "",
};
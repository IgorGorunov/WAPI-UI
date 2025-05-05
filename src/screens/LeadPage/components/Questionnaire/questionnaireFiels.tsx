import {ChangeEvent} from "react";
import {FormBuilderType, FormFieldTypes, WidthType} from "@/types/forms";

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

export const CompanyVatFields = (
    {
        companyWorksWithoutVAT = false,
        errorText = '',
        checkVatNumber
    }: {
        companyWorksWithoutVAT: boolean,
        errorText: string,
        checkVatNumber: (val: ChangeEvent)=>void
    }) => {
    return [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'vatNo',
            label: "VAT No.",
            width: WidthType.w50,
            placeholder: 'XX000000000',
            classNames: "",
            rules: {
                required: companyWorksWithoutVAT? false : errorText || "Required field",
            },
        } as FormBuilderType,

        {
            fieldType: FormFieldTypes.TOGGLE,
            type: "text",
            name: 'companyWorksWithoutVAT',
            label: "Company works without VAT",
            width: WidthType.w50,
            onChange: checkVatNumber,
            classNames: "",
        }  as FormBuilderType,
    ];
}

export const SalesVolumePerMonthField = {
    fieldType: FormFieldTypes.NUMBER,
    type: "number",
    name: 'salesVolumePerMonth',
    label: "Sales volume per month (number of orders)",
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
    label: "Number of references (number of SKUs)",
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
    label: "Additional package is needed for last mile delivery",
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

export const ProductTypeDescriptions_NameField = {
    fieldType: FormFieldTypes.TEXT,
    name: 'productTypeName',
    label: "Product type",
    width: WidthType.w50,
    classNames: "",
    rules: {
        required: "Required field",
    },
};

export const ProductTypeDescriptions_LinkField = {
    fieldType: FormFieldTypes.TEXT,
    name: 'productTypeLink',
    label: "Link to the product (type of product)",
    width: WidthType.w50,
    classNames: "",
};

export const ProductTypeDescriptionsFields2 = [
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'hazmat',
        label: "Hazmats, dangerous goods (DGR in limited quantity like perfume or goods with lithium batteries to be checked each case)",
        width: WidthType.w100,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'hasSerialNumbers',
        label: "Items with serial numbers, if we have to track each serial number upon order dispatch ( for example, IMEI - technical requirements need to be checked)",
        width: WidthType.w100,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'batches',
        label: "Items that must be counted/stocked/sent according to batches (technical requirements need to be checked)",
        width: WidthType.w100,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'purchasePriceMore100',
        label: "Purchase price is more than 100 euro per unit",
        width: WidthType.w100,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'cbdProduct',
        label: "CBD products",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'food',
        label: "Food with short life period",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'alcohol',
        label: "Alcohol",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'cigarettes',
        label: "Cigarettes",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fragile',
        label: "Fragile",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'glass',
        label: "Glass",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'flammable',
        label: "Flammable",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'liquid',
        label: "Liquid",
        width: WidthType.w25,
        classNames: "",
    }
]
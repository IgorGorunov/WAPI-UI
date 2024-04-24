import {FormFieldTypes, WidthType} from "@/types/forms";
import {isPhoneValid} from "@/utils/phoneNumber";
import {COUNTRIES} from "@/types/countries";


//countries
const alCountries = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

export const companyInfoFields  = [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'companyName',
        label: "Company name",
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'regNo',
        label: "Reg. No.",
        width: WidthType.w25,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'registrationCountry',
        label: "Reg. country",
        width: WidthType.w25,
        options: alCountries,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'legalAddress',
        label: "Legal address",
        width: WidthType.w75,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'vatNo',
        label: "VAT No.",
        width: WidthType.w25,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
];

export const bankInfoFields = [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'bank',
        label: "Bank",
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'accountNo',
        label: "Account No.",
        width: WidthType.w33,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'swiftCode',
        label: "SWIFT code",
        width: WidthType.w17,
        classNames: "",
        rules: {
            required: "Required field",
            // validate: {
            //     matchPattern: (v) =>
            //         /^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/.test(v) ||
            //         "Please, enter valid SWIFT code",
            // },
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'bankAddress',
        label: "Bank address",
        width: WidthType.w100,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },

]

export const otherInfoFields = [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'representedBy',
        label: "Represented by",
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'actingOnTheBasisOf',
        label: "Acting on the basis of",
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.PHONE_NUMBER,
        type: "text",
        name: 'phoneNumber',
        label: "Phone number",
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: "Phone number is required!",
            validate: value => isPhoneValid(value) || 'Please, enter valid phone number',
        },
        errorMessage: "Required field",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'contractEmail',
        label: "Email (for sending contract to be signed)",
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: "Required field",
            validate: {
                matchPattern: (v) =>
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) ||
                    "Please, enter valid email address",
            },
        },
        errorMessage: "Required field",
    },
];
import {FormBuilderType, FormFieldTypes, WidthType} from "@/types/forms";
import {isPhoneValid} from "@/utils/phoneNumber";

export const signUpFormFields: FormBuilderType[] = [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: "contact",
        label: "Your name",
        rules: {
            required:  "Please, enter your name!",
        },
        errorMessage: "Please, enter your name!",
        width: WidthType.w100,
        classNames: 'big-version',
        needToasts: false,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: "email",
        label: "Your email",
        placeholder: "laithoff@gmail.com",
        rules: {
            required: "Email is required!",
            validate: {
                matchPattern: (v) =>
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) ||
                    "Please, enter valid email address",
            },
        },
        errorMessage: "Email is required!",
        width: WidthType.w100,
        classNames: 'big-version',
    },
    {
        fieldType: FormFieldTypes.PHONE_NUMBER,
        type: "text",
        name: "phone",
        label: "Your phone number",
        rules: {
            required: "Phone number is required!",
            validate: value => isPhoneValid(value) || 'Please, enter valid phone number',
        },
        errorMessage: "Phone number is required!",
        width: WidthType.w100,
        classNames: 'big-version',
    },
    {
        fieldType: FormFieldTypes.CHECKBOX,
        type: "checkbox",
        name: "personalData",
        label: "I grant permission for the processing of my personal data",
        rules: {
            required: "You need to agree to let us process your personal data!",
        },
        errorMessage: "You need to agree to let us process your personal data!",
        width: WidthType.w100,
        classNames: 'big-version',
    },
];
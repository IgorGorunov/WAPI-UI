import {FormBuilderType, FormFieldTypes, WidthType} from "@/types/forms";
import {isPhoneValid} from "@/utils/phoneNumber";

export const signUpFormFields = (t) => [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: "contact",
        label: t('yourName'),
        rules: {
            required:  t('nameRequiredError'),
        },
        width: WidthType.w100,
        classNames: 'big-version',
        needToasts: false,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: "email",
        label: t('yourEmail'),
        placeholder: "laithoff@gmail.com",
        rules: {
            required: t("emailRequiredError"),
            validate: {
                matchPattern: (v) =>
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) ||
                    t('emailInvalidError'),
            },
        },
        width: WidthType.w100,
        classNames: 'big-version',
    },
    {
        fieldType: FormFieldTypes.PHONE_NUMBER,
        type: "text",
        name: "phone",
        label: t('yourPhone'),
        rules: {
            required: t('phoneRequiredError'),
            validate: value => isPhoneValid(value) || t('phoneInvalidError'),
        },
        width: WidthType.w100,
        classNames: 'big-version',
    },
    {
        fieldType: FormFieldTypes.CHECKBOX,
        type: "checkbox",
        name: "personalData",
        label: t('personalData'),
        rules: {
            required: t('personalDataError'),
        },
        width: WidthType.w100,
        classNames: 'big-version',
    },
] as FormBuilderType[];
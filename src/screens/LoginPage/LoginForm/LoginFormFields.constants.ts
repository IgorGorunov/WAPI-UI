import {FormBuilderType, FormFieldTypes, WidthType} from "@/types/forms";

export const formFields = (t) => [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: "login",
        label: t('yourEmail'),
        placeholder: "laithoff@gmail.com",
        rules: {
            required: t('emailRequiredError'),
            validate: {
                matchPattern: (v) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
                    t('emailInvalidError'),
            },
        },
        width: WidthType.w100,
        classNames: 'big-version',
        needToasts: false,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "password",
        name: "password",
        label: t('yourPassword'),
        placeholder: "********",
        rules: {
            required:  t('passwordRequiredError'),
            minLength: {
                value: 3,
                message: "Password has to be at least 3 symbols!"
            },
        },
        width: WidthType.w100,
        classNames: 'big-version',
        needToasts: false,
    },
] as FormBuilderType[];
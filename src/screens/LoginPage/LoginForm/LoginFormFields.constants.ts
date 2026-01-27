import {FormBuilderType, FormFieldTypes, WidthType} from "@/types/forms";

export const formFields: FormBuilderType[] = [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: "login",
        label: "Your email",
        placeholder: "laithoff@gmail.com",
        rules: {
            required: "Email is required!",
            // pattern: {
            //   value: "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$",
            //   message: "please. enter valid email",
            // },
            validate: {
                matchPattern: (v) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ||
                    "Please, enter valid email address",
            },
        },
        errorMessage: "Email is required!",
        width: WidthType.w100,
        classNames: 'big-version',
        needToasts: false,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "password",
        name: "password",
        label: "Your password",
        placeholder: "********",
        rules: {
            required:  "Please, enter valid password!",
            minLength: {
                value: 3,
                message: "Password has to be at least 3 symbols!"
            },
        },
        errorMessage: "Please, enter valid password!",
        width: WidthType.w100,
        classNames: 'big-version',
        needToasts: false,
    },
];
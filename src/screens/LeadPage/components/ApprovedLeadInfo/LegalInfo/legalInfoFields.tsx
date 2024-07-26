import {FormFieldTypes, WidthType} from "@/types/forms";
import {isPhoneValid} from "@/utils/phoneNumber";
import {COUNTRIES} from "@/types/countries";


//countries
const alCountries = (t) =>COUNTRIES.map(item => ({label: t(item.value), value: item.value.toUpperCase()}));

export const companyInfoFields  = (t, tMessages) => [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'companyName',
        label: t('companyName'),
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
        },
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'regNo',
        label: t('regNo'),
        width: WidthType.w25,
        classNames: "",
        rules: {
            required:  tMessages('requiredField'),
        },
    },
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'registrationCountry',
        label: t('registrationCountry'),
        width: WidthType.w25,
        options: alCountries(t),
        classNames: "",
        rules: {
            required:  tMessages('requiredField'),
        },
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'legalAddress',
        label: t('legalAddress'),
        width: WidthType.w75,
        classNames: "",
        rules: {
            required:  tMessages('requiredField'),
        },
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'vatNo',
        label: t('vatNo'),
        width: WidthType.w25,
        classNames: "",
        rules: {
            required:  tMessages('requiredField'),
        },
    },
];

export const bankInfoFields = (t, tMessages) => [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'bank',
        label: t('bank'),
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
        },
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'accountNo',
        label: t('accountNo'),
        width: WidthType.w33,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
        },
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'swiftCode',
        label: t('swiftCode'),
        width: WidthType.w17,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
            // validate: {
            //     matchPattern: (v) =>
            //         /^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/.test(v) ||
            //         "Please, enter valid SWIFT code",
            // },
        },
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'bankAddress',
        label: t('bankAddress'),
        width: WidthType.w100,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
        },
    },

]

export const otherInfoFields = (t, tMessages) => [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'representedBy',
        label: t('representedBy'),
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
        },
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'actingOnTheBasisOf',
        label: t('actingOnTheBasisOf'),
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
        },
    },
    {
        fieldType: FormFieldTypes.PHONE_NUMBER,
        type: "text",
        name: 'phoneNumber',
        label: t('phoneNumber'),
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
            validate: value => isPhoneValid(value) || tMessages('validPhoneNumber'),
        },
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'contractEmail',
        label: t('contractEmail'),
        width: WidthType.w50,
        classNames: "",
        rules: {
            required: tMessages('requiredField'),
            validate: {
                matchPattern: (v) =>
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) ||
                    tMessages('validEmail'),
            },
        },
    },
];
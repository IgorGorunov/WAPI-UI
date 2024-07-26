import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const ReceiverFields = ({t, requiredFieldMessage, countries}: { t: any; requiredFieldMessage: string; countries: OptionType[];  }) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: `receiver.country`,
        label: t('receiverCountry'),
        placeholder: "",
        options: countries,
        rules: {
            required: requiredFieldMessage,
        },
        errorMessage: requiredFieldMessage,
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.county`,
        label: t('receiverCounty'),
        placeholder: "",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.city`,
        label: t('receiverCity'),
        placeholder: "",
        rules: {
            required: requiredFieldMessage,
        },
        errorMessage: requiredFieldMessage,
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.zip`,
        label: t('receiverZip'),
        placeholder: "",
        rules: {
            required: requiredFieldMessage,
        },
        errorMessage: requiredFieldMessage,
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.address`,
        label: t('receiverAddress'),
        placeholder: "",
        rules: {
            required: requiredFieldMessage,
        },
        errorMessage: requiredFieldMessage,
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.phone`,
        label: t('receiverPhone'),
        placeholder: "",
        rules: {
            required: requiredFieldMessage,
        },
        errorMessage: requiredFieldMessage,
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.email`,
        label: t('receiverEMail'),
        placeholder: "",
        // rules: {
        //     validate: {
        //         matchPattern: (v) =>
        //             v==='' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
        //             "Please, enter valid email address",
        //     },
        // },
        errorMessage: requiredFieldMessage,
        width: WidthType.w25,
        classNames: "",
        needToasts: false,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.fullName`,
        label: t('receiverFullName'),
        placeholder: "",
        rules: {
            required: requiredFieldMessage,
        },
        errorMessage: requiredFieldMessage,
        width: WidthType.w50,
        classNames: "",
    },
    // {
    //     fieldType: FormFieldTypes.TEXT,
    //     type: "text",
    //     name: `${prefix}receiverComment`,
    //     label: 'Comment',
    //     placeholder: "",
    //     width: WidthType.w100,
    //     classNames: "",
    //},
];

export const MainFields = (t:any) => {
    return [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: `comment`,
            label: t('comment'),
            placeholder: "",
            width: WidthType.w100,
            classNames: "",
        },
    ];
}

export const DateFields = (t: any, requiredFieldMessage, numberOfDisabledDays = 0) => [
    {
        fieldType: FormFieldTypes.DATE,
        type: "text",
        name: `deliveryDate.date`,
        label: t('deliveryDate'),
        rules: {
            required: requiredFieldMessage,
        },
        placeholder: "",
        width: WidthType.w50,
        classNames: "",
        disableWeekends: true,
        disablePreviousDays: true,
        disableDaysAfterToday: numberOfDisabledDays,
        disableDaysTime: '14:00',
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `deliveryDate.hourFrom`,
        label: t('from'),
        placeholder: "HH:MM",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `deliveryDate.hourTo`,
        label: t('to'),
        placeholder: "HH:MM",
        width: WidthType.w25,
        classNames: "",
    },

];
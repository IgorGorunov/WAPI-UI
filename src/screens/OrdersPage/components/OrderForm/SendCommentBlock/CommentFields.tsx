import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const ReceiverFields = ({countries}: { countries: OptionType[];  }) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: `receiver.country`,
        label: 'Country',
        placeholder: "",
        options: countries,
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.county`,
        label: 'County',
        placeholder: "",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.city`,
        label: 'City',
        placeholder: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.zip`,
        label: 'Zip',
        placeholder: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.address`,
        label: 'Address',
        placeholder: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.phone`,
        label: 'Phone',
        placeholder: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.email`,
        label: 'E-mail',
        placeholder: "",
        // rules: {
        //     validate: {
        //         matchPattern: (v) =>
        //             v==='' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
        //             "Please, enter valid email address",
        //     },
        // },
        errorMessage: "Required field",
        width: WidthType.w25,
        classNames: "",
        needToasts: false,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `receiver.fullName`,
        label: 'Full name',
        placeholder: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
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

export const MainFields = () => [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `comment`,
        label: 'Comment',
        placeholder: "",
        width: WidthType.w100,
        classNames: "",
    },
];

export const DateFields = (numberOfDisabledDays = 0) => [
    {
        fieldType: FormFieldTypes.DATE,
        type: "text",
        name: `deliveryDate.date`,
        label: 'Delivery date',
        rules: {
            required: "Required field",
        },
        placeholder: "",
        width: WidthType.w50,
        classNames: "",
        disableWeekends: true,
        disablePreviousDays: true,
        disableDaysAfterToday: numberOfDisabledDays,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `deliveryDate.hourFrom`,
        label: 'from',
        placeholder: "HH:MM",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: `deliveryDate.hourTo`,
        label: 'to',
        placeholder: "HH:MM",
        width: WidthType.w25,
        classNames: "",
    },

];
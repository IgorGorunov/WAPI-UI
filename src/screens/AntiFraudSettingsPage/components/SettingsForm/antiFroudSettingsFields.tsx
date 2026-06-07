import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const GeneralFields = ({subscriptionOptions, codTypeOptions}:{subscriptionOptions: OptionType[], codTypeOptions: OptionType[]}) => [
    {
        fieldType: FormFieldTypes.TOGGLE,
        // type: "text",
        name: 'use',
        label: "Enable WAPI Checker",
        width: WidthType.w17,
    },
    {
        fieldType: FormFieldTypes.TOGGLE,
        // type: "text",
        name: 'demoMode',
        label: "Demo mode",
        disabled: false,
        width: WidthType.w17,
    },
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'demoOrderCount',
        label: "Number of demo orders",
        disabled: true,
        width: WidthType.w17,
    },
    {
        fieldType: FormFieldTypes.SELECT,
        // type: "text",
        name: 'checkingType',
        options: [{value: 'AllOrders', label: "Check all orders by default"}, {value: 'RequestedOnly', label: "Check only if it is requested"}],
        label: "Check orders by default",
        width: WidthType.w50,
        rules: {
            required: "Field is required!",
        }
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'description',
        label: "Description",
        placeholder: "",
        width: WidthType.w100,
    },
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'subscription',
        label: "Subscription",
        options: subscriptionOptions,
        width: WidthType.w25,
        rules: {
            required: "Field is required!",
        }
    },
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'codType',
        label: "COD type",
        options: codTypeOptions,
        width: WidthType.w25,
        rules: {
            required: "Field is required!",
        }
    },
    {
        fieldType: FormFieldTypes.DATE,
        type: "date",
        name: 'startDate',
        label: "Start date",
        width: WidthType.w25,
        rules: {
            required: "Field is required!",
        }
    },
    {
        fieldType: FormFieldTypes.DATE,
        type: "date",
        name: 'endDate',
        label: "End date",
        width: WidthType.w25,
        rules: {
            required: "Field is required!",
        }
    },
];
import React from 'react';
import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import {PRODUCT} from "@/screens/ProductsPage/components/ProductForm/FroductFormFields";


export const GeneralFields = () => [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'wapiTrackingNumber',
        label: "WAPI tracking number",
        placeholder: "",
        isDisabled: true,
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'clientOrderID',
        label: "Order ID",
        placeholder: "",
        disabled: true,
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.DATE,
        type: "date",
        name: 'date',
        label: "Date",
        placeholder: "",
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.DATE,
        type: "date",
        name: 'incomingDate',
        label: "Incoming date",
        placeholder: "",
        disabled: true,
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'status',
        label: "Status",
        placeholder: "",
        disabled: true,
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'statusAdditionalInfo',
        label: "Status additional info",
        placeholder: "",
        disabled: true,
        width: WidthType.w50,
        classNames: "",
    }
];

export const DetailsFields = ({warehouses}: { warehouses: OptionType[] }) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'warehouse',
        label: 'Warehouse',
        placeholder: "Select warehouse",
        // rules: {
        //     required: "Warehouse couldn't be empty!",
        // },
        options: warehouses,
        width: WidthType.w25,
        classNames: "",
    },

];

export const ReceiverFields = ({countries}: { countries: OptionType[] }) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'receiverCountry',
        label: 'Receiver country',
        placeholder: "Select country",
        // rules: {
        //     required: "Receiver country couldn't be empty!",
        // },
        options: countries,
        width: WidthType.w25,
        classNames: "",
    },
];


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
        disabled: true,
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'status',
        label: "Status",
        placeholder: "",
        disabled: true,
        width: WidthType.w25,
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
    },
    {
        fieldType: FormFieldTypes.DATE,
        type: "date",
        name: 'date',
        label: "Order date",
        placeholder: "",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.DATE,
        type: "date",
        name: 'preferredDeliveryDate',
        label: "Preferred delivery date",
        placeholder: "",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'clientOrderID',
        label: "Order ID",
        placeholder: "",
        width: WidthType.w50,
        classNames: "",
    },
];

export const DetailsFields = ({warehouses, courierServices, handleCourierServiceChange}: { warehouses: OptionType[], courierServices: OptionType[] , handleCourierServiceChange: (a: string)=>void}) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'preferredWarehouse',
        label: 'Preferred warehouse',
        placeholder: "",
        options: warehouses,
        width: WidthType.w33,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.CHECKBOX,
        type: "text",
        name: 'preferredWarehouseMandatory',
        label: 'Mandatory',
        placeholder: "",
        width: WidthType.w17,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'preferredCourierService',
        label: 'Preferred courier service',
        placeholder: "",
        options: courierServices,
        width: WidthType.w33,
        classNames: "",
        onChange: handleCourierServiceChange,
    },
    {
        fieldType: FormFieldTypes.CHECKBOX,
        type: "text",
        name: 'preferredCourierServiceMandatory',
        label: 'Mandatory',
        placeholder: "",
        width: WidthType.w17,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'commentWarehouse',
        label: 'Comment for warehouse',
        placeholder: "",
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'commentCourierService',
        label: 'Comment for courier service ',
        placeholder: "",
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'warehouse',
        label: 'Warehouse',
        placeholder: "",
        disabled: true,
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'courierService',
        label: 'Courier service',
        placeholder: "",
        disabled: true,
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'courierServiceTrackingNumber',
        label: 'Tracking number',
        placeholder: "",
        disabled: true,
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'courierServiceTrackingNumberCurrent',
        label: 'Current tracking number',
        placeholder: "",
        disabled: true,
        width: WidthType.w50,
        classNames: "",
    },
];

export const ReceiverFields = ({countries}: { countries: OptionType[] }) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'receiverCountry',
        label: 'Country',
        placeholder: "",
        options: countries,
        rules: {
            required: "Country couldn't be empty!",
        },
        errorMessage: "Country couldn't be empty!",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverCity',
        label: 'City',
        placeholder: "",
        rules: {
            required: "City couldn't be empty!",
        },
        errorMessage: "City couldn't be empty!",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverZip',
        label: 'Zip',
        placeholder: "",
        rules: {
            required: "Zip couldn't be empty!",
        },
        errorMessage: "Zip  couldn't be empty!",
        width: WidthType.w17,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverAddress',
        label: 'Address',
        placeholder: "",
        rules: {
            required: "Address couldn't be empty!",
        },
        errorMessage: "Address couldn't be empty!",
        width: WidthType.w33,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverPhone',
        label: 'Phone',
        placeholder: "",
        rules: {
            required: "Phone couldn't be empty!",
        },
        errorMessage: "Phone couldn't be empty!",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverEMail',
        label: 'E-mail',
        placeholder: "",
        rules: {
            pattern: {
                value: "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$",
                message: "please. enter valid email",
            },
        },
        errorMessage: "E-mail couldn't be empty!",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverFullName',
        label: 'Full name',
        placeholder: "",
        rules: {
            required: "Full name couldn't be empty!",
        },
        errorMessage: "Full name couldn't be empty!",
        width: WidthType.w50,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverComment',
        label: 'Comment',
        placeholder: "",
        width: WidthType.w100,
        classNames: "",
    },
];

export const PickUpPointFields = ({countries}: { countries: OptionType[] }) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'receiverPickUpCountry',
        label: 'Country',
        placeholder: "",
        options: countries,
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverPickUpCity',
        label: 'City',
        placeholder: "",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverPickUpName',
        label: 'Name',
        placeholder: "",
        width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverPickUpAddress',
        label: 'Address',
        placeholder: "",
        width: WidthType.w100,
        classNames: "",
    },

];


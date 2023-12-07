import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const GeneralFields = (newObject: boolean) => [
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'wapiTrackingNumber',
        label: "WAPI tracking number",
        placeholder: "",
        disabled: true,
        width: WidthType.w25,
        classNames: "",
        isDisplayed: !newObject,
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
        isDisplayed: !newObject,
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
        isDisplayed: !newObject,
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

export const DetailsFields = ({warehouses, courierServices, handleWarehouseChange, handleCourierServiceChange, linkToTrack, newObject}: { warehouses: OptionType[], courierServices: OptionType[], handleWarehouseChange:(w: string)=>void, handleCourierServiceChange: (a: string)=>void, linkToTrack:any, newObject: boolean}) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'preferredWarehouse',
        label: 'Preferred warehouse',
        placeholder: "",
        options: warehouses,
        width: WidthType.w33,
        classNames: "",
        onChange: handleWarehouseChange,
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
        isDisplayed: !newObject,
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
        isDisplayed: !newObject,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'courierServiceTrackingNumber',
        label: 'Tracking number',
        placeholder: "",
        disabled: true,
        width: WidthType.w25,
        classNames: "",
        isDisplayed: !newObject,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'courierServiceTrackingNumberCurrent',
        label: 'Current tracking number',
        placeholder: "",
        disabled: true,
        width: WidthType.w25,
        classNames: "",
        isDisplayed: !newObject,
    },
    {
        fieldType: FormFieldTypes.OTHER,
        name: 'trackingLink',
        label: 'Tracking link',
        otherComponent: linkToTrack,
        width: WidthType.w50,
        classNames: 'order-tracking-link',
        isDisplayed: !newObject,
    },
];

export const ReceiverFields = ({countries}: { countries: OptionType[]; }) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'receiverCountry',
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
        name: 'receiverCity',
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
        name: 'receiverZip',
        label: 'Zip',
        placeholder: "",
        rules: {
            required: "Required field",
        },
        errorMessage: "Required field",
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
            required: "Required field",
        },
        errorMessage: "Required field",
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
            required: "Required field",
        },
        errorMessage: "Required field",
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
            validate: {
                matchPattern: (v) =>
                    v==='' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
                    "Please, enter valid email address",
            },
        },
        errorMessage: "Required field",
        width: WidthType.w25,
        classNames: "",
        needToasts: false,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverFullName',
        label: 'Full name',
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


import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const GeneralFields = (newObject) => [
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

export const DetailsFields = ({warehouses, courierServices, handleWarehouseChange,linkToTrack,deliveryMethodOptions, carrierDisabled, carrierTypeOptions, multipleLocations=false}:{warehouses: OptionType[], courierServices: OptionType[], handleWarehouseChange:(w: string)=>void,linkToTrack:any; deliveryMethodOptions: OptionType[]; carrierDisabled: boolean; carrierTypeOptions: OptionType[]; multipleLocations?: boolean;}) => [
    {
        name: 'grid-1',
        fieldType: FormFieldTypes.GRID,
        width: WidthType.w50,
        fields: [{
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'asnNumber',
            label: 'ASN',
            placeholder: "",
            rules: {
                required: "Required field",
            },
            width: WidthType.autoGrow,
            classNames: "",
        },
        {
            fieldType:FormFieldTypes.RADIO,
            name: 'deliveryMethod',
            options: deliveryMethodOptions,
            width: WidthType.autoNoGrow,
        }]
    },
    {
        fieldType: FormFieldTypes.GRID,
        name: 'grid-2',
        isGrid: true,
        width: WidthType.w50,
        fields: [

            {
                fieldType:FormFieldTypes.RADIO,
                name: 'carrierType',
                options: carrierTypeOptions,
                width: WidthType.autoNoGrow,
                //classNames: 'flex-auto',
            },

            {
                fieldType: FormFieldTypes.TOGGLE,
                name: 'prepackedMasterBox',
                label: "Prepacked master box",
                width: WidthType.autoGrow,
                classNames: 'prepacked-checkbox',
            //disabled: multipleLocations,
            }
        ]
    },
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'warehouse',
        label: 'Warehouse',
        placeholder: "",
        rules: {
            required: "Required field",
        },
        options: warehouses,
        width: WidthType.w50,
        onChange: handleWarehouseChange,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'courierService',
        label: 'Courier service',
        placeholder: "",
        options: courierServices,
        width: WidthType.w50,
        classNames: "",
        disabled: carrierDisabled,
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
        disabled: carrierDisabled,
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
    },
    {
        fieldType: FormFieldTypes.OTHER,
        name: 'trackingLink',
        label: 'Tracking link',
        otherComponent: linkToTrack,
        width: WidthType.w75,
        classNames: 'amazon-tracking-link',
    },
];

export const ReceiverFields = ({countries, multipleLocations=false}: { countries: OptionType[]; multipleLocations?: boolean;}) => [
    {
        fieldType: FormFieldTypes.CHECKBOX,
        name: 'multipleLocations',
        label: "Multiple locations",
        width: WidthType.w100,
        classNames: "",
    },
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
        disabled: multipleLocations,
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
        disabled: multipleLocations,
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
        disabled: multipleLocations,
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
        disabled: multipleLocations,
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
        disabled: multipleLocations,
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
        disabled: multipleLocations,
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
        disabled: multipleLocations,
    },
    {
        fieldType: FormFieldTypes.TEXT,
        type: "text",
        name: 'receiverComment',
        label: 'Comment',
        placeholder: "",
        width: WidthType.w100,
        classNames: "",
        disabled: multipleLocations,
    },
];


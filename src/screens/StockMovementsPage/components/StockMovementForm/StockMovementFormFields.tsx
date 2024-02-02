import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";

export const GeneralFields = (newObject: boolean, docType: STOCK_MOVEMENT_DOC_TYPE) => {
    const isInbound = docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS;

    return [
            {
                fieldType: FormFieldTypes.TEXT,
                type: "text",
                name: 'number',
                label: "Number",
                placeholder: "",
                // rules: {
                //     required: "Required field",
                // },
                // errorMessage: "Required field",
                disabled: true,
                width: WidthType.w17,
                classNames: "",
                isDisplayed: !newObject,
            },
            {
                fieldType: FormFieldTypes.TEXT,
                type: "text",
                name: 'incomingNumber',
                label: "Incoming number",
                placeholder: "",
                // rules: {
                //     required: "Required field",
                // },
                // errorMessage: "Required field",
                width: newObject ? WidthType.w33 : WidthType.w17,
                classNames: "",
            },
            // {
            //     fieldType: FormFieldTypes.DATE,
            //     type: "date",
            //     name: 'incomingDate',
            //     label: "Incoming date",
            //     placeholder: "",
            //     rules: {
            //         required: "Required field",
            //     },
            //     errorMessage: "Required field",
            //     width: WidthType.w17,
            //     classNames: "",
            // },

            // {
            //     fieldType: FormFieldTypes.TEXT,
            //     type: "text",
            //     name: 'freightSupplier',
            //     label: 'Fright supplier',
            //     placeholder: "",
            //     disabled: true,
            //     width: WidthType.w33,
            //     classNames: "",
            //     isDisplayed: !newObject,
            // },
            {
                fieldType: FormFieldTypes.DATE,
                type: "date",
                name: 'estimatedTimeArrives',
                label: 'ETA',
                disabled: !isInbound,
                placeholder: "",
                width: WidthType.w17,
                classNames: "calendar-to-right",
                rules: {
                    required: isInbound ? "Required field" : false,
                    validate: value => {
                        if (!isInbound) return true;

                        const selectedDate = new Date(value);
                        const year2000 = new Date('2000-01-01');

                        if (selectedDate < year2000) {
                            return 'Required field';
                        }

                        return true; // Validation passed
                    }
                },
                errorMessage: "Required field",
                isClearable: true,
            },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'status',
            label: 'Status',
            placeholder: "",
            disabled: true,
            width: WidthType.w33,
            classNames: "",
            isDisplayed: !newObject,
        },
    ];
}

export const DetailsFields = (
    {
        newObject,
        docType,
        countryOptions,
        senderOptions,
        receiverOptions,
        onSenderChange,
        onReceiverChange
    }:{
        newObject: boolean,
        docType: STOCK_MOVEMENT_DOC_TYPE,
        countryOptions: OptionType[],
        receiverOptions: OptionType[],
        senderOptions: OptionType[],
        onSenderChange: (newSender: string)=>void,
        onReceiverChange: (newReceiver: string)=>void,
    }
) => {
    const isInbound = docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS;
    const isOutbound = docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND
    return [
        {
            fieldType: isInbound ? FormFieldTypes.TEXT : FormFieldTypes.SELECT,
            type: "text",
            name: 'sender',
            label: 'Sender',
            placeholder: "",
            //disabled: isInbound,
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            options: isInbound ? [] : senderOptions,
            onChange: onSenderChange,
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'senderCountry',
            label: 'Country of sender',
            options: countryOptions,
            placeholder: "",
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            disabled: !isInbound,
            width: WidthType.w17,
            classNames: "",
        },
        {
            fieldType: isOutbound ? FormFieldTypes.TEXT : FormFieldTypes.SELECT,
            type: "text",
            name: 'receiver',
            label: 'Receiver',
            placeholder: "",
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            options: isOutbound ? [] : receiverOptions,
            onChange: onReceiverChange,
            //disabled: isOutbound,
            width: WidthType.w33,
            classNames: "",
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'receiverCountry',
            label: 'Country of receiver',
            placeholder: "",
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            options: countryOptions,
            disabled: !isOutbound,
            width: WidthType.w17,

            classNames: "",
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'courierServiceTrackingNumber',
            label: 'Courier service tracking number',
            placeholder: "",
            disabled: true,
            width: WidthType.w50,
            classNames: "",
            isDisplayed: !newObject,
        },
        // {
        //     fieldType: FormFieldTypes.TEXT,
        //     type: "text",
        //     name: 'warehouseTrackingNumberCurrent',
        //     label: 'Warehouse tracking number',
        //     placeholder: "",
        //     disabled: true,
        //     width: WidthType.w33,
        //     classNames: "",
        //     isDisplayed: !newObject,
        // },
        // {
        //     fieldType: FormFieldTypes.TEXT,
        //     type: "text",
        //     name: 'wapiTrackingNumber',
        //     label: 'Wapi tracking number',
        //     placeholder: "",
        //     disabled: true,
        //     width: WidthType.w33,
        //     classNames: "",
        //     isDisplayed: !newObject,
        // },
        {
            fieldType: FormFieldTypes.TEXT_AREA,
            type: "text",
            name: 'comment',
            label: 'Comment',
            placeholder: "",
            //disabled: true,
            width: WidthType.w100,
            classNames: "",

        },

    ];
}

export const ProductsTotalFields = () => [
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'weightGross',
        label: "Weight total gross, kg",
        placeholder: "",
        //width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'weightNet',
        label: "Weight total net, kg",
        placeholder: "",
        //width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'volume',
        label: "Volume, m3",
        placeholder: "",
        //width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'palletAmount',
        label: "Pallet amount, pcs",
        placeholder: "",
        //width: WidthType.w25,
        classNames: "",
    },
    {
        fieldType: FormFieldTypes.NUMBER,
        type: "number",
        name: 'packages',
        label: "Packages, pcs",
        placeholder: "",
        //width: WidthType.w25,
        classNames: "",
    },

];



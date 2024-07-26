import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import {StockMovementsHints} from "@/screens/StockMovementsPage/stockMovementsHints.constants";
import {docNamesSingle} from "@/screens/StockMovementsPage";

export const GeneralFields = (t: any, tTypes, requiredFieldMessage: string, newObject: boolean, docType: STOCK_MOVEMENT_DOC_TYPE, canEditATA: boolean) => {
    const isInbound = docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS;
    const docTypeSingle = docNamesSingle[docType];

    return [
            {
                fieldType: FormFieldTypes.TEXT,
                type: "text",
                name: 'number',
                label: t('number'),
                placeholder: "",
                disabled: true,
                width: WidthType.w17,
                classNames: "",
                isDisplayed: !newObject,
                hint: t('numberHint'),
            },
            {
                fieldType: FormFieldTypes.TEXT,
                type: "text",
                name: 'incomingNumber',
                label: t('incomingNumber'),
                placeholder: "",
                width: newObject ? WidthType.w33 : WidthType.w17,
                classNames: "",
                hint: t('incomingNumberHint', {docType: tTypes(docType)}),
            },
            {
                fieldType: FormFieldTypes.DATE,
                type: "date",
                name: 'estimatedTimeArrives',
                label: 'ETA',
                disabled: !isInbound,
                notDisable: isInbound && canEditATA,
                placeholder: "",
                width: WidthType.w17,
                classNames: "calendar-to-right",
                rules: {
                    required: isInbound ? requiredFieldMessage : false,
                    validate: value => {
                        if (!isInbound) return true;

                        const selectedDate = new Date(value);
                        const year2000 = new Date('2000-01-01');

                        if (selectedDate < year2000) {
                            return requiredFieldMessage;
                        }

                        return true; // Validation passed
                    }
                },
                isClearable: true,
                hint: t('estimatedTimeArrivesHint') || '',
            },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'status',
            label: t('status'),
            placeholder: "",
            disabled: true,
            width: WidthType.w25,
            classNames: "",
            isDisplayed: !newObject,
            hint: t("statusHint") || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'statusAdditionalInfo',
            label: t('statusAdditionalInfo'),
            placeholder: "",
            disabled: true,
            width: WidthType.w25,
            classNames: "",
            isDisplayed: !newObject,
            hint: t('statusAdditionalInfoHint') || '',
        },
    ];
}

export const DetailsFields = (
    {
        t,
        tTypes,
        requiredFieldMessage,
        newObject,
        docType,
        countryOptions,
        senderOptions,
        receiverOptions,
        onSenderChange,
        onReceiverChange,
        canEditETA,
        receiverHide,
        senderHide,
        sender,
        receiver,
        isSenderDisabled,
    }:{
        t: any,
        tTypes: any
        requiredFieldMessage: string,
        newObject: boolean,
        docType: STOCK_MOVEMENT_DOC_TYPE,
        countryOptions: OptionType[],
        receiverOptions: OptionType[],
        senderOptions: OptionType[],
        onSenderChange: (newSender: string)=>void,
        onReceiverChange: (newReceiver: string)=>void,
        canEditETA: boolean;
        receiverHide: boolean;
        senderHide: boolean;
        sender: string;
        receiver: string;
        isSenderDisabled?: boolean
    }
) => {
    const isInbound = docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS;
    const isOutbound = docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND;
    const isLogisticService = docType === STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE;
    const isStockMovement = docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT;

    const docTypeSingle = docNamesSingle[docType];
    const docHintsObj = StockMovementsHints(docTypeSingle);

    return [
        {
            fieldType: isInbound || isLogisticService ? FormFieldTypes.TEXT : FormFieldTypes.SELECT,
            type: "text",
            name: 'sender',
            label: t('sender'),
            placeholder: "",
            disabled: senderHide || isSenderDisabled,
            rules: {
                required: requiredFieldMessage,
            },
            options: isInbound || isLogisticService ? [] : isStockMovement && !!receiver ? senderOptions.filter(item => item.value !== receiver) : senderOptions,
            onChange: onSenderChange,
            width: WidthType.w33,
            classNames: "",
            hint: t(isInbound || isLogisticService ? "senderInboundHint" : "senderOutboundHint"),
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'senderCountry',
            label: t('senderCountry'),
            options: countryOptions,
            placeholder: "",
            rules: {
                required: requiredFieldMessage,
            },
            disabled: !isInbound && !isLogisticService,
            width: WidthType.w17,
            classNames: "",
            hint: t('senderCountryHint') || '',
        },
        {
            fieldType: isOutbound || isLogisticService ? FormFieldTypes.TEXT : FormFieldTypes.SELECT,
            type: "text",
            name: 'receiver',
            label: t('receiver'),
            placeholder: "",
            rules: {
                required: requiredFieldMessage,
            },
            options: isOutbound || isLogisticService ? [] : isStockMovement && !!sender ? receiverOptions.filter(item => item.value !== sender) : receiverOptions,
            onChange: onReceiverChange,
            disabled: receiverHide,
            width: WidthType.w33,
            classNames: "",
            hint: t(isOutbound || isLogisticService ? 'receiverOutboundHint' : 'receiverInboundHint'),
        },
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'receiverCountry',
            label: t('receiverCountry'),
            placeholder: "",
            rules: {
                required: requiredFieldMessage,
            },
            options: countryOptions,
            disabled: !isOutbound && !isLogisticService,
            width: WidthType.w17,

            classNames: "",
            hint: t('receiverCountryHint') || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'courierServiceTrackingNumber',
            label: t('courierServiceTrackingNumber'),
            placeholder: "",
            //disabled: true,
            width: WidthType.w50,
            classNames: "",
            notDisable: isInbound && canEditETA,
            //isDisplayed: !newObject,
            hint: t('courierServiceTrackingNumberHint') || '',
        },
        {
            fieldType: FormFieldTypes.TEXT_AREA,
            type: "text",
            name: 'comment',
            label: t('comment'),
            placeholder: "",
            //disabled: true,
            width: WidthType.w100,
            classNames: "",
            //hint: t('commentHint', {docType: tTypes(docType)}),
            hint: t('commentHint'+docType),
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



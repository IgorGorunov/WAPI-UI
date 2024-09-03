import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import {StockMovementsHints} from "@/screens/StockMovementsPage/stockMovementsHints.constants";
import {docNamesSingle} from "@/screens/StockMovementsPage";

export const GeneralFields = (
    {
        newObject,
        docType,
        canEditATA,
        // transportationTypeOptions,
        // isContainer,
        // deliveryMethodOptions,
        // container20Value = 0,
        // container40Value = 0
    }: {
        newObject: boolean;
        docType: STOCK_MOVEMENT_DOC_TYPE;
        canEditATA: boolean;
        // transportationTypeOptions: OptionType[];
        // isContainer: boolean;
        // deliveryMethodOptions: OptionType[];
        // container20Value: number;
        // container40Value: number;
    }
) => {
    const isInbound = docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS;
    const docTypeSingle = docNamesSingle[docType];
    const docHintsObj = StockMovementsHints(docTypeSingle);

    return [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'number',
            label: "Number",
            placeholder: "",
            disabled: true,
            width: WidthType.w17,
            classNames: "",
            isDisplayed: !newObject,
            hint: docHintsObj['number'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'incomingNumber',
            label: "Incoming number",
            placeholder: "",
            width: newObject ? WidthType.w33 : WidthType.w17,
            classNames: "",
            hint: docHintsObj['incomingNumber'] || '',
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
            isClearable: false,
            hint: docHintsObj['estimatedTimeArrives'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'status',
            label: 'Status',
            placeholder: "",
            disabled: true,
            width: WidthType.w25,
            classNames: "",
            isDisplayed: !newObject,
            hint: docHintsObj['status'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'statusAdditionalInfo',
            label: 'Status additional info',
            placeholder: "",
            disabled: true,
            width: WidthType.w25,
            classNames: "",
            isDisplayed: !newObject,
            hint: docHintsObj['statusAdditionalInfo'] || '',
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
        onReceiverChange,
        canEditETA,
        receiverHide,
        senderHide,
        sender,
        receiver,
        isSenderDisabled,
        transportationTypeOptions,
        isContainer,
        deliveryMethodOptions,
        container20Value = 0,
        container40Value = 0
    }:{
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
        isSenderDisabled?: boolean;
        transportationTypeOptions: OptionType[];
        isContainer: boolean;
        deliveryMethodOptions: OptionType[];
        container20Value: number;
        container40Value: number;
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
            label: 'Sender',
            placeholder: "",
            disabled: senderHide || isSenderDisabled,
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            options: isInbound || isLogisticService ? [] : isStockMovement && !!receiver ? senderOptions.filter(item => item.value !== receiver) : senderOptions,
            onChange: onSenderChange,
            width: WidthType.w33,
            classNames: "",
            hint: docHintsObj['sender'] || '',
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
            disabled: !isInbound && !isLogisticService,
            width: WidthType.w17,
            classNames: "",
            hint: docHintsObj['senderCountry'] || '',
        },
        {
            fieldType: isOutbound || isLogisticService ? FormFieldTypes.TEXT : FormFieldTypes.SELECT,
            type: "text",
            name: 'receiver',
            label: 'Receiver',
            placeholder: "",
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            options: isOutbound || isLogisticService ? [] : isStockMovement && !!sender ? receiverOptions.filter(item => item.value !== sender) : receiverOptions,
            onChange: onReceiverChange,
            disabled: receiverHide,
            width: WidthType.w33,
            classNames: "",
            hint: docHintsObj['receiver'] || '',
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
            disabled: !isOutbound && !isLogisticService,
            width: WidthType.w17,

            classNames: "",
            hint: docHintsObj['receiverCountry'] || '',
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'courierServiceTrackingNumber',
            label: 'Courier service tracking number',
            placeholder: "",
            //disabled: true,
            width: WidthType.w50,
            classNames: "",
            notDisable: isInbound && canEditETA,
            //isDisplayed: !newObject,
            hint: docHintsObj['courierServiceTrackingNumber'] || '',
        },
        {
            name: 'grid-13',
            fieldType: FormFieldTypes.GRID,
            width: WidthType.w100,
            isDisplayed: isInbound,
            classNames: 'grid-no-wrap',
            fields: [
                {
                    fieldType: FormFieldTypes.SELECT,
                    type: "text",
                    name: 'transportationType',
                    label: 'Transportation type',
                    options: transportationTypeOptions || [],
                    placeholder: "",
                    rules: {
                        required: isInbound ? "Required field" : false,
                    },
                    errorMessage: "Required field",
                    isDisplayed: isInbound,
                    width: WidthType.w25,
                    classNames: "",
                    hint: docHintsObj['transportationType'] || '',
                },
                {
                    fieldType: FormFieldTypes.RADIO,
                    type: "text",
                    name: 'deliveryMethod',
                    label: 'Delivery method',
                    isDisplayed: isInbound,
                    options: deliveryMethodOptions,
                    placeholder: "",
                    width: WidthType.w25,
                    rules: {
                        required: isInbound ? "Required field" : false,
                    },
                    errorMessage: "Required field",
                    isClearable: false,
                    hint: docHintsObj['deliveryMethod'] || '',
                },
                {
                    fieldType: FormFieldTypes.TOGGLE,
                    name: 'labelingNeeds',
                    label: "Needs labeling",
                    width: WidthType.w25,
                    isDisplayed: isInbound,
                    classNames: "",
                    hint: docHintsObj['labelingNeeds'] || '',
                },
                {
                    fieldType: FormFieldTypes.TOGGLE,
                    name: 'mixedCarton',
                    label: "Mixed carton",
                    width: WidthType.w25,
                    isDisplayed: isInbound,
                    classNames: "",
                    hint: docHintsObj['mixedCarton'] || '',
                },

                {
                    fieldType: FormFieldTypes.NUMBER,
                    type: "number",
                    name: 'container20Amount',
                    label: 'Container20 amount',
                    placeholder: "0",
                    width: WidthType.w25,
                    rules: {
                        //required: isInbound ? 'Required field...' : false,
                        validate: value => {
                            if (!isInbound || !isContainer) return true;

                            if (value <= 0 && container40Value <= 0) {
                                return 'Fill at least one container amount';
                            }
                        },
                    },
                    classNames: "",
                    isDisplayed: isContainer,
                    hint: docHintsObj['container20Amount'] || '',
                },
                {
                    fieldType: FormFieldTypes.NUMBER,
                    type: "number",
                    name: 'container40Amount',
                    label: 'Container40 amount',
                    placeholder: "0",
                    width: WidthType.w25,
                    rules: {
                        //required: isInbound ? 'Required field...' : false,
                        validate: value => {
                            if (!isInbound || !isContainer) return true;

                            if (value<=0 && container20Value <= 0) {
                                return 'Fill at least one container amount';
                            }

                            return true; // Validation passed
                        }
                    },
                    classNames: "",
                    isDisplayed: isContainer,
                    hint: docHintsObj['container40Amount'] || '',
                },
                {
                    fieldType: FormFieldTypes.OTHER,
                    type: "text",
                    name: 'deliveryTypeHint',
                    isDisplayed: isContainer,
                    otherComponent: <p>Please remember to book your delivery day and time slot at least 5 business days in advance. During the high season (September to December), we recommend booking as early as possible to ensure your delivery is accepted by the warehouse.</p>,
                    width: WidthType.w100,
                    classNames: 'delivery-type-hint'
                }
            ],
        },
        {
            fieldType: FormFieldTypes.TEXT_AREA,
            type: "text",
            name: 'comment',
            label: 'Comment',
            placeholder: "",
            //disabled: true,
            width: WidthType.w100,
            classNames: "",
            hint: docHintsObj['comment'] || '',
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



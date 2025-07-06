import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import {StockMovementsHints} from "@/screens/StockMovementsPage/stockMovementsHints.constants";
import {docNamesSingle} from "@/screens/StockMovementsPage";
import {DELIVERY_METHODS} from "./StockMovementFormComponent";

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

export const CargoFields = (
    {
        newObject,
        docType,
        deliveryTypeOptions,
        deliveryMethod,
        deliveryMethodOptions,
        container20Value = 0,
        container40Value = 0,
        palletsAmount = 0,
        cartonsAmount = 0,
        canDisplayCargoInfo,
        canEdit,
    }:{
        newObject: boolean,
        docType: STOCK_MOVEMENT_DOC_TYPE,
        deliveryTypeOptions: OptionType[];
        deliveryMethod: string,
        deliveryMethodOptions: OptionType[];
        container20Value: number;
        container40Value: number;
        palletsAmount: number;
        cartonsAmount: number;
        canDisplayCargoInfo: boolean;
        canEdit?: boolean;
    }
) => {
    const isInbound = docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS;
    const isLogisticService = docType === STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE;
    const isOutbound = docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND;
    const isStockMovement = docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT;

    const isStockMovementOrOutbound = isStockMovement || isOutbound;
    const isInboundOrLogisticService = isInbound || isLogisticService;

    const isContainer = deliveryMethod === DELIVERY_METHODS.CONTAINER;
    const isPallets = deliveryMethod === DELIVERY_METHODS.PLL;
    const isFullTrack = deliveryMethod === DELIVERY_METHODS.FULL_TRACK;
    const isCartons = deliveryMethod === DELIVERY_METHODS.CARTONS;
    const isEmpty = !deliveryMethod;

    const docTypeSingle = docNamesSingle[docType];
    const docHintsObj = StockMovementsHints(docTypeSingle);

    //const isCargoInfoFieldsDisplayed = (isOutbound || isStockMovement) && canDisplayCargoInfo || isInbound || isLogisticService;
    const isCargoInfoFieldsDisplayed = isStockMovementOrOutbound && canDisplayCargoInfo || isInboundOrLogisticService;



    return [
        {
            fieldType: FormFieldTypes.RADIO,
            type: "text",
            name: 'deliveryType',
            label: 'Delivery type',
            //isDisplayed: isInbound,
            options: deliveryTypeOptions,
            placeholder: "",
            width: WidthType.w50,
            rules: {
                required: "Required field",
            },
            errorMessage: "Required field",
            isClearable: true,
            hint: docHintsObj['deliveryType'] || '',
        },
        !isCargoInfoFieldsDisplayed ? {
            fieldType: FormFieldTypes.TOGGLE,
            // key: 'labelingNeeds_extra',
            name: 'labelingNeeds',
            label: "Needs labeling",
            width: WidthType.w25,
            isDisplayed: !isCargoInfoFieldsDisplayed,
            classNames: "",
            hint: docHintsObj['labelingNeeds'] || '',
        } : null,
        {
            fieldType: FormFieldTypes.OTHER,
            type: "text",
            name: 'cargoInfoHint',
            otherComponent: <p>If you have any wishes about the way of packing, please specify in the Comment field (in General tab)!</p>,
            width: WidthType.w100,
            isDisplayed: (isStockMovementOrOutbound) && (newObject || canEdit),
            classNames: 'delivery-type-hint'
        },
        {
            name: 'grid-13',
            fieldType: FormFieldTypes.GRID,
            width: WidthType.w100,
            isDisplayed: isCargoInfoFieldsDisplayed,
            classNames: 'grid-no-wrap',
            fields: [
                {
                    fieldType: FormFieldTypes.SELECT,
                    type: "text",
                    name: 'deliveryMethod',
                    label: 'Delivery method',
                    isDisplayed: isCargoInfoFieldsDisplayed,
                    options: deliveryMethodOptions,
                    placeholder: "",
                    disabled: isStockMovementOrOutbound,
                    width: WidthType.w50,
                    rules: {
                        required: isInbound || isLogisticService ? "Required field" : false,
                    },
                    errorMessage: "Required field",
                    isClearable: true,
                    hint: docHintsObj['deliveryMethod'] || '',
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
                            if (!isContainer) return true;

                            if (value <= 0 && container40Value <= 0) {
                                return 'Fill at least one container amount';
                            }
                        },
                    },
                    classNames: "",
                    isDisplayed: (isCargoInfoFieldsDisplayed || isInbound || isLogisticService) && (isContainer || isEmpty),
                    disabled: isStockMovementOrOutbound,
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
                            //if (!isInbound || !isContainer) return true;
                            if (!isContainer) return true;

                            if (value<=0 && container20Value <= 0) {
                                return 'Fill at least one container amount';
                            }

                            return true; // Validation passed
                        }
                    },
                    classNames: "",
                    isDisplayed: (isCargoInfoFieldsDisplayed || isInbound || isLogisticService) && (isContainer || isEmpty),
                    disabled: isStockMovementOrOutbound,
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
            name: 'grid-14',
            fieldType: FormFieldTypes.GRID,
            width: WidthType.w50,
            isDisplayed: isCargoInfoFieldsDisplayed,
            classNames: `grid-no-wrap ${isCartons ? 'align-right' : ''}`,
            fields: [
                {
                    fieldType: FormFieldTypes.NUMBER,
                    type: "number",
                    name: 'palletsAmount',
                    label: 'Pallet amount, pcs',
                    placeholder: "0",
                    width: WidthType.w50,
                    rules: {
                        //required: isInbound ? 'Required field...' : false,
                        validate: value => {
                            //if (!isInbound || !isContainer) return true;
                            if (isOutbound || isStockMovement || !isPallets && !isFullTrack) return true;

                            if (isFullTrack && value<=0 && cartonsAmount <= 0) {
                                return 'Fill the amount of pallets or cartons (or both)';
                            }

                            if (isPallets && value <= 0) {
                                return 'Fill the amount of pallets';
                            }

                            return true; // Validation passed
                        }
                    },
                    isDisplayed: (isCargoInfoFieldsDisplayed || isInbound || isLogisticService) && !isCartons,
                    disabled: isStockMovementOrOutbound,
                    classNames: "",
                    hint: docHintsObj['pallets'] || '',
                },
                {
                    fieldType: FormFieldTypes.NUMBER,
                    type: "number",
                    name: 'cartonsAmount',
                    label: 'Cartons, pcs',
                    placeholder: "0",
                    width: WidthType.w50,
                    isDisplayed: (isCargoInfoFieldsDisplayed || isInbound || isLogisticService),
                    disabled: isStockMovementOrOutbound,
                    rules: {
                        //required: isInbound ? 'Required field...' : false,
                        validate: value => {
                            //if (!isInbound || !isContainer) return true;
                            if (isOutbound || isStockMovement || !isCartons && !isFullTrack) return true;

                            if (isCartons && value <= 0) {
                                return 'Fill the amount of cartons';
                            }

                            if (isFullTrack && value<=0 && palletsAmount <= 0) {
                                return 'Fill the amount of pallets or cartons (or both)';
                            }

                            return true;
                        }
                    },
                    classNames: "",
                    hint: docHintsObj['pallets'] || '',
                },
            ],
        },
        isCargoInfoFieldsDisplayed ? {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'labelingNeeds',
            label: "Needs labeling",
            width: WidthType.w25,
            isDisplayed: isCargoInfoFieldsDisplayed,
            classNames: "",
            hint: docHintsObj['labelingNeeds'] || '',
        } : null,
        {
            fieldType: FormFieldTypes.TOGGLE,
            name: 'mixedCarton',
            label: "Mixed carton",
            width: WidthType.w25,
            isDisplayed: isCargoInfoFieldsDisplayed,
            disabled: isStockMovementOrOutbound,
            classNames: "",
            hint: docHintsObj['mixedCarton'] || '',
        },
        {
            name: 'grid-15',
            fieldType: FormFieldTypes.GRID,
            width: WidthType.w100,
            isDisplayed: isCargoInfoFieldsDisplayed,
            disabled: isStockMovementOrOutbound,
            classNames: `grid-no-wrap`,
            fields: [
                {
                    fieldType: FormFieldTypes.NUMBER,
                    type: "number",
                    name: 'volume',
                    label: 'Volume, m3',
                    placeholder: "0",
                    width: WidthType.w25,
                    isDisplayed: isCargoInfoFieldsDisplayed,
                    disabled: isStockMovementOrOutbound,
                    classNames: "",
                    hint: docHintsObj['volume'] || '',
                },
                {
                    fieldType: FormFieldTypes.NUMBER,
                    type: "number",
                    name: 'weightTotalGross',
                    label: 'Total weight gross, kg',
                    placeholder: "0",
                    width: WidthType.w25,
                    isDisplayed: isCargoInfoFieldsDisplayed,
                    disabled: isStockMovementOrOutbound,
                    classNames: "",
                    hint: docHintsObj['weightTotalGross'] || '',
                },
                {
                    fieldType: FormFieldTypes.NUMBER,
                    type: "number",
                    name: 'weightTotalNet',
                    label: 'Total weight net, kg',
                    placeholder: "0",
                    width: WidthType.w25,
                    isDisplayed: isCargoInfoFieldsDisplayed,
                    disabled: isStockMovementOrOutbound,
                    classNames: "",
                    hint: docHintsObj['weightTotalNet'] || '',
                },
                {
                    fieldType: FormFieldTypes.OTHER,
                    type: "text",
                    name: 'cargoVolumeHint',
                    otherComponent: <p>If you dont have info about volume and weight, it will be approximately calculated based on the products specified in the document. </p>,
                    width: WidthType.w100,
                    isDisplayed: isInboundOrLogisticService,
                    classNames: 'cargo-volume-hint'
                }
            ],
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



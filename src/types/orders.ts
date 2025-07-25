import {
    SEND_COMMENT_TYPES,
    AttachedFilesType,
    WarehouseType,
    DocProductParamsType, SellerType
} from "@/types/utility";
import {TicketType} from "@/types/tickets";
import {NoteType} from "@/types/notes";
import {UserAccessActionType} from "@/context/authContext";

export type ClaimType = {
    date: string;
    number: string;
    status: string;
    statusHistory: {
        date: string;
        Status: string;
    }[]
}

export type OrderType = {
    mobileIcon: string,
    icon: string,
    uuid: string;
    status: string;
    statusGroup: string;
    date: string;
    wapiTrackingNumber: string,
    isCod: boolean,
    codAmount: string,
    codCurrency: string,
    clientOrderID: string,
    warehouse: string,
    warehouseCountry: string,
    courierService: string,
    trackingNumber: string,
    receiverCountry: string,
    receiverAddress: string;
    receiverCity: string;
    receiverZip: string;
    receiverComment: string;
    receiverEMail: string;
    receiverFullName: string;
    receiverPhone: string;
    receiverIcon: string;
    productLines: number;
    trackingLink: string;
    productsByString: string;
    statusAdditionalInfo: string;
    lastUpdateDate: string;
    lastTroubleStatus: string;
    troubleStatusesByString: string;
    claimsExist: boolean;
    claims: ClaimType[];
    products: {
        product: string;
        quantity: number;
    } [],
    troubleStatusesExist: boolean;
    troubleStatuses: {
        period: string;
        status: string;
        troubleStatus: string;
        additionalInfo: string;
    }[],
    notifications: boolean;
    commentToCourierService: {
        period: string;
        additionalInfo: string;
    }[];
    commentToCourierServiceExist: boolean;
    selfCollect: boolean;
    sentSMS: {}[];
    sentSMSExist: boolean;
    logisticComment: string;
    ticket?: boolean;
    ticketopen?: boolean;
    nonTroubleEventsByString: string;
    nonTroubleEvents: {
        event: string;
        period: string;
        status: string;
        additionalInfo: string;
    }[];
    nonTroubleEventsExist: boolean;
    WarehouseAssemblyPhotos?: boolean;
    returnsExist?: boolean;
    returns?: {
        date: string;
        number: string;
        status: string;
    }[];
    marketplace: string;
    seller?: SellerType;
}

export type ProductInfoType = {
    name: string;
    sku: string;
    uuid: string;
};

export type SingleOrderProductType = {
    analogue: ProductInfoType;
    cod: number;
    discount: number;
    price: number;
    product: ProductInfoType;
    quantity: number;
    tax: number;
    total: number;
    unfoldBundle?: boolean;
    unitOfMeasure?: string;
    connectionKey?: string | number;
}

export type OrderHistoryType = {
    additionalInfo: string;
    period: string;
    status: string;
    offset: string;
    trackingNumber: string;
    troubleStatus: string;
    statusGroup: string;
    location: string;
    event: string;
}

export type OrderSmsHistoryType = {
    smsPeriod: string;
    smsStatus: string;
    smsText: string;
    smsRecipient: string;
}

export type OrderServiceType = {
    amount: number;
    amountEuro: number;
    currency: string;
    period: string;
    price: number;
    quantity: number;
    service: string;
    trackingNumber: string;
    weight: number;
}



export type OrderCustomerReturnProductType = {
    product: ProductInfoType;
    quality: string;
    quantity: number;
}

export type OrderCustomerReturnType = {
    products: OrderCustomerReturnProductType[];
    date: string;
    number: string;
    status: string;
}

export type SingleOrderType = {
    clientOrderID: string;
    codAmount: number;
    codCurrency: string;
    // commentCourierService: string;
    // commentWarehouse: string;
    courierService: string;
    courierServiceTrackingNumber: string;
    courierServiceTrackingNumberCurrent: string;
    date: string;
    incomingDate: string;
    preferredCourierService: string;
    preferredCourierServiceMandatory: boolean;
    preferredDeliveryDate: string;
    preferredWarehouse: string;
    preferredWarehouseMandatory: boolean;
    priceCurrency: string;
    receiverAddress: string;
    receiverCity: string;
    receiverComment: string;
    receiverCountry: string;
    receiverCounty?: string;
    receiverEMail: string;
    receiverFullName: string;
    receiverPhone: string;
    receiverPickUpAddress:string;
    receiverPickUpCity:string;
    receiverPickUpCountry: string;
    receiverPickUpDescription: string;
    receiverPickUpID: string;
    receiverPickUpName: string;
    receiverZip: string;
    status: string;
    statusAdditionalInfo: string;
    trackingLink: string;
    uuid: string;
    wapiTrackingNumber: string;
    warehouse: string;
    claims: ClaimType[];
    products: SingleOrderProductType[];
    statusHistory: OrderHistoryType[];
    smsHistory?: OrderSmsHistoryType[];
    services: OrderServiceType[];
    attachedFiles: AttachedFilesType[];
    canEdit: boolean;
    tickets: TicketType[];
    commentCourierServiceFunctionsList: string;
    notes: NoteType[];
    commentTodayWasSent: boolean;
    nextAvailableDayAfterDays: number;
    logisticComment: string;
    addressEditAllowedOnly?: boolean;
    warehouseAdditionalInfo?: string;
    warehouseAssemblyPhotos?: AttachedFilesType[];
    customerReturns: OrderCustomerReturnType[];
    seller?: string;
}

export type OrderProductType = {
    available: number;
    country: string;
    damaged: number;
    expired: number;
    forPlacement: number;
    name: string;
    reserved: number;
    sellable: number;
    sku: string;
    total: number;
    undefinedStatus: number;
    uuid: string;
    warehouse: string;
    warehouseSku: string;
    withoutBox: number;
    weightNet: number;
    weightGross: number;
    volume: number;
}

export type OrderParamsType = {
    products?: DocProductParamsType[];
    warehouses: WarehouseType[];
    currencies: string[];
    actionAccessSettings?: UserAccessActionType[];
}

export type PickupPointsType = {
    address: string;
    city: string;
    country: string;
    description: string;
    id: string;
    name: string;
}

export type OrderProductWithTotalInfoType = {
    cod: number;
    weightNet: number;
    weightGross: number;
    volumeWeight?: number;
    volume: number;
    currency?: string;
}

export type OrderCommentType = {
    order: {
        uuid: string;
    };
    //clientOrderID: string;
    action: SEND_COMMENT_TYPES,
    comment: string;
    receiver?: {
        address: string;
        city: string;
        country: string;
        county?: string;
        email: string;
        fullName: string;
        phone: string;
        zip: string;
    }
    deliveryDate?:{
        date: string;
        hourFrom: string;
        hourTo: string;
    }
}

export type SingleOrderProductFormType = {
    sku?: string;
    product: string;
    analogue: string;
    quantity: string | number;
    price: string | number;
    discount: string | number;
    tax: string | number;
    total: string | number;
    cod: string | number;
    connectionKey?: string | number;
};

export type SingleOrderFormType = {
    clientOrderID: string;
    codAmount: number;
    codCurrency: string;
    courierService: string;
    courierServiceTrackingNumber: string;
    courierServiceTrackingNumberCurrent: string;
    date: string;
    incomingDate: string;
    preferredCourierService: string;
    preferredCourierServiceMandatory: boolean;
    preferredDeliveryDate: string;
    preferredWarehouse: string;
    preferredWarehouseMandatory: boolean;
    priceCurrency: string;
    receiverAddress: string;
    receiverCity: string;
    receiverComment: string;
    receiverCountry: string;
    receiverCounty?: string;
    receiverEMail: string;
    receiverFullName: string;
    receiverPhone: string;
    receiverPickUpAddress:string;
    receiverPickUpCity:string;
    receiverPickUpCountry: string;
    receiverPickUpDescription: string;
    receiverPickUpID: string;
    receiverPickUpName: string;
    receiverZip: string;
    status: string;
    statusAdditionalInfo: string;
    trackingLink: string;
    uuid: string;
    wapiTrackingNumber: string;
    warehouse: string;
    products: SingleOrderProductFormType[];
}

//endpoint types
export type CreateOrderRequestType = {
    orderData: SingleOrderType,
    token: string;
    alias: string;
    ui?: string;
    seller?: string;
}


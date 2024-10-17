import {AttachedFilesType, DocProductParamsType} from "@/types/utility";
import {TicketType} from "@/types/tickets";
import {Routes} from '@/types/routes';

export const enum STOCK_MOVEMENT_DOC_TYPE {
    INBOUNDS = 'Inbound',
    STOCK_MOVEMENT = 'StockMovement',
    OUTBOUND = 'Outbound',
    LOGISTIC_SERVICE = 'LogisticService',
}

export enum STOCK_MOVEMENT_DOC_SUBJECT {
    'Inbound' = 'Inbound',
    'StockMovement' = 'Stock movement',
    'Outbound' = 'Outbound',
    'LogisticService' = 'Logistic service',
}

export enum STOCK_MOVEMENT_ROUTES {
    'Inbound' = Routes.Inbounds,
    'StockMovement' = Routes.StockMovements,
    'Outbound' = Routes.Outbounds,
    'LogisticService' = Routes.LogisticServices
}

export type StockMovementType = {
    type?: STOCK_MOVEMENT_DOC_TYPE | string;
    number: string;
    estimatedTimeArrives: string;
    incomingDate: string;
    incomingNumber: string;
    products: {quantity: number; product: string;}[];
    productsByString: string;
    receiver: string;
    receiverCountry: string;
    sender: string;
    senderCountry: string;
    status: string;
    tableKey: string;
    uuid: string;
    statusPeriod: string;
}

export type ProductInfoType = {
    name: string;
    sku: string;
    uuid: string;
};

export type SingleStockMovementProductType = {
    product: ProductInfoType;
    quantityPlan: number;
    quantity: number;
    quality: string;
    unitOfMeasure: string;
}

export type StockMovementHistoryType = {
    period: string;
    status: string;
    estimatedTimeArrives: string;
    statusAdditionalInfo?: string;
    // estimatedTimeDepartures: string;
    // freightSupplier: string;
}

export type StockMovementServiceType = {
    amount: number;
    amountEuro: number;
    currency: string;
    period: string;
    price: number;
    quantity: number;
    service: string;
}

export type SingleStockMovementType = {
    date: string;
    number: string;
    incomingDate: string;
    incomingNumber: string;
    deliveryType: string;
    deliveryMethod?: string;
    //transportationType?: string;
    container20Amount?: number;
    container40Amount?: number;
    palletsAmount?: number;
    cartonsAmount?: number;
    volume: number;
    weightTotalGross: number;
    weightTotalNet: number;
    labelingNeeds?: boolean;
    mixedCarton?: boolean;
    packages: number;
    //palletAmount: number;
    sender: string;
    senderCountry: string;
    receiver: string;
    receiverCountry: string;
    estimatedTimeArrives: string;
    courierServiceTrackingNumber: string;
    uuid: string;
    // volume: number;
    // weightGross: number;
    // weightNet: number;
    comment: string;
    status: string;
    products: SingleStockMovementProductType[];
    statusHistory: StockMovementHistoryType[];
    statusAdditionalInfo?: string;
    services: StockMovementServiceType[];
    attachedFiles: AttachedFilesType[];
    canEdit?: boolean;
    tickets?: TicketType[];
    receiverHide?: boolean;
    senderHide?: boolean;
}

export type StockMovementParamsProductType = {
    available: number;
    name: string;
    sku: string;
    uuid: string;
    unitOfMeasures: string[];
    warehouse: string;
}

export type StockMovementWarehouseType = {
    warehouse: string;
    country: string;
}

export type StockMovementParamsType = {
    products?: DocProductParamsType[];
    sender: StockMovementWarehouseType[] | null;
    receiver: StockMovementWarehouseType[] | null;
    quality: string[];
}

//send form types
export type SingleStockMovementProductFormType = {
    product: string;
    quantityPlan: number|string;
    quantity: number|string;
    quality: string;
    //unitOfMeasure: string;
};

export type SingleStockMovementFormType = {
    incomingDate: string;
    number: string;
    incomingNumber: string;
    deliveryType: string;
    deliveryMethod?: string;
    //transportationType?: string;
    container20Amount?: number;
    container40Amount?: number;
    palletsAmount?: number;
    cartonsAmount?: number;
    volume: number;
    weightTotalGross: number;
    weightTotalNet: number;
    labelingNeeds?: boolean;
    mixedCarton?: boolean;
    sender: string;
    senderCountry: string;
    receiver: string;
    receiverCountry: string;
    estimatedTimeArrives: string;
    courierServiceTrackingNumber: string;
    uuid: string;
    comment: string;
    status: string;
    products: SingleStockMovementProductFormType[];
}
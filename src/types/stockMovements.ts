import {AttachedFilesType, DocProductParamsType, ProductsSelectionType} from "@/types/utility";
import {TicketType} from "@/types/tickets";

export const enum STOCK_MOVEMENT_DOC_TYPE {
    INBOUNDS = 'Inbound',
    STOCK_MOVEMENT = 'StockMovement',
    OUTBOUND = 'Outbound',
}

export enum STOCK_MOVEMENT_DOC_SUBJECT {
    'Inbound' = 'Inbound',
    'StockMovement' = 'Stock movement',
    'Outbound' = 'Outbound',
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
    // packages: number;
    // palletAmount: number;
    // volume: number;
    // weightGross: number;
    // weightNet: number;
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
    packages: number;
    palletAmount: number;
    sender: string;
    senderCountry: string;
    receiver: string;
    receiverCountry: string;
    // freightSupplier: string;
    estimatedTimeArrives: string;
    courierServiceTrackingNumber: string;
    // wapiTrackingNumber: string;
    // warehouseTrackingNumber: string;
    uuid: string;
    volume: number;
    weightGross: number;
    weightNet: number;
    comment: string;
    //commentCargo: string;
    status: string;
    products: SingleStockMovementProductType[];
    statusHistory: StockMovementHistoryType[];
    statusAdditionalInfo?: string;
    services: StockMovementServiceType[];
    attachedFiles: AttachedFilesType[];
    canEdit?: boolean;
    tickets?: TicketType[];
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
    //products?: StockMovementParamsProductType[];
    products?: DocProductParamsType[];
    sender: StockMovementWarehouseType[] | null;
    receiver: StockMovementWarehouseType[] | null;
    quality: string[];
    productsSelection: ProductsSelectionType[];
}

//send form types
export type SingleStockMovementProductFormType = {
    product: string;
    quantityPlan: number|string;
    quantity: number|string;
    quality: string;
    unitOfMeasure: string;
};

export type SingleStockMovementFormType = {
    incomingDate: string;
    number: string;
    incomingNumber: string;
    // packages: number;
    // palletAmount: number;
    sender: string;
    senderCountry: string;
    receiver: string;
    receiverCountry: string;
    // freightSupplier: string;
    estimatedTimeArrives: string;
    courierServiceTrackingNumber: string;
    // wapiTrackingNumber: string;
    // warehouseTrackingNumber: string;
    uuid: string;
    // volume: number;
    // weightGross: number;
    // weightNet: number;
    comment: string;
    //commentCargo: string;
    status: string;
    products: SingleStockMovementProductFormType[];
    // statusHistory: StockMovementHistoryType[];
    // services: StockMovementServiceType[];
    // attachedFiles: AttachedFilesType[];
    // canEdit?: boolean;
}
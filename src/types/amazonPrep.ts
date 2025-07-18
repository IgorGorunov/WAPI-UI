import {DocProductParamsType} from "@/types/utility";
import {TicketType} from "@/types/tickets";

export type AmazonPrepOrderType = {
    key?: string;
    asnNumber: string;
    clientOrderID: string;
    courierService: string;
    date: string;
    deliveryMethod: string;
    productLines: number;
    receiverCountry: string;
    status: string;
    statusGroup: string;
    trackingNumber: string,
    uuid: string;
    wapiTrackingNumber: string;
    warehouse: string,
    warehouseCountry: string,
    products: {
        product: string,
        quantity: number,
    } [];
    notifications: boolean,
    seller?: string;
}

export type ProductInfoType = {
    name: string;
    sku: string;
    uuid: string;
};

export type SingleAmazonPrepOrderProductType = {
    product: ProductInfoType;
    quantity: number;
    boxesQuantity: number;
    unitOfMeasure?: string;
}

export type AmazonPrepOrderHistoryType = {
    additionalInfo: string;
    period: string;
    status: string;
    trackingNumber: string;
    statusGroup: string;
}

export type AmazonPrepOrderWarehouseStatusHistoryType = {
    additionalInfo: string;
    period: string;
    status: string;
}

export type AmazonPrepOrderServiceType = {
    amount: number;
    amountEuro: number;
    currency: string;
    period: string;
    price: number;
    quantity: number;
    service: string;
    unit: string;
}

export type PalletType = {
    palletName: string;
    palletWidth: number;
    palletLength: number;
    palletHeight: number;
    palletWeight: number;
    palletVolume: number;
    palletTrackingNumber: string;
}

export type AttachedFilesType = {
    id: string;
    name: string;
    type: string;
    data: string;
}

export type SingleAmazonPrepOrderType = {
    asnNumber: string;
    attachedFiles: AttachedFilesType[];
    canEdit: boolean;
    clientOrderID: string;
    courierService: string;
    courierServiceTrackingNumber: string;
    date: string;
    deliveryMethod: string;
    incomingDate: string;
    pallets: PalletType[];
    preferredDeliveryDate: string;
    receiverAddress: string;
    receiverCity: string;
    receiverComment: string;
    receiverCountry: string;
    receiverEMail: string;
    receiverFullName: string;
    receiverPhone: string;
    receiverZip: string;
    status: string;
    statusAdditionalInfo: string;
    trackingLink: string;
    uuid: string;
    wapiTrackingNumber: string;
    warehouse: string;
    products: SingleAmazonPrepOrderProductType[];
    statusHistory: AmazonPrepOrderHistoryType[];
    services: AmazonPrepOrderServiceType[];
    draft?: boolean;
    carrierType?: string;
    multipleLocations?: boolean;
    boxesType?: string;
    tickets?: TicketType[];
    comment: string;
    warehouseStatusHistory?: AmazonPrepOrderWarehouseStatusHistoryType[];
    seller?: string;
}

export type AmazonPrepOrderProductType = {
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
    unitOfMeasures: string[];
}

export type WarehouseType = {
    warehouse: string;
    courierService: string;
    country?: string;
}

export type AmazonPrepOrderParamsType = {
    products?: DocProductParamsType[];
    warehouses: WarehouseType[];
    deliveryMethod: string[];
    carrierTypes?: string[];
    boxesTypes?: string[];
}

export type AmazonPrepOrderProductWithTotalInfoType = {
    pallets: number;
    weightNet: number;
    weightGross: number;
    volume: number;
    currency?: string;
}

//type of form data sent to server
export type SingleAmazonPrepOrderFormType = {
    asnNumber: string;
    clientOrderID: string;
    courierService: string;
    courierServiceTrackingNumber: string;
    date: string;
    deliveryMethod: string;
    incomingDate: string;
    preferredDeliveryDate: string;
    receiverAddress: string;
    receiverCity: string;
    receiverComment: string;
    receiverCountry: string;
    receiverEMail: string;
    receiverFullName: string;
    receiverPhone: string;
    receiverZip: string;
    status: string;
    statusAdditionalInfo: string;
    trackingLink: string;
    uuid: string;
    wapiTrackingNumber: string;
    warehouse: string;
    products: {
        key: string;
        selected: boolean;
        product: string;
        quantity: number;
        boxesQuantity: number;
    }[];
    carrierType?: string;
    multipleLocations?: boolean;
    boxesType?: string;
    draft?: boolean;
    attachedFiles?: AttachedFilesType[];
    comment: string;
    seller?: string;
}

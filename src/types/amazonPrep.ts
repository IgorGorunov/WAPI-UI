export type AmazonPrepOrderType = {
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
}

export type ProductInfoType = {
    name: string;
    sku: string;
    uuid: string;
};

export type SingleAmazonPrepOrderProductType = {
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
}

export type AmazonPrepOrderHistoryType = {
    additionalInfo: string;
    period: string;
    status: string;
    trackingNumber: string;
    troubleStatus: string;
    statusGroup: string;
}

export type AmazonPrepOrderServiceType = {
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

export type SingleAmazonPrepOrderType = {
    clientOrderID: string;
    codAmount: number;
    codCurrency: string;
    commentCourierService: string;
    commentWarehouse: string;
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
    receiverAddress: string;
    receiverCity: string;
    receiverComment: string;
    receiverCountry: string;
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
    products: SingleAmazonPrepOrderProductType[];
    statusHistory: AmazonPrepOrderHistoryType[];
    services: AmazonPrepOrderServiceType[];
    attachedFiles: AttachedFilesType[];
    canEdit: boolean;
}

export type AttachedFilesType = {
    id: string;
    name: string;
    type: string;
    data: string;
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
}

export type WarehouseType = {
    warehouse: string;
    courierService: string;
    country: string;
}

export type AmazonPrepOrderParamsType = {
    products: AmazonPrepOrderProductType[];
    warehouses: WarehouseType[];
    currencies: string[];
}

// export type PickupPointsType = {
//     address: string;
//     city: string;
//     country: string;
//     description: string;
//     id: string;
//     name: string;
// }

export type AmazonPrepOrderProductWithTotalInfoType = {
    cod: number;
    weightNet: number;
    weightGross: number;
    volume: number;
    currency?: string;
}
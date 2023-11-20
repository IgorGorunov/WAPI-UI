export type OrderType = {
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
    productLines: number,
    products: {
        product: string,
        quantity: number,
    } [],
    troubleStatusesExist: boolean,
    troubleStatuses: {
        period: string,
        status: string,
        troubleStatus: string,
        additionalInfo: string,
    }[],
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
    unfoldBundle: boolean;
    unitOfMeasure: string;
}

export type OrderHistoryType = {
    additionalInfo: string;
    period: string;
    status: string;
    trackingNumber: string;
    troubleStatus: string;
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

export type SingleOrderType = {
    clientOrderID: string;
    codAmount: number;
    codCurrency: string;
    commentCourierService: string;
    commentWarehouse: string;
    courierService: string;
    courierServiceTrackingNumber: string;
    courierServiceTrackingNumberCurrent: string;
    date: string;
    exportReason: string;
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
    selfCollect: boolean;
    status: string;
    statusAdditionalInfo: string;
    trackingLink: string;
    uuid: string;
    wapiTrackingNumber: string;
    warehouse: string;
    products: SingleOrderProductType[];
    statusHistory: OrderHistoryType[];
    services: OrderServiceType[];
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
}

export type WarehouseType = {
    warehouse: string;
    courierService: string;
}

export type OrderParamsType = {
    products: OrderProductType[];
    warehouses: WarehouseType[];
}
import {SEND_COMMENT_TYPES} from "@/types/utility";

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
    productLines: number,
    trackingLink: string,
    productsByString: string,
    statusAdditionalInfo: string,
    lastUpdateDate: string,
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
    unfoldBundle?: boolean;
    unitOfMeasure?: string;
}

export type OrderHistoryType = {
    additionalInfo: string;
    period: string;
    status: string;
    trackingNumber: string;
    troubleStatus: string;
    statusGroup: string;
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
    products: SingleOrderProductType[];
    statusHistory: OrderHistoryType[];
    services: OrderServiceType[];
    attachedFiles: AttachedFilesType[];
    canEdit: boolean;
}

export type AttachedFilesType = {
    id: string;
    name: string;
    type: string;
    data: string;
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

export type WarehouseType = {
    warehouse: string;
    courierService: string;
    country: string;
}

export type OrderParamsType = {
    products: OrderProductType[];
    warehouses: WarehouseType[];
    currencies: string[];
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
        email: string;
        fullName: string;
        phone: string;
    }
    deliveryDate?:{
        date: string;
        hourFrom: string;
        hourTo: string;
    }
}
import {TicketType} from "@/types/tickets";

export type ProductType = {
    selected?: boolean;
    aliases: string;
    barcodes: string;
    dimension: string;
    name: string;
    sku: string;
    uuid: string;
    weight: number;
    status: string,
    stock: {
        warehouse: string,
        total: number,
        damaged: number,
        expired: number,
        undefinedStatus: number,
        withoutBox: number,
        forPlacement: number,
        reserved: number,
        available: number,
    }[]
    notifications: boolean,
}

export type ReservedRowType = {
    document: string;
    reserved: number;
}

export type ProductStockType = {
    tableKey: string,
    name: string;
    sku: string;
    uuid: string;
    warehouse: string,
    warehouseSku: string,
    country: string,
    total: number,
    damaged: number,
    expired: number,
    undefinedStatus: number,
    withoutBox: number,
    forPlacement: number,
    reserved: number,
    available: number,
    volume: number,
    weightGross: number,
    weightNet: number,
    onShipping: number;
    reservedRows: ReservedRowType[];
}

export type ProductParamsType = {
    salesPackingMaterial: string[];
    specialDeliveryOrStorageRequirements: string[];
    typeOfStorage: string[];
    whoProvideExtraPacking: string[];
};

export type UnitOfMeasuresType = {
    height: number;
    length: number;
    name: number;
    coefficient: number;
    volume: number;
    weightGross: number;
    weightNet: number;
    width: number;
}

export type BundleKitType = {
    uuid: string;
    quantity: number;
}

export type AttachedFilesType = {
    id: string;
    name: string;
    type: string;
    data: string;
}

export type StatusHistoryType = {
    date: string;
    status: string;
    comment: string;
}

export type SingleProductType = {
    uuid?: string;
    amazonSku: string;
    barcodes: string[];
    countryOfOrigin: string;
    fireproof: boolean;
    fragile: boolean;
    fullName: string;
    glass: boolean;
    hazmat: boolean;
    hsCode: string;
    liquid: boolean;
    name: string;
    packingBox: boolean;
    purchaseValue: number;
    salesPackingMaterial: string;
    sku: string;
    specialDeliveryOrStorageRequirements: string;
    specialTemperatureControl: string;
    typeOfStorage: string;
    unitOfMeasure: string;
    unitOfMeasures: UnitOfMeasuresType[];
    whoProvideExtraPacking: string;
    aliases: string[];
    status: string;
    bundleKit: BundleKitType[];
    analogues: string[];
    attachedFiles: AttachedFilesType[];
    statusHistory: StatusHistoryType[];
    canEdit: boolean;
    tickets?: TicketType[];
}

export type SingleProductFormType = {
    uuid?: string;
    amazonSku: string;
    barcodes: {
        key: string;
        selected: boolean;
        barcode:string;
    }[];
    countryOfOrigin: string;
    fireproof: boolean;
    fragile: boolean;
    fullName: string;
    glass: boolean;
    hazmat: boolean;
    hsCode: string;
    liquid: boolean;
    name: string;
    packingBox: boolean;
    purchaseValue: number;
    salesPackingMaterial: string;
    sku: string;
    specialDeliveryStorageRequest: string;
    specialTemperatureControl: string;
    typeOfStorage: string;
    unitOfMeasure: string;
    unitOfMeasures: {
        key: string;
        selected: boolean;
        name: string;
        coefficient: string;
        width: string;
        length: string;
        height:  string;
        weightGross: string;
        weightNet: string;
    }[];
    whoProvidesPackagingMaterial: string;
    aliases: {
        key: string;
        selected: boolean;
        alias:string;
    }[];
    //status: string;
    bundleKit: {
        key: string;
        selected: boolean;
        uuid: string;
        quantity: string;
    }[];
    analogues: {
        key: string;
        selected: boolean;
        analogue: string;
    }[];
    //attachedFiles: AttachedFilesType[];
    // statusHistory: StatusHistoryType[];
    // canEdit: boolean;
}
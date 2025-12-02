import {TicketType} from "@/types/tickets";
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";

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
    additionalService?: boolean,
    seller?: string;
    available: number;
}

export type ReservedRowType = {
    document: string;
    reserved: number;
}

export type OnShippingRowType = {
    onshipping: number;
    date: string;
    number: string;
    type: NOTIFICATION_OBJECT_TYPES;
    uid: string;
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
    onShippingRows: OnShippingRowType[];
    seller?: string;
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
    name: string;
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
    withoutMasterCartonData?: boolean;
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
    additionalService?: boolean;
    expiringTerm?: number;
    seller?: string;
};

export type UnitOfMeasureFormType = {
    key: string;
    selected?: boolean;
    isDisabled?: boolean;
    name: string;
    coefficient: number;
    width: number;
    length: number;
    height:  number;
    weightGross: number;
    weightNet: number;
};

export type SingleProductFormType = {
    uuid?: string;
    status?: string;
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
    specialDeliveryOrStorageRequirements: string;
    specialTemperatureControl: string;
    typeOfStorage: string;
    unitOfMeasure: string;
    withoutMasterCartonData?: boolean;
    unitOfMeasures: UnitOfMeasureFormType[];
    whoProvidesPackagingMaterial: string;
    additionalService?: boolean;
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
        quantity: number;
    }[];
    analogues: {
        key: string;
        selected: boolean;
        analogue: string;
    }[];
    expiringTerm?: number;
    seller?: string;
    //attachedFiles: AttachedFilesType[];
    // statusHistory: StatusHistoryType[];
    // canEdit: boolean;
}
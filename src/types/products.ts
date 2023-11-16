export type ProductType = {
    aliases: string;
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
}

export type ProductStockType = {
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
    fileName: string;
    bynaryData: string;
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
}

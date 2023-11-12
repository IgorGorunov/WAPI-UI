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
    volume: number;
    weightGross: number;
    weightNet: number;
    width: number;
}

export type SingleProductType = {
    aliases: string;
    amazonSku: string;
    barcodes: string[];
    boxUnitOfMeasure: string;
    bundle: boolean;
    countryOfOrigin: string;
    fireproof: boolean;
    fragile: boolean;
    fullName: string;
    glass: boolean;
    hazmat: boolean;
    hsCode: string;
    insurance: boolean;
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
    warehouseSku: string;
    whoProvideExtraPacking: string;
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
    volume: number;
    weightGross: number;
    weightNet: number;
    width: number;
}

export type SingleProductType = {
    aliases: string;
    amazonSku: string;
    barcodes: string[];
    boxUnitOfMeasure: string;
    bundle: boolean;
    countryOfOrigin: string;
    fireproof: boolean;
    fragile: boolean;
    fullName: string;
    glass: boolean;
    hazmat: boolean;
    hsCode: string;
    insurance: boolean;
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
    warehouseSku: string;
    whoProvideExtraPacking: string;
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
    volume: number;
    weightGross: number;
    weightNet: number;
    width: number;
}

export type SingleProductType = {
    aliases: string;
    amazonSku: string;
    barcodes: string[];
    boxUnitOfMeasure: string;
    bundle: boolean;
    countryOfOrigin: string;
    fireproof: boolean;
    fragile: boolean;
    fullName: string;
    glass: boolean;
    hazmat: boolean;
    hsCode: string;
    insurance: boolean;
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
    warehouseSku: string;
    whoProvideExtraPacking: string;
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
    volume: number;
    weightGross: number;
    weightNet: number;
    width: number;
}

export type SingleProductType = {
    aliases: string;
    amazonSku: string;
    barcodes: string[];
    boxUnitOfMeasure: string;
    bundle: boolean;
    countryOfOrigin: string;
    fireproof: boolean;
    fragile: boolean;
    fullName: string;
    glass: boolean;
    hazmat: boolean;
    hsCode: string;
    insurance: boolean;
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
    warehouseSku: string;
    whoProvideExtraPacking: string;
}
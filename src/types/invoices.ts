export type InvoiceType = {
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
}
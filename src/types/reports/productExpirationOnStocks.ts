
export enum PRODUCT_EXPIRATION_VARIANTS  {
    WAREHOUSE_PRODUCT = 'Warehouse/Product',
    PRODUCT_WAREHOUSE = 'Product/Warehouse',
}

export type ProductExpirationRowType = {
    product: string;
    sku: string;
    warehouse: string;
    warehouseSku: string;
    country: string;
    available: number;
    quantity: number;
    expiration: number;

    seller?: string;
}


export type ProductExpirationReportType = {
    reportData: ProductExpirationRowType[];
}

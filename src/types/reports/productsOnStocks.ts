
export enum PRODUCTS_ON_STOCKS_VARIANTS  {
    PRODUCT = 'Product',
    WAREHOUSE_PRODUCT = 'Warehouse/Product',
    WAREHOUSE_PRODUCT_DOCUMENT = 'Warehouse/Product/Document',
}

export type ProductOnStockRowType = {
    product: string;
    warehouse: string;
    country: string;
    document: string;
    period: string;
    damagedClosingBalance: number;
    // DamagedExpense: number;
    // DamagedOpeningBalance: number;
    // DamagedReceipt: number;
    expiredClosingBalance: number;
    // ExpiredExpense: number;
    // ExpiredOpeningBalance: number;
    // ExpiredReceipt: number;
    quantityClosingBalance: number;
    quantityExpense: number;
    quantityOpeningBalance: number;
    quantityReceipt: number;
    undefinedStatusClosingBalance: number;
    // UndefinedStatusExpense: number;
    // UndefinedStatusOpeningBalance: number;
    // UndefinedStatusReceipt: number;
    withoutBoxClosingBalance: number;
    // WithoutBoxExpense: number;
    // WithoutBoxOpeningBalance: number;
    // WithoutBoxReceipt: number;
    onShipping: number;

    reserveClosingBalance: number;
    available: number;
}


export type ProductsOnStocksReportType = {
    reportData: ProductOnStockRowType[];
}

export enum REPORT_SALES_VARIANTS  {
    MONTH_COUNTRY_PRODUCT_ORDER = 'Month / receiver country / product / order' ,
    MONTH_PRODUCT_COUNTRY_ORDER = 'Month / product / receiver country / order' ,
    // MONTH_COUNTRY = 'Month / receiver country',
    // MONTH_PRODUCT = 'Month / product',
    WEEK_COUNTRY_PRODUCT_ORDER = 'Week / receiver country / product / order' ,
    WEEK_PRODUCT_COUNTRY_ORDER = 'Week / product / receiver country / order' ,
    // WEEK_COUNTRY = 'Week / receiver country',
    // WEEK_PRODUCT = 'Week / product',
    OFF_COUNTRY_PRODUCT_ORDER = 'Receiver country / product / order' ,
    OFF_PRODUCT_COUNTRY_ORDER = 'Product / receiver country / order' ,
    // OFF_COUNTRY = 'Receiver country',
    // OFF_PRODUCT = '`Product',
}

export enum REPORT_SALES_PERIOD_VARIANTS {
    OFF = 'Off',
    MONTH = 'Month',
    WEEK = 'Week',

}

export enum REPORT_SALES_PARTIAL_VARIANTS {
    COUNTRY_PRODUCT_ORDER = 'Receiver country / product / order' ,
    PRODUCT_COUNTRY_ORDER = 'Product / receiver country /order' ,
    // COUNTRY = 'Receiver country',
    // PRODUCT = 'Product',
}

export type ReportSalesRowType = {
    order: string;
    product: string;
    sku: string;
    wapiTrackingNumber: string;
    receiverCountry: string;
    receiverCountryCode: string;
    warehouse: string;
    price: number;
    currency: string;
    month: string;
    week: string;

    quantity: number;
    orderCount?: string;
}


export type ReportSalesReportType = {
    reportData: ReportSalesRowType[];
}

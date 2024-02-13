
export enum DELIVERY_RATES_VARIANTS  {
    MONTH_COUNTRY_PRODUCT_TYPE = 'Month / receiver country / product type' ,
    MONTH_COUNTRY_PRODUCT = 'Month / receiver country / product' ,
    MONTH_COUNTRY = 'Month / receiver country',
    MONTH_PRODUCT = 'Month / product',
    WEEK_COUNTRY_PRODUCT_TYPE = 'Week / receiver country / product type' ,
    WEEK_COUNTRY_PRODUCT = 'Week / receiver country / product' ,
    WEEK_COUNTRY = 'Week / receiver country',
    WEEK_PRODUCT = 'Week / product',
    OFF_COUNTRY_PRODUCT_TYPE = 'Receiver country / product type' ,
    OFF_COUNTRY_PRODUCT = 'Receiver country / product' ,
    OFF_COUNTRY = 'Receiver country',
    OFF_PRODUCT = 'Product',
}

export enum DELIVERY_RATES_PERIOD_VARIANTS {
    OFF = 'Off',
    MONTH = 'Month',
    WEEK = 'Week',
}

export enum DELIVERY_RATES_PARTIAL_VARIANTS {
    COUNTRY = 'Receiver country',
    PRODUCT = 'Product',
    COUNTRY_PRODUCT_TYPE = 'Receiver country / product type' ,
    COUNTRY_PRODUCT = 'Receiver country / product' ,
}

export type DeliveryRatesRowType = {
    product: string;
    productType: string;
    warehouse: string;
    receiverCountry: string;
    receiverCountryCode: string;
    courierService: string;
    month: string;
    week: string;

    sale: number;

    totalOrders: string;
    totalInTransit: string;
    delivered: string;
    deliveredWithTroubleStatus: string;
    returned: string;
    inTransit: string;
    otherStatuses: string;
}


export type DeliveryRatesReportType = {
    reportData: DeliveryRatesRowType[];
}

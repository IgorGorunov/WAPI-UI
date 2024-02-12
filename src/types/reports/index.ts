import {IconType} from "@/components/Icon";
import {
    ProductOnStockRowType,
    PRODUCTS_ON_STOCKS_VARIANTS,
    ProductsOnStocksReportType
} from "@/types/reports/productsOnStocks";
import {DELIVERY_RATES_VARIANTS, DeliveryRatesReportType, DeliveryRatesRowType} from "@/types/reports/deliveryRates";
import {REPORT_SALES_VARIANTS, ReportSalesReportType, ReportSalesRowType} from "@/types/reports/reportSales";
import {SALE_DYNAMIC_VARIANTS, SaleDynamicReportType, SaleDynamicRowType} from "@/types/reports/saleDynamic";

export * from './productsOnStocks';
export * from './deliveryRates';
export * from './reportSales';
export * from './saleDynamic';

export enum REPORT_TYPES {
    PRODUCTS_ON_STOCKS = 'ProductsOnStocks',
    DELIVERY_RATES = 'DeliveryRate',
    REPORT_SALES = 'ReportSales',
    SALE_DYNAMIC = 'ReportSaleDynamic',
}

export const REPORT_TITLES = {
    [REPORT_TYPES.PRODUCTS_ON_STOCKS]: "Products on Stocks",
    [REPORT_TYPES.DELIVERY_RATES]: "Buyout / delivery rates",
    [REPORT_TYPES.REPORT_SALES]: "Sales report",
    [REPORT_TYPES.SALE_DYNAMIC]: "Sales dynamic report",
}

export type BlockReportsType = {
    reportType: REPORT_TYPES;
    reportPageLink: string;
}

export type ReportsListBlockType = {
    blockTitle: string;
    blockIcon: IconType;
    blockReports: BlockReportsType[];
}

export type ReportParametersType = {
    statuses: string[];
    products: {
        name: string;
        sku: string;
        uuid: string;
    }[];
    warehouses: {
        country: string;
        warehouse: string;
    }[];
    countries: string[];
    courierServices: string[];
    productTypes: string[];
}

export type AllReportsType = ProductsOnStocksReportType | DeliveryRatesReportType | ReportSalesReportType | SaleDynamicReportType ;

export type AllReportsRowType =  ProductOnStockRowType | DeliveryRatesRowType | ReportSalesRowType | SaleDynamicRowType;
export type AllReportsRowArrayType =  ProductOnStockRowType[] | DeliveryRatesRowType[] | ReportSalesRowType[] | SaleDynamicRowType[];

export type AllVariantsType = PRODUCTS_ON_STOCKS_VARIANTS | DELIVERY_RATES_VARIANTS | REPORT_SALES_VARIANTS | SALE_DYNAMIC_VARIANTS;
import {IconType} from "@/components/Icon";
import {
    ProductOnStockRowType,
    PRODUCTS_ON_STOCKS_VARIANTS,
    ProductsOnStocksReportType
} from "@/types/reports/productsOnStocks";
import {DELIVERY_RATES_VARIANTS, DeliveryRatesReportType, DeliveryRatesRowType} from "@/types/reports/deliveryRates";
import {REPORT_SALES_VARIANTS, ReportSalesReportType, ReportSalesRowType} from "@/types/reports/reportSales";
import {SALE_DYNAMIC_VARIANTS, SaleDynamicReportType, SaleDynamicRowType} from "@/types/reports/saleDynamic";
import {CodReportType} from "@/types/codReports";
import {COD_REPORT_VARIANTS, CodReportRowType} from "@/types/reports/codReport";

export * from './productsOnStocks';
export * from './deliveryRates';
export * from './reportSales';
export * from './saleDynamic';
export * from './codReport';

export enum REPORT_TYPES {
    PRODUCTS_ON_STOCKS = 'ProductsOnStocks',
    DELIVERY_RATES = 'DeliveryRate',
    REPORT_SALES = 'ReportSales',
    SALE_DYNAMIC = 'ReportSaleDynamic',
    COD_REPORT = 'ReportCodCheck',
}

export const REPORT_TITLES = {
    [REPORT_TYPES.PRODUCTS_ON_STOCKS]: "Stock movements history",
    [REPORT_TYPES.DELIVERY_RATES]: "Buyout / delivery rates",
    [REPORT_TYPES.REPORT_SALES]: "Sales report",
    [REPORT_TYPES.SALE_DYNAMIC]: "Sales dynamic report",
    [REPORT_TYPES.COD_REPORT]: 'Customer report COD Check',
}

export type BlockReportsType = {
    reportType: REPORT_TYPES;
    reportPageLink: string;
    reportDescription?: string;
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

export type AllReportsType = ProductsOnStocksReportType | DeliveryRatesReportType | ReportSalesReportType | SaleDynamicReportType | CodReportType;

export type AllReportsRowType =  ProductOnStockRowType | DeliveryRatesRowType | ReportSalesRowType | SaleDynamicRowType | CodReportRowType;
export type AllReportsRowArrayType =  ProductOnStockRowType[] | DeliveryRatesRowType[] | ReportSalesRowType[] | SaleDynamicRowType[] | CodReportRowType[];

export type AllVariantsType = PRODUCTS_ON_STOCKS_VARIANTS | DELIVERY_RATES_VARIANTS | REPORT_SALES_VARIANTS | SALE_DYNAMIC_VARIANTS | COD_REPORT_VARIANTS;
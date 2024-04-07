import {
    AllReportsRowArrayType,
    AllVariantsType,
    COD_REPORT_VARIANTS,
    DELIVERY_RATES_PARTIAL_VARIANTS,
    DELIVERY_RATES_VARIANTS,
    PRODUCTS_ON_STOCKS_VARIANTS,
    REPORT_SALES_PARTIAL_VARIANTS,
    REPORT_SALES_VARIANTS,
    REPORT_TYPES,
    SALE_DYNAMIC_VARIANTS
} from "@/types/reports";
import {
    getProductsOnStocksVariantColumns,
    getProductsOnStocksVariantDimensionCols,
    getProductsOnStocksVariantDimensionNumber,
    getProductsOnStocksVariantGroupCols,
    getProductsOnStocksVariantResourceCols,
    getProductsOnStocksVariantSortingCols,
    ProductsOnStocksHeaderNames
} from "./Reports/ProductOnStockes";
import {
    DeliveryRateHeaderNames,
    getDeliveryRateVariantColumns,
    getDeliveryRateVariantDimensionCols,
    getDeliveryRateVariantDimensionNumber,
    getDeliveryRateVariantGroupCols,
    getDeliveryRateVariantResourceCols,
    getDeliveryRateVariantSortingCols
} from "./Reports/DeliveryRates";
import {
    getReportSalesVariantColumns,
    getReportSalesVariantDimensionCols,
    getReportSalesVariantDimensionNumber,
    getReportSalesVariantGroupCols,
    getReportSalesVariantResourceCols,
    getReportSalesVariantSortingCols,
    ReportSalesHeaderNames
} from "@/screens/ReportPage/Reports/ReportSales";
import {
    getSaleDynamicHeaderNames,
    getSaleDynamicVariantColumns,
    getSaleDynamicVariantDimensionCols,
    getSaleDynamicVariantDimensionNumber,
    getSaleDynamicVariantGroupCols,
    getSaleDynamicVariantResourceCols,
    getSaleDynamicVariantSortingCols
} from "@/screens/ReportPage/Reports/SaleDynamic";
import {
    CodReportHeaderNames,
    getCodReportVariantColumns,
    getCodReportVariantDimensionCols,
    getCodReportVariantDimensionNumber,
    getCodReportVariantGroupCols,
    getCodReportVariantResourceCols,
    getCodReportVariantSortingCols
} from "@/screens/ReportPage/Reports/CodReport";


export const getVariantByReportType = (reportType: REPORT_TYPES, variant: string) => {

    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS:
            return PRODUCTS_ON_STOCKS_VARIANTS[variant] as PRODUCTS_ON_STOCKS_VARIANTS;
        case REPORT_TYPES.DELIVERY_RATES:
            return DELIVERY_RATES_VARIANTS[variant] as DELIVERY_RATES_VARIANTS;
        case REPORT_TYPES.REPORT_SALES:
            return REPORT_SALES_VARIANTS[variant] as REPORT_SALES_VARIANTS;
        case REPORT_TYPES.SALE_DYNAMIC:
            return SALE_DYNAMIC_VARIANTS[variant] as SALE_DYNAMIC_VARIANTS;
        case REPORT_TYPES.COD_REPORT:
            return COD_REPORT_VARIANTS[variant] as COD_REPORT_VARIANTS;

        default:
            return null;
    }
}

export const getVariantColumnsByReportType = (reportType: REPORT_TYPES, variant: AllVariantsType, resourceNames: string[]) => {

    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS:
            return getProductsOnStocksVariantColumns(variant as PRODUCTS_ON_STOCKS_VARIANTS);
        case REPORT_TYPES.DELIVERY_RATES:
            return getDeliveryRateVariantColumns(variant as DELIVERY_RATES_VARIANTS);
        case REPORT_TYPES.REPORT_SALES:
            return getReportSalesVariantColumns(variant as REPORT_SALES_VARIANTS);
        case REPORT_TYPES.SALE_DYNAMIC:
            return getSaleDynamicVariantColumns(variant as SALE_DYNAMIC_VARIANTS, resourceNames);
        case REPORT_TYPES.COD_REPORT:
            return getCodReportVariantColumns(variant as COD_REPORT_VARIANTS);

        default:
            return null;
    }
}
export const getVariantOptionsByReportType = (reportType: REPORT_TYPES) => {
    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS :
            return Object.keys(PRODUCTS_ON_STOCKS_VARIANTS).map(item => ({value: item.toString(), label: PRODUCTS_ON_STOCKS_VARIANTS[item],}))
        case REPORT_TYPES.DELIVERY_RATES :
            return Object.keys(DELIVERY_RATES_PARTIAL_VARIANTS).map(item => ({value: item.toString(), label: DELIVERY_RATES_PARTIAL_VARIANTS[item],}))
        case REPORT_TYPES.REPORT_SALES :
            return Object.keys(REPORT_SALES_PARTIAL_VARIANTS).map(item => ({value: item.toString(), label: REPORT_SALES_PARTIAL_VARIANTS[item],}))
        case REPORT_TYPES.SALE_DYNAMIC :
            return Object.keys(SALE_DYNAMIC_VARIANTS).map(item => ({value: item.toString(), label: SALE_DYNAMIC_VARIANTS[item],}))
        case REPORT_TYPES.COD_REPORT:
            return Object.keys(COD_REPORT_VARIANTS).map(item => ({value: item.toString(), label: COD_REPORT_VARIANTS[item],}))

        default:
            return [];
    }
}

export const getVariantDimensionColsByReportType = (reportType: REPORT_TYPES, variant: AllVariantsType) => {
    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS :
            return getProductsOnStocksVariantDimensionCols(variant as PRODUCTS_ON_STOCKS_VARIANTS)
        case REPORT_TYPES.DELIVERY_RATES :
            return getDeliveryRateVariantDimensionCols(variant as DELIVERY_RATES_VARIANTS)
        case REPORT_TYPES.REPORT_SALES :
            return getReportSalesVariantDimensionCols(variant as REPORT_SALES_VARIANTS)
        case REPORT_TYPES.SALE_DYNAMIC :
            return getSaleDynamicVariantDimensionCols(variant as SALE_DYNAMIC_VARIANTS)
        case REPORT_TYPES.COD_REPORT :
            return getCodReportVariantDimensionCols(variant as COD_REPORT_VARIANTS)

        default:
            return [];
    }
}

export const getVariantDimensionNumberByReportType = (reportType: REPORT_TYPES, variant: AllVariantsType) => {
    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS :
            return getProductsOnStocksVariantDimensionNumber(variant as PRODUCTS_ON_STOCKS_VARIANTS);
        case REPORT_TYPES.DELIVERY_RATES :
            return getDeliveryRateVariantDimensionNumber(variant as DELIVERY_RATES_VARIANTS);
        case REPORT_TYPES.REPORT_SALES :
            return getReportSalesVariantDimensionNumber(variant as REPORT_SALES_VARIANTS);
        case REPORT_TYPES.SALE_DYNAMIC :
            return getSaleDynamicVariantDimensionNumber(variant as SALE_DYNAMIC_VARIANTS);
        case REPORT_TYPES.COD_REPORT :
            return getCodReportVariantDimensionNumber(variant as COD_REPORT_VARIANTS);

        default:
            return [];
    }
}

export const getVariantGroupColsByReportType = (reportType: REPORT_TYPES, variant: AllVariantsType) => {
    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS :
            return getProductsOnStocksVariantGroupCols(variant as PRODUCTS_ON_STOCKS_VARIANTS);
        case REPORT_TYPES.DELIVERY_RATES :
            return getDeliveryRateVariantGroupCols(variant as DELIVERY_RATES_VARIANTS);
        case REPORT_TYPES.REPORT_SALES :
            return getReportSalesVariantGroupCols(variant as REPORT_SALES_VARIANTS);
        case REPORT_TYPES.SALE_DYNAMIC:
            return getSaleDynamicVariantGroupCols(variant as SALE_DYNAMIC_VARIANTS);
        case REPORT_TYPES.COD_REPORT:
            return getCodReportVariantGroupCols(variant as COD_REPORT_VARIANTS);

        default:
            return [];
    }
}

export const getVariantResourceColsByReportType = (reportType: REPORT_TYPES, variant: AllVariantsType, arr: AllReportsRowArrayType = []) => {
    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS :
            return getProductsOnStocksVariantResourceCols(variant as PRODUCTS_ON_STOCKS_VARIANTS);
        case REPORT_TYPES.DELIVERY_RATES :
            return getDeliveryRateVariantResourceCols(variant as DELIVERY_RATES_VARIANTS);
        case REPORT_TYPES.REPORT_SALES :
            return getReportSalesVariantResourceCols(variant as REPORT_SALES_VARIANTS);
        case REPORT_TYPES.SALE_DYNAMIC :
            return getSaleDynamicVariantResourceCols(arr, variant as SALE_DYNAMIC_VARIANTS);
        case REPORT_TYPES.COD_REPORT :
            return getCodReportVariantResourceCols(variant as COD_REPORT_VARIANTS);

        default:
            return {sumCols: [], uniqueCols: [], concatenatedCols: []};
    }
}

export const isFilterVisibleByReportType = (reportType: REPORT_TYPES, filterName: string) => {
    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS :
            return ['country', 'warehouse', 'product'].includes(filterName);
        case REPORT_TYPES.DELIVERY_RATES :
            return ['receiverCountry', 'warehouse', 'courierService', 'productType', 'product'].includes(filterName);
        case REPORT_TYPES.REPORT_SALES :
            return ['receiverCountry', 'warehouse', 'product', 'status'].includes(filterName);
        case REPORT_TYPES.SALE_DYNAMIC :
            return ['country'].includes(filterName);
        case REPORT_TYPES.COD_REPORT :
            return ['status'].includes(filterName);

        default:
            return false;
    }
}

export const getVariantSortingColsByReportType = (reportType: REPORT_TYPES, variant: AllVariantsType) => {
    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS :
            return getProductsOnStocksVariantSortingCols(variant as PRODUCTS_ON_STOCKS_VARIANTS);
        case REPORT_TYPES.DELIVERY_RATES :
            return getDeliveryRateVariantSortingCols(variant as DELIVERY_RATES_VARIANTS);
        case REPORT_TYPES.REPORT_SALES :
            return getReportSalesVariantSortingCols(variant as REPORT_SALES_VARIANTS);
        case REPORT_TYPES.SALE_DYNAMIC :
            return getSaleDynamicVariantSortingCols(variant as SALE_DYNAMIC_VARIANTS);
        case REPORT_TYPES.COD_REPORT :
            return getCodReportVariantSortingCols(variant as COD_REPORT_VARIANTS);

        default:
            return [];
    }
}

export const formatNumbers = (num: number) => {
    return num.toLocaleString('en-GB').replace(',', ' ');
}

export const formatPercent = (num: number) => {
    return (Math.round(num*10)/10).toFixed(1);
}

export const getHeaderNameById = (reportType: REPORT_TYPES, headerId: string) => {
    switch (reportType) {
        case REPORT_TYPES.PRODUCTS_ON_STOCKS :
            return ProductsOnStocksHeaderNames[headerId] || '';
        case REPORT_TYPES.DELIVERY_RATES :
            return DeliveryRateHeaderNames[headerId] || '';
        case REPORT_TYPES.REPORT_SALES :
            return ReportSalesHeaderNames[headerId] || '';
        case REPORT_TYPES.SALE_DYNAMIC :
            return getSaleDynamicHeaderNames(headerId) || '';
        case REPORT_TYPES.COD_REPORT :
            return CodReportHeaderNames[headerId] || '';

        default:
            return '';
    }
}


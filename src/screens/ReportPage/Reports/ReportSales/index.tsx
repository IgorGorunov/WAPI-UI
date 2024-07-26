import * as React from "react";
import {REPORT_SALES_VARIANTS, ReportSalesRowType,} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatDateToShowMonthYear, formatDateToWeekRange} from "@/utils/date";
import getSymbolFromCurrency from "currency-symbol-map";
import {formatNumbers} from "@/screens/ReportPage/utils";
import {Tooltip} from "antd";


const resourceColumns = (t) => [
    {
        accessorKey: 'quantity',
        header: () => <Tooltip title={t("ReportSales.quantityHint")} ><span>{t("ReportSales.quantity")}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'wapiTrackingNumber',
        header: ()=> <Tooltip title={t("ReportSales.countHint")} ><span>{t("ReportSales.count")}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'saleEuro',
        header: ()=> <Tooltip title={t("ReportSales.saleEuroHint")} ><span>{t("ReportSales.saleEuro")}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
] as ColumnDef<ReportSalesRowType>[];

const dimensionColumns = (t, tCountries) =>[
    {
        accessorKey: 'receiverCountry',
        id: 'receiverCountry',
        header: () => <Tooltip title={t("ReportSales.receiverCountryHint")} ><span>{t("ReportSales.receiverCountry")}</span></Tooltip>,
        cell: info => <span><span className={`fi fi-${info.row.original.receiverCountryCode ? info.row.original?.receiverCountryCode.toLowerCase() : ''} flag-icon`}></span>{info.row.original.receiverCountryCode ? tCountries(info.row.original?.receiverCountryCode.toLowerCase()) : info.row.original.receiverCountry}</span>,
        aggregationFn: 'count',
        size: 100,
        maxSize: 500,
    },
    {
        accessorKey: 'product',
        header: () => <Tooltip title={t("ReportSales.productHint")} ><span>{t("ReportSales.product")} <span className='product-sku-header'>{t("ReportSales.productSKU")}</span> </span></Tooltip>,
        cell: info => <><span>{`${info.row.original.product}`}</span>{info.row.original.sku ? <span className='product-sku'>{` [${info.row.original.sku}] `}</span> : ''}</>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'order',
        header: () => <Tooltip title={t("ReportSales.orderHint")} ><span>{t("ReportSales.order")}</span></Tooltip>,
        size: 90,
    },
    {
        accessorKey: 'price',
        header: () => <Tooltip title={t("ReportSales.priceHint")} ><span>{t("ReportSales.price")}</span></Tooltip>,
        cell: info => <span className='price-column'><span>{`${info.row.original.price}`}</span><span className='currency'>{`${getSymbolFromCurrency(info.row.original.currency) || ''}`}</span></span>,
        size: 50,
        maxSize: 90,
    },
] as ColumnDef<ReportSalesRowType>[];


export const columns_Month_Country_Product_Order = (t, tCountries) => [
    {
        accessorKey: 'month',
        header: () => <Tooltip title={t("ReportSales.periodMonthHint")}>{t("ReportSales.periodMonth")}</Tooltip> ,
        cell: info => formatDateToShowMonthYear(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
    ...dimensionColumns(t, tCountries),
    ...resourceColumns(t),

] as ColumnDef<ReportSalesRowType>[];

export const columns_Week_Country_Product_Order = (t, tCountries) => [
    {
        accessorKey: 'week',
        header: () => <Tooltip title={t("ReportSales.periodWeekHint")}>{t("ReportSales.periodWeek")}</Tooltip>,
        cell: info => formatDateToWeekRange(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
    ...dimensionColumns(t, tCountries),
    ...resourceColumns(t),
] as ColumnDef<ReportSalesRowType>[];

export const columns_Off_Country_Product_Order = (t, tCountries) => [
    ...dimensionColumns(t, tCountries),
    ...resourceColumns(t),
];

export const getReportSalesVariantColumns = (t: any, tCountries:any, variant: REPORT_SALES_VARIANTS) => {
    switch (variant) {
        case REPORT_SALES_VARIANTS.MONTH_COUNTRY_PRODUCT_ORDER:
            return columns_Month_Country_Product_Order(t, tCountries);
        case REPORT_SALES_VARIANTS.WEEK_COUNTRY_PRODUCT_ORDER:
            return columns_Week_Country_Product_Order(t, tCountries);
        case REPORT_SALES_VARIANTS.OFF_COUNTRY_PRODUCT_ORDER:
            return columns_Off_Country_Product_Order(t, tCountries);
        case REPORT_SALES_VARIANTS.MONTH_PRODUCT_COUNTRY_ORDER:
            return columns_Month_Country_Product_Order(t, tCountries);
        case REPORT_SALES_VARIANTS.WEEK_PRODUCT_COUNTRY_ORDER:
            return columns_Week_Country_Product_Order(t, tCountries);
        case REPORT_SALES_VARIANTS.OFF_PRODUCT_COUNTRY_ORDER:
            return columns_Off_Country_Product_Order(t, tCountries);
        default:
            return columns_Month_Country_Product_Order(t, tCountries);
    }
}

export const getReportSalesVariantGroupCols = (variant: REPORT_SALES_VARIANTS) => {
    switch (variant) {
        case REPORT_SALES_VARIANTS.MONTH_COUNTRY_PRODUCT_ORDER:
            return ['month', 'receiverCountry', 'product'];
        case REPORT_SALES_VARIANTS.WEEK_COUNTRY_PRODUCT_ORDER:
            return ['week', 'receiverCountry', 'product'];
        case REPORT_SALES_VARIANTS.OFF_COUNTRY_PRODUCT_ORDER:
            return ['receiverCountry', 'product'];
        case REPORT_SALES_VARIANTS.MONTH_PRODUCT_COUNTRY_ORDER:
            return  ['month', 'product', 'receiverCountry'];
        case REPORT_SALES_VARIANTS.WEEK_PRODUCT_COUNTRY_ORDER:
            return ['week', 'product', 'receiverCountry'];
        case REPORT_SALES_VARIANTS.OFF_PRODUCT_COUNTRY_ORDER:
            return ['product', 'receiverCountry']
        default:
            return ['week', 'receiverCountry']
    }
}

export const getReportSalesVariantDimensionNumber = (variant: REPORT_SALES_VARIANTS) => {
    switch (variant) {
        case REPORT_SALES_VARIANTS.MONTH_COUNTRY_PRODUCT_ORDER:
            return ['month', 'receiverCountry', 'product', 'order', 'price'];
        case REPORT_SALES_VARIANTS.WEEK_COUNTRY_PRODUCT_ORDER:
            return ['week', 'receiverCountry', 'product', 'order', 'price'];
        case REPORT_SALES_VARIANTS.OFF_COUNTRY_PRODUCT_ORDER:
            return ['receiverCountry', 'product', 'order', 'price'];
        case REPORT_SALES_VARIANTS.MONTH_PRODUCT_COUNTRY_ORDER:
            return ['month','product', 'receiverCountry', 'order', 'price'];
        case REPORT_SALES_VARIANTS.WEEK_PRODUCT_COUNTRY_ORDER:
            return ['week', 'product', 'receiverCountry', 'order', 'price'];
        case REPORT_SALES_VARIANTS.OFF_PRODUCT_COUNTRY_ORDER:
            return ['product', 'receiverCountry', 'order', 'price'];
        default:
            return ['month', 'receiverCountry', 'product', 'order', 'price'];
    }
}

export const getReportSalesVariantDimensionCols = (variant: REPORT_SALES_VARIANTS) => {
    switch (variant) {
        case REPORT_SALES_VARIANTS.MONTH_COUNTRY_PRODUCT_ORDER:
            return ['month', 'receiverCountry', 'receiverCountryCode', 'product', 'sku', 'order', 'price','currency'];
        case REPORT_SALES_VARIANTS.WEEK_COUNTRY_PRODUCT_ORDER:
            return ['week', 'receiverCountry', 'receiverCountryCode', 'product', 'sku', 'order', 'price', 'currency'];
        case REPORT_SALES_VARIANTS.OFF_COUNTRY_PRODUCT_ORDER:
            return ['receiverCountry', 'receiverCountryCode', 'product', 'sku', 'order', 'price', 'currency'];
        case REPORT_SALES_VARIANTS.MONTH_PRODUCT_COUNTRY_ORDER:
            return ['month','product', 'sku', 'receiverCountry', 'receiverCountryCode', 'order', 'price', 'currency'];
        case REPORT_SALES_VARIANTS.WEEK_PRODUCT_COUNTRY_ORDER:
            return ['week', 'product', 'sku', 'receiverCountry', 'receiverCountryCode', 'order', 'price', 'currency'];
        case REPORT_SALES_VARIANTS.OFF_PRODUCT_COUNTRY_ORDER:
            return ['product', 'sku', 'receiverCountry', 'receiverCountryCode', 'order', 'price', 'currency'];
        default:
            return ['month', 'receiverCountry', 'receiverCountryCode', 'product', 'sku', 'order', 'price', 'currency'];
    }
}

export const getReportSalesVariantResourceCols = (variant: REPORT_SALES_VARIANTS) => {
    return {
        sumCols: ['quantity', 'saleEuro'],
        uniqueCols: ['wapiTrackingNumber'],
        concatenatedCols: [],
    }
}

export const getReportSalesVariantSortingCols = (variant: REPORT_SALES_VARIANTS) => {
    switch (variant) {
        case REPORT_SALES_VARIANTS.MONTH_COUNTRY_PRODUCT_ORDER:
            return ['month', 'receiverCountry', 'product', 'order'];
        case REPORT_SALES_VARIANTS.WEEK_COUNTRY_PRODUCT_ORDER:
            return ['week', 'receiverCountry', 'product', 'order'];
        case REPORT_SALES_VARIANTS.OFF_COUNTRY_PRODUCT_ORDER:
            return ['receiverCountry', 'product', 'order'];
        case REPORT_SALES_VARIANTS.MONTH_PRODUCT_COUNTRY_ORDER:
            return ['month','product', 'receiverCountry', 'order'];
        case REPORT_SALES_VARIANTS.WEEK_PRODUCT_COUNTRY_ORDER:
            return ['week', 'product', 'receiverCountry', 'order'];
        case REPORT_SALES_VARIANTS.OFF_PRODUCT_COUNTRY_ORDER:
            return ['product', 'receiverCountry', 'order'];
        default:
            return ['month', 'receiverCountry', 'product', 'order'];
    }
}

export const ReportSalesHeaderNames = {
    'month': "Period - month",
    'week': "Period - week",
    'receiverCountry': "Country",
    'order': "Order",
    'product': "Product name [SKU]",
    'price': "Price",
    'quantity': "Product quantity",
    'wapiTrackingNumber': "Orders count",
    'saleEuro': "Sales (euro)",
}
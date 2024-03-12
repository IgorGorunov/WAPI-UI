import * as React from "react";
import {REPORT_SALES_VARIANTS, ReportSalesRowType,} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatDateToShowMonthYear, formatDateToWeekRange} from "@/utils/date";
import getSymbolFromCurrency from "currency-symbol-map";
import {formatNumbers} from "@/screens/ReportPage/utils";
import {Tooltip} from "antd";


const resourceColumns: ColumnDef<ReportSalesRowType>[] = [
    {
        accessorKey: 'quantity',
        header: () => <Tooltip title="Items sold" ><span>Product quantity</span></Tooltip>,
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
        header: ()=> <Tooltip title="Quantity of orders" ><span>Orders count</span></Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
];

const dimensionColumns: ColumnDef<ReportSalesRowType>[] = [
    {
        accessorKey: 'receiverCountry',
        id: 'receiverCountry',
        header: () => <Tooltip title="Receiver country" ><span>Country</span></Tooltip>,
        cell: info => <span><span className={`fi fi-${info.row.original.receiverCountryCode ? info.row.original?.receiverCountryCode.toLowerCase() : ''} flag-icon`}></span>{info.row.original.receiverCountry}</span>,
        aggregationFn: 'count',
        size: 100,
        maxSize: 500,
    },
    {
        accessorKey: 'product',
        header: () => <Tooltip title="Name of the product + [SKU]" ><span>Product <span className='product-sku-header'>[SKU]</span> </span></Tooltip>,
        cell: info => <><span>{`${info.row.original.product}`}</span>{info.row.original.sku ? <span className='product-sku'>{` [${info.row.original.sku}] `}</span> : ''}</>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'order',
        header: () => <Tooltip title="Wapi tracking number" ><span>Order</span></Tooltip>,
        size: 90,
    },
    {
        accessorKey: 'price',
        header: () => <Tooltip title="Price of one product unit" ><span>Price</span></Tooltip>,
        cell: info => <span className='price-column'><span>{`${info.row.original.price}`}</span><span className='currency'>{`${getSymbolFromCurrency(info.row.original.currency) || ''}`}</span></span>,
        size: 50,
        maxSize: 90,
    },
];


export const columns_Month_Country_Product_Order: ColumnDef<ReportSalesRowType>[] = [
    {
        accessorKey: 'month',
        header: () => <Tooltip title="Period - month">Period - month</Tooltip> ,
        cell: info => formatDateToShowMonthYear(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
    ...dimensionColumns,
    ...resourceColumns,

];

export const columns_Week_Country_Product_Order: ColumnDef<ReportSalesRowType>[] = [
    {
        accessorKey: 'week',
        header: () => <Tooltip title="Period - week">Period - week</Tooltip>,
        cell: info => formatDateToWeekRange(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
    ...dimensionColumns,
    ...resourceColumns,
];

export const columns_Off_Country_Product_Order: ColumnDef<ReportSalesRowType>[] = [
    ...dimensionColumns,
    ...resourceColumns,
];

export const getReportSalesVariantColumns = (variant: REPORT_SALES_VARIANTS) => {
    switch (variant) {
        case REPORT_SALES_VARIANTS.MONTH_COUNTRY_PRODUCT_ORDER:
            return columns_Month_Country_Product_Order;
        case REPORT_SALES_VARIANTS.WEEK_COUNTRY_PRODUCT_ORDER:
            return columns_Week_Country_Product_Order;
        case REPORT_SALES_VARIANTS.OFF_COUNTRY_PRODUCT_ORDER:
            return columns_Off_Country_Product_Order;
        case REPORT_SALES_VARIANTS.MONTH_PRODUCT_COUNTRY_ORDER:
            return columns_Month_Country_Product_Order;
        case REPORT_SALES_VARIANTS.WEEK_PRODUCT_COUNTRY_ORDER:
            return columns_Week_Country_Product_Order;
        case REPORT_SALES_VARIANTS.OFF_PRODUCT_COUNTRY_ORDER:
            return columns_Off_Country_Product_Order;
        default:
            return columns_Month_Country_Product_Order;
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
        sumCols: ['quantity'],
        uniqueCols: ['wapiTrackingNumber'],
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
}
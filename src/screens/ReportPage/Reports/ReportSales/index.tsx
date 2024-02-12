import * as React from "react";
import {REPORT_SALES_VARIANTS, ReportSalesRowType,} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatDateToShowMonthYear, formatDateToWeekRange} from "@/utils/date";
import getSymbolFromCurrency from "currency-symbol-map";


export const columns_Month_Country_Product_Order: ColumnDef<ReportSalesRowType>[] = [
    {
        accessorKey: 'month',
        header: 'Period - month',
        cell: info => formatDateToShowMonthYear(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
    {
        accessorKey: 'receiverCountry',
        id: 'receiverCountry',
        header: () => <span>Country</span>,
        cell: info => <span>{info.row.original.receiverCountry}<span className={`fi fi-${info.row.original.receiverCountryCode ? info.row.original?.receiverCountryCode.toLowerCase() : ''} flag-icon`}></span></span>,
        aggregationFn: 'count',
        size: 100,
        maxSize: 500,
    },
    {
        accessorKey: 'product',
        header: 'Product [SKU]',
        cell: info => <><span>{`${info.row.original.product}`}</span>{info.row.original.sku ? <span className='product-sku'>{` [${info.row.original.sku}] `}</span> : ''}</>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'order',
        header: 'Order',
        size: 90,
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: info => <><span>{`${info.row.original.price}`}</span><span className='currency'>{`${getSymbolFromCurrency(info.row.original.currency) || ''}`}</span></>,
        size: 50,
        maxSize: 90,
    },
    {
        accessorKey: 'quantity',
        header: () => <span>Quantity</span>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        //enableSorting: false,
        // aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
    },
    {
        accessorKey: 'wapiTrackingNumber',
        header: 'Orders count',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },

];

export const columns_Week_Country_Product_Order: ColumnDef<ReportSalesRowType>[] = [
    {
        accessorKey: 'week',
        header: 'Period - week',
        cell: info => formatDateToWeekRange(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
    {
        accessorKey: 'receiverCountry',
        id: 'receiverCountry',
        header: () => <span>Country</span>,
        cell: info => <span>{info.row.original.receiverCountry}<span className={`fi fi-${info.row.original.receiverCountryCode ? info.row.original?.receiverCountryCode.toLowerCase() : ''} flag-icon`}></span></span>,
        aggregationFn: 'count',
        size: 100,
        maxSize: 500,
    },
    {
        accessorKey: 'product',
        header: 'Product [SKU]',
        cell: info => <><span>{`${info.row.original.product}`}</span>{info.row.original.sku ? <span className='product-sku'>{` [${info.row.original.sku}] `}</span> : ''}</>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'order',
        header: 'Order',
        size: 90,
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: info => <><span>{`${info.row.original.price}`}</span><span className='currency'>{`${getSymbolFromCurrency(info.row.original.currency) || ''}`}</span></>,
        size: 50,
        maxSize: 90,
    },
    {
        accessorKey: 'quantity',
        header: () => <span>Product quantity</span>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        //enableSorting: false,
        // aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
    },
    {
        accessorKey: 'wapiTrackingNumber',
        header: 'Orders count',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
];

export const columns_Off_Country_Product_Order: ColumnDef<ReportSalesRowType>[] = [
    {
        accessorKey: 'receiverCountry',
        id: 'receiverCountry',
        header: () => <span>Country</span>,
        cell: info => <span>{info.row.original.receiverCountry}<span className={`fi fi-${info.row.original.receiverCountryCode ? info.row.original?.receiverCountryCode.toLowerCase() : ''} flag-icon`}></span></span>,
        aggregationFn: 'count',
        size: 100,
        maxSize: 500,
    },
    {
        accessorKey: 'product',
        header: 'Product [SKU]',
        cell: info => <><span>{`${info.row.original.product}`}</span>{info.row.original.sku ? <span className='product-sku'>{` [${info.row.original.sku}] `}</span> : ''}</>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'order',
        header: 'Order',
        size: 90,
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: info => <><span>{`${info.row.original.price}`}</span><span className='currency'>{`${getSymbolFromCurrency(info.row.original.currency) || ''}`}</span></>,
        size: 50,
        maxSize: 90,
    },
    {
        accessorKey: 'quantity',
        header: () => <span>Quantity</span>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        //enableSorting: false,
        // aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
    },
    {
        accessorKey: 'wapiTrackingNumber',
        header: 'Orders count',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
];

export const getReportSalesVariantColumns = (variant: REPORT_SALES_VARIANTS) => {
    console.log('check columns variant:', variant, typeof variant)
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
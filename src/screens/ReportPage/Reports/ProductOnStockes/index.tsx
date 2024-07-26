import * as React from "react";
import {ProductOnStockRowType, PRODUCTS_ON_STOCKS_VARIANTS} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";
import {formatNumbers} from "@/screens/ReportPage/utils";
import {Tooltip} from "antd";


const resourceColumns = (t) => [
    {
        accessorKey: 'quantityOpeningBalance',
        header: () => <Tooltip title={t('ProductsOnStocks.quantityOpeningBalanceHint')} ><span>{t('ProductsOnStocks.quantityOpeningBalance')}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'quantityExpense',
        header: ()=><Tooltip title={t('ProductsOnStocks.quantityExpenseHint')} ><span>{t('ProductsOnStocks.quantityExpense')}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'quantityReceipt',
        header: ()=><Tooltip title={t('ProductsOnStocks.quantityReceiptHint')} ><span>{t('ProductsOnStocks.quantityReceipt')}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'quantityClosingBalance',
        header: () => <Tooltip title={t('ProductsOnStocks.quantityClosingBalanceHint')}>{t('ProductsOnStocks.quantityClosingBalance')}</Tooltip>,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({getValue}) =>
            formatNumbers(Math.round(getValue<number>() * 100) / 100),
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'damagedClosingBalance',
        header: () => <Tooltip title={t('ProductsOnStocks.damagedClosingBalanceHint')}>{t('ProductsOnStocks.damagedClosingBalance')}</Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'expiredClosingBalance',
        header: () => <Tooltip title={t('ProductsOnStocks.expiredClosingBalanceHint')}>{t('ProductsOnStocks.expiredClosingBalance')}</Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    // {
    //     accessorKey: 'undefinedStatusClosingBalance',
    //     header: () => 'Undefined Status',
    //     aggregationFn: 'sum',
    //     size: 70,
    //     maxSize: 400,
    //     cell: ({getValue }) =>
    //         formatNumbers(getValue<number>()),
    //     aggregatedCell: ({ getValue }) =>
    //         formatNumbers(getValue<number>()),
    // },
    // {
    //     accessorKey: 'withoutBoxClosingBalance',
    //     header: () => 'Without Box',
    //     aggregationFn: 'sum',
    //     size: 70,
    //     maxSize: 400,
    //     cell: ({getValue }) =>
    //         formatNumbers(getValue<number>()),
    //     aggregatedCell: ({ getValue }) =>
    //         formatNumbers(getValue<number>()),
    // },
    {
        accessorKey: 'onShipping',
        header: ()=><Tooltip title={t('ProductsOnStocks.onShippingHint')} ><span>{t('ProductsOnStocks.onShipping')}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'reserveClosingBalance',
        header: () => <Tooltip title={t('ProductsOnStocks.reserveClosingBalanceHint')} ><span>{t('ProductsOnStocks.reserveClosingBalance')}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'available',
        header: () => <Tooltip title={t('ProductsOnStocks.availableHint')} ><span>{t('ProductsOnStocks.available')}</span></Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(Math.round(getValue<number>() * 100) / 100),
    },
] as ColumnDef<ProductOnStockRowType>[];

const warehouseColumn = (t) => [
    {
        accessorKey: 'warehouse',
        id: 'warehouse',
        header: () => <Tooltip title={t('ProductsOnStocks.warehouseHint')}> <span>{t('ProductsOnStocks.warehouse')}</span></Tooltip>,
        cell: info => <span><span className={`fi fi-${info.row.original?.country ? info.row.original?.country.toLowerCase() : ''} flag-icon`}></span>{info.row.original.warehouse}</span>,

        aggregationFn: 'count',
        size: 110,
        minSize: 100,
        maxSize: 500,
    },
] as ColumnDef<ProductOnStockRowType>[];

const productColumn = (t, width: number) => [
    {

        accessorKey: 'product',
        header: () => <Tooltip title={t('ProductsOnStocks.productHint')}>{t('ProductsOnStocks.product')}</Tooltip>,
        cell: info => info.getValue(),
        /**
         * override the value used for row grouping
         * (otherwise, defaults to the value derived from accessorKey / accessorFn)
         */
        //getGroupingValue: row => `${row.Product} ${row.Warehouse}`,
        aggregationFn: 'count',
        size: width,
        maxSize: 1800,

    } as ColumnDef<ProductOnStockRowType>,
]

const documentColumns = (t) => [
    {
        accessorKey: 'document',
        header: () => <Tooltip title={t("ProductsOnStocks.documentHint")}>{t("ProductsOnStocks.document")}</Tooltip>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'period',
        header: () => <Tooltip title={t("ProductsOnStocks.periodHint")}>{t("ProductsOnStocks.period")}</Tooltip>,
        cell: info => <span>{formatDateTimeToStringWithDotWithoutSeconds(info.row.original?.period)}</span>,
        size: 80,
        minSize: 80,
        maxSize: 500,
    },
] as ColumnDef<ProductOnStockRowType>[];

export const columns_Warehouse_Product_Doc = (t) => [
    ...productColumn(t,90),
    ...warehouseColumn(t),
    ...documentColumns(t),
    ...resourceColumns(t),
] as ColumnDef<ProductOnStockRowType>[];

export const columns_Warehouse_Product = (t) => [
    ...productColumn(t,120),
    ...warehouseColumn(t),
    ...resourceColumns(t),
] as ColumnDef<ProductOnStockRowType>[];

export const columns_Product = (t) => [
    ...productColumn(t,230),
    ...resourceColumns(t),
] as ColumnDef<ProductOnStockRowType>[];

export const getProductsOnStocksVariantColumns = (t: any, variant: PRODUCTS_ON_STOCKS_VARIANTS) => {
    switch (variant) {
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT_DOCUMENT:
            return columns_Warehouse_Product_Doc(t);
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT:
            return columns_Warehouse_Product(t);
        case PRODUCTS_ON_STOCKS_VARIANTS.PRODUCT:
            return columns_Product(t);
        default:
            return columns_Warehouse_Product_Doc(t);
    }
}

export const getProductsOnStocksVariantGroupCols = (variant: PRODUCTS_ON_STOCKS_VARIANTS) => {
    switch (variant) {
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT_DOCUMENT:
            return ['warehouse', 'product'];
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT:
            return ['warehouse'];
        case PRODUCTS_ON_STOCKS_VARIANTS.PRODUCT:
            return [];
        default:
            return ['warehouse', 'product'];
    }
}

export const getProductsOnStocksVariantDimensionNumber = (variant: PRODUCTS_ON_STOCKS_VARIANTS) => {
    switch (variant) {
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT_DOCUMENT:
            return ['warehouse', 'product', 'period','document'];
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT:
            return ['warehouse', 'product'];
        case PRODUCTS_ON_STOCKS_VARIANTS.PRODUCT:
            return ['product'];
        default:
            return ['warehouse', 'product', 'document'];
    }
}

export const getProductsOnStocksVariantDimensionCols = (variant: PRODUCTS_ON_STOCKS_VARIANTS) => {
    switch (variant) {
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT_DOCUMENT:
            return ['warehouse', 'product', 'period','document', 'country'];
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT:
            return ['warehouse', 'product', 'country'];
        case PRODUCTS_ON_STOCKS_VARIANTS.PRODUCT:
            return ['product'];
        default:
            return ['warehouse', 'product', 'document'];
    }
}

export const getProductsOnStocksVariantResourceCols = (variant: PRODUCTS_ON_STOCKS_VARIANTS) => {
    return {
        sumCols: ['damagedClosingBalance', 'expiredClosingBalance', 'quantityClosingBalance', 'quantityExpense', 'quantityOpeningBalance', 'quantityReceipt',
            'undefinedStatusClosingBalance', 'withoutBoxClosingBalance', 'reserveClosingBalance','onShipping', 'available'],
        uniqueCols: [],
        concatenatedCols: [],
    }
}

export const getProductsOnStocksVariantSortingCols = (variant: PRODUCTS_ON_STOCKS_VARIANTS) => {
    switch (variant) {
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT_DOCUMENT:
            return ['warehouse', 'product', 'period'];
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT:
            return ['warehouse', 'product'];
        case PRODUCTS_ON_STOCKS_VARIANTS.PRODUCT:
            return ['product'];
        default:
            return ['warehouse', 'product', 'period'];
    }
}


export const ProductsOnStocksHeaderNames = {
    'warehouse': "Warehouse",
    'product': "Product",
    'document': "Document",
    'period': "Period",
    'quantityOpeningBalance': "Opening balance",
    'quantityExpense': "Expense",
    'quantityReceipt': "Receipt",
    'quantityClosingBalance': "Closing balance",
    'damagedClosingBalance': "Damaged",
    'expiredClosingBalance': "Expired",
    'onShipping': "On shipping",
    'reserveClosingBalance': "Reserve",
    'available': "Available",
}

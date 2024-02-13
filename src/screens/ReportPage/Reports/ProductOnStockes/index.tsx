import * as React from "react";
import {ProductOnStockRowType, PRODUCTS_ON_STOCKS_VARIANTS} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatDateTimeToStringWithDot} from "@/utils/date";
import {formatNumbers} from "@/screens/ReportPage/utils";


const resourceColumns: ColumnDef<ProductOnStockRowType>[] = [
    {
        header: 'Quantity',
        columns: [
            {
                accessorKey: 'quantityOpeningBalance',
                header: () => <span>Opening Balance</span>,
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
                header: 'Receipt',
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
                header: 'Expense',
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
                header: () => 'Closing Balance',
                cell: ({getValue }) =>
                    formatNumbers(getValue<number>()),
                aggregatedCell: ({getValue}) =>
                    formatNumbers(Math.round(getValue<number>() * 100) / 100),
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
            },
        ],
    },
    {
        accessorKey: 'damagedClosingBalance',
        header: () => 'Damaged',
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
        header: () => 'Expired',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'undefinedStatusClosingBalance',
        header: () => 'Undefined Status',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'withoutBoxClosingBalance',
        header: () => 'Without Box',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'onShipping',
        header: () => 'On shipping',
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
        header: () => 'Reserve',
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
        header: () => 'Available',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(Math.round(getValue<number>() * 100) / 100),
    },
];

const warehouseColumn: ColumnDef<ProductOnStockRowType>[] = [
    {
        accessorKey: 'warehouse',
        id: 'warehouse',
        header: () => <span>Warehouse</span>,
        cell: info => <span><span className={`fi fi-${info.row.original?.country ? info.row.original?.country.toLowerCase() : ''} flag-icon`}></span>{info.row.original.warehouse}</span>,

        aggregationFn: 'count',
        size: 110,
        minSize: 100,
        maxSize: 500,
    },
];

const productColumn = (width: number) => [
    {

        accessorKey: 'product',
        header: 'Product',
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

const documentColumns: ColumnDef<ProductOnStockRowType>[] = [
    {
        accessorKey: 'document',
        header: 'Document',
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'period',
        header: 'Period',
        cell: info => <span>{formatDateTimeToStringWithDot(info.row.original?.period)}</span>,
        size: 70,
        maxSize: 500,
    },
]

export const columns_Warehouse_Product_Doc: ColumnDef<ProductOnStockRowType>[] = [
    ...productColumn(80),
    ...warehouseColumn,
    ...documentColumns,
    ...resourceColumns,
];

export const columns_Warehouse_Product: ColumnDef<ProductOnStockRowType>[] = [
    ...productColumn(120),
    ...warehouseColumn,
    ...resourceColumns,
];

export const columns_Product: ColumnDef<ProductOnStockRowType>[] = [
    ...productColumn(230),
    ...resourceColumns,
];

export const getProductsOnStocksVariantColumns = (variant: PRODUCTS_ON_STOCKS_VARIANTS) => {
    console.log('check: ', variant, variant === PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT_DOCUMENT)
    switch (variant) {
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT_DOCUMENT:
            return columns_Warehouse_Product_Doc;
        case PRODUCTS_ON_STOCKS_VARIANTS.WAREHOUSE_PRODUCT:
            return columns_Warehouse_Product;
        case PRODUCTS_ON_STOCKS_VARIANTS.PRODUCT:
            return columns_Product;
        default:
            return columns_Warehouse_Product_Doc;
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


export type ProductOnStocksFilters = {
    country: string[];
    warehouse: string[];
    product: string[];
}
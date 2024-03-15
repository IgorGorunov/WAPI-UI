import * as React from "react";
import {ProductOnStockRowType, PRODUCTS_ON_STOCKS_VARIANTS} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";
import {formatNumbers} from "@/screens/ReportPage/utils";
import {Tooltip} from "antd";


const resourceColumns: ColumnDef<ProductOnStockRowType>[] = [

    {
        accessorKey: 'quantityOpeningBalance',
        header: () => <Tooltip title="Opening Balance" ><span>Opening Balance</span></Tooltip>,
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
        header: ()=><Tooltip title="Outbound" ><span>Expense</span></Tooltip>,
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
        header: ()=><Tooltip title="Inbound" ><span>Receipt</span></Tooltip>,
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
        header: () => <Tooltip title='Closing Balance'>Closing Balance</Tooltip>,
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
        header: () => <Tooltip title='Quantity of damaged products'>Damaged</Tooltip>,
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
        header: () => <Tooltip title='Quantity of expired products'>Expired</Tooltip>,
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
        header: ()=><Tooltip title="In stock movements" ><span>On shipping</span></Tooltip>,
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
        header: () => <Tooltip title="For orders and stock movements" ><span>Reserve</span></Tooltip>,
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
        header: () => <Tooltip title="For sale" ><span>Available</span></Tooltip>,
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
        header: () => <Tooltip title='Warehouse'> <span>Warehouse</span></Tooltip>,
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
        header: () => <Tooltip title='Name of product'>Product</Tooltip>,
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
        header: () => <Tooltip title='Movement document'>Document</Tooltip>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'period',
        header: () => <Tooltip title="Document's date">Period</Tooltip>,
        cell: info => <span>{formatDateTimeToStringWithDotWithoutSeconds(info.row.original?.period)}</span>,
        size: 80,
        minSize: 80,
        maxSize: 500,
    },
]

export const columns_Warehouse_Product_Doc: ColumnDef<ProductOnStockRowType>[] = [
    ...productColumn(90),
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

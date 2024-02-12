import * as React from "react";
import {ProductOnStockRowType, PRODUCTS_ON_STOCKS_VARIANTS} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatDateTimeToStringWithDot} from "@/utils/date";


// export const columns: ColumnDef<ProductOnStockRowType>[] =  [
// export const columns_Warehouse_Product_Doc: ColumnDef<ProductOnStockRowType>[] = [
export const columns_Warehouse_Product_Doc: ColumnDef<ProductOnStockRowType>[] = [
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
            size: 80,
            maxSize: 500,
        },

        {
            accessorKey: 'warehouse',
            id: 'warehouse',
            header: () => <span>Warehouse</span>,
            cell: info => <span>{info.row.original.warehouse}<span className={`fi fi-${info.row.original?.country ? info.row.original?.country.toLowerCase() : ''} flag-icon`}></span></span>,


            aggregationFn: 'count',
            size: 100,
            maxSize: 500,
        },
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
            size: 80,
            maxSize: 500,
        },
        {
            header: 'Quantity',
            columns: [
                {
                    accessorKey: 'quantityOpeningBalance',
                    header: () => <span>Opening Balance</span>,
                    aggregationFn: 'sum',
                    size: 70,
                    maxSize: 400,
                    //enableSorting: false,
                    // aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
                },
                {
                    accessorKey: 'quantityReceipt',
                    header: 'Receipt',
                    // cell: ({ getValue }) =>
                    //     Math.round(getValue<number>() * 100) / 100 + '%',
                    aggregationFn: 'sum',
                    size: 70,
                    maxSize: 400,
                    // aggregatedCell: ({ getValue }) =>
                    //     Math.round(getValue<number>() * 100) / 100 + '%',
                },
                {
                    accessorKey: 'quantityExpense',
                    header: 'Expense',
                    aggregationFn: 'sum',
                    size: 70,
                    maxSize: 400,
                },
                {
                    accessorKey: 'quantityClosingBalance',
                    header: () => 'Closing Balance',
                    aggregatedCell: ({getValue}) =>
                        Math.round(getValue<number>() * 100) / 100,
                    aggregationFn: 'sum',
                    size: 70,
                    maxSize: 400,
                },
            ],
        },
        {
            accessorKey: 'damagedClosingBalance',
            header: () => 'Damaged',
            // aggregatedCell: ({ getValue }) =>
            //     Math.round(getValue<number>() * 100) / 100,
            aggregationFn: 'sum',
            size: 70,
            maxSize: 400,
        },
        {
            accessorKey: 'expiredClosingBalance',
            header: () => 'Expired',
            // aggregatedCell: ({ getValue }) =>
            //     Math.round(getValue<number>() * 100) / 100,
            aggregationFn: 'sum',
            size: 70,
            maxSize: 400,
        },
        {
            accessorKey: 'undefinedStatusClosingBalance',
            header: () => 'Undefined Status',
            // aggregatedCell: ({ getValue }) =>
            //     Math.round(getValue<number>() * 100) / 100,
            aggregationFn: 'sum',
            size: 70,
            maxSize: 400,
        },
        {
            accessorKey: 'withoutBoxClosingBalance',
            header: () => 'Without Box',
            // aggregatedCell: ({ getValue }) =>
            //     Math.round(getValue<number>() * 100) / 100,
            aggregationFn: 'sum',
            size: 70,
            maxSize: 400,
        },
        {
            accessorKey: 'onShipping',
            header: () => 'On shipping',
            // aggregatedCell: ({ getValue }) =>
            //     Math.round(getValue<number>() * 100) / 100,
            aggregationFn: 'sum',
            size: 70,
            maxSize: 400,
        },
        {
            accessorKey: 'reserveClosingBalance',
            header: () => 'Reserve',
            // aggregatedCell: ({ getValue }) =>
            //     Math.round(getValue<number>() * 100) / 100,
            aggregationFn: 'sum',
            size: 70,
            maxSize: 400,
        },
        {
            accessorKey: 'available',
            header: () => 'Available',
            aggregatedCell: ({getValue}) =>
                Math.round(getValue<number>() * 100) / 100,
            aggregationFn: 'sum',
            size: 70,
            maxSize: 400,
        },
    ];

export const columns_Warehouse_Product: ColumnDef<ProductOnStockRowType>[] = [
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
                size: 120,
                maxSize: 800,
            },

            {
                accessorKey: 'warehouse',
                id: 'warehouse',
                header: () => <span>Warehouse</span>,
                cell: info => <span>{info.row.original.warehouse}<span className={`fi fi-${info.row.original?.country ? info.row.original?.country.toLowerCase() : ''} flag-icon`}></span></span>,

                aggregationFn: 'count',

                size: 100,
                maxSize: 800,
            },

    {
        header: 'Quantity',
        columns: [
            {
                accessorKey: 'quantityOpeningBalance',
                header: () => <span>Opening Balance</span>,
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
                //enableSorting: false,
                // aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
            },
            {
                accessorKey: 'quantityReceipt',
                header: 'Receipt',
                // cell: ({ getValue }) =>
                //     Math.round(getValue<number>() * 100) / 100 + '%',
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
                // aggregatedCell: ({ getValue }) =>
                //     Math.round(getValue<number>() * 100) / 100 + '%',
            },
            {
                accessorKey: 'quantityExpense',
                header: 'Expense',
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
            },
            {
                accessorKey: 'quantityClosingBalance',
                header: () => 'Closing Balance',
                aggregatedCell: ({getValue}) =>
                    Math.round(getValue<number>() * 100) / 100,
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
            },
        ],
    },
    {
        accessorKey: 'damagedClosingBalance',
        header: () => 'Damaged',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'expiredClosingBalance',
        header: () => 'Expired',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'undefinedStatusClosingBalance',
        header: () => 'Undefined Status',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'withoutBoxClosingBalance',
        header: () => 'Without Box',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'onShipping',
        header: () => 'On shipping',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'reserveClosingBalance',
        header: () => 'Reserve',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'available',
        header: () => 'Available',
        aggregatedCell: ({getValue}) =>
            Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
];

export const columns_Product: ColumnDef<ProductOnStockRowType>[] = [
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
        size: 230,
        maxSize: 1800,

    },
    {
        header: 'Quantity',
        columns: [
            {
                accessorKey: 'quantityOpeningBalance',
                header: () => <span>Opening Balance</span>,
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
                //enableSorting: false,
                // aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
            },
            {
                accessorKey: 'quantityReceipt',
                header: 'Receipt',
                // cell: ({ getValue }) =>
                //     Math.round(getValue<number>() * 100) / 100 + '%',
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
                // aggregatedCell: ({ getValue }) =>
                //     Math.round(getValue<number>() * 100) / 100 + '%',
            },
            {
                accessorKey: 'quantityExpense',
                header: 'Expense',
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
            },
            {
                accessorKey: 'quantityClosingBalance',
                header: () => 'Closing Balance',
                aggregatedCell: ({getValue}) =>
                    Math.round(getValue<number>() * 100) / 100,
                aggregationFn: 'sum',
                size: 70,
                maxSize: 400,
            },
        ],
    },
    {
        accessorKey: 'damagedClosingBalance',
        header: () => 'Damaged',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'expiredClosingBalance',
        header: () => 'Expired',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'undefinedStatusClosingBalance',
        header: () => 'Undefined Status',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'withoutBoxClosingBalance',
        header: () => 'Without Box',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'onShipping',
        header: () => 'On shipping',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'reserveClosingBalance',
        header: () => 'Reserve',
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'available',
        header: () => 'Available',
        aggregatedCell: ({getValue}) =>
            Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
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

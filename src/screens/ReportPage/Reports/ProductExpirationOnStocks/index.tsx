import * as React from "react";
import {PRODUCT_EXPIRATION_VARIANTS, ProductExpirationRowType} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatNumbers} from "@/screens/ReportPage/utils";
import {Tooltip} from "antd";
import {formatExpirationDate} from "@/utils/date";


const resourceColumns: ColumnDef<ProductExpirationRowType>[] = [

    {
        accessorKey: 'quantity',
        header: () => <Tooltip title="Quantity" ><span>Quantity</span></Tooltip>,
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
        header: ()=><Tooltip title="Available" ><span>Available</span></Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },

];

const warehouseColumn: ColumnDef<ProductExpirationRowType>[] = [
    {
        accessorKey: 'warehouse',
        id: 'warehouse',
        header: () => <Tooltip title='Warehouse'> <span >Warehouse</span></Tooltip>,
        cell: info => <span className={'text-bold'}><span className={`fi fi-${info.row.original?.country ? info.row.original?.country.toLowerCase() : ''} flag-icon`}></span>{info.row.original.warehouse}</span>,

        aggregationFn: 'count',
        size: 50,
        minSize: 50,
        maxSize: 50,
    },
];

const productColumn = (width: number) => [
    {

        accessorKey: 'product',
        header: () => <Tooltip title='Name of product'>Product</Tooltip>,
        cell: info => <span><span className={'text-bold'}>{info.row.original.product}</span></span>,
        // cell: info => <span><span>{info.row.original.product}</span><span className={'text-bold'} style={{marginLeft: '16px'}}>[sku: {info.row.original?.sku}]</span></span>,
        /**
         * override the value used for row grouping
         * (otherwise, defaults to the value derived from accessorKey / accessorFn)
         */
        //getGroupingValue: row => `${row.Product} ${row.Warehouse}`,
        aggregationFn: 'count',
        size: 50,
        maxSize: 50,

    } as ColumnDef<ProductExpirationRowType>,
];

const batchColumn: ColumnDef<ProductExpirationRowType>[] = [
    {
        accessorKey: 'batch',
        header: () => <Tooltip title="Batch"><span>Batch</span></Tooltip>,
        size: 100,
        maxSize: 400,
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return val && val.trim() ? val : '-';
        },
        aggregatedCell: ({ getValue }) => "",
    },
];

const expirationColumn: ColumnDef<ProductExpirationRowType>[] = [
    {
        accessorKey: 'expiration',
        header: ()=><Tooltip title="Expiration date" ><span>Expiration date</span></Tooltip>,
        // aggregationFn: 'none',
        size: 120,
        maxSize: 1800,
        cell: ({getValue }) =>
            formatExpirationDate(getValue<string>()),
        aggregatedCell: ({ getValue }) =>
            "",
    },
]


export const columns_Warehouse_Product: ColumnDef<ProductExpirationRowType>[] = [
    ...warehouseColumn,
    ...productColumn(80),
    ...batchColumn,
    ...expirationColumn,
    ...resourceColumns,
];

export const columns_Product_Warehouse: ColumnDef<ProductExpirationRowType>[] = [
    ...productColumn(80),
    ...warehouseColumn,
    ...batchColumn,
    ...expirationColumn,
    ...resourceColumns,
];

export const getProductExpirationVariantColumns = (variant: PRODUCT_EXPIRATION_VARIANTS) => {
    switch (variant) {
        case PRODUCT_EXPIRATION_VARIANTS.WAREHOUSE_PRODUCT:
            return columns_Warehouse_Product;
        case PRODUCT_EXPIRATION_VARIANTS.PRODUCT_WAREHOUSE:
            return columns_Product_Warehouse;
        default:
            return columns_Warehouse_Product;
    }
}

export const getProductExpirationVariantGroupCols = (variant: PRODUCT_EXPIRATION_VARIANTS) => {
    switch (variant) {
        case PRODUCT_EXPIRATION_VARIANTS.WAREHOUSE_PRODUCT:
            return ['warehouse', 'product'];
        case PRODUCT_EXPIRATION_VARIANTS.PRODUCT_WAREHOUSE:
            return ['product', 'warehouse'];

        default:
            return ['warehouse'];
    }
}

export const getProductExpirationVariantDimensionNumber = (variant: PRODUCT_EXPIRATION_VARIANTS) => {
    switch (variant) {
        case PRODUCT_EXPIRATION_VARIANTS.WAREHOUSE_PRODUCT:
            return ['warehouse', 'product', 'batch', 'expiration'];
        case PRODUCT_EXPIRATION_VARIANTS.PRODUCT_WAREHOUSE:
            return ['product', 'warehouse', 'batch', 'expiration'];

        default:
            return ['warehouse', 'product', 'batch', 'expiration'];
    }
}

export const getProductExpirationVariantDimensionCols = (variant: PRODUCT_EXPIRATION_VARIANTS) => {
    switch (variant) {
        case PRODUCT_EXPIRATION_VARIANTS.WAREHOUSE_PRODUCT:
            return ['warehouse', 'product','country', 'batch', 'expiration', 'sku'];
        case PRODUCT_EXPIRATION_VARIANTS.PRODUCT_WAREHOUSE:
            return ['product','warehouse', 'country', 'batch', 'expiration', 'sku'];

        default:
            return ['warehouse', 'product', 'country', 'batch', 'expiration', 'sku'];
    }
}

export const getProductExpirationVariantResourceCols = (variant: PRODUCT_EXPIRATION_VARIANTS) => {
    return {
        sumCols: ['quantity', 'available'],
        uniqueCols: [],
        concatenatedCols: [],
    }
}

export const getProductExpirationVariantSortingCols = (variant: PRODUCT_EXPIRATION_VARIANTS) => {
    switch (variant) {
        case PRODUCT_EXPIRATION_VARIANTS.WAREHOUSE_PRODUCT:
            return ['warehouse', 'product', 'batch', 'expiration'];
        case PRODUCT_EXPIRATION_VARIANTS.PRODUCT_WAREHOUSE:
            return ['product', 'warehouse', 'batch', 'expiration'];

        default:
            return ['warehouse', 'product', 'batch', 'expiration'];
    }
}


export const ProductExpirationHeaderNames = {
    'warehouse': "Warehouse",
    'product': "Product",
    'batch': "Batch",
    'expiration': "Expiration date",
    'quantity': "Quantity",
    'available': "Available",
}

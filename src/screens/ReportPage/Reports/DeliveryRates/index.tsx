import * as React from "react";
import {DELIVERY_RATES_VARIANTS, DeliveryRatesRowType,} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {Tooltip} from "antd";
import {formatDateToShowMonthYear, formatDateToWeekRange} from "@/utils/date";


const resourceColumns: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'totalOrders',
        header: () => <Tooltip title="All orders received" >
            <span>Total</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        //enableSorting: false,
        // aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
    },
    {
        accessorKey: 'totalInTransit',
        header: () => <Tooltip title="Orders ever been in transit" >
            <span>Total in transit</span>
        </Tooltip>,
        // cell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100 + '%',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100 + '%',
    },
    {
        accessorKey: 'delivered',
        header: () => <Tooltip title="Delivered to final customer" >
            <span>Delivered</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'deliveredWithTroubleStatus',
        header: 'test',
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'deliveredWithFirstAttempt',
        header: () => <Tooltip title="Delivered without trouble status" >
            <span>Delivered with first attempt</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
        cell: ({ row, getValue }) =>
            row.getValue<number>('delivered') - row.getValue<number>('deliveredWithTroubleStatus'),
        aggregatedCell: ({ row }) =>
            row.getValue<number>('delivered') - row.getValue<number>('deliveredWithTroubleStatus'),
    },
    {
        accessorKey: 'inTransit',
        header: () => <Tooltip title="Orders currently in transit" >
            <span>In transit</span>
        </Tooltip>,
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'returned',
        header: () => <Tooltip title="Already confirmed by warehouse" >
            <span>Returned to sender</span>
        </Tooltip>,
        // aggregatedCell: ({getValue}) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'otherStatuses',
        header: () => <Tooltip title="All except InTransit, Delivered, Returning, Returned" >
            <span>Other statuses</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,
    },
    {
        accessorKey: 'sale',
        header: () => <Tooltip title="Average cheque amount" >
            <span>Average sale</span>
        </Tooltip>,
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,

        cell: ({ row, getValue }) =>
            Math.round(getValue<number>() / row.getValue<number>('totalOrders') * 100) / 100,
        // Math.round(getValue<number>()  * 100) / 100,
        aggregatedCell: ({ getValue }) =>
            Math.round(getValue<number>() * 100) / 100,
    },
    {
        accessorKey: 'buyout',
        header: () => <Tooltip title="Percentage of delivered among orders ever been in transit" >
            <span>Buyout</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,

        cell: ({ row, getValue }) =>
            row.getValue<number>('totalInTransit')===0 ? '0%' : Math.round(row.getValue<number>('delivered') / row.getValue<number>('totalInTransit') * 10000) / 100+'%',
        // Math.round(getValue<number>()  * 100) / 100,
        aggregatedCell: ({ row, getValue }) =>
            row.getValue<number>('totalInTransit')===0 ? '0%' : Math.round(row.getValue<number>('delivered') / row.getValue<number>('totalInTransit') * 10000) / 100+'%',
    },
    {
        accessorKey: 'probableBuyout',
        header: () => <Tooltip title="If all transit orders delivered" >
            <span>Probably buyout</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 70,
        maxSize: 400,

        cell: ({ row }) =>
            row.getValue<number>('totalInTransit')===0 ? '0%' : Math.round((row.getValue<number>('delivered')+row.getValue<number>('inTransit'))/ row.getValue<number>('totalInTransit') * 10000) / 100+'%',
        // Math.round(getValue<number>()  * 100) / 100,
        aggregatedCell: ({ row, getValue }) =>
            row.getValue<number>('totalInTransit')===0 ? '0%' : Math.round((row.getValue<number>('delivered')+row.getValue<number>('inTransit')) / row.getValue<number>('totalInTransit') * 10000) / 100+'%',
    },
];

const monthColumn: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'month',
        header: 'Period - month',
        cell: info => formatDateToShowMonthYear(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
];

const weekColumn: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'week',
        header: 'Period - week',
        cell: info => formatDateToWeekRange(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
];

const receiverCountryColumn: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'receiverCountry',
        id: 'receiverCountry',
        header: () => <span>Country</span>,
        cell: info => <span><span className={`fi fi-${info.row.original.receiverCountryCode ? info.row.original?.receiverCountryCode.toLowerCase() : ''} flag-icon`}></span>{info.row.original.receiverCountry}</span>,
        aggregationFn: 'count',
        size: 100,
        maxSize: 500,
    },
]

const productTypeColumn: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'productType',
        header: 'Product type',
        size: 90,
        maxSize: 500,
    } as ColumnDef<DeliveryRatesRowType>,
];

const productColumn = (width: number) => [
    {
        accessorKey: 'product',
        header: 'Product',
        size: width,
        maxSize: 500,
    } as ColumnDef<DeliveryRatesRowType>,
];


export const getDeliveryRateVariantByString = (variant: string, extraInfo: string) => {
    const fullVariantName = extraInfo+'_'+variant;
    return DELIVERY_RATES_VARIANTS[fullVariantName];
}

export const getDeliveryRateVariantColumns = (variant: DELIVERY_RATES_VARIANTS) => {
console.log('check columns variant:', variant, typeof variant)
    switch (variant) {
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT_TYPE:
            return [...monthColumn, ...receiverCountryColumn, ...productTypeColumn, ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY:
            return [...monthColumn, ...receiverCountryColumn, ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT:
            return [...monthColumn, ...receiverCountryColumn, ...productColumn(90), ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.MONTH_PRODUCT:
            return [...monthColumn, ...productColumn(140), ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT_TYPE:
            return [...weekColumn, ...receiverCountryColumn, ...productTypeColumn, ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY:
            return [...weekColumn, ...receiverCountryColumn, ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT:
            return [...weekColumn, ...receiverCountryColumn, ...productColumn(90), ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.WEEK_PRODUCT:
            return [...weekColumn, ...productColumn(140), ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT_TYPE:
            return [...receiverCountryColumn, ...productTypeColumn, ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY:
            return [...receiverCountryColumn, ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT:
            return [...receiverCountryColumn, ...productColumn(90), ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.OFF_PRODUCT:
            return [...productColumn(140), ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];

        default:
            return [...monthColumn, ...receiverCountryColumn, ...productTypeColumn, ...resourceColumns] as ColumnDef<DeliveryRatesRowType>[];
    }
}

export const getDeliveryRateVariantGroupCols = (variant: DELIVERY_RATES_VARIANTS) => {
    switch (variant) {
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT_TYPE:
            return ['month', 'receiverCountry'];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY:
            return ['month'];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT:
            return ['month', 'receiverCountry'];
        case DELIVERY_RATES_VARIANTS.MONTH_PRODUCT:
            return ['month'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT_TYPE:
            return ['week', 'receiverCountry'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY:
            return ['week']
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT:
            return ['week', 'receiverCountry']
        case DELIVERY_RATES_VARIANTS.WEEK_PRODUCT:
            return ['week']
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT_TYPE:
            return ['receiverCountry'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY:
            return []
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT:
            return ['receiverCountry']
        case DELIVERY_RATES_VARIANTS.OFF_PRODUCT:
            return []
        default:
            return ['month', 'receiverCountry']
    }
}

export const getDeliveryRateVariantDimensionNumber = (variant: DELIVERY_RATES_VARIANTS) => {
    switch (variant) {
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT_TYPE:
            return ['month', 'receiverCountry', 'productType'];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY:
            return ['month', 'receiverCountry'];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT:
            return ['month', 'receiverCountry', 'product'];
        case DELIVERY_RATES_VARIANTS.MONTH_PRODUCT:
            return ['month', 'product'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT_TYPE:
            return ['week', 'receiverCountry', 'productType'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY:
            return ['week', 'receiverCountry'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT:
            return ['week', 'receiverCountry', 'product'];
        case DELIVERY_RATES_VARIANTS.WEEK_PRODUCT:
            return ['week', 'product'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT_TYPE:
            return ['receiverCountry', 'productType'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY:
            return ['receiverCountry'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT:
            return ['receiverCountry', 'product'];
        case DELIVERY_RATES_VARIANTS.OFF_PRODUCT:
            return ['product'];

        default:
            return ['month', 'receiverCountry', 'productType'];
    }
}

export const getDeliveryRateVariantDimensionCols = (variant: DELIVERY_RATES_VARIANTS) => {
    switch (variant) {
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT_TYPE:
            return ['month', 'receiverCountry', 'receiverCountryCode', 'productType'];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY:
            return ['month', 'receiverCountry', 'receiverCountryCode'];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT:
            return ['month', 'receiverCountry', 'receiverCountryCode', 'product'];
        case DELIVERY_RATES_VARIANTS.MONTH_PRODUCT:
            return ['month', 'product'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT_TYPE:
            return ['week', 'receiverCountry', 'receiverCountryCode', 'productType'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY:
            return ['week', 'receiverCountry', 'receiverCountryCode'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT:
            return ['week', 'receiverCountry', 'receiverCountryCode', 'product'];
        case DELIVERY_RATES_VARIANTS.WEEK_PRODUCT:
            return ['week', 'product'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT_TYPE:
            return ['receiverCountry', 'receiverCountryCode', 'productType'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY:
            return ['receiverCountry', 'receiverCountryCode'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT:
            return ['receiverCountry', 'receiverCountryCode', 'product'];
        case DELIVERY_RATES_VARIANTS.OFF_PRODUCT:
            return ['product'];

        default:
            return ['month', 'receiverCountry', 'productType'];
    }
}

export const getDeliveryRateVariantResourceCols = (variant: DELIVERY_RATES_VARIANTS) => {
    return {
        sumCols: ['sale'],
        uniqueCols: ['totalOrders','totalInTransit','delivered','returned', 'inTransit', 'otherStatuses', 'deliveredWithTroubleStatus'],
    }
}

export const getDeliveryRateVariantSortingCols = (variant: DELIVERY_RATES_VARIANTS) => {
    switch (variant) {
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT_TYPE:
            return ['month', 'receiverCountry', 'productType'];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY:
            return ['month', 'receiverCountry'];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT:
            return ['month', 'receiverCountry', 'product'];
        case DELIVERY_RATES_VARIANTS.MONTH_PRODUCT:
            return ['month', 'product'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT_TYPE:
            return ['week', 'receiverCountry', 'productType'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY:
            return ['week', 'receiverCountry'];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT:
            return ['week', 'receiverCountry', 'product'];
        case DELIVERY_RATES_VARIANTS.WEEK_PRODUCT:
            return ['week', 'product'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT_TYPE:
            return ['receiverCountry', 'productType'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY:
            return ['receiverCountry'];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT:
            return ['receiverCountry', 'product'];
        case DELIVERY_RATES_VARIANTS.OFF_PRODUCT:
            return ['product'];

        default:
            return ['month', 'receiverCountry', 'productType'];
    }
}
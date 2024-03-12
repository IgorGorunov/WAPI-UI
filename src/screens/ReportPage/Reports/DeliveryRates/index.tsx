import * as React from "react";
import {DELIVERY_RATES_VARIANTS, DeliveryRatesRowType,} from "@/types/reports";
import {ColumnDef, Row} from "@tanstack/react-table";
import {Tooltip} from "antd";
import {formatDateToShowMonthYear, formatDateToWeekRange} from "@/utils/date";
import {formatNumbers, formatPercent} from "@/screens/ReportPage/utils";

export const getDeliveredWithFirstAttemptValue = (row: Row<DeliveryRatesRowType>) => {
    return row.getValue<number>('delivered') - row.getValue<number>('deliveredWithTroubleStatus');
}

export const getAverageSaleValue = (row: Row<DeliveryRatesRowType>) => {
    return row.getValue<number>('totalOrders') === 0 ? 0 : Math.round(row.getValue<number>('sale') / row.getValue<number>('totalOrders') * 100) / 100;
}

export const getBuyoutValue = (row: Row<DeliveryRatesRowType>) => {
    return row.getValue<number>('totalInTransit')===0 ? '0%' : formatPercent(row.getValue<number>('delivered') / row.getValue<number>('totalInTransit') * 100)+'%';
}

export const getProbableBuyoutValue = (row:Row<DeliveryRatesRowType>) => {
    return row.getValue<number>('totalInTransit')===0 ? '0.0%' : formatPercent((row.getValue<number>('delivered')+row.getValue<number>('inTransit')) / row.getValue<number>('totalInTransit')*100)+'%';
}

const resourceColumns: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'totalOrders',
        header: () => <Tooltip title="All orders received" >
            <span>Total</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 75,
        maxSize: 400,

        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'totalInTransit',
        header: () => <Tooltip title="Orders ever been in transit" >
            <span>Total in transit</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 75,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'delivered',
        header: () => <Tooltip title="Delivered to the final customer" >
            <span>Delivered</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 75,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'deliveredWithTroubleStatus',
        header: 'test',
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'deliveredWithFirstAttempt',
        header: () => <Tooltip title="Delivered without trouble status" >
            <span>Delivered with first attempt</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({ row }) =>
            formatNumbers( getDeliveredWithFirstAttemptValue(row)),
        aggregatedCell: ({ row }) =>
            formatNumbers( getDeliveredWithFirstAttemptValue(row)),
    },
    {
        accessorKey: 'inTransit',
        header: () => <Tooltip title="Orders currently in transit" >
            <span>In transit</span>
        </Tooltip>,
        // aggregatedCell: ({ getValue }) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'returned',
        header: () => <Tooltip title="Returns already confirmed by warehouse" >
            <span>Returned to sender</span>
        </Tooltip>,
        // aggregatedCell: ({getValue}) =>
        //     Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'otherStatuses',
        header: () => <Tooltip title="All orders except InTransit, Delivered, Returning, Returned" >
            <span>Other statuses</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'sale',
        header: () => <Tooltip title="Average cheque amount" >
            <span>Average sale (EUR)</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,

        cell: ({ row }) =>
            getAverageSaleValue(row).toFixed(2),
        // Math.round(getValue<number>()  * 100) / 100,
        aggregatedCell: ({ row }) =>
            //(Math.round(getValue<number>() * 100) / 100).toFixed(2),
            getAverageSaleValue(row).toFixed(2),
    },
    {
        accessorKey: 'buyout',
        header: () => <Tooltip title="Percentage of delivered orders among orders ever been in transit" >
            <span>Buyout</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,

        cell: ({ row }) =>
            getBuyoutValue(row),
        // Math.round(getValue<number>()  * 100) / 100,
        aggregatedCell: ({ row }) =>
            getBuyoutValue(row),
    },
    {
        accessorKey: 'probableBuyout',
        header: () => <Tooltip title="Buyout if all transit orders will be delivered" >
            <span>Expected buyout</span>
        </Tooltip>,
        aggregationFn: 'sum',
        size: 80,
        maxSize: 400,

        cell: ({ row }) =>
            getProbableBuyoutValue(row),
            // row.getValue<number>('totalInTransit')===0 ? '0.0%' : Math.round((row.getValue<number>('delivered')+row.getValue<number>('inTransit'))/ row.getValue<number>('totalInTransit') * 10000) / 100+'%',
        // Math.round(getValue<number>()  * 100) / 100,
        aggregatedCell: ({ row }) =>
            getProbableBuyoutValue(row),
    },
];

const monthColumn: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'month',
        header: () => <Tooltip title="Period - month">Period - month</Tooltip>,
        cell: info => formatDateToShowMonthYear(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
];

const weekColumn: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'week',
        header: () => <Tooltip title="Period - week">Period - week</Tooltip>,
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
        header: () => <Tooltip title="Receiver country" ><span>Country</span></Tooltip>,
        cell: info => <span><span className={`fi fi-${info.row.original.receiverCountryCode ? info.row.original?.receiverCountryCode.toLowerCase() : ''} flag-icon`}></span>{info.row.original.receiverCountry}</span>,
        aggregationFn: 'count',
        size: 110,
        maxSize: 500,
    },
]

const productTypeColumn: ColumnDef<DeliveryRatesRowType>[] = [
    {
        accessorKey: 'productType',
        header: () => <Tooltip title="Name of the product type" >Product type</Tooltip>,
        size: 110,
        minSize: 100,
        maxSize: 500,
    } as ColumnDef<DeliveryRatesRowType>,
];

const productColumn = (width: number) => [
    {
        accessorKey: 'product',
        header: () => <Tooltip title="Name of the product" >Product</Tooltip>,
        size: width,
        maxSize: 500,
    } as ColumnDef<DeliveryRatesRowType>,
];


export const getDeliveryRateVariantByString = (variant: string, extraInfo: string) => {
    const fullVariantName = extraInfo+'_'+variant;
    return DELIVERY_RATES_VARIANTS[fullVariantName];
}

export const getDeliveryRateVariantColumns = (variant: DELIVERY_RATES_VARIANTS) => {
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

export const DeliveryRateHeaderNames = {
    'month': "Period - month",
    'week': "Period - week",
    'receiverCountry': "Country",
    'productType': "Product type",
    'product': "Product",
    'totalOrders': "Total",
    'totalInTransit': "Total in transit",
    'delivered': "Delivered",
    'deliveredWithTroubleStatus': "Delivered with trouble status",
    'deliveredWithFirstAttempt': "Delivered with first attempt",
    'inTransit': "In transit",
    'returned': "Returned to sender",
    'otherStatuses': "Other statuses",
    'sale': "Average sale (EUR)",
    'buyout': "Buyout",
    'probableBuyout': "Expected buyout",
}
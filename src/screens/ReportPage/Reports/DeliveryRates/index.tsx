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

const resourceColumns = (t: any) => [
    {
        accessorKey: 'totalOrders',
        header: () => <Tooltip title={t('DeliveryRate.totalOrdersHint')} >
            <span>{t('DeliveryRate.totalOrders')}</span>
        </Tooltip>,
        //@ts-ignore
        aggregationFn: 'aggUnique',
        size: 75,
        maxSize: 400,

        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),

    },
    {
        accessorKey: 'totalInTransit',
        header: () => <Tooltip title={t('DeliveryRate.totalInTransitHint')} >
            <span>{t('DeliveryRate.totalInTransit')}</span>
        </Tooltip>,
        //@ts-ignore
        aggregationFn: 'aggUnique',
        size: 75,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'delivered',
        header: () => <Tooltip title={t('DeliveryRate.deliveredHint')} >
            <span>{t('DeliveryRate.delivered')}</span>
        </Tooltip>,
        //aggregationFn: 'sum',
        //@ts-ignore
        aggregationFn: 'aggUnique',
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
        //aggregationFn: 'sum',
        //@ts-ignore
        aggregationFn: 'aggUnique',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'deliveredWithFirstAttempt',
        header: () => <Tooltip title={t('DeliveryRate.deliveredWithFirstAttemptHint')} >
            <span>{t('DeliveryRate.deliveredWithFirstAttempt')}</span>
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
        header: () => <Tooltip title={t('DeliveryRate.inTransitHint')} >
            <span>{t('DeliveryRate.inTransit')}</span>
        </Tooltip>,
        //@ts-ignore
        aggregationFn: 'aggUnique',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'returned',
        header: () => <Tooltip title={t('DeliveryRate.returnedHint')} >
            <span>{t('DeliveryRate.returned')}</span>
        </Tooltip>,
        //@ts-ignore
        aggregationFn: 'aggUnique',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'otherStatuses',
        header: () => <Tooltip title={t('DeliveryRate.otherStatusesHint')} >
            <span>{t('DeliveryRate.otherStatuses')}</span>
        </Tooltip>,
        //aggregationFn: 'sum',
        //@ts-ignore
        aggregationFn: 'aggUnique',
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            formatNumbers(getValue<number>()),
        aggregatedCell: ({ getValue }) =>
            formatNumbers(getValue<number>()),
    },
    {
        accessorKey: 'sale',
        header: () => <Tooltip title={t('DeliveryRate.averageSaleEurHint')} >
            <span>{t('DeliveryRate.averageSaleEur')}</span>
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
        header: () => <Tooltip title={t('DeliveryRate.buyoutHint')} >
            <span>{t('DeliveryRate.buyout')}</span>
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
        header: () => <Tooltip title={t('DeliveryRate.expectedBuyoutHint')} >
            <span>{t('DeliveryRate.expectedBuyout')}</span>
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
] as ColumnDef<DeliveryRatesRowType>[];

const monthColumn = (t) => [
    {
        accessorKey: 'month',
        header: () => <Tooltip title={t('DeliveryRate.periodMonthHint')}>{t('DeliveryRate.periodMonth')}</Tooltip>,
        cell: info => formatDateToShowMonthYear(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
] as ColumnDef<DeliveryRatesRowType>[];

const weekColumn = (t) => [
    {
        accessorKey: 'week',
        header: () => <Tooltip title={t('DeliveryRate.periodWeekHint')}>{t('DeliveryRate.periodWeek')}</Tooltip>,
        cell: info => formatDateToWeekRange(info.getValue() as string),
        aggregationFn: 'count',
        size: 80,
        maxSize: 500,
    },
] as ColumnDef<DeliveryRatesRowType>[];

const receiverCountryColumn = (t:any, tCountries: any) => [
    {
        accessorKey: 'receiverCountry',
        id: 'receiverCountry',
        header: () => <Tooltip title={t('DeliveryRate.countryHint')} ><span>{t('DeliveryRate.country')}</span></Tooltip>,
        cell: info => <span><span className={`fi fi-${info.row.original.receiverCountryCode ? info.row.original?.receiverCountryCode.toLowerCase() : ''} flag-icon`}></span>{info.row.original.receiverCountryCode ? tCountries(info.row.original?.receiverCountryCode.toLowerCase()) : info.row.original.receiverCountry}</span>,
        aggregationFn: 'count',
        size: 110,
        maxSize: 500,
    },
] as ColumnDef<DeliveryRatesRowType>[];

const productTypeColumn = (t) => [
    {
        accessorKey: 'productType',
        header: () => <Tooltip title={t('DeliveryRate.productTypeHint')} >{t('DeliveryRate.productType')}</Tooltip>,
        size: 110,
        minSize: 100,
        maxSize: 500,
    } as ColumnDef<DeliveryRatesRowType>,
] as ColumnDef<DeliveryRatesRowType>[];

const productColumn = (t, width: number) => [
    {
        accessorKey: 'product',
        header: () => <Tooltip title={t('DeliveryRate.productHint')} >{t('DeliveryRate.product')}</Tooltip>,
        size: width,
        maxSize: 500,
    } as ColumnDef<DeliveryRatesRowType>,
];


export const getDeliveryRateVariantByString = (variant: string, extraInfo: string) => {
    const fullVariantName = extraInfo+'_'+variant;
    return DELIVERY_RATES_VARIANTS[fullVariantName];
}

export const getDeliveryRateVariantColumns = (t: any, tCountries: any, variant: DELIVERY_RATES_VARIANTS) => {
    switch (variant) {
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT_TYPE:
            return [...monthColumn(t), ...receiverCountryColumn(t, tCountries), ...productTypeColumn(t), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY:
            return [...monthColumn(t), ...receiverCountryColumn(t, tCountries), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.MONTH_COUNTRY_PRODUCT:
            return [...monthColumn(t), ...receiverCountryColumn(t, tCountries), ...productColumn(t,90), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.MONTH_PRODUCT:
            return [...monthColumn(t), ...productColumn(t,140), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT_TYPE:
            return [...weekColumn(t), ...receiverCountryColumn(t, tCountries), ...productTypeColumn(t), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY:
            return [...weekColumn(t), ...receiverCountryColumn(t, tCountries), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.WEEK_COUNTRY_PRODUCT:
            return [...weekColumn(t), ...receiverCountryColumn(t, tCountries), ...productColumn(t,90), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.WEEK_PRODUCT:
            return [...weekColumn(t), ...productColumn(t,140), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT_TYPE:
            return [...receiverCountryColumn(t, tCountries), ...productTypeColumn(t), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY:
            return [...receiverCountryColumn(t, tCountries), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.OFF_COUNTRY_PRODUCT:
            return [...receiverCountryColumn(t, tCountries), ...productColumn(t,90), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
        case DELIVERY_RATES_VARIANTS.OFF_PRODUCT:
            return [...productColumn(t,140), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];

        default:
            return [...monthColumn(t), ...receiverCountryColumn(t, tCountries), ...productTypeColumn(t), ...resourceColumns(t)] as ColumnDef<DeliveryRatesRowType>[];
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
        concatenatedCols: ['totalOrders','totalInTransit','delivered','returned', 'inTransit', 'otherStatuses', 'deliveredWithTroubleStatus'],
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
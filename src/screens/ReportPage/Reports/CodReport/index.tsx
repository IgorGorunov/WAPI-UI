import * as React from "react";
import {COD_REPORT_VARIANTS, CodReportRowType,} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatNumbers} from "@/screens/ReportPage/utils";
import {formatDateStringToDisplayString} from "@/utils/date";
import {Tooltip} from "antd";


const resourceColumns = (t: any) => [
    {
        accessorKey: 'codAmount',
        header: () => <Tooltip title={t('ReportCodCheck.totalCodHint')} ><span>{t('ReportCodCheck.totalCod')}</span></Tooltip>,
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            <span className='centered-cell'>{formatNumbers(getValue<number>())}</span>,

    },
    {
        accessorKey: 'reported',
        header: () => <Tooltip title={t('ReportCodCheck.codReportedHint')} ><span>{t('ReportCodCheck.codReported')}</span></Tooltip>,
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            <span className='centered-cell'>{formatNumbers(getValue<number>())}</span>,
    },
    {
        accessorKey: 'codBalance',
        header: () => <Tooltip title={t('ReportCodCheck.codBalanceHint')} ><span>{t('ReportCodCheck.codBalance')}</span></Tooltip>,
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            <span className='centered-cell'>{formatNumbers(getValue<number>())}</span>,
    },

] as  ColumnDef<CodReportRowType>[];

const documentColumns = (t: any) => [
    {
        accessorKey: 'order',
        header: () => <Tooltip title={t('ReportCodCheck.orderHint')}>{t('ReportCodCheck.order')}</Tooltip> ,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'status',
        header: () => <Tooltip title={t('ReportCodCheck.orderStatusHint')}>{t('ReportCodCheck.orderStatus')}</Tooltip>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'codReport',
        header: () => <Tooltip title={t('ReportCodCheck.codReportHint')}>{t('ReportCodCheck.codReport')}</Tooltip>,
        size: 80,
        maxSize: 500,
    },
    {
        accessorKey: 'deliveryDate',
        header: () => <Tooltip title={t('ReportCodCheck.deliveryDate')}>{t('ReportCodCheck.deliveryDate')}</Tooltip>,
        size: 70,
        maxSize: 500,
        cell: ({getValue }) => getValue<string>() ? formatDateStringToDisplayString(getValue<string>()) : '',
    },
    {
        accessorKey: 'currency',
        header: () => <Tooltip title={t('ReportCodCheck.currencyHint')}>{t('ReportCodCheck.currency')}</Tooltip>,
        size: 70,
        maxSize: 500,
        cell: ({getValue }) =><span className='centered-cell'>{getValue<string>()}</span>,
    },
] as ColumnDef<CodReportRowType>[]

export const columns_VARIANT = (t) => [
    ...documentColumns(t),
    ...resourceColumns(t),
] as ColumnDef<CodReportRowType>[];


export const getCodReportVariantColumns = (t: any, variant: COD_REPORT_VARIANTS) => {

    switch (variant) {
        case COD_REPORT_VARIANTS.OFF:
            return columns_VARIANT(t);
        case COD_REPORT_VARIANTS.COD_REPORT:
            return columns_VARIANT(t);

        default:
            return [];
    }
}

export const getCodReportVariantGroupCols = (variant: COD_REPORT_VARIANTS) => {
    switch (variant) {
        case COD_REPORT_VARIANTS.OFF:
            return [];
        case COD_REPORT_VARIANTS.COD_REPORT:
            return ['codReport'];

        default:
            return [];
    }
}

export const getCodReportVariantDimensionNumber = (variant: COD_REPORT_VARIANTS) => {
    switch (variant) {
        case COD_REPORT_VARIANTS.OFF:
            return ['order', 'status','codReport', 'deliveryDate', 'currency','codAmount', 'codBalance', 'reported'];
        case COD_REPORT_VARIANTS.COD_REPORT:
            return ['order', 'status','codReport', 'deliveryDate', 'currency','codAmount', 'codBalance', 'reported'];

        default:
            return [];
    }
}

export const getCodReportVariantDimensionCols = (variant: COD_REPORT_VARIANTS) => {
    switch (variant) {
        case COD_REPORT_VARIANTS.OFF:
            return ['order', 'status','codReport', 'deliveryDate', 'currency', 'codAmount', 'codBalance', 'reported'];
        case COD_REPORT_VARIANTS.COD_REPORT:
            return ['order', 'status','codReport', 'deliveryDate', 'currency', 'codAmount', 'codBalance', 'reported'];

        default:
            return [];
    }
}

export const getCodReportVariantResourceCols = (variant: COD_REPORT_VARIANTS) => {
    return {
        sumCols: [],
        uniqueCols: [],
        concatenatedCols: [],
    }
}

export const getCodReportVariantSortingCols = (variant: COD_REPORT_VARIANTS) => {
    switch (variant) {
        case COD_REPORT_VARIANTS.OFF:
            return ['order', 'status','codReport', 'deliveryDate'];
        case COD_REPORT_VARIANTS.COD_REPORT:
            return ['order', 'status','codReport', 'deliveryDate'];

        default:
            return [];
    }
}

export const CodReportHeaderNames = {
    'order': "Order",
    'status': "Order status",
    'codReport': "COD report",
    'deliveryDate': "Delivery date",
    'currency': "Currency",
    'codAmount': "Total COD amount",
    'reported': "COD reported",
    'codBalance': "COD balance",
}





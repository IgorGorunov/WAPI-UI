import * as React from "react";
import {COD_REPORT_VARIANTS, CodReportRowType,} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import {formatNumbers} from "@/screens/ReportPage/utils";
import {formatDateStringToDisplayString} from "@/utils/date";
import {Tooltip} from "antd";


const resourceColumns: ColumnDef<CodReportRowType>[] = [
    {
        accessorKey: 'codAmount',
        header: () => <Tooltip title="Means all COD for selected orders" ><span>Total COD amount</span></Tooltip>,
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            <span className='centered-cell'>{formatNumbers(getValue<number>())}</span>,

    },
    {
        accessorKey: 'reported',
        header: () => <Tooltip title="COD amount reported for payment to customer" ><span>COD reported</span></Tooltip>,
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            <span className='centered-cell'>{formatNumbers(getValue<number>())}</span>,
    },
    {
        accessorKey: 'codBalance',
        header: () => <Tooltip title="Expected COD for orders in transit" ><span>COD balance</span></Tooltip>,
        size: 80,
        maxSize: 400,
        cell: ({getValue }) =>
            <span className='centered-cell'>{formatNumbers(getValue<number>())}</span>,
    },

];

const documentColumns: ColumnDef<CodReportRowType>[] = [
    {
        accessorKey: 'order',
        header: () => <Tooltip title="Wapi tracking number">Order</Tooltip> ,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'status',
        header: () => <Tooltip title="Order status">Order status</Tooltip>,
        size: 90,
        maxSize: 500,
    },
    {
        accessorKey: 'codReport',
        header: () => <Tooltip title="COD report name">COD report</Tooltip>,
        size: 80,
        maxSize: 500,
    },
    {
        accessorKey: 'deliveryDate',
        header: () => <Tooltip title="Delivery date">Delivery date</Tooltip>,
        size: 70,
        maxSize: 500,
        cell: ({getValue }) => getValue<string>() ? formatDateStringToDisplayString(getValue<string>()) : '',
    },
    {
        accessorKey: 'currency',
        header: () => <Tooltip title="COD currency">Currency</Tooltip>,
        size: 70,
        maxSize: 500,
        cell: ({getValue }) =><span className='centered-cell'>{getValue<string>()}</span>,
    },
]

export const columns_VARIANT: ColumnDef<CodReportRowType>[] = [
    ...documentColumns,
    ...resourceColumns,
];


export const getCodReportVariantColumns = (variant: COD_REPORT_VARIANTS) => {

    switch (variant) {
        case COD_REPORT_VARIANTS.OFF:
            return columns_VARIANT;
        case COD_REPORT_VARIANTS.COD_REPORT:
            return columns_VARIANT;

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





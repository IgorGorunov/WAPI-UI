import * as React from "react";
import {SALE_DYNAMIC_VARIANTS, SaleDynamicRowType, AllReportsRowArrayType,} from "@/types/reports";
import {ColumnDef} from "@tanstack/react-table";
import Icon from "@/components/Icon";


const formatDate = (colStr: string) => {
    return colStr.replace('week','').split('_').join('.');
}

const getColor = (row: any, colName: string) => {
    const dateArr = colName.replace('week','').split('_');
    const curDate = new Date(Number(dateArr[2]), Number(dateArr[1])-1, Number(dateArr[0]));
    const prevDate = new Date(curDate);
    prevDate.setDate(prevDate.getDate() - 7);
    //const prevColName = `week${prevDate.getDate()}_${prevDate.getMonth()+1}_${get}`;
    let month = "" + (prevDate.getMonth() + 1),
        day = "" + prevDate.getDate(),
        year = "" +prevDate.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (year.length === 1) year = "000"+year;
    const prevColName = `week${day}_${month}_${year}`;

    if (row[prevColName] || row[prevColName]===0) {
        const prevValue = row[prevColName];
        const curValue = row[colName];
        if (prevValue === 0) return curValue > prevValue ? 'UP' : 'NONE';
        const difference = Math.round((curValue - prevValue)*100/prevValue);
        if (difference < -25) {
            return 'DOWN';
        } else if (difference < 25) {
            return 'NONE';
        } else return 'UP';
    } else {
        return 'NONE';
    }
}

export const columns_Country_Weeks: ColumnDef<SaleDynamicRowType>[] = [
    {
        accessorKey: 'country',
        id: 'country',
        header: () => <span>Country</span>,
        cell: info => <span><span className={`fi fi-${info.row.original.countryCode ? info.row.original?.countryCode.toLowerCase() : ''} flag-icon`}></span>{info.row.original.country}</span>,
        aggregationFn: 'count',
        size: 150,
        minSize: 150,
        maxSize: 500,
    },

];

const createColumn = (colName: string) => {
    return {
        accessorKey: colName,
        id: colName,
        header: () => <span>{formatDate(colName)}</span>,
        cell: info => <span className={`arrow arrow-${getColor(info.row.original, colName)}`}>{info.row.original[colName]}<Icon name='arrow-up' /></span>,
        aggregationFn: 'count',
        size: 90,
        minSize: 90,
        maxSize: 500,
    }
}


export const getSaleDynamicVariantColumns = (variant: SALE_DYNAMIC_VARIANTS, resourceCols: string[]=[]) => {
    console.log('check columns variant:', variant, typeof variant)
    switch (variant) {
        case SALE_DYNAMIC_VARIANTS.COUNTRY:
            return [...columns_Country_Weeks, ...resourceCols.map(colName => { return createColumn(colName)})];
        default:
            return columns_Country_Weeks;
    }
}

export const getSaleDynamicVariantGroupCols = (variant: SALE_DYNAMIC_VARIANTS) => {
    switch (variant) {
        case SALE_DYNAMIC_VARIANTS.COUNTRY:
            return [];
        default:
            return []
    }
}

export const getSaleDynamicVariantDimensionNumber = (variant: SALE_DYNAMIC_VARIANTS) => {
    switch (variant) {
        case SALE_DYNAMIC_VARIANTS.COUNTRY:
            return ['country'];
        default:
            return ['country'];
    }
}

export const getSaleDynamicVariantDimensionCols = (variant: SALE_DYNAMIC_VARIANTS) => {
    switch (variant) {
        case SALE_DYNAMIC_VARIANTS.COUNTRY:
            return ['country', 'countryCode'];
        default:
            return ['country', 'countryCode'];
    }
}

export const getSaleDynamicVariantResourceCols = (arr: AllReportsRowArrayType, variant: SALE_DYNAMIC_VARIANTS) => {
    return {
        sumCols: [...getSaleDynamicResourceColumnNames(arr, variant)],
        uniqueCols: [],
    }
}

export const getSaleDynamicVariantSortingCols = (variant: SALE_DYNAMIC_VARIANTS) => {
    switch (variant) {
        case SALE_DYNAMIC_VARIANTS.COUNTRY:
            return ['country'];
        default:
            return ['country'];
    }
}


export const getSaleDynamicResourceColumnNames = (arr: any, variant: SALE_DYNAMIC_VARIANTS) => {
    if (!arr || !arr.length) return [];

    const dimensionCols = getSaleDynamicVariantDimensionCols(variant);

    const reportCols = Object.keys(arr[0]);

    const resourceCols = [];
    reportCols.forEach(key => {
        if (!dimensionCols.includes(key as string) && key.includes('week')) {
            resourceCols.push(key);
        }
    } );
    return resourceCols;
}
import * as React from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import Icon from "@/components/Icon";
import './styles.scss';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {getHeaderNameById, getVariantColumnsByReportType} from '../utils';

import {
    ColumnResizeMode,
    ColumnSizingState,
    ColumnSort,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getGroupedRowModel,
    getSortedRowModel,
    GroupingState,
    Row,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import {AllReportsRowType, AllVariantsType, DeliveryRatesRowType, REPORT_TITLES, REPORT_TYPES} from "@/types/reports";
import {getVariantByReportType} from "@/screens/ReportPage/utils";
import Button, {ButtonVariant} from "@/components/Button/Button";

import {Workbook} from 'exceljs';
import {formatDateStringToDisplayString, formatDateToShowMonthYear, formatDateToWeekRange} from "@/utils/date";
import getSymbolFromCurrency from "currency-symbol-map";
import {
    getAverageSaleValue,
    getBuyoutValue,
    getDeliveredWithFirstAttemptValue,
    getProbableBuyoutValue
} from "@/screens/ReportPage/Reports/DeliveryRates";

type ReportTablePropsType = {
    reportData: AllReportsRowType[];
    reportGrouping: string[];
    dimensionsCount: number;
    reportType: REPORT_TYPES;
    reportVariantAsString: string;
    searchText: string;
    sortingCols: string[];
    resourceColumnNames?: string[];
}

const ReportTable:React.FC<ReportTablePropsType> = ({reportType, reportVariantAsString, reportData,reportGrouping, dimensionsCount, searchText='', sortingCols = [], resourceColumnNames=[]}) => {
    //resizing
    const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
    const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange");

    const initialSortingState: ColumnSort[] = useMemo(()=> {return sortingCols.map(item => ({id: item, desc: false}))},[sortingCols]);

    const [sorting, setSorting] = React.useState<SortingState>( initialSortingState);
    const [grouping, setGrouping] = React.useState<GroupingState>(reportGrouping);
    const [columnVisibility, setColumnVisibility] = React.useState({'deliveredWithTroubleStatus':false,});
    // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    //     []
    // )
    const [globalFilter, setGlobalFilter] = React.useState(searchText);

    const [groupsAreOpen, setGroupsAreOpen] = useState(false);

    useEffect(() => {
        setGroupsAreOpen(false);
    }, [reportType, reportData, reportVariantAsString, reportGrouping]);

    useEffect(() => {
        setGlobalFilter(searchText);
    }, [searchText]);

    //const dimensionsCount = 4;
    const groupedCols = reportGrouping.length;

    useEffect(() => {
        setGrouping(reportGrouping);
    }, [reportGrouping]);

    useEffect(() => {
        setSorting(initialSortingState);
    }, [initialSortingState]);


    const curVariantAsType = getVariantByReportType(reportType, reportVariantAsString);

    const columns = getVariantColumnsByReportType(reportType, curVariantAsType, resourceColumnNames);

    const table = useReactTable({
        data: reportData,
        //@ts-ignore
        columns,
        state: {
            grouping,
            sorting,
            columnVisibility,
            //columnFilters,
            globalFilter,
            columnSizing,
        },
        columnResizeMode: 'onChange',
        onGroupingChange: setGrouping,
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        debugTable: true,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        //onColumnFiltersChange: setColumnFilters,
        onColumnSizingChange: setColumnSizing,
        aggregationFns: {
            aggUnique: (columnId, leafRows, childRows) => {
                if (childRows.length > 0) {
                    const arr = childRows.map(item => item.original[columnId+"_c"].split(';'));
                    const uniqueValues = new Set(arr.reduce((acc, curr) => acc.concat(curr), []).filter(item=>item));
                    return uniqueValues.size;
                }
                return 0;
            }
        }
    })

    const calcPadding = useCallback((index: number, isCellAggregated: boolean, hasSubRows:boolean, depth: number ) => {
        if (index<=groupedCols && !isCellAggregated) {
            if (hasSubRows) {
                return `${depth * 16 +10}px`;
            } else if (groupedCols === 0) {
                return `16px`;
            } else {
                return `${depth * 16 + 30}px`;
            }

        } else return '10px';
    }, [groupedCols]);

    const getFileName = useCallback((reportType:REPORT_TYPES, curVariant:AllVariantsType) => {
        return `${REPORT_TITLES[reportType]} (${curVariant}).xlsx`
    }, [reportType, curVariantAsType])

    const handleDownload = async () => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Report');

        worksheet.properties.outlineProperties = {
            summaryBelow: false,
            summaryRight: false,
        };

        //get headers
        const lastHeaderGroup = table.getHeaderGroups().at(-1);
        if (!lastHeaderGroup) {
            return;
        }
        worksheet.columns = lastHeaderGroup.headers.filter((h)=>h.column.getIsVisible()).map(header=> {

            return {
                header:  getHeaderNameById(reportType, header.id) as string,
                key: header.id,
                width: 20,
            }
        });

        // create rows
        const addGroupedRows = (groupedData: Row<AllReportsRowType>[], level: number, startRow: number) => {
            groupedData.forEach((currentRow, index) => {
                const isGroup = currentRow.subRows.length > 0;

                const groupRows = currentRow.subRows;
                const groupRowStart = startRow + index;

                const cells = currentRow.getVisibleCells();

                const values = cells.map((cell, index)=> {
                    //check grouping
                    if (cell.getIsPlaceholder()) {
                        return '';
                    }

                    if (isGroup && !cell.getIsGrouped()  && index<dimensionsCount ) {
                        return ''
                    }

                    if (cell.column.id === 'month') {
                        return formatDateToShowMonthYear(cell.getValue() as string)
                    } else if (cell.column.id === 'week') {
                        return formatDateToWeekRange(cell.getValue() as string)
                    } else if (cell.column.id === 'deliveryDate'  || cell.column.id === 'period') {
                        return cell.getValue<string>() ? formatDateStringToDisplayString(cell.getValue<string>()) : ' '
                    } else if (cell.column.id === 'price' ) {
                        const val = cell.getValue();
                        //@ts-ignore
                        const currency = cell.row.original.hasOwnProperty('currency') ? getSymbolFromCurrency(cell.row.original?.currency) || '' : '';
                        return `${val} ${currency}`;
                    }

                    if (reportType === REPORT_TYPES.DELIVERY_RATES) {
                        if (cell.column.id === 'deliveredWithFirstAttempt') {
                            return getDeliveredWithFirstAttemptValue(cell.row as Row<DeliveryRatesRowType>);
                        } else if (cell.column.id === 'sale') {
                            return getAverageSaleValue(cell.row as Row<DeliveryRatesRowType>);
                        } else if (cell.column.id === 'buyout') {
                            return getBuyoutValue(cell.row as Row<DeliveryRatesRowType>);
                        } else if (cell.column.id === 'probableBuyout') {
                            return getProbableBuyoutValue(cell.row as Row<DeliveryRatesRowType>);
                        }
                    }

                    if (cell.getValue() === undefined) {
                        return '';
                    }

                    return  cell.getValue()
                });

                const addedRow = worksheet.addRow(values);
                addedRow.outlineLevel = level;

                const colorLevel = groupedCols - level; //'FFC3D2FD'
                const rowColor = isGroup ? colorLevel === 3 ? 'FFD4DFFE' : colorLevel === 2 ? 'FFE6ECFE' : colorLevel === 1 ? 'FFF7F8FF' : 'FFF7F8FF' : 'FFFFFFFF';

                addedRow.eachCell(cell => {

                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb:rowColor }
                    };
                    cell.border ={
                        top: {style:'thin', color: {argb: 'FF7D8FB3'}},
                        left: {style:'thin', color: {argb: 'FF7D8FB3'}},
                        bottom: {style:'thin', color: {argb: 'FF7D8FB3'}},
                        right: {style:'thin', color: {argb: 'FF7D8FB3'}},
                    };
                })

                if (isGroup) {
                    addGroupedRows(groupRows, level + 1, groupRowStart + 1);
                }
            });
        };

        const reportData = table.getRowModel().rows || [];

        addGroupedRows(reportData, 0, 1);

        worksheet.getRow(1).eachCell(cell=> {
            cell.font = {bold: true};
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF5380F5' }
            };
            cell.border = {
                top: {style: 'thin', color: {argb: 'FF7D8FB3'}},
                left: {style: 'thin', color: {argb: 'FF7D8FB3'}},
                bottom: {style: 'thin', color: {argb: 'FF7D8FB3'}},
                right: {style: 'thin', color: {argb: 'FF7D8FB3'}},
            }
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        worksheet.getRow(1).height=40;




        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = getFileName(reportType, curVariantAsType);
            a.click();
        });
    }

    return (
        <div className='report'>
            <div className="card report-container">
                <div className="h-2" />
                <div className='interactive-block'>
                    <Button onClick={handleDownload} icon='download-file' iconOnTheRight variant={ButtonVariant.SECONDARY}>Export to Excel</Button>
                    {reportGrouping.length ? <Button iconOnTheRight onClick={()=>{table.toggleAllRowsExpanded(!groupsAreOpen); setGroupsAreOpen(prev => !prev);}} icon={ groupsAreOpen ? 'minus' : 'plus'} variant={ButtonVariant.SECONDARY} >{groupsAreOpen ? 'Collapse all' : 'Expand all'}</Button> : null}
                    {reportType===REPORT_TYPES.SALE_DYNAMIC ? <div className='sales-dynamic-legend'>
                        <div><Icon name='arrow-up-green' /> Your sales have increased by more than 25 percent</div>
                        <div><Icon name='arrow-down-red' /> Your sales have decreased by more than 25 percent</div>
                    </div> : null}
                </div>

                <div className={`t-container ${reportType} ${reportType===REPORT_TYPES.SALE_DYNAMIC ? 'is-sticky' : ''}`}>
                    <table {...{
                        style: {
                            width: table.getCenterTotalSize()
                        }
                    }}>
                        <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header, index: number) => {
                                    return (
                                        <th key={header.id} colSpan={header.colSpan} className={`col-${index}`} {...{
                                            style: {
                                                width: header.getSize()
                                            }
                                        }}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className: `${header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : ''}`,
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: <span className='sort-icon'><Icon name='sort-asc'/></span>,
                                                        desc: <span className='sort-icon'><Icon name='sort-desc'/></span>,
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            )}
                                            <div
                                                {...{
                                                    onMouseDown: header.getResizeHandler(),
                                                    onTouchStart: header.getResizeHandler(),
                                                    className: `resizer ${
                                                        header.column.getIsResizing() ? "isResizing" : ""
                                                    }`,
                                                    style: {
                                                        transform:
                                                            columnResizeMode === "onEnd" &&
                                                            header.column.getIsResizing()
                                                                ? `translateX(${
                                                                    table.getState().columnSizingInfo.deltaOffset
                                                                }px)`
                                                                : ""
                                                    }
                                                }}
                                            />
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                        </thead>
                        <tbody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <tr key={row.id} className={`${row.subRows.length ? 'is-group' : 'is-leaf'} ${row.getIsGrouped ? 'is-grouped' : 'not-grouped'} ${row.getIsExpanded ? 'is-expanded' : 'not-expanded'} depth-${groupedCols - row.depth}`}>

                                    {row.getVisibleCells().map((cell,index) => {
                                        return (
                                            <td
                                                colSpan={Number(`${(cell.getIsGrouped() ? dimensionsCount : index<=groupedCols && !cell.getIsAggregated() ? groupedCols+1  : 1) }`)}
                                                className={`${cell.id} col-${index} ${index<dimensionsCount ? 'is-dimension': 'is-resource'} ${cell.getIsGrouped() ? 'is-grouped' : ''} ${cell.getIsAggregated() ? 'is-aggravated' : ''} ${cell.getIsPlaceholder() ? 'is-placeholder' : ''} ${row.depth}`}
                                                {...{
                                                    key: cell.id,
                                                    style: {
                                                        // paddingLeft: index<=groupedCols && !cell.getIsAggregated() ? row.subRows.length ? `${row.depth * 16 +10}px` : `${row.depth * 16 + 30}px` : '10px',
                                                        paddingLeft: calcPadding(index, cell.getIsAggregated(), row.subRows.length !==0, row.depth),
                                                        color: cell.getIsGrouped()
                                                            ? "rgb(29 78 216)"
                                                            : "black",
                                                        background: cell.getIsGrouped()
                                                            ? "none"
                                                            : cell.getIsAggregated()
                                                                ? "none"
                                                                : cell.getIsPlaceholder()
                                                                    ? "none"
                                                                    : "none",
                                                    },
                                                }}
                                            >
                                                {cell.getIsGrouped() ? (
                                                    // If it's a grouped cell, add an expander and row count
                                                    <>
                                                        <button
                                                            {...{
                                                                onClick: row.getToggleExpandedHandler(),
                                                                className: "btn-expand",
                                                                style: {
                                                                    cursor: row.getCanExpand()
                                                                        ? "pointer"
                                                                        : "normal",
                                                                },
                                                            }}
                                                        >
                                                            <Icon name={`${row.getIsExpanded() ? 'minus' : 'plus'}`} className='show-hide-btn' />
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )} <span className='grouped-rows-count'>
                                                            ({row.subRows.length})</span>
                                                        </button>
                                                    </>
                                                ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                                                    // Otherwise, just render the regular cell
                                                    flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default ReportTable;
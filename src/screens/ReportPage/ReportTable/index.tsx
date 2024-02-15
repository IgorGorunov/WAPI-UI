import * as React from 'react';
import {useEffect, useMemo, useRef} from 'react';
import Icon from "@/components/Icon";
import './styles.scss';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {formatPercent, getVariantColumnsByReportType} from '../utils';

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

import {AllReportsRowType, REPORT_TYPES} from "@/types/reports";
import {getVariantByReportType} from "@/screens/ReportPage/utils";
//import Button from "@/components/Button/Button";

import {Workbook} from 'exceljs';
import {formatDateStringToDisplayString, formatDateToShowMonthYear, formatDateToWeekRange} from "@/utils/date";
import getSymbolFromCurrency from "currency-symbol-map";

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
    // console.log('test report data:', reportData, reportGrouping, dimensionsCount);
    // console.log('table data renders', reportVariantAsString);
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

    //console.log('variant and columns: ', reportVariantAsString, curVariantAsType, typeof curVariantAsType, columns, )

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
    })

    const calcPadding = (index: number, isCellAggregated: boolean, hasSubRows:boolean, depth: number ) => {
        if (index<=groupedCols && !isCellAggregated) {
            if (hasSubRows) {
                return `${depth * 16 +10}px`;
            } else if (groupedCols === 0) {
                return `16px`;
            } else {
                return `${depth * 16 + 30}px`;
            }

        } else return '10px';
    }

    const tbl = useRef(null);

    const handleDownload = async () => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Data');

        const lastHeaderGroup = table.getHeaderGroups().at(-1);
        if (!lastHeaderGroup) {
            return;
        }

        worksheet.properties.outlineProperties = {
            summaryBelow: false,
            summaryRight: false,
        };

        worksheet.columns = lastHeaderGroup.headers.filter((h)=>h.column.getIsVisible()).map(header=> {
            //console.log('header: ', header, typeof header.column.columnDef.header === 'function' ? header.column.columnDef.header() as string : header.column.columnDef.header as string);
            return {
                header: typeof header.column.columnDef.header === 'function' ? 'tbd' : header.column.columnDef.header as string,
                key: header.id,
                width: 20,
            }
        });






        // const buf = await workbook.xlsx.writeBuffer();
        // saveAs

        // Recursive function to add grouped rows to the worksheet
        // const addGroupedRows = (groupedData, level, startRow) => {
        //     Object.keys(groupedData).forEach((group, index) => {
        //         const groupRows = groupedData[group];
        //         const groupRowStart = startRow + index;
        //         const groupRowEnd = groupRowStart + groupRows.length - 1;
        //
        //         worksheet.addRow({ [level]: group });
        //         worksheet.addRows(Array(groupRows.length - 1).fill({}));
        //
        //         groupRows.forEach((row, rowIndex) => {
        //             worksheet.addRow({ ...row });
        //         });
        //
        //         if (Array.isArray(groupRows[0])) {
        //             addGroupedRows(groupRows, level + ' sub', groupRowStart + 1);
        //         }
        //
        //         worksheet.getRow(groupRowStart).outlineLevel = level.split(' ').length;
        //         worksheet.getRow(groupRowStart).groupOutlines = [{ startRow: groupRowStart + 1, endRow: groupRowEnd }];
        //     });
        // };
        const addGroupedRows = (groupedData: Row<AllReportsRowType>[], level: number, startRow: number) => {
            groupedData.forEach((currentRow, index) => {
                const isGroup = currentRow.subRows.length > 0;
                if (!isGroup) {

                }
                const groupRows = currentRow.subRows;
                const groupRowStart = startRow + index;
                //const groupRowEnd = groupRowStart + groupRows.length - 1;

                const cells = currentRow.getVisibleCells();
                console.log('visible cells: ', cells)
                const values = cells.map((cell, index)=> {
                    // console.log('cell: ', cell, cell.getContext(), cell.renderValue(), flexRender(cell.column.columnDef.cell,
                    //     cell.getContext()));

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
                            return (cell.row.getValue<number>('delivered') - cell.row.getValue<number>('deliveredWithTroubleStatus'))
                        } else if (cell.column.id === 'sale') {
                            return (Math.round(cell.getValue<number>() / cell.row.getValue<number>('totalOrders') * 100) / 100).toFixed(2)
                        } else if (cell.column.id === 'buyout') {
                            return (cell.row.getValue<number>('totalInTransit') === 0 ? '0%' : formatPercent(cell.row.getValue<number>('delivered') / cell.row.getValue<number>('totalInTransit') * 100) + '%')
                        } else if (cell.column.id === 'probableBuyout') {
                            return (cell.row.getValue<number>('totalInTransit')===0 ? '0.0%' : formatPercent((cell.row.getValue<number>('delivered')+cell.row.getValue<number>('inTransit')) / cell.row.getValue<number>('totalInTransit')*100)+'%')
                        }
                    }

                    if (cell.getValue() === undefined) {
                        return '';
                    }

                    return  cell.getValue()
                });

                console.log('values: ', values);

                const addedRow = worksheet.addRow(values);
                addedRow.outlineLevel = level;

                const colorLevel = groupedCols - level; //'FFC3D2FD'
                const rowColor = isGroup ? colorLevel === 3 ? 'FFD4DFFE' : colorLevel === 2 ? 'FFE6ECFE' : colorLevel === 1 ? 'FFF7F8FF' : 'FFF7F8FF' : 'FFFFFFFF';

                addedRow.eachCell(cell => {
                    //console.log('cell - color', cell)
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


        // table.getRowModel().rows.forEach(row=> {
        //     const cells = row.getVisibleCells();
        //     const values = cells.map(cell=> cell.getValue() ?? ' ');
        //     console.log('values - row', row.index, values);
        //     worksheet.addRow(values);
        // });

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
            a.download = 'exported_data.xlsx';
            a.click();
        });

    }


    console.log('table experiments - table.getRowModel():', table.getRowModel());
    console.log('table experiments - table.getRowModel()  visible cells:', table.getRowModel().rows.length ?  table.getRowModel().rows[0].getVisibleCells() : '-');



    return (
        <div className='report'>
            {reportType===REPORT_TYPES.SALE_DYNAMIC ? <div className='sales-dynamic-legend'>
                <div><Icon name='arrow-up-green' /> Your sales have increased by more than 25 percent</div>
                <div><Icon name='arrow-down-red' /> Your sales have decreased by more than 25 percent</div>
            </div> : null}

            <div className="card report-container">
                <div className="h-2" />
                <div className='interactive-block'>
                    {/*<Button onClick={handleDownload}>Export to Excel</Button>*/}
                    {/*<Button onClick={()=>table.toggleAllRowsExpanded()}>Toggle</Button>*/}
                </div>

                <div className={`t-container ${reportType} ${reportType===REPORT_TYPES.SALE_DYNAMIC ? 'is-sticky' : ''}`}>
                    {/*{reportData && !table.getRowModel().rows.length ? (<div>{reportData.length}</div>) : null}*/}
                    <table ref={tbl} {...{
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
                                                            )}{" "}
                                                            ({row.subRows.length})
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
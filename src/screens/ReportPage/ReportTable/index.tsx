import * as React from 'react';
import {useEffect, useMemo} from 'react';
import Icon from "@/components/Icon";
import './styles.scss';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {getVariantColumnsByReportType} from '../utils';

import {
    ColumnFiltersState,
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
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import {AllReportsRowType, REPORT_TYPES} from "@/types/reports";
import {getVariantByReportType} from "@/screens/ReportPage/utils";

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
    console.log('test report data:', reportData, reportGrouping, dimensionsCount);
    console.log('table data renders', reportVariantAsString);
    //resizing
    const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
    const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange");
    //
    // useEffect(() => {
    //     console.log("columnSizing", columnSizing);
    // }, [columnSizing]);

    const initialSortingState: ColumnSort[] = useMemo(()=> {return sortingCols.map(item => ({id: item, desc: false}))},[sortingCols]);

    const [sorting, setSorting] = React.useState<SortingState>( initialSortingState);
    const [grouping, setGrouping] = React.useState<GroupingState>(reportGrouping);
    const [columnVisibility, setColumnVisibility] = React.useState({'deliveredWithTroubleStatus':false,});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
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

    console.log('variant and columns: ', reportVariantAsString, curVariantAsType, typeof curVariantAsType, columns, )

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
        onColumnFiltersChange: setColumnFilters,
        onColumnSizingChange: setColumnSizing,
    })

    // const columnSizeVars = React.useMemo(() => {
    //     const headers = table.getFlatHeaders()
    //     const colSizes: { [key: string]: number } = {}
    //     for (let i = 0; i < headers.length; i++) {
    //         const header = headers[i]!
    //         colSizes[`--header-${header.id}-size`] = header.getSize()
    //         colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    //     }
    //     return colSizes
    // }, [table.getState().columnSizingInfo])

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

    return (
        <div className="report-container">
            <div className="h-2" />
            <div className={`t-container ${reportType} ${reportType===REPORT_TYPES.SALE_DYNAMIC ? 'is-sticky' : ''}`}>
                {/*{reportData && !table.getRowModel().rows.length ? (<div>{reportData.length}</div>) : null}*/}
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
    )
};

export default ReportTable;
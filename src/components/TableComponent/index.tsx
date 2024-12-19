import React from 'react'
import {TableType, TableRowType} from "@/types/sanity/fragmentTypes";
import {
    useReactTable,
    ColumnDef,
    flexRender,
    getCoreRowModel,
} from '@tanstack/react-table';
import './styles.scss';

export type TableComponentPropsType = {
    heading?: string;
    table: TableType;
    isFirstRowAHeader: boolean;
    isFirstColumnAHeader: boolean;
}


const TableComponent: React.FC<TableComponentPropsType> = (props) => {
    const {heading, table, isFirstRowAHeader=false, isFirstColumnAHeader=false} = props;
    const rows = table.rows;

    // Create column definitions dynamically based on the number of cells in the first row
    const columns = rows[0]?.cells.map((_, columnIndex) => ({
        accessorFn: (row: TableRowType) => row.cells[columnIndex],
        id: `column-${columnIndex}`,
        header: isFirstRowAHeader ? rows[0].cells[columnIndex] : null,
    })) as ColumnDef<TableRowType>[];

    // Adjust rows if the first row is used as a header
    const tableRows = isFirstRowAHeader ? rows.slice(1) : rows;

    const tanstackTable = useReactTable({
        columns,
        data: tableRows,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className='table-block'>
            { heading ? <h3 className={'table-block__heading'}>{heading}</h3> : null }
            <div className={`card table-block__container ${isFirstColumnAHeader ? 'is-sticky' : ''} has-scroll`}>
                <table>
                    {isFirstRowAHeader && (
                        <thead>
                        {tanstackTable.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <th key={header.id} className={`col-${index} table-cell header-cell`}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                    )}
                    <tbody>
                    {tanstackTable.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell, index) => (
                                <td key={cell.id} className={`col-${index} table-cell`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

//
//     return (
//         <div className='table-block'>
//             <table>
//                 <tbody>
//                 {table.rows.map((row, rowIndex) => (
//                     <tr key={rowIndex} className={`table-block_row `}>
//                         {row.cells.map((cell, cellIndex) => {
//                             const isHeader = (isFirstRowAHeader && rowIndex === 0) || (isFirstColumnAHeader && cellIndex === 0);
//                             return isHeader ? (
//                                 <th key={cellIndex}>{cell}</th>
//                             ) : (
//                                 <td key={cellIndex}>{cell}</td>
//                             );
//                         })}
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//         </div>
//     )
//
}

export default TableComponent;
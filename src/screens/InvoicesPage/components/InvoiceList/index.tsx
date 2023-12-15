import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Table, Pagination, Input} from 'antd';
import {ColumnType} from "antd/es/table";
import "./styles.scss";
import "@/styles/tables.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {InvoiceType} from "@/types/invoices";
import StatusWarehouseSelector from "@/components/InputSelect";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import Head from "next/head";
import {PageOptions} from '@/constants/pagination';
import {GetFilterArray} from '@/utils/common';
import getSymbolFromCurrency from "currency-symbol-map";
import {GroupStatuses} from "@/screens/DashboardPage/components/OrderStatuses";


export const StatusColors = {
    "Payd": "#29CC39",
    "Unpaid": "#FEDB4F",
    "Partiallity paid": "#5380F5",
    "Overdue": "#FF4000",
};

type InvoiceListType = {
    invoices:InvoiceType[];
    setFilteredInvoices: React.Dispatch<React.SetStateAction<InvoiceType[]>>;
}

const InvoiceList: React.FC<InvoiceListType> = ({invoices, setFilteredInvoices}) => {

    const [animating, setAnimating] = useState(false);

    // Pagination
    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const handleChangePage = (page: number) => {
        setAnimating(true);
        setTimeout(() => {
            setCurrent(page);
            setAnimating(false);
        }, 500);
    };
    const handleChangePageSize = (size: number) => {
        setPageSize(size);
        setCurrent(1);
    };

    // Sorting
    const [sortColumn, setSortColumn] = useState<keyof InvoiceType>('date');
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof InvoiceType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    // Filter and searching
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const transformedStatuses= GetFilterArray(invoices, 'status', 'All statuses');

    const handleFilterChange = (newSearchTerm: string, newStatusFilter: string) => {
        if (newSearchTerm !== undefined) {
            setSearchTerm(newSearchTerm);
        }
        if (newStatusFilter !== undefined) {
            setFilterStatus(newStatusFilter);
        }
    };
    const filteredInvoices = useMemo(() => {
        setCurrent(1);
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = invoices.filter(invoice => {
            const matchesSearch = !searchTerm || Object.keys(invoice).some(key => {
                const value = invoice[key];
                return key !== 'uuid' && typeof value === 'string' && value.toLowerCase().includes(searchTermLower);
            });
            const matchesStatus = !filterStatus || invoice.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                if (sortDirection === 'ascend') {
                    return a[sortColumn] > b[sortColumn] ? 1 : -1;
                } else {
                    return a[sortColumn] < b[sortColumn] ? 1 : -1;
                }
            });
        }
        return filtered;
    }, [invoices, searchTerm, filterStatus, sortColumn, sortDirection]);

    useEffect(() => {
        setFilteredInvoices(filteredInvoices)
    }, [filteredInvoices]);

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    const columns: ColumnType<InvoiceType>[] = useMemo(() => [
        {
            title: <TitleColumn title="Status" minWidth="100px" maxWidth="100px" contentPosition="start"/>,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.status);
                return (
                    <TableCell
                        minWidth="100px"
                        maxWidth="100px"
                        contentPosition="start"
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title="Number"
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px"  contentPosition="start"/>
            ),
            dataIndex: 'number',
            key: 'number',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title="Date"
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px"  contentPosition="start"/>
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title="Amount"
                minWidth="75px"
                maxWidth="75px"
                contentPosition="center"
            />,
            render: (text: string, record) => {
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="center">
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="center">
                        </TableCell>
                    );
                }
            },
            dataIndex: 'amount',
            key: 'amount',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title="Due date"
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px"  contentPosition="start"/>
            ),
            dataIndex: 'dueDate',
            key: 'dueDate',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title="Overdue"
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px"  contentPosition="start"/>
            ),
            dataIndex: 'overdue',
            key: 'overdue',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title="Payd"
                minWidth="75px"
                maxWidth="75px"
                contentPosition="center"
            />,
            render: (text: string, record) => {
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="center">
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="center">
                        </TableCell>
                    );
                }
            },
            dataIndex: 'payd',
            key: 'payd',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },

        {
            title: <TitleColumn
                title="Debt"
                minWidth="75px"
                maxWidth="75px"
                contentPosition="center"
            />,
            render: (text: string, record) => {
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="center">
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="center">
                        </TableCell>
                    );
                }
            },
            dataIndex: 'debt',
            key: 'debt',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },

    ], [handleHeaderCellClick]);
    return (
        <div className='table'>
            <Head>
                <title>Invoices</title>
                <meta name="invoices" content="invoices" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div className="warehouse-filter-container">
                <StatusWarehouseSelector
                    options={transformedStatuses}
                    value={filterStatus}
                    onChange={(value: string) => handleFilterChange(undefined, value)}
                />
                <Input
                    placeholder="🔍 Search..."
                    value={searchTerm}
                    onChange={e => handleFilterChange(e.target.value, undefined)}
                    className="search-input"
                />
            </div>
            <div className="page-size-container">
                <span className="page-size-text">Invoices</span>
                <PageSizeSelector
                    options={PageOptions}
                    value={pageSize}
                    onChange={(value: number) => handleChangePageSize(value)}
                />
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '}`}>
                <Table
                    dataSource={filteredInvoices.slice((current - 1) * pageSize, current * pageSize).map(item => ({
                        ...item,
                        key: item.tableKey,
                    }))}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                />
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={filteredInvoices.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default React.memo(InvoiceList);
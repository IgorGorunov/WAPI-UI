import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Table, Pagination, Input} from 'antd';
import {ColumnType} from "antd/es/table";
import "./styles.scss";
import "@/styles/tables.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {InvoiceType} from "@/types/invoices";
import StatusSelector from "@/components/InputSelect";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import Head from "next/head";
import {PageOptions} from '@/constants/pagination';
import {GetFilterArray} from '@/utils/common';
import getSymbolFromCurrency from "currency-symbol-map";
import {GroupStatuses} from "@/screens/DashboardPage/components/OrderStatuses";
import {DateRangeType} from "@/types/dashboard";
import DateInput from "@/components/DateInput";
import {getInvoiceForm, getInvoicesDebts} from "@/services/invoices";
import {verifyToken} from "@/services/auth";
import {Routes} from "@/types/routes";
import {ApiResponseType} from "@/types/api";
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import Cookie from "js-cookie";
import Skeleton from "@/components/Skeleton/Skeleton";


export const StatusColors = {
    "Paid": "#29CC39",
    "Credit note": "#5380F5",
    "Unpaid": "#FEDB4F",
    "Partiallity paid": "#5380F5",
    "Overdue": "#FF4000",
    "Overpaid": "#29CC39",
};

type InvoiceListType = {
    invoices:InvoiceType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredInvoices: React.Dispatch<React.SetStateAction<InvoiceType[]>>;
}

const InvoiceList: React.FC<InvoiceListType> = ({invoices, currentRange, setCurrentRange, setFilteredInvoices}) => {

    const [animating, setAnimating] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

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
    const [sortColumn, setSortColumn] = useState<keyof InvoiceType>();
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof InvoiceType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    // Filter and searching
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Active only');
    const transformedStatuses= GetFilterArray(invoices, 'status', 'All statuses');
    transformedStatuses.splice(1,0, {value:"Active only", label:"Active only"});

    const handleDownloadInvoice = async (uuid) => {
        setIsLoading(true);
        try {

            const response = await getInvoiceForm(
                { token: token, uuid: uuid }
            );

            if (response && response.data) {
                const files = response.data;
                if (files.length) {
                    files.forEach(file => {
                        const decodedData = atob(file.data);

                        // Convert base64 to Uint8Array
                        const arrayBuffer = new Uint8Array(decodedData.length);
                        for (let i = 0; i < decodedData.length; i++) {
                            arrayBuffer[i] = decodedData.charCodeAt(i);
                        }

                        // // Create a Blob
                        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

                        // Create a download link
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = file.name;

                        // Append the link to the document and trigger a click event
                        document.body.appendChild(link);
                        link.click();

                        // Remove the link from the document
                        document.body.removeChild(link);
                    });
                }
            setIsLoading(false);
            } else {
                console.error("API did not return expected data");
                setIsLoading(false);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    };

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
            const matchesStatus = (!filterStatus || invoice.status === filterStatus) || (filterStatus === 'Active only' && invoice.debt !== 0);

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

    const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        setShowDatepicker(false);
    };

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
                        value={text}
                        childrenBefore={
                            <span style={{
                                borderBottom: `2px solid ${underlineColor}`,
                                display: 'inline-block',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                backgroundColor: underlineColor,
                                marginRight: '5px',
                                justifyContent: 'center',}}
                            >
                        </span>
                        }
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
                contentPosition="start"
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}
                        >
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
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
            responsive: ['md'],
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
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title="Paid"
                minWidth="75px"
                maxWidth="75px"
                contentPosition="start"
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                }
            },
            dataIndex: 'paid',
            key: 'paid',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },

        {
            title: <TitleColumn
                title="Debt"
                minWidth="75px"
                maxWidth="75px"
                contentPosition="start"
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
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
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string, record: InvoiceType) => (
                <TableCell
                    minWidth="60px"
                    maxWidth="60px"
                    contentPosition="center"
                    childrenBefore={
                        <span className="services-cell-style">
                        <Icon name="download-file" />
                        </span>}>
                </TableCell>
            ),
            dataIndex: 'uuid',
            key: 'uuid',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleDownloadInvoice(record.uuid)}
                };
            },
            responsive: ['lg'],
        },

    ], [handleHeaderCellClick]);
    return (
        <div className='table'>
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    zIndex: 1000
                }}>
                    <Skeleton type="round" width="500px" height="300px" />
                </div>
            )}
            <Head>
                <title>Invoices</title>
                <meta name="invoices" content="invoices" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div className="status-filter-container">
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <StatusSelector
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
                <span className="page-size-text"></span>
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
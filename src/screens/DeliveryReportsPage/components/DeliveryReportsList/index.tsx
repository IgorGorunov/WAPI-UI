import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Table, Pagination, Input} from 'antd';
import {ColumnType} from "antd/es/table";
import "./styles.scss";
import "@/styles/tables.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { DeliveryReportType } from "@/types/deliveryReports";
import StatusWarehouseSelector from "@/components/InputSelect";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import Head from "next/head";
import {PageOptions} from '@/constants/pagination';
import {GetFilterArray} from '@/utils/common';

type DeliveryReportsListType = {
    deliveryReports: DeliveryReportType[];
    setFilteredDeliveryReports: React.Dispatch<React.SetStateAction<DeliveryReportType[]>>;
}

const InvoiceList: React.FC<DeliveryReportsListType> = ({deliveryReports, setFilteredDeliveryReports}) => {

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
    const [sortColumn, setSortColumn] = useState<keyof DeliveryReportType>('name');
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof DeliveryReportType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    // Filter and searching
    const [searchTerm, setSearchTerm] = useState('');
    const [filterWarehouse, setFilterWarehouse] = useState('');
    const transformedWarehouses= GetFilterArray(deliveryReports, 'warehouse', 'All warehouses');

    const handleFilterChange = (newSearchTerm: string, newStatusFilter: string) => {
        if (newSearchTerm !== undefined) {
            setSearchTerm(newSearchTerm);
        }
        if (newStatusFilter !== undefined) {
            setFilterWarehouse(newStatusFilter);
        }
    };
    const filteredInvoices = useMemo(() => {
        setCurrent(1);
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = deliveryReports.filter(product => {
            const matchesSearch = !searchTerm || Object.keys(product).some(key => {
                const value = product[key];
                return key !== 'uuid' && typeof value === 'string' && value.toLowerCase().includes(searchTermLower);
            });
            const matchesStatus = !filterWarehouse || product.warehouse === filterWarehouse;
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
    }, [deliveryReports, searchTerm, filterWarehouse, sortColumn, sortDirection]);

    // useEffect(() => {
    //     setFilteredInvoices(filteredInvoices)
    // }, [filteredInvoices]);

    const columns: ColumnType<DeliveryReportType>[] = useMemo(() => [
        {
            title: <TitleColumn title="" minWidth="15px" maxWidth="15px" contentPosition="center"
            />,
            render: (text: string) => (
                <TableCell
                    minWidth="15px"
                    maxWidth="15px"
                    contentPosition="center"
                    childrenBefore={<span className={`fi fi-${text.toLowerCase()} "flag-icon"`}></span>}>
                </TableCell>
            ),
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: <TitleColumn
                title=""
                minWidth="30px"
                maxWidth="30px"
                contentPosition="start"
                childrenBefore={<Icon name={"warehouse"}/>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px"  contentPosition="start"/>
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
        },
        {
            title: <TitleColumn title="SKU" minWidth="80px" maxWidth="120px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="120px"  contentPosition="start"/>
            ),
            dataIndex: 'warehouseSku',
            key: 'warehouseSku',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Name" minWidth="150px" maxWidth="500px"  contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="150px" maxWidth="500px"  contentPosition="start"/>
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
        },
        {
            title: <TitleColumn title="Available" minWidth="40px" maxWidth="40px"  contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px"  contentPosition="center"/>
            ),
            dataIndex: 'available',
            key: 'available',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
        },


        {
            title: <TitleColumn title="Reserve" minWidth="40px" maxWidth="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'reserved',
            key: 'reserved',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Damaged" minWidth="40px" maxWidth="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'damaged',
            key: 'damaged',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Expired" minWidth="40px" maxWidth="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'expired',
            key: 'expired',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Undefined status" minWidth="40px" maxWidth="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'undefinedStatus',
            key: 'undefinedStatus',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Without box" minWidth="40px" maxWidth="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'withoutBox',
            key: 'withoutBox',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Returning" minWidth="40px" maxWidth="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'forPlacement',
            key: 'forPlacement',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Total" minWidth="40px" maxWidth="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'total',
            key: 'total',
            sorter: true,
            onHeaderCell: (column: ColumnType<DeliveryReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof DeliveryReportType),
            }),
            responsive: ['md'],
        },
    ], [handleHeaderCellClick]);
    return (
        <div className='table'>
            <Head>
                <title>Delivery reports</title>
                <meta name="delivery reports" content="delivery" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div className="warehouse-filter-container">
                <StatusWarehouseSelector
                    options={transformedWarehouses}
                    value={filterWarehouse}
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
                <span className="page-size-text">Delivery reports</span>
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
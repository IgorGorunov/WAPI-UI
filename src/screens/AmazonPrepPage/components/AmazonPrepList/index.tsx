import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Input, Pagination, Table, TableColumnProps} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@/styles/tables.scss";
import Selector from "@/components/InputSelect";
import Icon from "@/components/Icon";
import UniversalPopup from "@/components/UniversalPopup";
import {ColumnType} from "antd/es/table";
import DateInput from "@/components/DateInput";
import {DateRangeType} from "@/types/dashboard";
import {AmazonPrepOrderType} from "@/types/amazonPrep";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, {ButtonVariant} from "@/components/Button/Button";
import Head from "next/head";
import {OrderType} from "@/types/orders";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";


type AmazonPrepListType = {
    amazonPrepOrders: AmazonPrepOrderType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredAmazonPrepOrders: React.Dispatch<React.SetStateAction<AmazonPrepOrderType[]>>;
    handleEditAmazonPrepOrder(uuid: string): void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const AmazonPrepList: React.FC<AmazonPrepListType> = ({amazonPrepOrders, currentRange, setCurrentRange, setFilteredAmazonPrepOrders,handleEditAmazonPrepOrder}) => {

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDisplayedPopup, setIsDisplayedPopup] = useState(false);
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [hoveredOrder, setHoveredOrder] = useState<AmazonPrepOrderType | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
    const productItems = amazonPrepOrders.flatMap(order => {
        return order.products.map(orderItem => ({
            uuid: order.uuid,
            title: orderItem.product,
            description: orderItem.quantity
        }));
    }).filter(item => item.uuid === hoveredOrder?.uuid);


    const [filterStatus, setFilterStatus] = useState('-All statuses-');
    // const allStatuses = orders.map(order => order.status);
    const uniqueStatuses = useMemo(() => {
        const statuses = amazonPrepOrders.map(order => order.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [amazonPrepOrders]);
    uniqueStatuses.sort();
    const transformedStatuses = useMemo(() => ([
        {
            value: '-All statuses-',
            label: '-All statuses-',
        },
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
        }))
    ]), [uniqueStatuses]);

    const [filterWarehouse, setFilterWarehouse] = useState('-All warehouses-');
    // const allWarehouses = orders.map(order => order.warehouse);
    const uniqueWarehouses = useMemo(() => {
        const warehouses = amazonPrepOrders.map(order => order.warehouse);
        return Array.from(new Set(warehouses)).filter(warehouse => warehouse).sort();
    }, [amazonPrepOrders]);
    uniqueWarehouses.sort();
    const transformedWarehouses = useMemo(() => ([
        {
            value: '-All warehouses-',
            label: '-All warehouses-',
        },
        ...uniqueWarehouses.map(warehouse => ({
            value: warehouse,
            label: warehouse,
        }))
    ]), [uniqueWarehouses]);

    const [filterReceiverCountry, setFilterReceiverCountry] = useState('-All countries-');
    // const allReceiverCountries = orders.map(order => order.receiverCountry);
    const uniqueReceiverCountries = useMemo(() => {
        const receiverCountries = amazonPrepOrders.map(order => order.receiverCountry);
        return Array.from(new Set(receiverCountries)).filter(country => country).sort();
    }, [amazonPrepOrders]);
    uniqueReceiverCountries.sort();
    const transformedReceiverCountries = useMemo(() => ([
        {
            value: '-All countries-',
            label: '-All countries-',
        },
        ...uniqueReceiverCountries.map(country => ({
            value: country,
            label: country,
        }))
    ]), [uniqueReceiverCountries]);

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

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

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTerm(newSearchTerm);
    };

    const [sortColumn, setSortColumn] = useState<keyof AmazonPrepOrderType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof AmazonPrepOrderType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    const filteredOrders = useMemo(() => {
        setCurrent(1);

        return amazonPrepOrders.filter(order => {
            const matchesSearch = !searchTerm.trim() || Object.keys(order).some(key => {
                const value = order[key];
                if (key !== 'uuid' && typeof value === 'string') {
                    const searchTermsArray = searchTerm.trim().split(' ');
                    return searchTermsArray.some(word => value.includes(word));
                }
                return false;
            });
            const matchesWarehouse = !filterWarehouse || filterWarehouse === '-All warehouses-' ||
                order.warehouse.toLowerCase() === filterWarehouse.toLowerCase();
            const matchesReceiverCountry = !filterReceiverCountry || filterReceiverCountry === '-All countries-' ||
                order.receiverCountry.toLowerCase() === filterReceiverCountry.toLowerCase();
            return matchesSearch && matchesWarehouse && matchesReceiverCountry;
        }).sort((a, b) => {
            if (!sortColumn) return 0;
            if (sortDirection === 'ascend') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        });
    }, [amazonPrepOrders, searchTerm, filterStatus, filterWarehouse, filterReceiverCountry, sortColumn, sortDirection]);

    const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        setShowDatepicker(false);
    };

    const [isFiltersVisible, setIsFiltersVisible] = useState(true);

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    useEffect(() => {
        setFilteredAmazonPrepOrders(filteredOrders);

    }, [filteredOrders]);

    const columns: TableColumnProps<AmazonPrepOrderType>[]  = [
        {
            key: 'warehouseCountries',
            title: <TitleColumn
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenBefore={<Icon name={"car"}/>}>
                    </TitleColumn>,
            render: (text: string, record) =>
                <TableCell
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    value={'➔'}
                    childrenBefore={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.warehouseCountry.toLowerCase()} flag-icon`}></span>
                            <div style={{ fontSize: '8px' }}>{record.warehouseCountry}</div>
                        </div>
                    }
                    childrenAfter={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}></span>
                            <div style={{ fontSize: '8px' }}>{record.receiverCountry}</div>
                        </div>
                }
                >
                </TableCell>,
            dataIndex: 'icon',
            // key: 'icon',
        },
        {
            title: <TitleColumn title="Status" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.statusGroup);
                return (
                    <TableCell
                        minWidth="60px"
                        maxWidth="60px"
                        contentPosition="start"
                        childrenAfter={
                            <span style={{
                                borderBottom: `2px solid ${underlineColor}`,
                                display: 'inline-block',
                            }}>
                        {text}
                        </span>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
        },
        {
            title: <TitleColumn title="Date" minWidth="80px" maxWidth="80px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start"/>
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
        },
        {
            title: <TitleColumn title="WH number" minWidth="80px" maxWidth="80px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer'/>
            ),
            dataIndex: 'wapiTrackingNumber',
            key: 'wapiTrackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleEditAmazonPrepOrder(record.uuid)}
                };
            },
        },
        {
            title: <TitleColumn title="ASN" minWidth="100px" maxWidth="100px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="start"/>
            ),
            dataIndex: 'asnNumber',
            key: 'asnNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleEditAmazonPrepOrder(record.uuid)}
                };
            },
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Order ID" minWidth="100px" maxWidth="100px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="start"/>
            ),
            dataIndex: 'clientOrderID',
            key: 'clientOrderID',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Warehouse" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start"/>
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Courier" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start"/>
            ),
            dataIndex: 'courierService',
            key: 'courierService',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Method" minWidth="40px" maxWidth="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'deliveryMethod',
            key: 'deliveryMethod',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Products" minWidth="50px" maxWidth="50px" contentPosition="start"/>,
            render: (text: string, record: AmazonPrepOrderType) => (
                <TableCell
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenAfter ={
                    <span
                        className="products-cell-style"
                        onClick={(e) => {
                            setHoveredOrder(record);
                            setHoveredColumn('productLines');
                            setMousePosition({ x: e.clientX, y: e.clientY });
                            setIsDisplayedPopup(true);
                        }}
                        onMouseEnter={(e) => {
                            setHoveredOrder(record);
                            setHoveredColumn('productLines');
                            setMousePosition({ x: e.clientX, y: e.clientY });
                            setIsDisplayedPopup(true);
                        }}
                        onMouseLeave={() => {
                            setHoveredOrder(null);
                            setHoveredColumn('');
                            setMousePosition(null);
                            setIsDisplayedPopup(false);
                        }}
                    >
                        {text} <Icon name="info" />
                    </span>}>
                </TableCell>

            ),
            dataIndex: 'productLines',
            key: 'productLines',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['lg'],
        },
        ];
    return (
        <div className="table">
            <Head>
                <title>Orders</title>
                <meta name="orders" content="orders" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div className="search-container">
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.MOBILE} icon={'filter'}></Button>
                <Input
                    placeholder="🔍 Search..."
                    value={searchTerm}
                    onChange={e => handleFilterChange(e.target.value)}
                    className="search-input"
                />
            </div>
            {isFiltersVisible && (
            <div className="filter-container">
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <Selector
                    options={transformedStatuses}
                    value={filterStatus}
                    onChange={(value: string) => setFilterStatus(value)}
                />
                <Selector
                    options={transformedWarehouses}
                    value={filterWarehouse}
                    onChange={(value: string) => setFilterWarehouse(value)}
                />
                <Selector
                    options={transformedReceiverCountries}
                    value={filterReceiverCountry}
                    onChange={(value: string) => setFilterReceiverCountry(value)}
                />
            </div>)}
            <div className="page-size-container">
                <span className="page-size-text"></span>
                <PageSizeSelector
                    options={pageOptions}
                    value={pageSize}
                    onChange={(value: number) => handleChangePageSize(value)}
                />
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredOrders?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={filteredOrders.slice((current - 1) * pageSize, current * pageSize)}
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
                    total={filteredOrders.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
             </div>
            {hoveredOrder && isDisplayedPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: mousePosition?.y || 0,
                        left: mousePosition?.x || 0,
                    }}
                >
                    <UniversalPopup
                        width={null}
                        items={productItems}
                        position={'left'}
                        handleClose={()=>setIsDisplayedPopup(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(AmazonPrepList);
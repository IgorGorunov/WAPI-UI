import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Input, Pagination, Table, TableColumnProps} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@/styles/tables.scss";
import Selector from "@/components/InputSelect";
import Icon from "@/components/Icon";
import getSymbolFromCurrency from 'currency-symbol-map';
import {StatusColors} from '@/screens/DashboardPage/components/OrderStatuses';
import UniversalPopup from "@/components/UniversalPopup";
import {ColumnType} from "antd/es/table";
import DateInput from "@/components/DateInput";
import {DateRangeType, PeriodType} from "@/types/dashboard";
import {OrderType} from "@/types/orders";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";


type OrderListType = {
    orders: OrderType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredOrders: React.Dispatch<React.SetStateAction<OrderType[]>>;
    handleEditOrder(uuid: string): void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const OrderList: React.FC<OrderListType> = ({orders, currentRange, setCurrentRange, setFilteredOrders,handleEditOrder}) => {

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDisplayedPopup, setIsDisplayedPopup] = useState(false);
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [hoveredOrder, setHoveredOrder] = useState<OrderType | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
    const productItems = orders.flatMap(order => {
        return order.products.map(orderItem => ({
            uuid: order.uuid,
            title: orderItem.product,
            description: orderItem.quantity
        }));
    }).filter(item => item.uuid === hoveredOrder?.uuid);
    const troubleStatusesItems = orders.flatMap(order => {
        return order.troubleStatuses.map(orderItem => ({
            uuid: order.uuid,
            title: orderItem.period +': '+ orderItem.status,
            description: orderItem.troubleStatus + ': ' + orderItem.additionalInfo,
        }));
    }).filter(item => item.uuid === hoveredOrder?.uuid);

    const [filterStatus, setFilterStatus] = useState('-All statuses-');
    const allStatuses = orders.map(order => order.status);
    const uniqueStatuses = useMemo(() => {
        const statuses = orders.map(order => order.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [orders]);
    uniqueStatuses.sort();
    const transformedStatuses = useMemo(() => ([
        {
            value: '-All statuses-',
            label: '-All statuses-',
        },
        {
            value: '-Trouble statuses-',
            label: '-Trouble statuses-',
        },
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
        }))
    ]), [uniqueStatuses]);

    const [filterWarehouse, setFilterWarehouse] = useState('-All warehouses-');
    const allWarehouses = orders.map(order => order.warehouse);
    const uniqueWarehouses = useMemo(() => {
        const warehouses = orders.map(order => order.warehouse);
        return Array.from(new Set(warehouses)).filter(warehouse => warehouse).sort();
    }, [orders]);
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

    const [filterCourierService, setFilterCourierService] = useState('-All couriers-');
    const allCourierServices = orders.map(order => order.courierService);
    const uniqueCourierServices = useMemo(() => {
        const courierServices = orders.map(order => order.courierService);
        return Array.from(new Set(courierServices)).filter(courier => courier).sort();
    }, [orders]);
    uniqueCourierServices.sort();
    const transformedCourierServices = useMemo(() => ([
        {
            value: '-All couriers-',
            label: '-All couriers-',
        },
        ...uniqueCourierServices.map(courier => ({
            value: courier,
            label: courier,
        }))
    ]), [uniqueCourierServices]);

    const [filterReceiverCountry, setFilterReceiverCountry] = useState('-All countries-');
    const allReceiverCountries = orders.map(order => order.receiverCountry);
    const uniqueReceiverCountries = useMemo(() => {
        const receiverCountries = orders.map(order => order.receiverCountry);
        return Array.from(new Set(receiverCountries)).filter(country => country).sort();
    }, [orders]);
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

    const [sortColumn, setSortColumn] = useState<keyof OrderType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof OrderType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    const filteredOrders = useMemo(() => {
        setCurrent(1);
        const searchTermLower = searchTerm.toLowerCase();
        return orders.filter(order => {
            const matchesSearch = !searchTerm || Object.keys(order).some(key => {
                const value = order[key];
                return key !== 'uuid' && typeof value === 'string' && value.toLowerCase().includes(searchTermLower);
            });
            const matchesStatus = filterStatus === '-All statuses-' ||
                (filterStatus === '-Trouble statuses-' ? order.troubleStatusesExist : order.status === filterStatus);
            const matchesWarehouse = !filterWarehouse || filterWarehouse === '-All warehouses-' ||
                order.warehouse.toLowerCase() === filterWarehouse.toLowerCase();
            const matchesCourierService = !filterCourierService || filterCourierService === '-All couriers-' ||
                order.courierService.toLowerCase() === filterCourierService.toLowerCase();
            const matchesReceiverCountry = !filterReceiverCountry || filterReceiverCountry === '-All countries-' ||
                order.receiverCountry.toLowerCase() === filterReceiverCountry.toLowerCase();
            return matchesSearch && matchesStatus && matchesWarehouse && matchesCourierService && matchesReceiverCountry;
        }).sort((a, b) => {
            if (!sortColumn) return 0;
            if (sortDirection === 'ascend') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        });
    }, [orders, searchTerm, filterStatus, filterWarehouse, filterCourierService, filterReceiverCountry, sortColumn, sortDirection]);

    const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        setShowDatepicker(false);
    };

    useEffect(() => {
        setFilteredOrders(filteredOrders);

    }, [filteredOrders]);

    const columns: TableColumnProps<OrderType>[]  = [
        {
            title: <TitleColumn
                    width="60px"
                    contentPosition="center"
                    childrenBefore={<Icon name={"car"}/>}>
                    </TitleColumn>,
            render: (text: string, record) =>
                <TableCell
                    width="60px"
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
            key: 'icon',
        },
        {
            title: <TitleColumn title="Status" width="80px" contentPosition="start"/>,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.statusGroup);
                return (
                    <TableCell
                        width="80px"
                        contentPosition="start"
                        childrenBefore={
                            record.troubleStatusesExist && (
                                    <div style={{
                                        minHeight: '8px',
                                        minWidth: '8px',
                                        backgroundColor: 'red',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        marginRight: '5px',
                                        alignSelf: 'center',
                                    }}
                                         onMouseEnter={(e) => {
                                             setHoveredOrder(record);
                                             setHoveredColumn('status');
                                             setMousePosition({ x: e.clientX, y: e.clientY });
                                             setIsDisplayedPopup(true);

                                         }}
                                         onMouseLeave={() => {
                                             setHoveredOrder(null);
                                             setHoveredColumn('');
                                             setMousePosition(null);
                                             setIsDisplayedPopup(false);
                                         }}/>
                                )
                        }
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
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="Date" width="75px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="75px" contentPosition="start"/>
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            onCell: (record, rowIndex) => {
                return {
                    onClick: () => handleEditOrder(record.uuid)
                };
            },
        },
        {
            title: <TitleColumn title="WH number" width="75px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="75px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer'/>
            ),
            dataIndex: 'wapiTrackingNumber',
            key: 'wapiTrackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="COD" width="60px" contentPosition="start"/>,
            render: (text: string, record) => {
                const currencySymbol = getSymbolFromCurrency(record.codCurrency);
                return (
                    <TableCell
                        value={`${text} ${currencySymbol}`}
                        width="75px"
                        contentPosition="start">
                    </TableCell>
                );
            },
            dataIndex: 'codAmount',
            key: 'codAmount',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="Order ID" width="70px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="70px" contentPosition="start"/>
            ),

            dataIndex: 'clientOrderID',
            key: 'clientOrderID',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="Warehouse" width="60px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="60px" contentPosition="start"/>
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="Courier" width="60px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="60px" contentPosition="start"/>
            ),
            dataIndex: 'courierService',
            key: 'courierService',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="Tracking number" width="150px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="150px" contentPosition="start"/>
            ),
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="Products" width="50px" contentPosition="start"/>,
            render: (text: string, record: OrderType) => (
                <TableCell
                    width="50px"
                    contentPosition="center"
                    childrenAfter ={
                    <span
                        className="products-cell-style"
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
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        ];
    return (
        <div className="table">
            <div className="filter-container" >
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <Selector
                    options={transformedStatuses}
                    value={filterStatus}
                    onChange={(value: string) => setFilterStatus(value)}
                />
                <div>
                    <Selector
                        options={transformedWarehouses}
                        value={filterWarehouse}
                        onChange={(value: string) => setFilterWarehouse(value)}
                    />
                </div>
                <div>
                    <Selector
                        options={transformedCourierServices}
                        value={filterCourierService}
                        onChange={(value: string) => setFilterCourierService(value)}
                    />
                </div>
                <div>
                    <Selector
                        options={transformedReceiverCountries}
                        value={filterReceiverCountry}
                        onChange={(value: string) => setFilterReceiverCountry(value)}
                    />
                </div>
            </div>
            <div className="filter-container" >
                <Input
                    placeholder="🔍 Search..."
                    value={searchTerm}
                    onChange={e => handleFilterChange(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="page-size-container">
                <span className="page-size-text">Orders list</span>
                <PageSizeSelector
                    options={pageOptions}
                    value={pageSize}
                    onChange={(value: number) => handleChangePageSize(value)}
                />
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '}`}>
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
                        width={
                            (() => {
                                switch (hoveredColumn) {
                                    case 'productLines':
                                        return null;
                                    case 'status':
                                        return 800;
                                    default:
                                        return null;
                                }
                            })()
                        }
                        items={
                            (() => {
                                switch (hoveredColumn) {
                                    case 'productLines':
                                        return productItems;
                                    case 'status':
                                        return troubleStatusesItems;
                                    default:
                                        return [];
                                }
                            })()
                        }
                        position={
                            (() => {
                                switch (hoveredColumn) {
                                    case 'productLines':
                                        return 'left';
                                    case 'status':
                                        return 'right';
                                    default:
                                        return 'left';
                                }
                            })()
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(OrderList);
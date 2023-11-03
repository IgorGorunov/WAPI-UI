import React, {useEffect, useState} from "react";
import {Input, Pagination, Table, TableColumnProps} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Selector from "@/components/InputSelect";
import Icon from "@/components/Icon";
import getSymbolFromCurrency from 'currency-symbol-map';
import {StatusColors} from '@/screens/DashboardPage/components/OrderStatuses';
import UniversalPopup from "@/components/UniversalPopup";
import {ColumnType} from "antd/es/table";
import Datepicker from '@/components/Datepicker';
import Button from "@/components/Button/Button";
import DateInput from "@/components/DateInput";
import {DateRangeType, PeriodType} from "@/types/dashboard";
import {OrderType} from "@/types/orders";


type OrderListType = {
    orders: OrderType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredOrders: React.Dispatch<React.SetStateAction<OrderType[]>>;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
];


const OrderList: React.FC<OrderListType> = ({orders, currentRange, setCurrentRange, setFilteredOrders}) => {

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
    const uniqueStatuses = Array.from(new Set(allStatuses)).filter(status => status);
    uniqueStatuses.sort();
    const transformedStatuses = [
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
    ];

    const [filterWarehouse, setFilterWarehouse] = useState('');
    const allWarehouses = orders.map(order => order.warehouse);
    const uniqueWarehouses = Array.from(new Set(allWarehouses)).filter(warehouse => warehouse);
    uniqueWarehouses.sort();
    const transformedWarehouses = [
        {
            value: '',
            label: '-All warehouses-',
        },
        ...uniqueWarehouses.map(warehouse => ({
            value: warehouse,
            label: warehouse,
        }))
    ];

    const [filterCourierService, setFilterCourierService] = useState('');
    const allCourierServices = orders.map(order => order.courierService);
    const uniqueCourierServices = Array.from(new Set(allCourierServices)).filter(courier => courier);
    uniqueCourierServices.sort();
    const transformedCourierServices = [
        {
            value: '',
            label: '-All couriers-',
        },
        ...uniqueCourierServices.map(courier => ({
            value: courier,
            label: courier,
        }))
    ];

    const [filterReceiverCountry, setFilterReceiverCountry] = useState('');
    const allReceiverCountries = orders.map(order => order.receiverCountry);
    const uniqueReceiverCountries = Array.from(new Set(allReceiverCountries)).filter(country => country);
    uniqueReceiverCountries.sort();
    const transformedReceiverCountries = [
        {
            value: '',
            label: '-All countries-',
        },
        ...uniqueReceiverCountries.map(country => ({
            value: country,
            label: country,
        }))
    ];

    const getUnderlineColor = (statusText: string) => {
        return StatusColors[statusText] || 'black';
    };

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

    const handleFilterChange = (newSearchTerm :string, newStatusFilter: string, newWarehouseFilter: string, newCourierServiceFilter:string, newReceiverCountryFilter:string) => {

        if (newSearchTerm !== "") {
            setSearchTerm(newSearchTerm);
        }

        if (newStatusFilter !== "") {
            setFilterStatus(newStatusFilter);
        }

        if (newWarehouseFilter!== "") {
            setFilterWarehouse(newWarehouseFilter);
        }

        if (newCourierServiceFilter!== "") {
            setFilterCourierService(newCourierServiceFilter);
        }

        if (newReceiverCountryFilter!== "") {
            setFilterReceiverCountry(newReceiverCountryFilter);
        }
        setCurrent(1);
    };

    const [sortColumn, setSortColumn] = useState<keyof OrderType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');

    const filteredOrders = orders.filter(order => {
        let matchesSearch: boolean;
        let matchesStatus = true;
        let matchesWarehouse = true;
        let matchesCourierService = true;
        let matchesReceiverCountry = true;

        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            matchesSearch = Object.values(order).some(value =>
                String(value).toLowerCase().includes(searchTermLower)
            );
        } else {
            matchesSearch = true;
        }

        if (filterStatus) {
            switch (filterStatus) {
                case '-All statuses-':
                    return true;
                case '-Trouble statuses-':
                    return matchesStatus = order.troubleStatusesExist === true;
                default:
                    return matchesStatus = order.status === filterStatus;
            }
        }

        if (filterWarehouse) {
            matchesWarehouse = order.warehouse === filterWarehouse;
        }

        if (filterCourierService) {
            matchesCourierService = order.courierService === filterCourierService;
        }

        if (filterReceiverCountry) {
            matchesReceiverCountry = order.receiverCountry === filterReceiverCountry;
        }

        return matchesSearch && matchesStatus && matchesWarehouse && matchesCourierService && matchesReceiverCountry;

    }).sort((a, b) => {
        if (!sortColumn) return 0;

        if (sortDirection === 'ascend') {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
        } else {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
    });

    useEffect(() => {
        setFilteredOrders(filteredOrders);
        console.log("clicked123")
    }, [filteredOrders]);

    const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        setShowDatepicker(false);
    };

    const columns: TableColumnProps<OrderType>[]  = [
        {
            title:  <Icon name={"car"} style={{display: 'flex', width: '60px', justifyContent:'center', alignItems:'center', textAlign:'center'}}/>,
            render: (text: string, record) =>
                <div className="flag" style={{ width: '60px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>
                    <span className={`fi fi-${record.warehouseCountry.toLowerCase()} flag-icon`}></span>
                    <span> ➔ </span>
                    <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}></span>
                </div>,
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title:  <div style={{display: 'flex', width: '80px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>Status</div>,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.statusGroup);
                return (
                    <div style={{display: 'flex', width: '80px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>
                        {record.troubleStatusesExist && (
                            <div style={{
                                height: '8px',
                                width: '8px',
                                backgroundColor: 'red',
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '5px',
                                alignSelf: 'center',
                            }}
                             onMouseEnter={(e) => {
                                 setHoveredOrder(record);
                                 setHoveredColumn('status');
                                 setIsDisplayedPopup(true);
                                 setMousePosition({ x: e.clientX, y: e.clientY });
                             }}
                             onMouseLeave={() => {
                                 setHoveredOrder(null);
                                 setHoveredColumn('');
                                 setIsDisplayedPopup(false);
                                 setMousePosition(null);
                             }}/>
                        )}
                        <span style={{
                            borderBottom: `2px solid ${underlineColor}`,
                            display: 'inline-block',

                        }}>

                        {text}
                        </span>
                    </div>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            title:  <div style={{display: 'flex', width: '75px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>Date</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '75px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>
                    <span>{text}</span>
                </div>
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            title:  <div style={{display: 'flex', width: '75px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>WH number</div>,
            render: (text: string) => (
                <div style={{ display: 'flex', width: '75px', color: 'var(--color-blue)', cursor:'pointer', justifyContent:'start', alignItems:'start', textAlign:'start'}}>
                    <span>{text}</span>
                </div>
            ),
            dataIndex: 'wapiTrackingNumber',
            key: 'wapiTrackingNumber',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            title:  <div style={{display: 'flex', width: '60px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>COD</div>,
            render: (text: string, record) => {
                const currencySymbol = getSymbolFromCurrency(record.codCurrency);
                return (
                    <div style={{display: 'flex', width: '60px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>
                        <span>{text} {currencySymbol}</span>
                    </div>
                );
            },
            dataIndex: 'codAmount',
            key: 'codAmount',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            title:  <div style={{display: 'flex', width: '70px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>Order ID</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '70px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>
                    <span>{text}</span>
                </div>
            ),

            dataIndex: 'clientOrderID',
            key: 'clientOrderID',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            title:  <div style={{display: 'flex', width: '60px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>Warehouse</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '60px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>
                    <span>{text}</span>
                </div>
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            title:  <div style={{display: 'flex', width: '60px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>Courier</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '60px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>
                    <span>{text}</span>
                </div>
            ),
            dataIndex: 'courierService',
            key: 'courierService',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            title:  <div style={{display: 'flex', width: '150px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>Tracking number</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '150px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>
                    <span>{text}</span>
                </div>
            ),
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            title:  <div style={{display: 'flex', width: '50px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Products</div>,
            render: (text: string, record: OrderType) => (
                <div style={{display: 'flex', width: '50px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>
                <span
                    className="products-cell-style"
                    onMouseEnter={(e) => {
                        setHoveredOrder(record);
                        setHoveredColumn('productLines');
                        setIsDisplayedPopup(true);
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                        setHoveredOrder(null);
                        setHoveredColumn('');
                        setIsDisplayedPopup(false);
                        setMousePosition(null);
                    }}
                >
                    {text} <Icon name="info" />
                </span>
                </div>

            ),
            dataIndex: 'productLines',
            key: 'productLines',
            sorter: true,
            onHeaderCell: (column:ColumnType<OrderType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof OrderType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        ];
    return (
        <div className="order-list">
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
                    onChange={e => handleFilterChange(e.target.value, "", "", "", "")}
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
            <div className={`card order-list__container mb-md ${animating ? '' : 'fade-in-down '}`}>
                <Table
                    dataSource={filteredOrders.slice((current - 1) * pageSize, current * pageSize)}
                    columns={columns}
                    pagination={false}
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
                                        return '200px';
                                    case 'status':
                                        return '800px';
                                    default:
                                        return '200px';
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
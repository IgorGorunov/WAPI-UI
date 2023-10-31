import React, {useEffect, useState} from "react";
import {Input, Pagination, Table, TableColumnProps} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Selector from "@/components/InputSelect";
import * as XLSX from 'xlsx';
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
];


const OrderList: React.FC<OrderListType> = ({orders, currentRange, setCurrentRange, setFilteredOrders}) => {

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDisplayedPopup, setIsDisplayedPopup] = useState(false);
    const [hoveredOrder, setHoveredOrder] = useState<OrderType | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
    const popupItems = orders.flatMap(order => {
        return order.products.map(orderItem => ({
            uuid: order.uuid,
            title: orderItem.product,
            description: orderItem.quantity
        }));
    }).filter(item => item.uuid === hoveredOrder?.uuid);

    const [filterStatus, setFilterStatus] = useState('');
    const allStatuses = orders.map(order => order.status);
    const uniqueStatuses = Array.from(new Set(allStatuses)).filter(status => status);
    uniqueStatuses.sort();
    const transformedStatuses = [
        {
            value: '',
            label: '-All statuses-',
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
            matchesStatus = order.status === filterStatus;
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

    // const [currentRange, setCurrentRange] = useState({
    //     startDate: new Date(),
    //     endDate: new Date(),
    // });

    const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        setShowDatepicker(false); // Закрываем Datepicker после выбора
        // Дополнительная логика обработки
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredOrders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, "Orders.xlsx");
    }

    const columns: TableColumnProps<OrderType>[]  = [
        {
            title:  <Icon name={"car"} />,
            dataIndex: 'icon',
            key: 'icon',
            render: (text: string, record) =>
                <div className="flag"  style={{ width: '50px'}}>
                    <span className={`fi fi-${record.warehouseCountry.toLowerCase()} flag-icon`}></span>
                    <span> ➔ </span>
                    <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}></span>
                </div>
        },
        {
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.statusGroup);

                return (
                    <div style={{ width: '70px' }}>
            <span style={{
                borderBottom: `2px solid ${underlineColor}`,
                display: 'inline-block'
            }}>
                {text}
            </span>
                    </div>
                );
            },
            title: 'Status',
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
            render: (text: string) => (
                <div style={{ width: '80px'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Date',
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
            render: (text: string) => (
                <div style={{ width: '110px', color: 'var(--color-blue)', cursor:'pointer'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'WH number',
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
            render: (text: string, record) => {
                const currencySymbol = getSymbolFromCurrency(record.codCurrency);
                return (
                    <div style={{ width: '60px'}}>
                        <span>{text} {currencySymbol}</span>
                    </div>
                );
            },
            title: 'COD',
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
            render: (text: string) => (
                <div style={{ width: '80px'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Order ID',
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
            render: (text: string) => (
                <div style={{ width: '60px'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Warehouse',
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
            render: (text: string) => (
                <div style={{ width: '60px'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Courier',
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
            render: (text: string) => (
                <div style={{ width: '90px'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Tracking number',
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
            render: (text: string, record: OrderType) => (
                <div style={{ width: '80px'}}>
                <span
                    className="products-cell-style"
                    onMouseEnter={(e) => {
                        setHoveredOrder(record);
                        setIsDisplayedPopup(true);
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                        setHoveredOrder(null);
                        setIsDisplayedPopup(false);
                        setMousePosition(null);
                    }}
                >
                    {text} <Icon name="info" />
                </span>
                </div>

            ),
            title: <div style={{ textAlign: 'center' }}>Products</div>,
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
        <div style={{width: '100%'}}>
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
            <div>
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
                        items={popupItems}
                        position='left'
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(OrderList);
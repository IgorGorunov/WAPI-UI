import React, { useState } from "react";
import {Table, TableColumnProps, Pagination, Input} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import StatusWarehouseSelector from "@/components/InputSelect";
import * as XLSX from 'xlsx';
import Icon from "@/components/Icon";
import getSymbolFromCurrency from 'currency-symbol-map';
import { StatusColors } from '@/screens/DashboardPage/components/OrderStatuses';


type OrderType = {
    icon: string,
    uuid: string;
    status: string;
    statusGroup: string;
    date: string;
    wapiTrackingNumber: string,
    isCod: boolean,
    сodAmount: string,
    codCurrency: string,
    clientOrderID: string,
    warehouse: string,
    warehouseCountry: string,
    courierService: string,
    trackingNumber: string,
    receiverCountry: string,
    productLines: number,
    products: {
        product: string,
        quantity: number,
    } [],
}

type OrderListType = {
    orders: OrderType[];
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
];


const OrderList: React.FC<OrderListType> = ({orders}) => {

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterWarehouse, setFilterWarehouse] = useState('');
    const allWarehouses = orders.map(order => order.warehouse);
    const uniqueWarehouses = Array.from(new Set(allWarehouses)).filter(warehouse => warehouse);
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

    const transformedWarehouses = [
        {
            value: '',
            label: 'All warehouses',
        },
        ...uniqueWarehouses.map(warehouse => ({
            value: warehouse,
            label: warehouse,
        }))
    ];

    const getUnderlineColor = (statusText: string) => {
        return StatusColors[statusText] || 'black';  // используйте цвет по умолчанию, если статус неизвестен
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

    const handleFilterChange = (newSearchTerm, newStatusFilter) => {

        if (newSearchTerm !== undefined) {
            setSearchTerm(newSearchTerm);
            setCurrent(1);
        }
        if (newStatusFilter !== undefined) {
            setFilterWarehouse(newStatusFilter);
            setCurrent(1);
        }
    };

    const filteredOrders = orders.filter(order => {
        let matchesSearch = false;
        let matchesStatus = true;

        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();

            matchesSearch = Object.values(order).some(value =>
                String(value).toLowerCase().includes(searchTermLower)
            );
        } else {
            matchesSearch = true;
        }

        if (filterWarehouse) {
            matchesStatus = order.warehouse === filterWarehouse;
        }

        return matchesSearch && matchesStatus;
    });

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
                    <span className={`fi fi-${record.warehouseCountry.toLowerCase()} "flag-icon"`}></span>
                    <span> ➔ </span>
                    <span className={`fi fi-${record.receiverCountry.toLowerCase()} "flag-icon"`}></span>
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
            dataIndex: 'сodAmount',
            key: 'сodAmount',
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
        },
        ];
    return (
        <div style={{width: '100%'}}>
            <div className="filter-container">
                <div>
                    <StatusWarehouseSelector
                        options={transformedWarehouses}
                        value={filterWarehouse}
                        onChange={(value) => handleFilterChange(undefined, value)}
                    />
                </div>
            </div>
            <div className="filter-container">
                <Input
                    placeholder="🔍 Search..."
                    value={searchTerm}
                    onChange={e => handleFilterChange(e.target.value, undefined)}
                    className="search-input"
                />
            </div>
            <div className="page-size-container">
                <span className="page-size-text">Orders list</span>
                <PageSizeSelector
                    options={pageOptions}
                    value={pageSize}
                    onChange={(value) => handleChangePageSize(value)}
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
        </div>
    );
};

export default OrderList;
import React, { useState } from "react";
import {Table, TableColumnProps, Pagination, Input} from 'antd';
import Button from "@/components/Button/Button";
import PageSizeSelector from '@/components/LabelSelect';
import StatusFilterSelector from '@/components/InputSelect';
import "./styles.scss";
import { SearchOutlined } from '@ant-design/icons';
import Icon from "@/components/Icon";
import UniversalPopup from "@/components/UniversalPopup";

type ProductType = {
    aliases: string;
    dimension: string;
    name: string;
    sku: string;
    uuid: string;
    weight: number;
    status: string,
    stock: {
        warehouse: string,
        total: number,
        damaged: number,
        expired: number,
        undefinedStatus: number,
        withoutBox: number,
        forPlacement: number,
        reserved: number,
        available: number,
    }[]
}

type ProductListType = {
    products: ProductType[];
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
];

const statusFilter = [
    { value: 'Approved', label: 'Approved' , color: '#5380F5'},
    { value: 'Declined', label: 'Declined' , color: '#FF4000'},
    { value: 'Draft', label: 'Draft' , color: '#FEDB4F'},
    { value: 'Pending', label: 'Pending' , color: '#FEDB4F'},
    { value: 'Cancelled', label: 'Cancelled' , color: '#FF4000'},
    { value: 'Expired', label: 'Expired' , color: '#FF4000'},
];

const ProductList: React.FC<ProductListType> = ({products}) => {

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState("Approved");
    const [isDisplayedPopup, setIsDisplayedPopup] = useState(false);
    const [hoveredProduct, setHoveredProduct] = useState<ProductType | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);

    const popupItems = products.flatMap(product => {
        return product.stock.map(stockItem => ({
            uuid: product.uuid,
            title: stockItem.warehouse,
            description: stockItem.available
        }));
    }).filter(item => item.uuid === hoveredProduct?.uuid);

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
            setFilterStatus(newStatusFilter);
            setCurrent(1);
        }
    };

    const filteredProducts = products.filter(product => {
        let matchesSearch = false;
        let matchesStatus = true;

        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();

            matchesSearch = Object.values(product).some(value =>
                String(value).toLowerCase().includes(searchTermLower)
            );
        } else {
            matchesSearch = true;
        }

        if (filterStatus) {
            matchesStatus = product.status === filterStatus;
        }

        return matchesSearch && matchesStatus;
    });


    const columns: TableColumnProps<ProductType>[]  = [
        {
            title: '',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color;
                switch (status) {
                    case "Approved":
                        color = '#5380F5';
                        break;
                    case "Declined":
                        color = '#FF4000';
                        break;
                    case "Draft":
                        color = '#FEDB4F';
                        break;
                    case "Pending":
                        color = '#FEDB4F';
                        break;
                    case "Cancelled":
                        color = '#FF4000';
                        break;
                    case "Expired":
                        color = '#FF4000';
                        break;
                    default:
                        color = 'white';
                }
                return <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color }}></div>;
            }
        },
        {
            render: (text: string) => (
                <div style={{ width: '100px'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            render: (text: string) => (
                <div style={{width: '200px', color: 'var(--color-blue)', cursor:'pointer'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            render: (text: string) => (
                <div style={{width: '100px',display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Dimension | mm</div>,
            dataIndex: 'dimension',
            key: 'dimension',

        },
        {
            render: (text: string) => (
                <div style={{width: '100px', display: 'flex',justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Weight | kg</div>,
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            render: (text: string) => (
                <div style={{ width: '200px'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Aliases',
            dataIndex: 'aliases',
            key: 'aliases',
        },
        {
            render: (text: string, record: ProductType) => (
                <div style={{ width: '100px'}}>
                <span
                    className="stock-cell-style"
                    onMouseEnter={(e) => {
                        setHoveredProduct(record);
                        setIsDisplayedPopup(true);
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                        setHoveredProduct(null);
                        setIsDisplayedPopup(false);
                        setMousePosition(null);
                    }}
                >
                    {text} <Icon name="info" />
                </span>
                </div>

            ),
            title: <div style={{ textAlign: 'center' }}>Available</div>,
            dataIndex: 'available',
            key: 'available',
        },
        ];
    return (
        <div style={{width: '100%'}}>
            <div className="status-filter-container">
                <div>
                    <StatusFilterSelector
                        options={statusFilter}
                        value={filterStatus}
                        onChange={(value) => handleFilterChange(undefined, value)}
                    />
                </div>
                <Input
                    placeholder="🔍 Search..."
                    value={searchTerm}
                    onChange={e => handleFilterChange(e.target.value, undefined)}
                    className="search-input"
                />
            </div>
            <div className="page-size-container">
                <span className="page-size-text">Products list</span>
                <PageSizeSelector
                    options={pageOptions}
                    value={pageSize}
                    onChange={(value) => handleChangePageSize(value)}
                />
            </div>
            <div className={`card product-list__container mb-md ${animating ? '' : 'fade-in-down '}`}>
                <Table
                    dataSource={filteredProducts.slice((current - 1) * pageSize, current * pageSize)}
                    columns={columns}
                    pagination={false}
                />
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={filteredProducts.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
             </div>
            {hoveredProduct && isDisplayedPopup && (
                <div
                    style={{
                        position: 'fixed', // используем 'fixed', так как координаты clientX и clientY основаны на видимой области окна
                        top: mousePosition?.y || 0,
                        left: mousePosition?.x || 0,
                        // ... другие стили
                    }}
                >
                    <UniversalPopup
                        items={popupItems}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductList;
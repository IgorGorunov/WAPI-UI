import React, { useState } from "react";
import {Table, TableColumnProps, Pagination, Input} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import { CountryCodes } from "@/types/countries";
import "/node_modules/flag-icons/css/flag-icons.min.css";

type ProductType = {
    name: string;
    sku: string;
    uuid: string;
    warehouse: string,
    warehouseSku: string,
    country: string,
    total: number,
    damaged: number,
    expired: number,
    undefinedStatus: number,
    withoutBox: number,
    forPlacement: number,
    reserved: number,
    available: number,
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

const ProductList: React.FC<ProductListType> = ({products}) => {

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDisplayedPopup, setIsDisplayedPopup] = useState(false);

    const handleChangePage = (page: number) => {
        setAnimating(true);
        setTimeout(() => {
            setCurrent(page);
            setAnimating(false);
        }, 500); // Это время должно совпадать с длительностью вашей CSS-анимации.
    };

    const handleChangePageSize = (size: number) => {
        setPageSize(size);
        setCurrent(1);
    };

    const handleFilterChange = (newSearchTerm) => {
        if (newSearchTerm !== undefined) {
            setSearchTerm(newSearchTerm);
        }
    };

    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true;

        const searchTermLower = searchTerm.toLowerCase();

        return Object.values(product).some(value =>
            String(value).toLowerCase().includes(searchTermLower)
        );
    });

    const columns: TableColumnProps<ProductType>[]  = [
        {
            title: '',
            dataIndex: 'country',
            key: 'country',
            width:'3%',
            render: (text: string) =>
                <div className="flag">
                    <span className={`fi fi-${text.toLowerCase()} "flag-icon"`}></span>
                </div>
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouse',
            key: 'warehouse',
            width:'3%',
        },
        {
            title: 'SKU',
            dataIndex: 'warehouseSku',
            key: 'warehouseSku',
            width:'10%',
        },
        {
            render: (text: string) => <span className="name-cell-style">{text}</span>,
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width:'20%',
        },
        {
            render: (text: string) => <span className="centred-cell-style">{text}</span>,
            title: <div style={{ textAlign: 'center' }}>Total</div>,
            dataIndex: 'total',
            key: 'total',
            width:'8%',
        },
        {
            render: (text: string) => <span className="centred-cell-style">{text}</span>,
            title: <div style={{ textAlign: 'center' }}>Available</div>,
            dataIndex: 'available',
            key: 'available',
            width:'8%',
        },
        {
            render: (text: string) => <span className="centred-cell-style">{text}</span>,
            title: <div style={{ textAlign: 'center' }}>Reserved</div>,
            dataIndex: 'reserved',
            key: 'reserved',
            width:'8%',
        },
        {
            render: (text: string) => <span className="centred-cell-style">{text}</span>,
            title: <div style={{ textAlign: 'center' }}>Damaged</div>,
            dataIndex: 'damaged',
            key: 'damaged',
            width:'8%',
        },
        {
            render: (text: string) => <span className="centred-cell-style">{text}</span>,
            title: <div style={{ textAlign: 'center' }}>Expired</div>,
            dataIndex: 'expired',
            key: 'expired',
            width:'8%',
        },
        {
            render: (text: string) => <span className="centred-cell-style">{text}</span>,
            title: <div style={{ textAlign: 'center' }}>Undefined Status</div>,
            dataIndex: 'undefinedStatus',
            key: 'undefinedStatus',
            width:'8%',
        },
        {
            render: (text: string) => <span className="centred-cell-style">{text}</span>,
            title: <div style={{ textAlign: 'center' }}>Without box</div>,
            dataIndex: 'withoutBox',
            key: 'withoutBox',
            width:'8%',
        },
        {
            render: (text: string) => <span className="centred-cell-style">{text}</span>,
            title: <div style={{ textAlign: 'center' }}>Returning</div>,
            dataIndex: 'forPlacement',
            key: 'forPlacement',
            width:'8%',
        },
        ];
    return (
        <div style={{width: '100%'}}>
            <div className="status-filter-container">
                <Input
                    placeholder="🔍 Search..."
                    value={searchTerm}
                    onChange={e => handleFilterChange(e.target.value)}
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
        </div>
    );
};

export default ProductList;
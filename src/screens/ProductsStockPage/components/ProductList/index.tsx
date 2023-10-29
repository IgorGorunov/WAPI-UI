import React, { useState } from "react";
import {Table, TableColumnProps, Pagination, Input} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import StatusWarehouseSelector from "@/components/InputSelect";
import * as XLSX from 'xlsx';

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
    const [filterWarehouse, setFilterWarehouse] = useState('');
    const allWarehouses = products.map(product => product.warehouse);
    const uniqueWarehouses = Array.from(new Set(allWarehouses));

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

        if (filterWarehouse) {
            matchesStatus = product.warehouse === filterWarehouse;
        }

        return matchesSearch && matchesStatus;
    });

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredProducts);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "products.xlsx");
    }


    const columns: TableColumnProps<ProductType>[]  = [
        {
            title: '',
            dataIndex: 'country',
            key: 'country',
            render: (text: string) =>
                <div className="flag" style={{ width: '10px'}}>
                    <span className={`fi fi-${text.toLowerCase()} "flag-icon"`}></span>
                </div>
        },
        {
            render: (text: string) => (
                <div style={{ width: '50px', display: 'flex'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Warehouse',
            dataIndex: 'warehouse',
            key: 'warehouse',
        },
        {
            render: (text: string) => (
                <div style={{ width: '80px'}}>
                    <span>{text}</span>
                </div>
            ),
            title: 'SKU',
            dataIndex: 'warehouseSku',
            key: 'warehouseSku',
        },
        {
            render: (text: string) => (
                <div style={{width: '100px', color: 'var(--color-blue)', cursor:'pointer' }}>
                    <span>{text}</span>
                </div>
            ),
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            render: (text: string) => (
                <div style={{width: '40px', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Total</div>,
            dataIndex: 'total',
            key: 'total',
        },
        {
            render: (text: string) => (
                <div style={{width: '40px', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Available</div>,
            dataIndex: 'available',
            key: 'available',
        },
        {
            render: (text: string) => (
                <div style={{width: '40px', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Reserved</div>,
            dataIndex: 'reserved',
            key: 'reserved',
        },
        {
            render: (text: string) => (
                <div style={{width: '40px', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Damaged</div>,
            dataIndex: 'damaged',
            key: 'damaged',
        },
        {
            render: (text: string) => (
                <div style={{width: '40px', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Expired</div>,
            dataIndex: 'expired',
            key: 'expired',
        },
        {
            render: (text: string) => (
                <div style={{width: '40px', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Undefined Status</div>,
            dataIndex: 'undefinedStatus',
            key: 'undefinedStatus',
        },
        {
            render: (text: string) => (
                <div style={{width: '40px', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Without box</div>,
            dataIndex: 'withoutBox',
            key: 'withoutBox',
        },
        {
            render: (text: string) => (
                <div style={{width: '40px', display: 'flex', justifyContent:'center', alignItems:'center'}}>
                    <span>{text}</span>
                </div>
            ),
            title: <div style={{ textAlign: 'center' }}>Returning</div>,
            dataIndex: 'forPlacement',
            key: 'forPlacement',
        },
        ];
    return (
        <div style={{width: '100%'}}>
            <div className="warehouse-filter-container">
                <div>
                    <StatusWarehouseSelector
                        options={transformedWarehouses}
                        value={filterWarehouse}
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
        </div>
    );
};

export default ProductList;
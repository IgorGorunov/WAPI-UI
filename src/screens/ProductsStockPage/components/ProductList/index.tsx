import React, {useEffect, useState} from "react";
import {Table, TableColumnProps, Pagination, Input} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import StatusWarehouseSelector from "@/components/InputSelect";
import * as XLSX from 'xlsx';
import {ColumnType} from "antd/es/table";
import { ProductStockType} from "@/types/products";


type ProductListType = {
    products: ProductStockType[];
    setFilteredProducts: React.Dispatch<React.SetStateAction<ProductStockType[]>>;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
];


const ProductList: React.FC<ProductListType> = ({products, setFilteredProducts}) => {

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

    const [sortColumn, setSortColumn] = useState<keyof ProductStockType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');

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
    }).sort((a, b) => {
        if (!sortColumn) return 0;

        if (sortDirection === 'ascend') {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
        } else {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
    });

    useEffect(() => {
        setFilteredProducts(filteredProducts)
    }, [filteredProducts]);

    const columns: TableColumnProps<ProductStockType>[]  = [
        {
            render: (text: string) => (
                <div className="flag" style={{display: 'block', width: '30px', textAlign:'center'}}>
                    <span className={`fi fi-${text.toLowerCase()} "flag-icon"`}></span>
                </div>
            ),
            title: <div style={{display: 'block'}}></div>,
            dataIndex: 'country',
            key: 'country',
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '70px'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '70px'}}>Warehouse</div>,
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '80px'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '80px'}}>SKU</div>,
            dataIndex: 'warehouseSku',
            key: 'warehouseSku',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '90px', color: 'var(--color-blue)', cursor:'pointer' }}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '90px'}}>Name</div>,
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '40px', textAlign:'center'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '40px', textAlign: 'center'}}>Total</div>,
            dataIndex: 'total',
            key: 'total',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '60px', textAlign:'center'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '60px', textAlign: 'center'}}>Available</div>,
            dataIndex: 'available',
            key: 'available',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '60px', textAlign:'center'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '60px', textAlign: 'center'}}>Reversed</div>,
            dataIndex: 'reserved',
            key: 'reserved',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '60x', textAlign:'center'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '60px', textAlign: 'center'}}>Damaged</div>,
            dataIndex: 'damaged',
            key: 'damaged',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '50px', textAlign:'center'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '50px', textAlign: 'center'}}>Expired</div>,
            dataIndex: 'expired',
            key: 'expired',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '65px', textAlign:'center'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '65px', textAlign: 'center'}}>Undefined status</div>,
            dataIndex: 'undefinedStatus',
            key: 'undefinedStatus',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '50px', textAlign:'center'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '50px', textAlign: 'center'}}>Without box</div>,
            dataIndex: 'withoutBox',
            key: 'withoutBox',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
        },
        {
            render: (text: string) => (
                <div style={{display: 'block', width: '65px', textAlign:'center'}}>{text}</div>
            ),
            title:  <div style={{display: 'block', width: '65px', textAlign: 'center'}}>Returning</div>,
            dataIndex: 'forPlacement',
            key: 'forPlacement',
            sorter: true,
            onHeaderCell: (column:ColumnType<ProductStockType>) => ({
                onClick: () => {
                    if (sortColumn === column.dataIndex) {
                        setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend');
                    } else {
                        setSortColumn(column.dataIndex as keyof ProductStockType);
                        setSortDirection('ascend');
                    }
                },
            }),
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

export default React.memo(ProductList);
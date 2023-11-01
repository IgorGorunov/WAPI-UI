import React, {useEffect, useState} from "react";
import {Table, TableColumnProps, Pagination, Input} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import StatusWarehouseSelector from "@/components/InputSelect";
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
            title: <div style={{display: 'flex', width: '20px', justifyContent:'center', alignItems:'center', textAlign:'center'}}></div>,
            render: (text: string) => (
                <div className="flag" style={{display: 'flex', width: '30px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>
                    <span className={`fi fi-${text.toLowerCase()} "flag-icon"`}></span>
                </div>
            ),
            dataIndex: 'country',
            key: 'country',
        },
        {
            title:  <div style={{display: 'flex', width: '70px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>Warehouse</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '70px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '80px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>SKU</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '80px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '90px', justifyContent:'start', alignItems:'start', textAlign:'start'}}>Name</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '90px', color: 'var(--color-blue)', cursor:'pointer', justifyContent:'start', alignItems:'start' , textAlign:'start'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '40px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Total</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '40px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '60px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Available</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '60px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '60px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Reversed</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '60px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '60px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Damaged</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '60x', justifyContent:'center', alignItems:'center', textAlign:'center'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '50px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Expired</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '50px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '65px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Undefined status</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '65px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '50px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Without box</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '50px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>{text}</div>
            ),
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
            title:  <div style={{display: 'flex', width: '65px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>Returning</div>,
            render: (text: string) => (
                <div style={{display: 'flex', width: '65px', justifyContent:'center', alignItems:'center', textAlign:'center'}}>{text}</div>
            ),
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
        <div className='product-stock'>
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
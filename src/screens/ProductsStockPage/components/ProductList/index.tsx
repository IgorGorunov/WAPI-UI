import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Table, Pagination, Input} from 'antd';
import {ColumnType} from "antd/es/table";

import "./styles.scss";
import "@/styles/tables.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import {ProductStockType} from "@/types/products";

import StatusWarehouseSelector from "@/components/InputSelect";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import {responsiveArray} from "@/utils/responsiveObserve";

type ProductListType = {
    products: ProductStockType[];
    setFilteredProducts: React.Dispatch<React.SetStateAction<ProductStockType[]>>;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const ProductList: React.FC<ProductListType> = ({products, setFilteredProducts}) => {

    const [animating, setAnimating] = useState(false);

    // Pagination
    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
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

    // Sorting
    const [sortColumn, setSortColumn] = useState<keyof ProductStockType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof ProductStockType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    // Filter and searching
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
    const handleFilterChange = (newSearchTerm: string, newStatusFilter: string) => {
        if (newSearchTerm !== undefined) {
            setSearchTerm(newSearchTerm);
        }
        if (newStatusFilter !== undefined) {
            setFilterWarehouse(newStatusFilter);
        }
    };
    const filteredProducts = useMemo(() => {
        setCurrent(1);
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = products.filter(product => {
            const matchesSearch = !searchTerm || Object.keys(product).some(key => {
                const value = product[key];
                return key !== 'uuid' && typeof value === 'string' && value.toLowerCase().includes(searchTermLower);
            });
            const matchesStatus = !filterWarehouse || product.warehouse === filterWarehouse;
            return matchesSearch && matchesStatus;
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                if (sortDirection === 'ascend') {
                    return a[sortColumn] > b[sortColumn] ? 1 : -1;
                } else {
                    return a[sortColumn] < b[sortColumn] ? 1 : -1;
                }
            });
        }
        return filtered;
    }, [products, searchTerm, filterWarehouse, sortColumn, sortDirection]);

    useEffect(() => {
        setFilteredProducts(filteredProducts)
    }, [filteredProducts]);

    const columns: ColumnType<ProductStockType>[] = useMemo(() => [
        {
            title: <TitleColumn title="" width="30px" contentPosition="center"
            />,
            render: (text: string) => (
               <TableCell
                    width="20px"
                    contentPosition="center"
                    childrenBefore={<span className={`fi fi-${text.toLowerCase()} "flag-icon"`}></span>}>
               </TableCell>
            ),
            dataIndex: 'country',
            key: 'country',
            responsive: ['sm'],
        },
        {
            title: <TitleColumn
                title=""
                width="40px"
                contentPosition="start"
                childrenBefore={<Icon name={"warehouse"}/>}
            />,
            render: (text: string) => (
                <TableCell value={text} width="40px" contentPosition="start"/>
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },
        {
            title: <TitleColumn title="SKU" width="50px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="50px" contentPosition="start"/>
            ),
            dataIndex: 'warehouseSku',
            key: 'warehouseSku',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Name" width="100px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="100px" contentPosition="start"/>
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },
        {
            title: <TitleColumn title="Available" width="30px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="30px" contentPosition="center"/>
            ),
            dataIndex: 'available',
            key: 'available',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },


        {
            title: <TitleColumn title="Reserve" width="30px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="30px" contentPosition="center"/>
            ),
            dataIndex: 'reserved',
            key: 'reserved',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Damaged" width="30px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="30px" contentPosition="center"/>
            ),
            dataIndex: 'damaged',
            key: 'damaged',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Expired" width="30px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="30px" contentPosition="center"/>
            ),
            dataIndex: 'expired',
            key: 'expired',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Undefined status" width="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="40px" contentPosition="center"/>
            ),
            dataIndex: 'undefinedStatus',
            key: 'undefinedStatus',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Without box" width="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="40px" contentPosition="center"/>
            ),
            dataIndex: 'withoutBox',
            key: 'withoutBox',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Returning" width="40px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="40px" contentPosition="center"/>
            ),
            dataIndex: 'forPlacement',
            key: 'forPlacement',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Total" width="20px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="20px" contentPosition="center"/>
            ),
            dataIndex: 'total',
            key: 'total',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['md'],
        },
        ], [handleHeaderCellClick]);
    return (
        <div className='table'>
            <div className="warehouse-filter-container">
                    <StatusWarehouseSelector
                        options={transformedWarehouses}
                        value={filterWarehouse}
                        onChange={(value: string) => handleFilterChange(undefined, value)}
                    />
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
                    onChange={(value: number) => handleChangePageSize(value)}
                />
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '}`}>
                <Table
                    dataSource={filteredProducts.slice((current - 1) * pageSize, current * pageSize)}
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
                    total={filteredProducts.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
             </div>
        </div>
    );
};

export default React.memo(ProductList);
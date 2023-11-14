import React, { useState , useMemo, useCallback, useEffect } from "react";
import {Table, Pagination, Input} from 'antd';
import {ColumnType} from "antd/es/table";

import "./styles.scss";
import "@/styles/tables.scss";

import {ProductType} from "@/types/products";

import PageSizeSelector from '@/components/LabelSelect';
import StatusFilterSelector from '@/components/InputSelect';
import UniversalPopup from "@/components/UniversalPopup";
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";

type ProductListType = {
    products: ProductType[];
    setFilteredProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
    handleEditProduct(uuid: string): void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const statusFilter = [
    { value: 'Approved', label: 'Approved' , color: '#5380F5'},
    { value: 'Declined', label: 'Declined' , color: '#FF4000'},
    { value: 'Draft', label: 'Draft' , color: '#FEDB4F'},
    { value: 'Pending', label: 'Pending' , color: '#FEDB4F'},
    { value: 'Rejected', label: 'Rejected' , color: '#FF4000'},
    { value: 'Expired', label: 'Expired' , color: '#FF4000'},
];

const ProductList: React.FC<ProductListType> = ({products, setFilteredProducts, handleEditProduct}) => {

    const [animating, setAnimating] = useState(false);

    // Popup
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

    // Pagination
    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
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

    // Sorting
    const [sortColumn, setSortColumn] = useState<keyof ProductType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof ProductType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);

    // Filter and searching
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState("Approved");
    const handleFilterChange = (newSearchTerm: string, newStatusFilter: string) => {
        if (newSearchTerm !== undefined) {
            setSearchTerm(newSearchTerm);
        }
        if (newStatusFilter !== undefined) {
            setFilterStatus(newStatusFilter);
        }
    };
    const filteredProducts = useMemo(() => {
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = products.filter(product => {
            const matchesSearch = !searchTerm || Object.values(product).some(value =>
                String(value).toLowerCase().includes(searchTermLower)
            );
            const matchesStatus = !filterStatus || product.status === filterStatus;
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
    }, [products, searchTerm, filterStatus, sortColumn, sortDirection]);

    useEffect(() => {
        setFilteredProducts(filteredProducts)
    }, [searchTerm, filterStatus]);

    // Table
    const columns: ColumnType<ProductType>[] = useMemo(() => [
        {
            title: <TitleColumn width="20px" contentPosition="center"/>,
            render: (status: string) => {
                const statusObj = statusFilter.find(s => s.value === status);
                let color = statusObj ? statusObj.color : 'white';
                return (
                    <TableCell
                        width="20px"
                        contentPosition="center"
                        childrenAfter={<div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: color
                                    }}></div>}>
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
        },
        {

            title: <TitleColumn title="SKU" width="130px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="130px" contentPosition="start"/>
            ),
            dataIndex: 'sku',
            key: 'sku',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
        },
        {
            title: <TitleColumn title="Name" width="200px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="200px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer'/>
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            onCell: (record, rowIndex) => {
                return {
                    onClick: () => handleEditProduct(record.uuid)
                };
            },

        },
        {
            title: <TitleColumn title="Dimension | mm" width="100px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="100px" contentPosition="center"/>
            ),
            dataIndex: 'dimension',
            key: 'dimension',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
        },
        {
            title: <TitleColumn title="Weight | kg" width="100px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} width="100px" contentPosition="center"/>
            ),
            dataIndex: 'weight',
            key: 'weight',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
        },
        {
            title: <TitleColumn title="Aliases" width="150px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} width="100px" contentPosition="start"/>
            ),
            dataIndex: 'aliases',
            key: 'aliases',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
        },
        {
            title: <TitleColumn title="Available" width="100px" contentPosition="center"/>,
            render: (text: string, record: ProductType) => (
                <TableCell
                    width="100px"
                    contentPosition="start"
                    childrenAfter={<span
                        className="stock-cell-style"
                        onMouseEnter={(e) => {
                            setHoveredProduct(record);
                            setMousePosition({ x: e.clientX, y: e.clientY });
                            setIsDisplayedPopup(true);
                        }}
                        onMouseLeave={() => {
                            setHoveredProduct(null);
                            setMousePosition(null);
                            setIsDisplayedPopup(false);
                        }}
                    >
                        {text} <Icon name="info" />
                    </span>
                    }>
                </TableCell>
            ),
            dataIndex: 'available',
            key: 'available',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
        },
        ], [handleHeaderCellClick, setHoveredProduct, setIsDisplayedPopup]);
    return (
        <div className='table'>
            <div className="status-filter-container">
                <div>
                    <StatusFilterSelector
                        options={statusFilter}
                        value={filterStatus}
                        onChange={(value: string) => handleFilterChange(undefined, value)}
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
                    onChange={(value: number) => handleChangePageSize(value)}
                />
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '}`}>
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
                        position: 'fixed',
                        top: mousePosition?.y || 0,
                        left: mousePosition?.x || 0,
                    }}
                    >
                    <UniversalPopup
                        items={popupItems}
                        position='left'
                        width = {150}
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(ProductList);
import React, { useState , useMemo, useCallback, useEffect } from "react";
import {Table, Pagination} from 'antd';
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
import Head from "next/head";
import {PageOptions} from '@/constants/pagination';
import SearchField from "@/components/SearchField";

type ProductListType = {
    products: ProductType[];
    setFilteredProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
    handleEditProduct(uuid: string): void;
}

const statusFilter = [
    { value: 'All statuses', label: 'All statuses' , color: 'var(--color-light-blue-gray)'},
    { value: 'Approved', label: 'Approved' , color: '#5380F5'},
    { value: 'Declined', label: 'Declined' , color: '#FF4000'},
    { value: 'Draft', label: 'Draft' , color: '#FEDB4F'},
    { value: 'Pending', label: 'Pending' , color: '#FFA500'},
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
    const [filterStatus, setFilterStatus] = useState("All statuses");
    const handleFilterChange = (newSearchTerm: string, newStatusFilter: string) => {
        if (newSearchTerm !== undefined) {
            setSearchTerm(newSearchTerm);
        }
        if (newStatusFilter !== undefined) {
            setFilterStatus(newStatusFilter);
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
            const matchesStatus = filterStatus === 'All statuses' || product.status === filterStatus;
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
            wight: "20px",
            title: <TitleColumn minWidth="20px" maxWidth="20px" contentPosition="center"/>,
            render: (status: string) => {
                const statusObj = statusFilter.find(s => s.value === status);
                let color = statusObj ? statusObj.color : 'white';
                return (
                    <TableCell
                        minWidth="20px"
                        maxWidth="20px"
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
            title: <TitleColumn title="SKU" minWidth="120px" maxWidth="200px" contentPosition="start" />,
            render: (text: string) => (
                <TableCell value={text} minWidth="120px" maxWidth="200px" contentPosition="start"/>
            ),
            dataIndex: 'sku',
            key: 'sku',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['sm'],
        },
        {
            title: <TitleColumn title="Name" minWidth="150px" maxWidth="500px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="150px" maxWidth="500px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer'/>
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => handleEditProduct(record.uuid)
                };
            },
        },
        {
            title: <TitleColumn title="Dimension | mm" minWidth="100px" maxWidth="100px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="center"/>
            ),
            dataIndex: 'dimension',
            key: 'dimension',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Weight | kg" minWidth="80px" maxWidth="80px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="center"/>
            ),
            dataIndex: 'weight',
            key: 'weight',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Aliases" minWidth="100px" maxWidth="300px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="300px" contentPosition="start"/>
            ),
            dataIndex: 'aliases',
            key: 'aliases',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Available" minWidth="90px" maxWidth="90px" contentPosition="center"/>,
            render: (text: string, record: ProductType) => (
                <TableCell
                    minWidth="90px"
                    maxWidth="90px"
                    contentPosition="start"
                    childrenAfter={<span
                        className="stock-cell-style"
                        onClick={(e) => {
                            setHoveredProduct(record);
                            setMousePosition({ x: e.clientX, y: e.clientY });
                            setIsDisplayedPopup(true);
                        }}
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
            <Head>
                <title>Products</title>
                <meta name="products" content="products" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png"/>
            </Head>
            <div className="status-filter-container">
                <StatusFilterSelector
                    options={statusFilter}
                    value={filterStatus}
                    onChange={(value: string) => handleFilterChange(undefined, value)}
                />
                <SearchField searchTerm={searchTerm} handleChange={str=>handleFilterChange(str, undefined)} handleClear={()=>{setSearchTerm(""); handleFilterChange("",undefined);}} />
            </div>
            <div className="page-size-container">
                <span className="page-size-text"></span>
                <PageSizeSelector
                    options={PageOptions}
                    value={pageSize}
                    onChange={(value: number) => handleChangePageSize(value)}
                />
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredProducts?.length ? '' : 'is-empty'}`}>
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
                        handleClose={()=>setIsDisplayedPopup(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(ProductList);
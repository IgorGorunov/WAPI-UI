import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination, Popover, Table, TableColumnProps, Tooltip } from 'antd';
import { ColumnType } from "antd/es/table";

import styles from "./styles.module.scss";
import "@/styles/tables.scss";

import { ProductType, ProductFilterDataType } from "@/types/products";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import { PageOptions } from '@/constants/pagination';
import SearchField from "@/components/SearchField";
import { FormFieldTypes } from "@/types/forms";
import Button, { ButtonVariant } from "@/components/Button/Button";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import SimplePopup, { PopupItem } from "@/components/SimplePopup";
import { useIsTouchDevice } from "@/hooks/useTouchDevice";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import useAuth from "@/context/authContext";
import { getSellerName } from "@/utils/seller";
import { FilterComponentType } from "@/types/filters";
import Select from "@/components/FormBuilder/Select/SelectField";

type ProductListType = {
    products: ProductType[];
    isLoading?: boolean;
    totalProducts?: number;
    filterMetadata?: ProductFilterDataType | null;
    currentPage?: number;
    pageSize?: number;
    searchTerm?: string;
    fullTextSearch?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    selectedFilters?: Record<string, any>;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    onSearchChange?: (search: string, fullTextSearch: boolean) => void;
    onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    onFiltersChange?: (filters: Record<string, any>) => void;
    onClearFilters?: () => void;
    handleEditProduct(uuid: string): void;
    handleRefresh: () => void;
}

const statusFilter = [
    { value: 'All statuses', label: 'All statuses', color: 'var(--color-light-blue-gray)' },
    { value: 'Approved', label: 'Approved', color: '#5380F5' },
    { value: 'Declined', label: 'Declined', color: '#FF4000' },
    { value: 'Draft', label: 'Draft', color: '#FEDB4F' },
    { value: 'Pending', label: 'Pending', color: '#FFA500' },
    { value: 'Rejected', label: 'Rejected', color: '#FF4000' },
    { value: 'Expired', label: 'Expired', color: '#FF4000' },
];


const extraStatusHints = {
    'Draft': ' - needs to be send for approve',
}



const ProductList: React.FC<ProductListType> = ({
    products,
    isLoading,
    totalProducts,
    filterMetadata,
    currentPage = 1,
    pageSize: propPageSize = 10,
    searchTerm: propSearchTerm = '',
    fullTextSearch: propFullTextSearch = false,
    sortBy: propSortBy,
    sortOrder: propSortOrder,
    selectedFilters,
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    onSortChange,
    onFiltersChange,
    onClearFilters,
    handleEditProduct,
    // handleRefresh
}) => {
    const { needSeller, sellersList } = useAuth();
    const isTouchDevice = useIsTouchDevice();
    const [animating, setAnimating] = useState(false);

    const [current, setCurrent] = React.useState(currentPage);
    const [pageSize, setPageSize] = React.useState(propPageSize);
    const [searchTerm, setSearchTerm] = useState(propSearchTerm);
    const [fullTextSearch, setFullTextSearch] = useState(propFullTextSearch);

    React.useEffect(() => { setCurrent(currentPage); }, [currentPage]);
    React.useEffect(() => { setPageSize(propPageSize); }, [propPageSize]);
    React.useEffect(() => { setSearchTerm(propSearchTerm); }, [propSearchTerm]);
    React.useEffect(() => { setFullTextSearch(propFullTextSearch); }, [propFullTextSearch]);

    useEffect(() => {
        if (!isLoading) {
            setAnimating(true);
            const id = setTimeout(() => setAnimating(false), 50);
            return () => clearTimeout(id);
        }
    }, [products]);

    // Popup
    const getPopupItems = useCallback((hoveredProduct) => {
        return hoveredProduct ? hoveredProduct.stock.map(stockItem => ({
            uuid: hoveredProduct.uuid,
            title: stockItem.warehouse,
            description: stockItem.available
        })) : [];
    }, []);

    const handleChangePage = (page: number) => {
        setCurrent(page);
        if (onPageChange) onPageChange(page);
    };

    const handleChangePageSize = (size: number) => {
        setPageSize(size);
        setCurrent(1);
        if (onPageSizeChange) onPageSizeChange(size);
    };

    const handleFilterChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
        setCurrent(1);
        if (onSearchChange) onSearchChange(newSearchTerm.trim(), fullTextSearch);
    };

    const handleFullTextSearchChange = () => {
        setFullTextSearch(prev => !prev);
        if (onSearchChange) onSearchChange(searchTerm.trim(), !fullTextSearch);
    };

    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearch',
        label: 'Full text search',
        checked: fullTextSearch,
        onChange: handleFullTextSearchChange,
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    }

    const [sortColumn, setSortColumn] = useState<keyof ProductType | null>('name');
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');

    React.useEffect(() => {
        if (propSortBy) setSortColumn(propSortBy as keyof ProductType);
        if (propSortOrder) setSortDirection(propSortOrder === 'asc' ? 'ascend' : 'descend');
    }, [propSortBy, propSortOrder]);

    const handleHeaderCellClick = useCallback((columnDataIndex: keyof ProductType) => {
        const newDirection = sortColumn === columnDataIndex && sortDirection === 'ascend' ? 'descend' : 'ascend';
        setSortDirection(newDirection);
        setSortColumn(columnDataIndex);
        if (onSortChange) onSortChange(String(columnDataIndex), newDirection === 'ascend' ? 'asc' : 'desc');
    }, [sortColumn, sortDirection, onSortChange]);

    // filters draft logic
    const [draftFilters, setDraftFilters] = useState<Record<string, string[]>>({});
    const updateDraftFilter = useCallback((key: string, valuesOrUpdater: string[] | ((prev: string[]) => string[])) => {
        setDraftFilters(prev => {
            const currentValues = prev[key] || [];
            const newValues = typeof valuesOrUpdater === 'function' ? valuesOrUpdater(currentValues) : valuesOrUpdater;
            return { ...prev, [key]: newValues };
        });
    }, []);

    const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
    const setFilterOpen = useCallback((key: string, isOpen: boolean) => {
        setOpenFilters(prev => ({ ...prev, [key]: isOpen }));
    }, []);

    const [selectedSeller, setSelectedSeller] = useState<string>('All sellers');
    useEffect(() => {
        if (selectedFilters && selectedFilters.seller && typeof selectedFilters.seller === 'string') {
            setSelectedSeller(selectedFilters.seller);
        } else {
            setSelectedSeller('All sellers');
        }
    }, [selectedFilters]);

    const handleSellerChange = (value: string) => {
        setSelectedSeller(value);
        if (onFiltersChange) {
            onFiltersChange({ seller: value === 'All sellers' ? [] : [value] });
            setCurrent(1);
        }
    }

    const sellersOptions = useMemo(() => {
        return [{ label: 'All sellers', value: 'All sellers', amount: totalProducts || products.length }, ...sellersList.map(item => ({ ...item, amount: 0 }))];
    }, [sellersList, totalProducts, products.length]);

    const transformedStatuses = useMemo(() => {
        if (!filterMetadata?.statuses) return [];
        return filterMetadata.statuses.map(status => ({
            value: status.id || status.name,
            label: status.name || status.id,
            amount: status.count,
            color: statusFilter.find(item => item.value === (status.id || status.name))?.color || 'white',
        }));
    }, [filterMetadata?.statuses]);

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const selectedFiltersString = JSON.stringify(selectedFilters);
    useEffect(() => {
        if (isFiltersVisible) return;
        const newDraft: Record<string, string[]> = {};
        if (selectedFilters) {
            Object.entries(selectedFilters).forEach(([key, val]) => {
                if (key === 'seller') return;
                if (Array.isArray(val)) {
                    newDraft[key] = val;
                } else if (typeof val === 'string') {
                    newDraft[key] = [val];
                }
            });
        }
        setDraftFilters(newDraft);
    }, [selectedFiltersString, isFiltersVisible]);

    const applyFilters = useCallback(() => {
        const fullUpdate: Record<string, string[]> = {};
        Object.keys(draftFilters).forEach(key => {
            fullUpdate[key] = draftFilters[key]?.length ? draftFilters[key] : [];
        });
        if (onFiltersChange) onFiltersChange(fullUpdate);
        setCurrent(1);
    }, [draftFilters, onFiltersChange]);

    const hasUnappliedChanges = useMemo(() => {
        const applied = selectedFilters || {};
        const draftKeys = Object.keys(draftFilters).filter(k => draftFilters[k]?.length > 0);
        const appliedKeys = Object.keys(applied).filter(k => Array.isArray(applied[k]) && (applied[k] as string[]).length > 0);

        if (draftKeys.length !== appliedKeys.length) return true;
        return draftKeys.some(key => {
            const draftVal = draftFilters[key] || [];
            const appliedVal = Array.isArray(applied[key]) ? (applied[key] as string[]) : [];
            return draftVal.length !== appliedVal.length || draftVal.some((v, i) => v !== appliedVal[i]);
        });
    }, [draftFilters, selectedFilters]);

    const productFilters = [
        {
            filterTitle: 'Status',
            icon: 'status',
            filterDescriptions: '',
            filterOptions: transformedStatuses,
            filterState: draftFilters['status'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('status', val),
            isOpen: !!openFilters['status'],
            setIsOpen: (v: boolean) => setFilterOpen('status', v),
            onClose: () => updateDraftFilter('status', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('status', true); },
        },
    ] as FilterComponentType[];

    const activeProductFilters = useMemo(() => [
        {
            filterTitle: 'Status',
            icon: 'status' as any,
            filterDescriptions: '',
            filterOptions: transformedStatuses,
            filterState: selectedFilters?.status ? (typeof selectedFilters.status === 'string' ? [selectedFilters.status] : selectedFilters.status) : [],
            setFilterState: () => { },
            isOpen: false,
            setIsOpen: () => { },
            onClose: () => onFiltersChange?.({ status: [] }),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('status', true) },
        }
    ] as FilterComponentType[], [selectedFilters, transformedStatuses, onFiltersChange, setFilterOpen]);

    const filteredProducts = products;

    // Table
    const SellerColumns: TableColumnProps<ProductType>[] = [];
    if (needSeller()) {
        SellerColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="90px"
                maxWidth="100px"
                contentPosition="left"
                childrenBefore={
                    <Tooltip title="Seller's name" >
                        <div className='sorter-col-wrapper'>
                            <span className='table-header-title'>Seller</span>
                            {sortColumn === 'seller' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'seller' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (_text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="90px"
                        maxWidth="100px"
                        contentPosition="left"
                        childrenBefore={
                            <div className="seller-container">
                                {getSellerName(sellersList, record.seller)}
                            </div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'seller',
            key: 'seller',
            sorter: false,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<ProductType>);
    }

    const columns: ColumnType<ProductType>[] = useMemo(() => [
        {
            width: "33px",
            title: <TitleColumn minWidth="20px" maxWidth="20px" contentPosition="center" />,
            render: (status: string, record) => {
                const statusObj = statusFilter.find(s => s.value === status);
                let color = statusObj ? statusObj.color : 'white';
                return (
                    <TableCell
                        minWidth="20px"
                        maxWidth="20px"
                        contentPosition="center"
                        childrenAfter={
                            <Popover
                                content={<SimplePopup
                                    items={[{
                                        uuid: record?.uuid || '',
                                        title: record?.status + (extraStatusHints[record?.status] || '') || ''
                                    } as PopupItem]
                                    }
                                />}
                                trigger={isTouchDevice ? 'click' : 'hover'}
                                placement="right"
                                overlayClassName="doc-list-popover"
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: color
                                }}></div>
                            </Popover>
                        }>
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
        },
        // {
        //     width: "20px",
        //     title: <TitleColumn minWidth="10px" maxWidth="20px" contentPosition="center" />,
        //     render: (_text: string, record) => {
        //         // const statusObj = statusFilter.find(s => s.value === status);
        //         // let color = statusObj ? statusObj.color : 'white';
        //
        //         if (!record?.hasCertificate && record?.productType?.certificate && record.status == 'Draft') {
        //             return (
        //                 <TableCell
        //                     minWidth="20px"
        //                     maxWidth="20px"
        //                     contentPosition="center"
        //                     childrenAfter={
        //                         <Tooltip title="You need to upload certificate for this product to be approved!" placement="right" openClassName={'warning-tooltip'} overlayClassName={styles['warning-tooltip-overlay']} >
        //                             <span><Icon name="warning-exclamation" className="warning-icon" /></span>
        //                         </Tooltip>
        //
        //                     }>
        //                 </TableCell>
        //             )
        //         } else {
        //             return <span></span>
        //         }
        //     },
        //     dataIndex: 'certificate',
        //     key: 'certificate',
        // },
        {
            title: <TitleColumn title="" minWidth="20px" maxWidth="20px" contentPosition="start"
            />,
            render: (_text: string, record: ProductType) => (
                <TableCell
                    className='no-padding'
                    minWidth="20px"
                    maxWidth="20px"
                    contentPosition="center"
                    childrenAfter={
                        <span style={{ marginTop: '3px' }}>{record.notifications ? <Icon name="notification" /> : null}</span>}
                >
                </TableCell>

            ),
            dataIndex: 'notifications',
            key: 'notifications',
            sorter: true,
            responsive: ['lg'],
        },

        {
            title: <TitleColumn
                minWidth="110px"
                maxWidth="200px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="A unique code for tracking each product in inventory">
                        <div className='sorter-col-wrapper'>
                            <span>SKU</span>
                            {sortColumn === 'sku' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'sku' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="110px" maxWidth="200px" contentPosition="start" />
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
            title: <TitleColumn
                title=""
                minWidth="150px"
                maxWidth="500px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span>Name</span>
                        {sortColumn === 'name' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'name' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="150px" maxWidth="500px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer' className="text-break-all" />
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
        ...SellerColumns,
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="100px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Length, width, and height in millimeters">
                        <>
                            <span>Dimension | mm</span>
                        </>
                    </Tooltip>
                } />,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="center" />
            ),
            dataIndex: 'dimension',
            key: 'dimension',
            // sorter: true,
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title=""
                minWidth="80px"
                maxWidth="80px"
                contentPosition="center"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span>Weight | kg</span>
                        {sortColumn === 'weight' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'weight' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="center" />
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
            title: <TitleColumn
                minWidth="100px"
                maxWidth="300px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Alternative names">
                        <div className='sorter-col-wrapper'>
                            <span>Aliases</span>
                            {sortColumn === 'aliases' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'aliases' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                } />,
            render: (text: string) => (
                <TableCell value={text.trim().slice(-1) === '|' ? text.trim().slice(0, text.length - 2) : text} minWidth="100px" maxWidth="300px" contentPosition="start" />
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
            title: <TitleColumn
                title=""
                minWidth="100px"
                maxWidth="300px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Alternative names">
                        <div className='sorter-col-wrapper'>
                            <span>Barcodes</span>
                            {sortColumn === 'barcodes' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'barcodes' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={text.trim().slice(-1) === '|' ? text.trim().slice(0, text.length - 2) : text} minWidth="100px" maxWidth="300px" contentPosition="start" />
            ),
            dataIndex: 'barcodes',
            key: 'barcodes',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn
                minWidth="90px"
                maxWidth="90px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Available products for new orders">
                        <div className='sorter-col-wrapper'>
                            <span>Available</span>
                            {sortColumn === 'available' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'available' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                } />,
            render: (text: string, record: ProductType) => (
                <TableCell
                    minWidth="90px"
                    maxWidth="90px"
                    contentPosition="start"
                    childrenAfter={
                        <Popover
                            content={record.stock.length ? <SimplePopup
                                items={getPopupItems(record)}
                                width={150}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span className={styles["stock-cell-style"]}>{text} <Icon name="info" /></span>
                        </Popover>
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
    ], [handleHeaderCellClick, sortDirection, sortColumn]);

    return (
        <div className='table'>
            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER}
                    icon={'filter'}></Button>
                <div className='search-block'>
                    <SearchField
                        searchTerm={searchTerm}
                        handleSearch={handleFilterChange}
                        handleClear={() => { setSearchTerm(""); handleFilterChange(""); }}
                        manualSearch={true}
                    />
                    <FieldBuilder {...fullTextSearchField} />
                </div>
            </SearchContainer>
            {needSeller() ?
                <div className='seller-filter-block'>
                    <Select
                        key='seller-filter'
                        name='selectedSeller'
                        label='Seller: '
                        value={selectedSeller}
                        onChange={(val) => handleSellerChange(val as string)}
                        options={sellersOptions}
                        classNames='seller-filter full-sized'
                        isClearable={false}
                    />
                </div>
                : null
            }
            <div className={styles['product-list__notice']}>
                <p>Before sending a new product to our warehouse, please wait until the product receives "Approved" status</p>
            </div>

            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    <FiltersChosen filters={activeProductFilters} />
                </div>
                <div className="page-size-container">
                    <span className="page-size-text"></span>
                    <PageSizeSelector
                        options={PageOptions}
                        value={pageSize}
                        onChange={(value: number) => handleChangePageSize(value)}
                    />
                </div>
            </div>
            <div className='product-list__container'>
                <div
                    className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredProducts?.length ? '' : 'is-empty'}`}>
                    <Table
                        dataSource={filteredProducts.map(item => ({
                            ...item,
                            key: item.uuid
                        }))}
                        columns={columns}
                        pagination={false}
                        // scroll={{ y: 700 }}
                        showSorterTooltip={false}
                    />
                    <div className="order-products-total">
                        <ul className='order-products-total__list'>
                            <li className='order-products-total__list-item'>Total products:<span
                                className='order-products-total__list-item__value'>{totalProducts || products.length}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={totalProducts || products.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>
            <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible}
                onClearFilters={onClearFilters ? onClearFilters : () => updateDraftFilter('status', [])}
                onApplyFilters={applyFilters}
                hasUnappliedChanges={hasUnappliedChanges}>
                <FiltersListWithOptions filters={productFilters} />
            </FiltersContainer>
        </div>
    );
};

export default React.memo(ProductList);
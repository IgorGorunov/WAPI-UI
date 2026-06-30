import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Table, Pagination, Tooltip, Popover, TableColumnProps } from 'antd';
import { ColumnType } from "antd/es/table";
import styles from "./styles.module.scss";
import "@/styles/tables.scss";
import { ProductStockType, ProductStockFilterDataType } from "@/types/products";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import { PageOptions } from '@/constants/pagination';
import SearchField from "@/components/SearchField";
import Button, { ButtonVariant } from "@/components/Button/Button";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import { FormFieldTypes } from "@/types/forms";
import SearchContainer from "@/components/SearchContainer";
import { Countries } from "@/types/countries";
import FiltersContainer from "@/components/FiltersContainer";
import SimplePopup from "@/components/SimplePopup";
import { useIsTouchDevice } from "@/hooks/useTouchDevice";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import useAuth from "@/context/authContext";
import { FilterComponentType } from "@/types/filters";
import Select from "@/components/FormBuilder/Select/SelectField";

type ProductListType = {
    products: ProductStockType[];
    isLoading?: boolean;
    totalProducts?: number;
    filterMetadata?: ProductStockFilterDataType | null;
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
    handleRefresh?: () => void;
    setWarehouseForExport: React.Dispatch<React.SetStateAction<string>>;
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
    // handleRefresh,
    setWarehouseForExport
}) => {
    const { sellersList, needSeller } = useAuth();

    const [animating, setAnimating] = useState(false);
    const isTouchDevice = useIsTouchDevice();

    // Popup
    const getPopupItems = useCallback((hoveredReserve) => {
        if (!hoveredReserve) return [];

        return hoveredReserve.reservedRows.map(stockItem => ({
            uuid: hoveredReserve.uuid,
            title: stockItem.document,
            description: stockItem.reserved,
        }));
    }, []);

    const getOnShippingPopupItems = useCallback((hoveredOnShipping: ProductStockType) => {
        if (!hoveredOnShipping) return [];

        return hoveredOnShipping.onShippingRows.map(stockItem => ({
            uuid: hoveredOnShipping.uuid,
            title: `${stockItem.type} ${stockItem.number}`,
            description: stockItem.onshipping,
            docUuid: stockItem.uid,
            docType: stockItem.type,
        }));
    }, []);

    // Pagination
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

    const [sortColumn, setSortColumn] = useState<keyof ProductStockType | null>('name');
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');

    React.useEffect(() => {
        if (propSortBy) setSortColumn(propSortBy as keyof ProductStockType);
        if (propSortOrder) setSortDirection(propSortOrder === 'asc' ? 'ascend' : 'descend');
    }, [propSortBy, propSortOrder]);

    const handleHeaderCellClick = useCallback((columnDataIndex: keyof ProductStockType) => {
        const newDirection = sortColumn === columnDataIndex && sortDirection === 'ascend' ? 'descend' : 'ascend';
        setSortDirection(newDirection);
        setSortColumn(columnDataIndex);
        if (onSortChange) onSortChange(String(columnDataIndex), newDirection === 'ascend' ? 'asc' : 'desc');
    }, [sortColumn, sortDirection, onSortChange]);

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

    const getSellerName = useCallback((sellerUid: string) => {
        const t = sellersList.find(item => item.value === sellerUid);
        return t ? t.label : ' - ';
    }, [sellersList]);

    const transformedWarehouses = useMemo(() => {
        if (!filterMetadata?.warehouses) return [];
        return filterMetadata.warehouses.map(item => ({
            value: item.id,
            label: item.name || item.id,
            amount: item.count,
        }));
    }, [filterMetadata?.warehouses]);

    const transformedCountries = useMemo(() => {
        if (!filterMetadata?.countries) return [];
        return filterMetadata.countries.map(country => ({
            value: country.id,
            label: Countries[country.name || country.id] || country.name || country.id,
            country: country.name,
            amount: country.count,
        }));
    }, [filterMetadata?.countries]);

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const toggleFilters = () => setIsFiltersVisible(!isFiltersVisible);

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
            filterTitle: 'Warehouse',
            icon: 'warehouse',
            filterDescriptions: '',
            filterOptions: transformedWarehouses,
            filterState: draftFilters['warehouse'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('warehouse', val),
            isOpen: !!openFilters['warehouse'],
            setIsOpen: (v: boolean) => setFilterOpen('warehouse', v),
            onClose: () => updateDraftFilter('warehouse', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('warehouse', true); },
        },
        {
            filterTitle: 'Country',
            icon: 'country-location',
            isCountry: true,
            filterDescriptions: '',
            filterOptions: transformedCountries,
            filterState: draftFilters['country'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('country', val),
            isOpen: !!openFilters['country'],
            setIsOpen: (v: boolean) => setFilterOpen('country', v),
            onClose: () => updateDraftFilter('country', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('country', true); },
        },
    ] as FilterComponentType[];

    const activeProductFilters = useMemo(() => {
        const currentFlags = [
            {
                key: 'warehouse',
                filterTitle: 'Warehouse',
                icon: 'warehouse' as any,
                options: transformedWarehouses
            },
            {
                key: 'country',
                filterTitle: 'Country',
                icon: 'country-location' as any,
                isCountry: true,
                options: transformedCountries
            }
        ];

        return currentFlags.map(f => ({
            filterTitle: f.filterTitle,
            icon: f.icon,
            isCountry: f.isCountry,
            filterDescriptions: '',
            filterOptions: f.options,
            filterState: selectedFilters?.[f.key] ? (typeof selectedFilters[f.key] === 'string' ? [selectedFilters[f.key]] : selectedFilters[f.key]) : [],
            setFilterState: () => {},
            isOpen: false,
            setIsOpen: () => {},
            onClose: () => onFiltersChange?.({ [f.key]: [] }),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen(f.key, true); },
        }));
    }, [selectedFilters, transformedWarehouses, transformedCountries, onFiltersChange, setFilterOpen]);

    const filteredProducts = products;

    useEffect(() => {
        if (selectedFilters && selectedFilters.warehouse) {
            setWarehouseForExport(typeof selectedFilters.warehouse === 'string' ? selectedFilters.warehouse : selectedFilters.warehouse.join('_'))
        } else {
            setWarehouseForExport('');
        }
    }, [selectedFiltersString]);

    const curWidth = useMemo(() => {
        const displayedData = filteredProducts;
        const maxAmount = displayedData.reduce((acc, item) => Math.max(acc, item.reserved), 0).toString().length;

        const width = 63 + maxAmount * 9;
        return width.toString() + 'px';
    }, [filteredProducts]);


    //Columns
    const SellerColumns: TableColumnProps<ProductStockType>[] = [];
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
                                {getSellerName(record.seller)}
                            </div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'seller',
            key: 'seller',
            sorter: false,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<ProductStockType>);
    }

    const columns: ColumnType<ProductStockType>[] = useMemo(() => [
        {
            title: <TitleColumn title="" minWidth="15px" maxWidth="15px" contentPosition="center"
            />,
            render: (text: string) => (
                <TableCell
                    minWidth="15px"
                    maxWidth="auto"
                    contentPosition="center"
                    childrenBefore={<span className={`fi fi-${text.toLowerCase()} flag-icon`}></span>}>
                </TableCell>
            ),
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: <TitleColumn
                minWidth="40px"
                maxWidth="40px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Code of warehouse" >
                        <div className='sorter-col-wrapper' style={{ display: 'flex', alignItems: 'center' }}>
                            <span><Icon name={"warehouse"} /></span>
                            {sortColumn === 'warehouse' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'warehouse' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start" />
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="120px"
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
                <TableCell value={text} minWidth="80px" maxWidth="120px" contentPosition="start" />
            ),
            dataIndex: 'sku',
            key: 'sku',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title=""
                minWidth="150px"
                maxWidth="500px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="A unique code for tracking each product in inventory">
                        <div className='sorter-col-wrapper'>
                            <span>Name</span>
                            {sortColumn === 'name' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'name' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="150px" maxWidth="500px" contentPosition="start" />
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },
        ...SellerColumns,
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Available products for new orders">
                        <div className='sorter-col-wrapper'>
                            <span>Available</span>
                            {sortColumn === 'available' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'available' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="center" />
            ),
            dataIndex: 'available',
            key: 'available',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Products that were reserved for orders or movements">
                        <div className='sorter-col-wrapper'>
                            <span>Reserve</span>
                            {sortColumn === 'reserved' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'reserved' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: number, record: ProductStockType) => (
                <TableCell minWidth="80px" maxWidth="80px" contentPosition="center"
                    childrenBefore={
                        <Popover
                            content={record.reserved ? <SimplePopup
                                items={getPopupItems(record)}
                                width={200}
                                hasCopyBtn={true}
                                needScroll={true}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span style={{ width: curWidth }} className="products-cell-style">{text} <Icon
                                name="info" /></span>
                        </Popover>
                    }
                />
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
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Damaged products">
                        <div className='sorter-col-wrapper'>
                            <span>Damaged</span>
                            {sortColumn === 'damaged' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'damaged' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="center" />
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
            title: <TitleColumn
                minWidth="70px"
                maxWidth="70px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Products past usability">
                        <div className='sorter-col-wrapper'>
                            <span>Expired</span>
                            {sortColumn === 'expired' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'expired' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="70px" maxWidth="70px" contentPosition="center" />
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
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Products that are being returned to the warehouse">
                        <div className='sorter-col-wrapper'>
                            <span>Returning</span>
                            {sortColumn === 'forPlacement' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'forPlacement' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="center" />
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
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Products currently in transit in stock movements">
                        <div className='sorter-col-wrapper' style={{ display: 'flex', alignItems: 'center' }}>
                            <span>On shipping</span>
                            {sortColumn === 'onShipping' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'onShipping' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string, record: ProductStockType) => (
                <TableCell minWidth="80px" maxWidth="80px" contentPosition="center"
                    childrenBefore={
                        <Popover
                            content={record.onShipping ? <SimplePopup
                                items={getOnShippingPopupItems(record)}
                                width={300}
                                hasCopyBtn={true}
                                needScroll={true}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span style={{ width: curWidth }} className="products-cell-style">{text} <Icon
                                name="info" /></span>
                        </Popover>
                    }
                />
            ),
            dataIndex: 'onShipping',
            key: 'onShipping',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn
                minWidth="60px"
                maxWidth="60px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="All stock including all product statuses">
                        <div className='sorter-col-wrapper'>
                            <span>Total</span>
                            {sortColumn === 'total' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'total' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="center" />
            ),
            dataIndex: 'total',
            key: 'total',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['md'],
        },
    ], [handleHeaderCellClick, sortDirection, sortColumn]);

    return (
        <div className={`${styles['product-stock-list']} table`}>
            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
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

            {sellersList && needSeller() ?
                <div className='seller-filter-block'>
                    <Select
                        key='seller-filter'
                        name='selectedSeller'
                        label='Seller: '
                        value={selectedSeller}
                        onChange={(val) => handleSellerChange(val as string)}
                        //options={[{label: 'All sellers', value: 'All sellers'}, ...sellersList]}
                        options={sellersOptions}
                        classNames='seller-filter full-sized'
                        isClearable={false}
                    />
                </div>
                : null
            }

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
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredProducts?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={filteredProducts.map(item => ({
                        ...item,
                        key: item.tableKey,
                    }))}
                    columns={columns}
                    pagination={false}
                    // scroll={{ y: 700 }}
                    showSorterTooltip={false}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total products:<span className='order-products-total__list-item__value'>{totalProducts || products.length}</span></li>
                    </ul>
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

            <FiltersContainer 
                isFiltersVisible={isFiltersVisible} 
                setIsFiltersVisible={setIsFiltersVisible} 
                onClearFilters={onClearFilters ? onClearFilters : () => { updateDraftFilter('warehouse', []); updateDraftFilter('country', []); }}
                onApplyFilters={applyFilters}
                hasUnappliedChanges={hasUnappliedChanges}
            >
                <FiltersListWithOptions filters={productFilters} />
            </FiltersContainer>
        </div>
    );
};

export default React.memo(ProductList);
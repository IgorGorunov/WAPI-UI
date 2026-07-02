import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Pagination, Popover, Table, TableColumnProps, Tooltip } from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "@/styles/tables.scss";
import Icon from "@/components/Icon";
import { ColumnType } from "antd/es/table";
import DateInput from "@/components/DateInput";
import { DateRangeType } from "@/types/dashboard";
import { AmazonPrepOrderType } from "@/types/amazonPrep";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, { ButtonVariant } from "@/components/Button/Button";
import { StatusColors } from "@/screens/DashboardPage/components/OrderStatuses";
import SearchField from "@/components/SearchField";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import { FormFieldTypes } from "@/types/forms";
import { Countries } from "@/types/countries";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import {formatDateStringToDisplayString} from "@/utils/date";
import { useIsTouchDevice } from "@/hooks/useTouchDevice";
import SimplePopup from "@/components/SimplePopup";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import useAuth from "@/context/authContext";
import { FilterComponentType } from "@/types/filters";


import { AmazonPrepFilterDataType } from "../../types";
import Select from "@/components/FormBuilder/Select/SelectField";

type AmazonPrepListType = {
    amazonPrepOrders: AmazonPrepOrderType[];
    isLoading?: boolean;
    totalOrders?: number;
    filterMetadata?: AmazonPrepFilterDataType | null;
    currentPage?: number;
    pageSize?: number;
    searchTerm?: string;
    fullTextSearch?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    selectedFilters?: Record<string, any>;
    startDate?: string;
    endDate?: string;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    onSearchChange?: (search: string, fullTextSearch: boolean) => void;
    onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    onFiltersChange?: (filters: Record<string, any>) => void;
    onClearFilters?: () => void;
    // onPeriodChange?: (start: string, end: string) => void;
    onPeriodChange?: (startDate: Date, endDate: Date) => void;
    handleEditAmazonPrepOrder(uuid: string): void;
    handleRefresh?: () => void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const AmazonPrepList: React.FC<AmazonPrepListType> = ({ 
    amazonPrepOrders, 
    isLoading,
    totalOrders,
    filterMetadata,
    currentPage = 1,
    pageSize: propPageSize = 10,
    searchTerm: propSearchTerm = '',
    fullTextSearch: propFullTextSearch = false,
    sortBy,
    sortOrder,
    selectedFilters,
    startDate,
    endDate,
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    onSortChange,
    onFiltersChange,
    // onClearFilters,
    onPeriodChange,
    handleEditAmazonPrepOrder,
    // handleRefresh
}) => {
    const isTouchDevice = useIsTouchDevice();
    const { needSeller, sellersList } = useAuth();

    const [current, setCurrent] = React.useState(currentPage);
    const [pageSize, setPageSize] = React.useState(propPageSize);
    const [animating, setAnimating] = useState(false);
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
    }, [amazonPrepOrders, isLoading]);

    const getProductItems = useCallback((hoveredOrder) => {
        return hoveredOrder ? hoveredOrder.products.map(orderItem => ({
            uuid: hoveredOrder.uuid,
            title: orderItem.product,
            description: orderItem.quantity
        })) : [];
    }, []);

    const handleFullTextSearchChange = () => {
        if (onSearchChange) {
            onSearchChange(searchTerm, !fullTextSearch);
        }
    }
    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearch',
        label: 'Full text search',
        checked: fullTextSearch,
        onChange: handleFullTextSearchChange,
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    }

    // ===== Draft Filters Pattern =====
    const [draftFilters, setDraftFilters] = useState<Record<string, string[]>>({});
    const updateDraftFilter = useCallback((key: string, valuesOrUpdater: string[] | ((prev: string[]) => string[])) => {
        setDraftFilters(prev => {
            console.log('update filter state: ', key, valuesOrUpdater)
            const currentValues = prev[key] || [];
            const newValues = typeof valuesOrUpdater === 'function' ? valuesOrUpdater(currentValues) : valuesOrUpdater;
            return { ...prev, [key]: newValues };
        });
    }, []);

    const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
    const setFilterOpen = useCallback((key: string, isOpen: boolean) => {
        setOpenFilters(prev => ({ ...prev, [key]: isOpen }));
    }, []);

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

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
        const appliedKeys = Object.keys(applied).filter(k => k !== 'seller' && Array.isArray(applied[k]) && (applied[k] as string[]).length > 0);

        if (draftKeys.length !== appliedKeys.length) return true;
        return draftKeys.some(key => {
            const draftVal = draftFilters[key] || [];
            const appliedVal = Array.isArray(applied[key]) ? (applied[key] as string[]) : [];
            return draftVal.length !== appliedVal.length || draftVal.some((v, i) => v !== appliedVal[i]);
        });
    }, [draftFilters, selectedFilters]);

    //sellers filter
    const selectedSeller = selectedFilters?.seller || 'All sellers';
    const setSelectedSeller = useCallback((val: string) => {
        if (onFiltersChange) {
            onFiltersChange({ seller: val === 'All sellers' ? undefined : val });
        }
    }, [onFiltersChange]);

    const sellersOptions = useMemo(() => {
        return [{ label: 'All sellers', value: 'All sellers' }, ...sellersList];
    }, [sellersList]);

    const getSellerName = useCallback((sellerUid: string) => {
        const t = sellersList.find(item => item.value === sellerUid);
        return t ? t.label : ' - ';
    }, [sellersList]);

    //other filters
    const filterTypeToOptions = (items?: any[]) => {
        if (!items) return [];
        return items.map(item => ({
            value: item.id || item.name,
            label: item.name || '-Empty-',
            amount: item.count,
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    const transformedStatuses = useMemo(() =>
        filterMetadata?.statuses ? filterMetadata.statuses.map(status => ({
            value: status.id || status.name,
            label: status.name || '-Empty-',
            amount: status.count,
            color: StatusColors[status.name] || 'white',
        })).sort((a, b) => a.label.localeCompare(b.label)) : [],
        [filterMetadata?.statuses]
    );

    const transformedWarehouses = useMemo(() =>
        filterMetadata?.warehouses ? filterTypeToOptions(filterMetadata.warehouses) : [],
        [filterMetadata?.warehouses]
    );

    const transformedReceiverCountries = useMemo(() =>
        filterMetadata?.receiverCountry ? filterMetadata.receiverCountry.map(item => ({
            value: item.id || item.name,
            label: Countries[item.name] as string || item.name || '-Empty-',
            country: item.name,
            amount: item.count,
        })).sort((a, b) => a.label.localeCompare(b.label)) : [],
        [filterMetadata?.receiverCountry]
    );

    const handleClearAllFilters = () => {
        setDraftFilters({});
    }

    const orderFilters = [
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
            filterTitle: 'Receiver country',
            icon: 'country-in',
            isCountry: true,
            filterDescriptions: '',
            filterOptions: transformedReceiverCountries,
            filterState: draftFilters['receiverCountry'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('receiverCountry', val),
            isOpen: !!openFilters['receiverCountry'],
            setIsOpen: (v: boolean) => setFilterOpen('receiverCountry', v),
            onClose: () => updateDraftFilter('receiverCountry', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('receiverCountry', true); },
        },
    ] as FilterComponentType[];

    const activeFilters = useMemo(() => {
        console.log('changed')
        const currentFlags = [
            {
                key: 'status',
                filterTitle: 'Status',
                icon: 'status' as any,
                options: transformedStatuses
            },
            {
                key: 'warehouse',
                filterTitle: 'Warehouse',
                icon: 'warehouse' as any,
                options: transformedWarehouses
            },
            {
                key: 'receiverCountry',
                filterTitle: 'Receiver country',
                icon: 'country-location' as any,
                isCountry: true,
                options: transformedReceiverCountries
            }
        ];

        console.log('currentFlags', currentFlags, selectedFilters, currentFlags.map(f => ({
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
        })))
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
    }, [selectedFilters, transformedWarehouses, transformedStatuses, transformedReceiverCountries, onFiltersChange, setFilterOpen]);

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    const handleChangePage = (page: number) => {
        if (onPageChange) onPageChange(page);
    };

    const handleChangePageSize = (size: number) => {
        if (onPageSizeChange) onPageSizeChange(size);
    };

    const handleFilterChange = (newSearchTerm: string) => {
        if (onSearchChange) onSearchChange(newSearchTerm, fullTextSearch);
    };

    const handleHeaderCellClick = useCallback((columnDataIndex: keyof AmazonPrepOrderType) => {
        if (onSortChange) {
            const newOrder = sortBy === columnDataIndex && sortOrder === 'asc' ? 'desc' : 'asc';
            onSortChange(columnDataIndex, newOrder);
        }
    }, [sortBy, sortOrder, onSortChange]);

    const handleDateRangeSave = (newRange: DateRangeType) => {
        if (onPeriodChange) {
            onPeriodChange(
                newRange.startDate,
                newRange.endDate
            );
        }
    };

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const currentRange = useMemo(() => {
        return {
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : new Date()
        };
    }, [startDate, endDate]);

    const curWidth = useMemo(() => {
        const displayedData = amazonPrepOrders;
        const maxAmount = displayedData.reduce((acc, item) => Math.max(acc, item.productLines), 0).toString().length;
        const width = 47 + maxAmount * 9;
        return width.toString() + 'px';
    }, [current, pageSize, amazonPrepOrders]);

    const SellerColumns: TableColumnProps<AmazonPrepOrderType>[] = [];
    if (needSeller()) {
        SellerColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="90px"
                maxWidth="100px"
                contentPosition="left"
                childrenBefore={
                    <Tooltip title="Seller's name" >
                        <>
                            <span className='table-header-title'>Seller</span>
                            {sortBy === 'seller' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'seller' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </>
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
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<AmazonPrepOrderType>);
    }

    const columns: TableColumnProps<AmazonPrepOrderType>[] = [
        {
            key: 'warehouseCountries',
            title: <TitleColumn
                minWidth="50px"
                maxWidth="50px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Sender country ➔ Receiver country">
                        <Icon name={"car"} />
                    </Tooltip>}>
            </TitleColumn>,
            render: (text: string, record) =>
                <TableCell
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    value={'➔'}
                    childrenBefore={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.warehouseCountry.toLowerCase()} flag-icon`}></span>
                            <div style={{ fontSize: '8px' }}>{record.warehouseCountry}</div>
                        </div>
                    }
                    childrenAfter={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}></span>
                            <div style={{ fontSize: '8px' }}>{record.receiverCountry}</div>
                        </div>
                    }
                >
                </TableCell>,
            dataIndex: 'icon',
            // key: 'icon',
        },
        {
            title: <TitleColumn title="" minWidth="20px" maxWidth="20px" contentPosition="start"
            />,
            render: (text: string, record: AmazonPrepOrderType) => (
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
                title=""
                minWidth="60px"
                maxWidth="60px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Current condition or state of an order">
                        <div className='sorter-col-wrapper'>
                            <span>Status</span>
                            {sortBy === 'status' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'status' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.statusGroup);
                return (
                    <TableCell
                        minWidth="60px"
                        maxWidth="60px"
                        contentPosition="start"
                        childrenAfter={
                            <span style={{
                                borderBottom: `2px solid ${underlineColor}`,
                                display: 'inline-block',
                            }}>
                                {text}
                            </span>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="When an order was created">
                        <div className='sorter-col-wrapper'>
                            <span>Date</span>
                            {sortBy === 'date' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'date' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="80px" maxWidth="80px" contentPosition="start" />
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Order identifier within the WAPI system">
                        <div className='sorter-col-wrapper'>
                            <span>WH number</span>
                            {sortBy === 'wapiTrackingNumber' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'wapiTrackingNumber' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer' />
            ),
            dataIndex: 'wapiTrackingNumber',
            key: 'wapiTrackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => { handleEditAmazonPrepOrder(record.uuid) }
                };
            },
        },
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="100px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Amazon Shipment Notification Number">
                        <div className='sorter-col-wrapper'>
                            <span>ASN</span>
                            {sortBy === 'asnNumber' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'asnNumber' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="start" />
            ),
            dataIndex: 'asnNumber',
            key: 'asnNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => { handleEditAmazonPrepOrder(record.uuid) }
                };
            },
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="100px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Unique code for order identification in the seller's system">
                        <div className='sorter-col-wrapper'>
                            <span>Order ID</span>
                            {sortBy === 'clientOrderID' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'clientOrderID' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="start" />
            ),
            dataIndex: 'clientOrderID',
            key: 'clientOrderID',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['lg'],
        },
        ...SellerColumns,
        {
            title: <TitleColumn
                minWidth="60px"
                maxWidth="60px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Code of warehouse">
                        <div className='sorter-col-wrapper'>
                            <span>Warehouse</span>
                            {sortBy === 'warehouse' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'warehouse' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start" />
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="60px"
                maxWidth="60px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Service responsible for transporting and delivering packages">
                        <div className='sorter-col-wrapper'>
                            <span>Courier</span>
                            {sortBy === 'courierService' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'courierService' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start" />
            ),
            dataIndex: 'courierService',
            key: 'courierService',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="40px"
                maxWidth="40px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Type of Amazon Prep Order: LTL or SPD">
                        <div className='sorter-col-wrapper'>
                            <span>Method</span>
                            {sortBy === 'deliveryMethod' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'deliveryMethod' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center" />
            ),
            dataIndex: 'deliveryMethod',
            key: 'deliveryMethod',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="50px"
                maxWidth="50px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Products" >
                        <div className='sorter-col-wrapper'>
                            <span><Icon name={"shopping-cart"} /></span>
                            {sortBy === 'productLines' && sortOrder === 'asc' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortBy === 'productLines' && sortOrder === 'desc' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (text: string, record: AmazonPrepOrderType) => (
                <TableCell
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenAfter={
                        <Popover
                            content={record.products.length ? <SimplePopup
                                items={getProductItems(record)}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span style={{ width: curWidth }} className={"products-cell-style"}>{text} <Icon name="info" /></span>
                        </Popover>
                    }
                />
            ),
            dataIndex: 'productLines',
            key: 'productLines',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['lg'],
        },
    ];
    return (
        <div className="table">
            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
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
                        onChange={(val) => setSelectedSeller(val as string)}
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
                    <FiltersChosen filters={activeFilters} />
                </div>
                <div className="page-size-container">
                    <span className="page-size-text"></span>
                    <PageSizeSelector
                        options={pageOptions}
                        value={pageSize}
                        onChange={(value: number) => handleChangePageSize(value)}
                    />
                </div>
            </div>

            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${amazonPrepOrders?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={amazonPrepOrders.map(item => ({ ...item, key: item.uuid }))}
                    columns={columns}
                    pagination={false}
                    // scroll={{ y: 700 }}
                    showSorterTooltip={false}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total amazon preps:<span className='order-products-total__list-item__value'>{totalOrders || 0}</span></li>
                    </ul>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={totalOrders || 0}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>

            <FiltersContainer 
                isFiltersVisible={isFiltersVisible} 
                setIsFiltersVisible={setIsFiltersVisible} 
                onClearFilters={handleClearAllFilters}
                onApplyFilters={applyFilters}
                hasUnappliedChanges={hasUnappliedChanges}
            >
                <FiltersListWithOptions filters={orderFilters.filter(item => item !== null)} />
            </FiltersContainer>

        </div>
    );
};

export default React.memo(AmazonPrepList);
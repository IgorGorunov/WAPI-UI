import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination, Popover, Table, TableColumnProps, Tooltip } from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "@/styles/tables.scss";
import Icon from "@/components/Icon";
import { IconType } from "@/components/Icon";
import { ColumnType } from "antd/es/table";
import DateInput from "@/components/DateInput";
import { STOCK_MOVEMENT_DOC_TYPE, StockMovementType } from "@/types/stockMovements";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, { ButtonVariant } from "@/components/Button/Button";
import { FormFieldTypes } from "@/types/forms";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchField from "@/components/SearchField";
import { Countries } from "@/types/countries";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import { formatDateStringToDisplayString } from "@/utils/date";
import SimplePopup from "@/components/SimplePopup";
import { useIsTouchDevice } from "@/hooks/useTouchDevice";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import { isTabAllowed } from "@/utils/tabs";
import useAuth from "@/context/authContext";
import { FilterType } from "@/types/filters";
import { StockMovementFilterDataType } from "@/screens/StockMovementsPage/types";
import { PageOptions } from "@/constants/pagination";
import Select from "@/components/FormBuilder/Select/SelectField";

type StockMovementsListType = {
    docType: STOCK_MOVEMENT_DOC_TYPE;
    docs: StockMovementType[];
    isLoading?: boolean;
    totalDocs?: number;
    filterMetadata?: StockMovementFilterDataType | null;
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
    handleEditDoc(uuid: string): void;
    handleRefresh?: () => void;
    forbiddenTabs: string[];
    // Period selector props
    startDate?: string;
    endDate?: string;
    onPeriodChange?: (startDate: Date, endDate: Date) => void;
}

const getDocType = (docType: STOCK_MOVEMENT_DOC_TYPE) => {
    if (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS) {
        return 'inbounds';
    } else if (docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND) {
        return 'outbounds';
    } else if (docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT) {
        return 'stock movements';
    } else if (docType === STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE) {
        return 'logistic services';
    } else return 'documents'
}

// Convert server FilterType[] to OptionType[]
function filterTypeToOptions(items: FilterType[]): { value: string; label: string; amount: number }[] {
    return items && items.length ? items.map(item => ({
        value: item.id || item.name,
        label: item.name || '-Empty-',
        amount: item.count,
    })).sort((a, b) => a.label.localeCompare(b.label)) : []
}

// Build boolean filter options
function booleanFilterOptions(
    withLabel: string,
    withoutLabel: string,
    withCount: number,
    totalCount: number
): { value: string; label: string; amount: number }[] {
    return [
        { value: 'true', label: withLabel, amount: withCount },
        { value: 'false', label: withoutLabel, amount: totalCount - withCount },
    ];
}

const StockMovementsList: React.FC<StockMovementsListType> = ({
    docType,
    docs,
    isLoading,
    totalDocs,
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
    handleEditDoc,
    forbiddenTabs,
    startDate,
    endDate,
    onPeriodChange,
}) => {
    const isTouchDevice = useIsTouchDevice();
    const { needSeller, sellersList } = useAuth();

    // Local UI state (mirrors URL state for smooth UX)
    const [current, setCurrent] = React.useState(currentPage);
    const [pageSize, setPageSize] = React.useState(propPageSize);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState(propSearchTerm);
    const [fullTextSearch, setFullTextSearch] = useState(propFullTextSearch);

    // Trigger animation when new data arrives
    useEffect(() => {
        if (!isLoading) {
            setAnimating(true);
            const id = setTimeout(() => setAnimating(false), 50);
            return () => clearTimeout(id);
        }
    }, [docs]);

    // Sync local state with parent props (back/forward navigation)
    React.useEffect(() => { setCurrent(currentPage); }, [currentPage]);
    React.useEffect(() => { setPageSize(propPageSize); }, [propPageSize]);
    React.useEffect(() => { setSearchTerm(propSearchTerm); }, [propSearchTerm]);
    React.useEffect(() => { setFullTextSearch(propFullTextSearch); }, [propFullTextSearch]);
    React.useEffect(() => {
        if (propSortBy) setSortColumn(propSortBy as keyof StockMovementType);
        if (propSortOrder) setSortDirection(propSortOrder === 'asc' ? 'ascend' : 'descend');
    }, [propSortBy, propSortOrder]);

    const handleFullTextSearchChange = () => {
        const newVal = !fullTextSearch;
        setFullTextSearch(newVal);
        if (searchTerm && onSearchChange) {
            onSearchChange(searchTerm, newVal);
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

    const getProductItems = useCallback((hoveredDoc) => {
        return hoveredDoc ? hoveredDoc.products.map(docItem => ({
            uuid: hoveredDoc.uuid,
            title: docItem.product,
            description: docItem.quantity
        })) : [];
    }, []);

    // Seller filter (server-side)
    const [selectedSeller, setSelectedSeller] = useState<string>('All sellers');
    const sellersOptions = useMemo(() => {
        return [{ label: 'All sellers', value: 'All sellers', amount: totalDocs || docs.length }, ...sellersList.map(item => ({ ...item, amount: 0 }))];
    }, [sellersList, totalDocs, docs.length]);

    // Draft filters state (UI selections before Apply)
    const [draftFilters, setDraftFilters] = useState<Record<string, string[]>>({});

    const updateDraftFilter = useCallback((key: string, valuesOrUpdater: string[] | ((prev: string[]) => string[])) => {
        setDraftFilters(prev => {
            const currentValues = prev[key] || [];
            const newValues = typeof valuesOrUpdater === 'function'
                ? valuesOrUpdater(currentValues)
                : valuesOrUpdater;
            return { ...prev, [key]: newValues };
        });
    }, []);

    // Filter panel open/close state
    const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
    const setFilterOpen = useCallback((key: string, isOpen: boolean) => {
        setOpenFilters(prev => ({ ...prev, [key]: isOpen }));
    }, []);

    const selectedFiltersString = JSON.stringify(selectedFilters);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    useEffect(() => {
        if (isFiltersVisible) return;
        const newDraft: Record<string, string[]> = {};
        if (selectedFilters) {
            Object.entries(selectedFilters).forEach(([key, val]) => {
                if (Array.isArray(val)) {
                    newDraft[key] = val;
                } else if (typeof val === 'string') {
                    newDraft[key] = [val];
                }
            });
        }
        setDraftFilters(newDraft);
    }, [selectedFiltersString, isFiltersVisible]);

    // Apply: triggers API call
    const applyFilters = useCallback(() => {
        const allKnownKeys = new Set([
            ...Object.keys(draftFilters),
            ...Object.keys(selectedFilters || {})
        ]);
        const fullUpdate: Record<string, string[]> = {};
        allKnownKeys.forEach(key => {
            const val = draftFilters[key];
            if (['page', 'limit', 'startDate', 'endDate', 'search', 'fullTextSearch', 'sortBy', 'sortOrder'].includes(key)) return;
            fullUpdate[key] = val?.length ? val : [];
        });
        if (onFiltersChange) onFiltersChange(fullUpdate);
        setCurrent(1);
    }, [draftFilters, selectedFilters, onFiltersChange]);

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

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setDraftFilters({});
        if (onClearFilters) onClearFilters();
        setCurrent(1);
    }, [onClearFilters]);

    // Server total count
    const totalCount = totalDocs !== undefined ? totalDocs : (filterMetadata?.count || docs.length || 0);
    console.log("totalCount", totalCount, filterMetadata?.count)

    // Build filter options from server metadata
    const transformedStatuses = useMemo(() =>
        filterMetadata?.statuses ? filterTypeToOptions(filterMetadata.statuses) : [],
        [filterMetadata?.statuses]
    );

    const transformedSenders = useMemo(() =>
        filterMetadata?.senders ? filterTypeToOptions(filterMetadata.senders) : [],
        [filterMetadata?.senders]
    );

    const transformedSenderCountries = useMemo(() =>
        filterMetadata?.senderCountries ? filterMetadata.senderCountries.map(item => ({
            value: item.id || item.name,
            label: Countries[item.name] as string || item.name || '-Empty-',
            country: item.name,
            amount: item.count,
        })).sort((a, b) => a.label.localeCompare(b.label)) : [],
        [filterMetadata?.senderCountries]
    );

    const transformedReceivers = useMemo(() =>
        filterMetadata?.receivers ? filterTypeToOptions(filterMetadata.receivers) : [],
        [filterMetadata?.receivers]
    );

    const transformedReceiverCountries = useMemo(() =>
        filterMetadata?.receiverCountries ? filterMetadata.receiverCountries.map(item => ({
            value: item.id || item.name,
            label: Countries[item.name] as string || item.name || '-Empty-',
            country: item.name,
            amount: item.count,
        })).sort((a, b) => a.label.localeCompare(b.label)) : [],
        [filterMetadata?.receiverCountries]
    );

    const hasTicketsOptions = useMemo(() =>
        filterMetadata ? booleanFilterOptions('With tickets', 'Without tickets', filterMetadata.countTicket || 0, totalCount) : [],
        [filterMetadata, totalCount]
    );

    const hasOpenTicketsOptions = useMemo(() =>
        filterMetadata ? booleanFilterOptions('With open tickets', 'Without open tickets', filterMetadata.countTicketOpen || 0, totalCount) : [],
        [filterMetadata, totalCount]
    );

    // Build filter configs
    const baseFilterConfigs = useMemo(() => {
        const configs: {
            key: string;
            title: string;
            icon: string;
            options: { value: string; label: string; amount: number }[];
            description?: string;
            isCountry?: boolean;
        }[] = [
            { key: 'status', title: 'Status', icon: 'status', options: transformedStatuses },
            { key: 'sender', title: 'Sender', icon: 'sender', options: transformedSenders },
            { key: 'senderCountry', title: 'Sender country', icon: 'country-out', options: transformedSenderCountries, isCountry: true },
            { key: 'receiver', title: 'Receiver', icon: 'package-receiver', options: transformedReceivers },
            { key: 'receiverCountry', title: 'Receiver country', icon: 'country-in', options: transformedReceiverCountries, isCountry: true },
        ];

        if (isTabAllowed('Tickets', forbiddenTabs)) {
            configs.push({ key: 'tickets', title: 'Tickets', icon: 'ticket-gray', options: hasTicketsOptions });
            configs.push({ key: 'ticketsOpen', title: 'Tickets (open)', icon: 'ticket-open', options: hasOpenTicketsOptions });
        }

        return configs;
    }, [
        transformedStatuses, transformedSenders, transformedSenderCountries,
        transformedReceivers, transformedReceiverCountries,
        hasTicketsOptions, hasOpenTicketsOptions,
        forbiddenTabs
    ]);

    // Draft filters for the filter panel
    const docFilters = useMemo(() => baseFilterConfigs.map(config => ({
        filterTitle: config.title,
        icon: config.icon as IconType,
        filterDescriptions: config.description || '',
        filterOptions: config.options,
        filterState: draftFilters[config.key] || [],
        setFilterState: (val: string[]) => updateDraftFilter(config.key, val),
        isOpen: !!openFilters[config.key],
        setIsOpen: (v: boolean) => setFilterOpen(config.key, v),
        onClose: () => updateDraftFilter(config.key, []),
        onClick: () => { setIsFiltersVisible(true); setFilterOpen(config.key, true) },
        isCountry: config.isCountry,
    })), [baseFilterConfigs, draftFilters, openFilters, updateDraftFilter, setFilterOpen]);

    // Active (applied) filters for the chips display
    const activeFilters = useMemo(() => baseFilterConfigs.map(config => {
        let val = selectedFilters?.[config.key];
        const state = typeof val === 'string' ? [val] : (Array.isArray(val) ? val : []);
        return {
            filterTitle: config.title,
            icon: config.icon as IconType,
            filterDescriptions: config.description || '',
            filterOptions: config.options,
            filterState: state,
            setFilterState: () => { },
            isOpen: false,
            setIsOpen: () => { },
            onClose: () => onFiltersChange?.({ [config.key]: [] }),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen(config.key, true) },
            isCountry: config.isCountry,
        };
    }), [baseFilterConfigs, selectedFilters, onFiltersChange]);

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
        if (onSearchChange) {
            onSearchChange(newSearchTerm.trim(), fullTextSearch);
        }
    };

    const [sortColumn, setSortColumn] = useState<keyof StockMovementType | null>("incomingDate");
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('descend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof StockMovementType) => {
        const newDirection = sortColumn === columnDataIndex && sortDirection === 'ascend' ? 'descend' : 'ascend';
        setSortDirection(newDirection);
        setSortColumn(columnDataIndex);
        if (onSortChange) onSortChange(String(columnDataIndex), newDirection === 'ascend' ? 'asc' : 'desc');
    }, [sortColumn, sortDirection, onSortChange]);

    // const handleDateRangeSave = (startDate: Date, endDate: Date) => {
    //     if (onPeriodChange) onPeriodChange(startDate, endDate);
    // };

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const curWidth = useMemo(() => {
        const maxAmount = docs.reduce((acc, item) => Math.max(acc, item.products.reduce(
            (accumulator, currentValue) => accumulator + currentValue.quantity,
            0,
        )), 0).toString().length;
        const width = 47 + maxAmount * 9;
        return width.toString() + 'px';
    }, [docs]);

    const SellerColumns: TableColumnProps<StockMovementType>[] = [];
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
                const sellerItem = sellersList.find(s => s.value === record.seller);
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="90px"
                        maxWidth="100px"
                        contentPosition="left"
                        childrenBefore={
                            <div className="seller-container">
                                {sellerItem ? sellerItem.label : record.seller || ' - '}
                            </div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'seller',
            key: 'seller',
            sorter: false,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<StockMovementType>);
    }

    const columns: TableColumnProps<StockMovementType>[] = [
        {
            title: <TitleColumn
                minWidth="50px"
                maxWidth="50px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Sender country ➔ Receiver country" >
                        <span><Icon name={"car"} /></span>
                    </Tooltip>
                }
            >
            </TitleColumn>,
            render: (_text: string, record) =>
                <TableCell
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    value={'➔'}
                    childrenBefore={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.senderCountry.toLowerCase()} flag-icon`}></span>
                            <div style={{ fontSize: '8px' }}>{record.senderCountry}</div>
                        </div>
                    }
                    childrenAfter={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}
                            />
                            <div style={{ fontSize: '8px' }}>{record.receiverCountry}</div>
                        </div>

                    }
                />,
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="100px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title={`Current condition or state of ${getDocType(docType).substring(0, getDocType(docType).length - 1)} with estimated date`}>
                        <div className='sorter-col-wrapper'>
                            <span>Status</span>
                            {sortColumn === 'status' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'status' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                return (
                    <TableCell
                        minWidth="100px"
                        maxWidth="100px"
                        contentPosition="start"
                        childrenBefore={
                            <div>
                                <div>
                                    {text}
                                </div>
                                <div style={{ fontSize: '9px', marginTop: '4px' }}>
                                    {record.statusDate != '0001-01-01T00:00:00'
                                        ? <>ETA: {formatDateStringToDisplayString(record.statusDate)}</>
                                        : record.estimatedTimeArrives && record.estimatedTimeArrives != '0001-01-01T00:00:00'
                                            ? <>ETA: {formatDateStringToDisplayString(record.estimatedTimeArrives)}</>
                                            : ''
                                    }
                                </div>
                            </div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={<Tooltip title="When an order was created">
                    <div className='sorter-col-wrapper'>
                        <span>Date</span>
                        {sortColumn === 'incomingDate' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'incomingDate' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="80px" maxWidth="80px" contentPosition="start" />
            ),
            dataIndex: 'incomingDate',
            key: 'incomingDate',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="75px"
                maxWidth="700px"
                contentPosition="start"
                childrenBefore={<Tooltip title="Document identifier within the system">
                    <div className='sorter-col-wrapper'>
                        <span>Number</span>
                        {sortColumn === 'number' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'number' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                </Tooltip>
                } />,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="75px"
                    maxWidth="75px"
                    contentPosition="start"
                    textColor='var(--color-blue)'
                    cursor='pointer'
                />
            ),
            dataIndex: 'number',
            key: 'number',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => { handleEditDoc(record.uuid) }
                };
            },
        },
        {
            title: <TitleColumn
                minWidth="120px"
                maxWidth="200px"
                contentPosition="start"
                childrenBefore={<Tooltip title="Document number in the seller's system">
                    <div className='sorter-col-wrapper'>
                        <span>Incoming #</span>
                        {sortColumn === 'incomingNumber' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'incomingNumber' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="120px"
                    maxWidth="200px"
                    contentPosition="start"
                />
            ),
            dataIndex: 'incomingNumber',
            key: 'incomingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['md'],
        },
        ...SellerColumns,
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={<Tooltip title="The source responsible for initiating the movement of products">
                    <div className='sorter-col-wrapper'>
                        <span>Sender</span>
                        {sortColumn === 'sender' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'sender' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                </Tooltip>
                } />,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="120px" contentPosition="start" />
            ),

            dataIndex: 'sender',
            key: 'sender',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={<Tooltip title="The recipient of products">
                    <div className='sorter-col-wrapper'>
                        <span>Receiver</span>
                        {sortColumn === 'receiver' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'receiver' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                </Tooltip>
                } />,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="120px" contentPosition="start" />
            ),
            dataIndex: 'receiver',
            key: 'receiver',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={<Tooltip title="Estimated arrival time">
                    <div className='sorter-col-wrapper'>
                        <span>ETA</span>
                        {sortColumn === 'estimatedTimeArrives' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'estimatedTimeArrives' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="80px" maxWidth="80px" contentPosition="start" />
            ),
            dataIndex: 'estimatedTimeArrives',
            key: 'estimatedTimeArrives',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="70px" maxWidth="70px" contentPosition="center" childrenBefore={
                <Tooltip title="Products" >
                    <div className='sorter-col-wrapper' style={{ display: 'flex', alignItems: 'center' }}>
                        <span><Icon name={"shopping-cart"} /></span>
                        {sortColumn === 'productLines' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'productLines' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                </Tooltip>
            } />,
            render: (text: string, record: StockMovementType) => {
                const productCount = record.products.reduce(
                    (accumulator, currentValue) => accumulator + currentValue.quantity,
                    0,
                );

                return (
                    <TableCell
                        minWidth="70px"
                        maxWidth="70px"
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
                                <span style={{ width: curWidth }} className={"products-cell-style"}>{productCount} <Icon name="info" /></span>
                            </Popover>
                        }
                    />
                );
            },
            dataIndex: 'productLines',
            key: 'productLines',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['lg'],
        },
    ];

    return (
        <div className="table">
            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                <DateInput
                    handleRangeChange={(range) => {
                        if (onPeriodChange) onPeriodChange(range.startDate, range.endDate);
                    }}
                    currentRange={{ startDate: startDate ? new Date(startDate) : new Date(), endDate: endDate ? new Date(endDate) : new Date() }}
                />
                <div className='search-block'>
                    <SearchField
                        searchTerm={searchTerm}
                        handleSearch={handleFilterChange}
                        handleClear={() => { handleFilterChange(""); }}
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
                        options={PageOptions}
                        value={pageSize}
                        onChange={(value: number) => handleChangePageSize(value)}
                    />
                </div>
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${docs?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={docs.map(item => ({ ...item, key: item.tableKey || item.uuid }))}
                    columns={columns}
                    pagination={false}
                    // scroll={{ y: 700 }}
                    showSorterTooltip={false}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total {getDocType(docType)}:<span className='order-products-total__list-item__value'>{totalCount}</span></li>
                    </ul>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={totalCount}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>

            <FiltersContainer
                isFiltersVisible={isFiltersVisible}
                setIsFiltersVisible={setIsFiltersVisible}
                onClearFilters={clearAllFilters}
                onApplyFilters={applyFilters}
                hasUnappliedChanges={hasUnappliedChanges}
            >
                <FiltersListWithOptions filters={docFilters} />
            </FiltersContainer>
        </div>
    );
};

export default React.memo(StockMovementsList);
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination, Table, TableColumnProps, Tooltip } from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
// import styles from "./styles.module.scss";
import "@/styles/tables.scss";
import { ColumnType } from "antd/es/table";
import DateInput from "@/components/DateInput";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, { ButtonVariant } from "@/components/Button/Button";
import { FormFieldTypes } from "@/types/forms";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchField from "@/components/SearchField";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import { formatDateTimeToStringWithDotWithoutSeconds } from "@/utils/date";
import { ticketStatusColors, TicketType } from "@/types/tickets";
import { FILTER_TYPE } from "@/types/utility";
import Icon from "@/components/Icon";
import FiltersBlockWrapper from "@/components/FiltersBlockWrapper";
import { Countries } from "@/types/countries";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import useAuth from "@/context/authContext";
import { FilterComponentType, FilterType } from "@/types/filters";
import { TicketFilterDataType } from "../../types";
import Select from "@/components/FormBuilder/Select/SelectField";

type TicketListType = {
    tickets: TicketType[];
    isLoading?: boolean;
    totalTickets?: number;
    filterMetadata?: TicketFilterDataType | null;
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
    handleEditTicket(uuid: string): void;
    handleRefresh?: () => void;
    startDate?: string;
    endDate?: string;
    onPeriodChange?: (startDate: Date, endDate: Date) => void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
];

function filterTypeToOptions(items: FilterType[]): { value: string; label: string; amount: number }[] {
    return items && items.length ? items.map(item => ({
        value: item.id || item.name,
        label: item.name || '-Empty-',
        amount: item.count,
    })).sort((a, b) => a.label.localeCompare(b.label)) : []
}

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

const noDocType = 'has no document';

const TicketList: React.FC<TicketListType> = ({
    tickets,
    isLoading,
    totalTickets,
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
    handleEditTicket,
    startDate,
    endDate,
    onPeriodChange,
}) => {
    const { needSeller, sellersList } = useAuth();

    const [current, setCurrent] = React.useState(currentPage);
    const [pageSize, setPageSize] = React.useState(propPageSize);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState(propSearchTerm);
    const [fullTextSearch, setFullTextSearch] = useState(propFullTextSearch);

    useEffect(() => {
        if (!isLoading) {
            setAnimating(true);
            const id = setTimeout(() => setAnimating(false), 50);
            return () => clearTimeout(id);
        }
    }, [tickets, isLoading]);

    React.useEffect(() => { setCurrent(currentPage); }, [currentPage]);
    React.useEffect(() => { setPageSize(propPageSize); }, [propPageSize]);
    React.useEffect(() => { setSearchTerm(propSearchTerm); }, [propSearchTerm]);
    React.useEffect(() => { setFullTextSearch(propFullTextSearch); }, [propFullTextSearch]);
    React.useEffect(() => {
        if (propSortBy) setSortColumn(propSortBy as keyof TicketType);
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

    // Check if draft differs from applied (for Apply button highlight)
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
                if (Array.isArray(val)) {
                    newDraft[key] = val;
                } else if (typeof val === 'string') {
                    newDraft[key] = [val];
                }
            });
        }
        setDraftFilters(newDraft);
    }, [selectedFiltersString, isFiltersVisible]);

    const handleClearAllFilters = useCallback(() => {
        setDraftFilters({});
        if (onClearFilters) onClearFilters();
        setCurrent(1);
    }, [onClearFilters]);

    const totalCount = totalTickets !== undefined ? totalTickets : (filterMetadata?.total || tickets.length || 0);

    const transformedStatuses = useMemo(() =>
        filterMetadata?.statuses ? filterMetadata.statuses.map(status => ({
            value: status.id || status.name,
            label: ticketStatusColors.find(item => item.value === status.name)?.label || status.name || '-Empty-',
            amount: status.count,
            color: ticketStatusColors.find(item => item.value === status.name)?.color || 'white',
        })).sort((a, b) => a.label.localeCompare(b.label)) : [],
        [filterMetadata?.statuses]
    );

    const transformedTopics = useMemo(() =>
        filterMetadata?.topic ? filterTypeToOptions(filterMetadata.topic) : [],
        [filterMetadata?.topic]
    );

    const hasNewMessagesOptions = useMemo(() => {
        if (!filterMetadata) return [];
        const fullTotal = typeof filterMetadata.count == 'number' ? filterMetadata.count : 0 ;
        return booleanFilterOptions(
            'Has new messages',
            "Doesn't have new messages",
            filterMetadata.countNewMessages || 0,
            fullTotal
        );
    }, [filterMetadata]);


    const docTypeOptions = useMemo(() =>
        filterMetadata?.documentType ? filterMetadata.documentType.map(item => ({
            value: item.id || item.name || noDocType,
            label: item.name || noDocType,
            amount: item.count,
        })).sort((a, b) => a.label.localeCompare(b.label)) : [],
        [filterMetadata?.documentType]
    );

    const orderSenderWarehousesOptions = useMemo(() =>
        filterMetadata?.warehouse ? filterTypeToOptions(filterMetadata.warehouse) : [],
        [filterMetadata?.warehouse]
    );

    const orderReceiverCountryOptions = useMemo(() =>
        filterMetadata?.receiverCountry ? filterMetadata.receiverCountry.map(item => ({
            value: item.id || item.name,
            label: Countries[item.name] as string || item.name || '-Empty-',
            country: item.name,
            amount: item.count,
        })).sort((a, b) => a.label.localeCompare(b.label)) : [],
        [filterMetadata?.receiverCountry]
    );

    const orderCourierServiceOptions = useMemo(() =>
        filterMetadata?.courierService ? filterTypeToOptions(filterMetadata.courierService) : [],
        [filterMetadata?.courierService]
    );

    const ticketFilters = useMemo(() => [
        {
            filterTitle: 'Status',
            icon: 'status',
            filterDescriptions: '',
            filterType: FILTER_TYPE.COLORED_CIRCLE,
            filterOptions: transformedStatuses,
            filterState: draftFilters['status'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('status', val),
            isOpen: !!openFilters['status'],
            setIsOpen: (v: boolean) => setFilterOpen('status', v),
            onClose: () => updateDraftFilter('status', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('status', true); },
        },
        {
            filterTitle: 'Topic',
            icon: 'topic',
            filterDescriptions: '',
            filterOptions: transformedTopics,
            filterState: draftFilters['topic'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('topic', val),
            isOpen: !!openFilters['topic'],
            setIsOpen: (v: boolean) => setFilterOpen('topic', v),
            onClose: () => updateDraftFilter('topic', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('topic', true); },
        },
        {
            filterTitle: 'New messages',
            icon: 'comment',
            filterDescriptions: '',
            filterOptions: hasNewMessagesOptions,
            filterState: draftFilters['newMessages'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('newMessages', val),
            isOpen: !!openFilters['newMessages'],
            setIsOpen: (v: boolean) => setFilterOpen('newMessages', v),
            onClose: () => updateDraftFilter('newMessages', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('newMessages', true); },
        },
        {
            filterTitle: 'Document type',
            icon: 'doc-type',
            filterDescriptions: '',
            filterOptions: docTypeOptions,
            filterState: draftFilters['documentType'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('documentType', val),
            isOpen: !!openFilters['documentType'],
            setIsOpen: (v: boolean) => setFilterOpen('documentType', v),
            onClose: () => updateDraftFilter('documentType', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('documentType', true); },
        },
    ] as FilterComponentType[], [transformedStatuses, transformedTopics, hasNewMessagesOptions, docTypeOptions, draftFilters, openFilters, updateDraftFilter, setFilterOpen]);

    const ticketExtraFilters = useMemo(() => [
        {
            filterTitle: 'Sender warehouse',
            icon: 'warehouse',
            filterDescriptions: '',
            filterOptions: orderSenderWarehousesOptions,
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
            filterOptions: orderReceiverCountryOptions,
            filterState: draftFilters['receiverCountry'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('receiverCountry', val),
            isOpen: !!openFilters['receiverCountry'],
            setIsOpen: (v: boolean) => setFilterOpen('receiverCountry', v),
            onClose: () => updateDraftFilter('receiverCountry', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('receiverCountry', true); },
        },
        {
            filterTitle: 'Courier service',
            icon: 'courier-service',
            filterDescriptions: '',
            filterOptions: orderCourierServiceOptions,
            filterState: draftFilters['courierService'] || [],
            setFilterState: (val: string[]) => updateDraftFilter('courierService', val),
            isOpen: !!openFilters['courierService'],
            setIsOpen: (v: boolean) => setFilterOpen('courierService', v),
            onClose: () => updateDraftFilter('courierService', []),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('courierService', true); },
        },
    ] as FilterComponentType[], [orderSenderWarehousesOptions, orderReceiverCountryOptions, orderCourierServiceOptions, draftFilters, openFilters, updateDraftFilter, setFilterOpen]);

    const allFilterConfigs = [...ticketFilters, ...ticketExtraFilters];

    // Active (applied) filters for the chips display
    const activeFilters = useMemo(() => allFilterConfigs.map(config => {
        // find the actual key matching the config title/icon since config.key is not in FilterComponentType directly here
        const key = config.filterTitle === 'Status' ? 'status' :
            config.filterTitle === 'Topic' ? 'topic' :
                config.filterTitle === 'New messages' ? 'newMessages' :
                    config.filterTitle === 'Document type' ? 'documentType' :
                        config.filterTitle === 'Sender warehouse' ? 'warehouse' :
                            config.filterTitle === 'Receiver country' ? 'receiverCountry' :
                                config.filterTitle === 'Courier service' ? 'courierService' : '';

        let val = selectedFilters?.[key];
        const state = typeof val === 'string' ? [val] : (Array.isArray(val) ? val : []);
        return {
            ...config,
            filterState: state,
            setFilterState: () => { },
            isOpen: false,
            setIsOpen: () => { },
            onClose: () => onFiltersChange?.({ [key]: [] }),
            onClick: () => { setIsFiltersVisible(true); setFilterOpen(key, true) },
        };
    }), [allFilterConfigs, selectedFilters, onFiltersChange, setFilterOpen]);

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

    const [sortColumn, setSortColumn] = useState<keyof TicketType | null>('date');
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('descend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof TicketType) => {
        const newDirection = sortColumn === columnDataIndex && sortDirection === 'ascend' ? 'descend' : 'ascend';
        setSortDirection(newDirection);
        setSortColumn(columnDataIndex);
        if (onSortChange) onSortChange(String(columnDataIndex), newDirection === 'ascend' ? 'asc' : 'desc');
    }, [sortColumn, sortDirection, onSortChange]);


    const handleDateRangeSave = (range: { startDate: Date, endDate: Date }) => {
        if (onPeriodChange) onPeriodChange(range.startDate, range.endDate);
    };

    const toggleFilters = () => {
        setIsFiltersVisible(prevState => !prevState);
    };

    const SellerColumns: TableColumnProps<TicketType>[] = [];
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
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<TicketType>);
    }

    const columns: TableColumnProps<TicketType>[] = [
        {
            title: <TitleColumn title="" minWidth="5px" maxWidth="5px" contentPosition="start" />,
            render: (status: string) => {
                const statusObj = ticketStatusColors.find(s => s.value === status);
                let color = statusObj ? statusObj.color : 'white';
                return (
                    <TableCell
                        minWidth="5px"
                        maxWidth="5px"
                        contentPosition="start"
                        childrenBefore={
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{
                                    display: 'flex',
                                    flex: '0 0 auto',
                                    alignItems: 'center',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                }}></div></div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="50px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Current ticket status" >
                        <div className='sorter-col-wrapper'>
                            <span>Status</span>
                            {sortColumn === 'status' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'status' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (status: string) => {
                return (
                    <TableCell value={status} minWidth="50px" maxWidth="80px" contentPosition="start" />
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="" minWidth="20px" maxWidth="20px" contentPosition="start"
            />,
            render: (_text: string, record: TicketType) => (
                <TableCell
                    className='no-padding'
                    minWidth="20px"
                    maxWidth="20px"
                    contentPosition="center"
                    childrenAfter={
                        <span style={{ marginTop: '3px' }}>{record.newMessages ? <Icon name="notification" /> : null}</span>}
                >
                </TableCell>
            ),
            dataIndex: 'newMessages',
            key: 'newMessages',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn
                minWidth="90px"
                maxWidth="90px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Ticket number. Click on the number to view the correspondence" >
                        <div className='sorter-col-wrapper'>
                            <span>Ticket #</span>
                            {sortColumn === 'number' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'number' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="90px"
                    maxWidth="90px"
                    contentPosition="start"
                    textColor='var(--color-blue)'
                    cursor='pointer'
                />
            ),
            dataIndex: 'number',
            key: 'number',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => { handleEditTicket(record.uuid) }
                };
            },
        },
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="When the ticket was created" >
                        <div className='sorter-col-wrapper'>
                            <span>Date</span>
                            {sortColumn === 'date' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'date' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={formatDateTimeToStringWithDotWithoutSeconds(text)} minWidth="80px" maxWidth="120px" contentPosition="start" />
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
        },
        ...SellerColumns,
        {
            title: <TitleColumn
                minWidth="90px"
                maxWidth="400px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Ticket subject" >
                        <div className='sorter-col-wrapper'>
                            <span>Topic</span>
                            {sortColumn === 'topic' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'topic' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="90px" maxWidth="400px" contentPosition="start" />
            ),

            dataIndex: 'topic',
            key: 'topic',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="115px"
                maxWidth="500px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Ticket title" >
                        <div className='sorter-col-wrapper'>
                            <span>Title</span>
                            {sortColumn === 'subject' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'subject' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </div>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="115px" maxWidth="500px" contentPosition="start" />
            ),

            dataIndex: 'subject',
            key: 'subject',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
        },
    ];

    const selectedSeller = selectedFilters?.seller ? (typeof selectedFilters.seller === 'string' ? selectedFilters.seller : selectedFilters.seller[0]) : 'All sellers';
    const sellersOptions = useMemo(() => {
        return [{ label: 'All sellers', value: 'All sellers', amount: totalCount }, ...sellersList.map(item => ({ ...item, amount: 0 }))];
    }, [sellersList, totalCount]);

    return (
        <div className="table order-list">
            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                <DateInput
                    handleRangeChange={handleDateRangeSave}
                    currentRange={{ startDate: startDate ? new Date(startDate) : new Date(), endDate: endDate ? new Date(endDate) : new Date() }}
                />
                <div className='search-block'>
                    <SearchField searchTerm={searchTerm} handleSearch={handleFilterChange} handleClear={() => { handleFilterChange(""); }} manualSearch={true} />
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
                        onChange={(val) => {
                            if (onFiltersChange) {
                                onFiltersChange({ seller: val === 'All sellers' ? [] : [val] });
                            }
                        }}
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

            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${tickets?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={tickets.map((item, id) => ({
                        ...item,
                        key: item.tableKey || item.uuid || id,
                    }))}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 700 }}
                    showSorterTooltip={false}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total tickets:<span className='order-products-total__list-item__value'>{totalCount}</span></li>
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
                onClearFilters={handleClearAllFilters}
                onApplyFilters={applyFilters}
                hasUnappliedChanges={hasUnappliedChanges}
            >
                <FiltersListWithOptions filters={ticketFilters} />
                <FiltersBlockWrapper title={'Fulfillment filters'}>
                    <FiltersListWithOptions filters={ticketExtraFilters} />
                </FiltersBlockWrapper>
            </FiltersContainer>
        </div>
    );
};

export default TicketList;
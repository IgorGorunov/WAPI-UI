import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination, Popover, Table, TableColumnProps, Tooltip } from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import getSymbolFromCurrency from 'currency-symbol-map';
import "./styles.scss";
import SearchContainer from "@/components/SearchContainer";
import SearchField from "@/components/SearchField";
import Icon from "@/components/Icon";
import { IconType } from "@/components/Icon";
import Button, { ButtonVariant } from "@/components/Button/Button";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import { OrderFilterDataType, OrderType } from "@/types/orders";
import { StatusColors } from '@/screens/DashboardPage/components/OrderStatuses';
import { isTabAllowed } from "@/utils/tabs";
import { DateRangeType } from "@/types/dashboard";
import DateInput from "@/components/DateInput";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import { FormFieldTypes } from "@/types/forms";
import { NotificationType } from "@/types/notifications";
import useNotifications from "@/context/notificationContext";
import { ColumnType } from "antd/lib/table/interface";
import FiltersContainer from "@/components/FiltersContainer";
import {
    formatDateStringToDisplayString,
    formatDateTimeToStringWithDotWithoutSeconds,
    formatTimeStringFromString
} from "@/utils/date";
import { useIsTouchDevice } from "@/hooks/useTouchDevice";
import SimplePopup, { PopupItem } from "@/components/SimplePopup";
import FiltersChosen from "@/components/FiltersChosen";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import useAuth from "@/context/authContext";
import SelectField from "@/components/FormBuilder/Select/SelectField";
import { FilterComponentType } from "@/types/filters";
import { Countries } from "@/types/countries";
import { PageOptions } from "@/constants/pagination";

type OrderListType = {
    orders: OrderType[];
    isLoading?: boolean;
    totalOrders?: number;
    filterMetadata?: OrderFilterDataType | null;
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
    handleEditOrder(uuid: string): void;
    handleRefresh: () => void;
    forbiddenTabs: string[] | null;
    // Period selector props (for correct layout)
    startDate?: string;
    endDate?: string;
    onPeriodChange?: (startDate: Date, endDate: Date) => void;
}

// const pageOptions = [
//     { value: '10', label: '10 per page' },
//     { value: '20', label: '20 per page' },
//     { value: '50', label: '50 per page' },
//     { value: '100', label: '100 per page' },
//     { value: '1000', label: '1000 per page' },
//     { value: '1000000', label: 'All' },
// ];

function hasCorrectNotifications(record: OrderType, notifications: NotificationType[]) {
    const orderNotifications = notifications && notifications.length ? notifications.filter(item => item.objectUuid === record.uuid && !item.message.toLowerCase().includes('error')) : [];
    if (orderNotifications.length > 0) {
        return true;
    }
    return true;
}

// convert server FilterType[] to OptionType[]
function filterTypeToOptions(items: { name: string; count: number; id?: string }[]): { value: string; label: string; amount: number }[] {
    return items.map(item => ({
        value: item.id || item.name,
        label: item.name || '-Empty-',
        amount: item.count,
    })).sort((a, b) => a.label.localeCompare(b.label));
}

// build boolean filter options
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

const OrderList: React.FC<OrderListType> = ({
    orders,
    isLoading,
    totalOrders,
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
    handleEditOrder,
    forbiddenTabs,
    startDate,
    endDate,
    onPeriodChange,
}) => {
    const isTouchDevice = useIsTouchDevice();
    const { needSeller, sellersList } = useAuth();

    // Local UI state
    const [current, setCurrent] = React.useState(currentPage);
    const [pageSize, setPageSize] = React.useState(propPageSize);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState(propSearchTerm);

    // Trigger fade-in animation when new data arrives from backend (not on request start)
    useEffect(() => {
        if (!isLoading) {
            // Briefly remove the animation class then restore it so CSS re-plays
            setAnimating(true);
            const id = setTimeout(() => setAnimating(false), 50);
            return () => clearTimeout(id);
        }
    }, [orders]);

    // Sync local state with parent props (e.g., browser back/forward)
    React.useEffect(() => { setCurrent(currentPage); }, [currentPage]);
    React.useEffect(() => { setPageSize(propPageSize); }, [propPageSize]);
    React.useEffect(() => { setSearchTerm(propSearchTerm); }, [propSearchTerm]);
    React.useEffect(() => { setFullTextSearch(propFullTextSearch); }, [propFullTextSearch]);
    React.useEffect(() => {
        if (propSortBy) setSortColumn(propSortBy as keyof OrderType);
        if (propSortOrder) setSortDirection(propSortOrder === 'asc' ? 'ascend' : 'descend');
    }, [propSortBy, propSortOrder]);

    const [fullTextSearch, setFullTextSearch] = useState(propFullTextSearch);
    const handleFullTextSearchChange = () => {
        setFullTextSearch(prev => !prev);
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

    // Notifications
    const { notifications } = useNotifications();

    // const [sortedInfo, setSortedInfo] = useState<SorterResult<OrderType>>({});
    // const handleTableChange: TableProps<OrderType>['onChange'] = (
    //     pagination,
    //     filters,
    //     sorter
    // ) => {
    //     console.log('Variable sortedInfo: ', sorter);
    // };

    // draftFilters = local selections (no API call until Apply)
    const [selectedSeller, setSelectedSeller] = useState<string>('All sellers');

    // Seller options (from auth context, no client-side counting needed for now)
    const sellersOptions = useMemo(() => {
        return [{ label: 'All sellers', value: 'All sellers', amount: totalOrders || orders.length }, ...sellersList.map(item => ({ ...item, amount: 0 }))];
    }, [sellersList, totalOrders, orders.length]);

    // All filter selections in one object
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

    // All filter panel open/close state in one object
    const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
    const setFilterOpen = useCallback((key: string, isOpen: boolean) => {
        setOpenFilters(prev => ({ ...prev, [key]: isOpen }));
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
            // Reserve system keys (not filter-related)
            if (['page', 'limit', 'startDate', 'endDate', 'search', 'fullTextSearch', 'sortBy', 'sortOrder'].includes(key)) return;
            fullUpdate[key] = val?.length ? val : [];
        });

        if (onFiltersChange) onFiltersChange(fullUpdate);
        setCurrent(1);
    }, [draftFilters, selectedFilters, onFiltersChange]);

    // Clear: reset draft AND applied
    const clearAllFilters = useCallback(() => {
        setDraftFilters({});
        if (onClearFilters) onClearFilters();
        setCurrent(1);
    }, [onClearFilters]);

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
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

        if (onSearchChange) {
            onSearchChange(newSearchTerm.trim(), fullTextSearch);
        }
    };

    // Map from local column keys to backend sort column names
    const sortColumnMap: Partial<Record<keyof OrderType, string>> = {
        // columns where our field name != backend sort column name
    };

    const [sortColumn, setSortColumn] = useState<keyof OrderType | null>('date');
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('descend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof OrderType) => {
        const newDirection = sortColumn === columnDataIndex && sortDirection === 'ascend' ? 'descend' : 'ascend';
        setSortDirection(newDirection);
        setSortColumn(columnDataIndex);
        const backendColumn = sortColumnMap[columnDataIndex] ?? String(columnDataIndex);
        if (onSortChange) onSortChange(backendColumn, newDirection === 'ascend' ? 'asc' : 'desc');
    }, [sortColumn, sortDirection, onSortChange]);

    // Orders are already filtered and paginated by 1С (refactored)
    // TO DO: rename later
    const filteredOrders = orders;

    // Total count comes from /GetPagedFilters endpoint's 'orders' property
    const totalCount = filterMetadata?.orders || totalOrders || orders.length;

    const transformedStatuses = useMemo(() =>
        filterMetadata?.statuses ? filterTypeToOptions(filterMetadata.statuses) : [],
        [filterMetadata?.statuses]
    );

    const transformedTroubleStatuses = useMemo(() => {
        if (!filterMetadata?.troubleStatuses) return [];
        const items = filterTypeToOptions(filterMetadata.troubleStatuses);
        const allTroubleCount = items.reduce((sum, i) => sum + (i.amount || 0), 0);
        return [
            { value: 'ANY', label: '-All trouble statuses-', amount: allTroubleCount },
            { value: 'NONE', label: '-NO trouble statuses-', amount: totalCount - allTroubleCount },
            ...items,
        ];
    }, [filterMetadata?.troubleStatuses, totalCount]);

    const transformedNonTroubleStatuses = useMemo(() => {
        if (!filterMetadata) return [];
        const nonTroubleCount = filterMetadata.nonTroubleEvents || 0;
        return [
            { value: 'ANY', label: '-All non-trouble events-', amount: nonTroubleCount },
            { value: 'NONE', label: '-NO non-trouble events-', amount: totalCount - nonTroubleCount },
        ];
    }, [filterMetadata, totalCount]);

    const claimFilterOptions = useMemo(() =>
        filterMetadata ? [
            { label: 'With claims', value: 'true', amount: filterMetadata.claims || 0 },
            { label: 'Without claims', value: 'false', amount: totalCount - filterMetadata.claims || 0 }
        ] : [],
        [filterMetadata, totalCount]
    );

    // Server doesn't yet provide logisticComment count — calculate from orders
    const logisticCommentFilterOptions = useMemo(() => {
        const withCount = orders.filter(order => !!order.logisticComment).length;
        return booleanFilterOptions('With order issue', 'Without order issue', withCount, totalCount);
    }, [orders, totalCount]);

    const commentToCourierServiceFilterOptions = useMemo(() =>
        filterMetadata ? booleanFilterOptions('With comments', 'Without comments', filterMetadata.commentToCourierService || 0, totalCount) : [],
        [filterMetadata, totalCount]
    );

    const selfCollectFilterOptions = useMemo(() =>
        filterMetadata ? booleanFilterOptions('Self collect', 'Not self collect', filterMetadata.selfCollect || 0, totalCount) : [],
        [filterMetadata, totalCount]
    );

    const sentSMSFilterOptions = useMemo(() =>
        filterMetadata ? booleanFilterOptions('SMS was sent', "Doesn't have SMS", filterMetadata.sentSMS || 0, totalCount) : [],
        [filterMetadata, totalCount]
    );

    const transformedWarehouses = useMemo(() =>
        filterMetadata?.warehouses ? filterTypeToOptions(filterMetadata.warehouses) : [],
        [filterMetadata?.warehouses]
    );

    const transformedCourierServices = useMemo(() =>
        filterMetadata?.courierServices ? filterTypeToOptions(filterMetadata.courierServices) : [],
        [filterMetadata?.courierServices]
    );

    const transformedReceiverCountries = useMemo(() =>
        filterMetadata?.receiverCountries ?
            filterMetadata?.receiverCountries.map(item => ({
                value: item.id,
                label: Countries[item.name] as string || item.name || '-Empty-',
                country: item.name,
                amount: item.count,
            })).sort((a, b) => a.label.localeCompare(b.label))
            : [],
        [filterMetadata?.receiverCountries]
    );

    const hasTicketsOptions = useMemo(() =>
        filterMetadata ? booleanFilterOptions('With tickets', 'Without tickets', filterMetadata.tickets || 0, totalCount) : [],
        [filterMetadata, totalCount]
    );

    // Server doesn't yet provide openTickets count — calculate from orders
    const hasOpenTicketsOptions = useMemo(() => {
        const withCount = orders.filter(order => !!order.ticketopen).length;
        return booleanFilterOptions('With open tickets', 'Without open tickets', withCount, totalCount);
    }, [orders, totalCount]);

    const photoFilterOptions = useMemo(() =>
        filterMetadata ? booleanFilterOptions('With photos', 'Without photos', filterMetadata.warehouseAssemblyPhotos || 0, totalCount) : [],
        [filterMetadata, totalCount]
    );

    const customerReturnsOptions = useMemo(() =>
        filterMetadata ? booleanFilterOptions('With customer returns', 'Without customer returns', filterMetadata.customerReturns || 0, totalCount) : [],
        [filterMetadata, totalCount]
    );

    const marketplaceOptions = useMemo(() =>
        filterMetadata?.marketplaces ? filterTypeToOptions(filterMetadata.marketplaces) : [],
        [filterMetadata?.marketplaces]
    );

    // ===== FILTER PANEL UI STATE =====
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const selectedFiltersString = JSON.stringify(selectedFilters);
    useEffect(() => {
        if (isFiltersVisible) return; // Panel is open, don't reset user's draft

        const newDraft: Record<string, string[]> = {};
        if (selectedFilters) {
            Object.entries(selectedFilters).forEach(([key, val]) => {
                if (Array.isArray(val)) {
                    newDraft[key] = val;
                } else if (typeof val === 'string') {
                    newDraft[key] = val.split(',');
                }
            });
        }
        setDraftFilters(newDraft);
    }, [selectedFiltersString, isFiltersVisible]);

    // ===== Filters  ==============
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
                { key: 'troubleStatus', title: 'Trouble status', icon: 'trouble', description: 'Shows orders where the selected trouble status was the last in the trouble status list', options: transformedTroubleStatuses },
                { key: 'nonTroubleStatus', title: 'Non-trouble events', icon: 'event', options: transformedNonTroubleStatuses },
            ];

        if (isTabAllowed('Claims', forbiddenTabs)) {
            configs.push({ key: 'claims', title: 'Claims', icon: 'complaint', options: claimFilterOptions });
        }
        if (isTabAllowed('Order issues', forbiddenTabs)) {
            configs.push({ key: 'logisticComment', title: 'Order issues', icon: 'issue', options: logisticCommentFilterOptions });
        }
        if (isTabAllowed('Comment to courier service', forbiddenTabs)) {
            configs.push({ key: 'commentToCourierService', title: 'Comments to courier service', icon: 'comment', options: commentToCourierServiceFilterOptions });
        }

        configs.push({ key: 'selfCollect', title: 'Self collect', icon: 'self-collect', options: selfCollectFilterOptions });

        if (isTabAllowed('SMS history', forbiddenTabs)) {
            configs.push({ key: 'sentSMS', title: 'Sent SMS', icon: 'sms', options: sentSMSFilterOptions });
        }

        configs.push({ key: 'warehouse', title: 'Warehouse', icon: 'warehouse', options: transformedWarehouses });
        configs.push({ key: 'courierService', title: 'Courier service', icon: 'courier-service', options: transformedCourierServices });
        configs.push({ key: 'receiverCountry', title: 'Receiver country', icon: 'country-in', options: transformedReceiverCountries, isCountry: true });

        if (isTabAllowed('Tickets', forbiddenTabs)) {
            configs.push({ key: 'tickets', title: 'Tickets', icon: 'ticket-gray', options: hasTicketsOptions });
        }
        if (isTabAllowed('Tickets', forbiddenTabs)) {
            configs.push({ key: 'hasOpenTickets', title: 'Tickets (open)', icon: 'ticket-open', options: hasOpenTicketsOptions });
        }

        configs.push({ key: 'warehouseAssemblyPhotos', title: 'Photos from warehouse', icon: 'webcam', options: photoFilterOptions });

        if (isTabAllowed('Customer returns', forbiddenTabs)) {
            configs.push({ key: 'customerReturns', title: 'Customer returns', icon: 'package-return', options: customerReturnsOptions });
        }

        configs.push({ key: 'marketplace', title: 'Marketplaces', icon: 'marketplace', options: marketplaceOptions });

        return configs;
    }, [
        transformedStatuses, transformedTroubleStatuses, transformedNonTroubleStatuses, claimFilterOptions,
        logisticCommentFilterOptions, commentToCourierServiceFilterOptions, selfCollectFilterOptions,
        sentSMSFilterOptions, transformedWarehouses, transformedCourierServices, transformedReceiverCountries,
        hasTicketsOptions, hasOpenTicketsOptions, photoFilterOptions, customerReturnsOptions, marketplaceOptions,
        forbiddenTabs
    ]);

    // DRAFT FILTERS (For the Filter Panel) - Uses local draft state
    const orderFilters = useMemo(() => baseFilterConfigs.map(config => ({
        filterTitle: config.title,
        icon: config.icon as IconType,
        filterDescriptions: config.description || '',
        filterOptions: config.options,
        filterState: draftFilters[config.key] || [],
        setFilterState: (val: string[]) => updateDraftFilter(config.key, val),
        isOpen: !!openFilters[config.key],
        setIsOpen: (v: boolean) => setFilterOpen(config.key, v),
        onClose: () => updateDraftFilter(config.key, []), // Panel uses draft update
        onClick: () => { setIsFiltersVisible(true); setFilterOpen(config.key, true) },
        isCountry: config.isCountry,
    })), [baseFilterConfigs, draftFilters, openFilters, updateDraftFilter, setFilterOpen]);

    // ACTIVE FILTERS (For the Chips Display) - Uses properties from URL (Applied state)
    const activeOrderFilters = useMemo(() => baseFilterConfigs.map(config => {
        let val = selectedFilters?.[config.key];
        const state = typeof val === 'string' ? val.split(',') : (Array.isArray(val) ? val : []);

        return {
            filterTitle: config.title,
            icon: config.icon as IconType,
            filterDescriptions: config.description || '',
            filterOptions: config.options,
            filterState: state,
            setFilterState: () => { },
            isOpen: false,
            setIsOpen: () => { },
            onClose: () => onFiltersChange?.({ [config.key]: [] }), // Chips trigger Apply (Removal)
            onClick: () => { setIsFiltersVisible(true); setFilterOpen(config.key, true) },
            isCountry: config.isCountry,
        };
    }), [baseFilterConfigs, selectedFilters, onFiltersChange]);

    // calculate width for product lines
    const curWidth = useMemo(() => {
        const maxAmount = orders.reduce((acc, item) => Math.max(acc, item.productLines), 0).toString().length;
        const width = 47 + maxAmount * 9;
        return width.toString() + 'px';
    }, [orders]);

    // columns
    const ClaimsColumns: TableColumnProps<OrderType>[] = [];
    if (isTabAllowed('Claims', forbiddenTabs)) {
        ClaimsColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="26px"
                maxWidth="26px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="If order has Claims" >
                        <span><Icon name={"complaint"} className='header-icon' /></span>
                    </Tooltip>
                }
            />,
            render: (_text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="26px"
                        maxWidth="26px"
                        contentPosition="center"
                        childrenBefore={
                            record.claimsExist && (
                                <Popover
                                    content={record.claims.length ? <SimplePopup
                                        items={record.claims.map(orderItem => ({
                                            uuid: record.uuid,
                                            title: formatDateTimeToStringWithDotWithoutSeconds(orderItem.date),
                                            description: orderItem.status,
                                        }))}
                                    /> : null}
                                    trigger={isTouchDevice ? 'click' : 'hover'}
                                    placement="right"
                                    overlayClassName="doc-list-popover"
                                >
                                    <div style={{
                                        minHeight: '8px',
                                        minWidth: '8px',
                                        backgroundColor: 'red',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        alignSelf: 'center',
                                    }} />
                                </Popover>
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'claimsExist',
            key: 'claimsExist',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],

        } as TableColumnProps<OrderType>);
    }

    const OrderIssueColumns: TableColumnProps<OrderType>[] = [];
    if (isTabAllowed('Order issues', forbiddenTabs)) {
        OrderIssueColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="42px"
                maxWidth="46px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="If order has Order issues" >
                        <span className='table-header-title'>Order issue</span>
                    </Tooltip>
                }
            />,
            render: (_text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="42px"
                        maxWidth="46px"
                        contentPosition="center"
                        childrenBefore={
                            !!record.logisticComment && (
                                <Popover
                                    content={<SimplePopup
                                        items={[{
                                            title: '',
                                            description: record.logisticComment,
                                        }] as PopupItem[]}
                                    />}
                                    trigger={isTouchDevice ? 'click' : 'hover'}
                                    placement="right"
                                    overlayClassName="doc-list-popover"
                                >
                                    <div style={{
                                        minHeight: '8px',
                                        minWidth: '8px',
                                        backgroundColor: 'red',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        alignSelf: 'center',
                                    }} />
                                </Popover>
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'logisticComment',
            key: 'logisticComment',
            sorter: false,
            // sorter: (a, b) => !!a.logisticComment < !!b.logisticComment ? -1 : 1,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<OrderType>);
    }

    const SellerColumns: TableColumnProps<OrderType>[] = [];
    if (needSeller()) {
        SellerColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="60px"
                maxWidth="80px"
                contentPosition="left"
                childrenBefore={
                    <Tooltip title="Seller's name" >
                        <>
                            <span className='table-header-title'>Seller</span>
                            {sortColumn === 'seller' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'seller' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
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
                                {record.seller.description}
                            </div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'seller',
            key: 'seller',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<OrderType>);
    }

    const columns: TableColumnProps<OrderType>[] = [
        {
            title: <TitleColumn
                minWidth="50px"
                maxWidth="50px"
                contentPosition="center"
                childrenBefore={<Tooltip title="Sender country ➔ Receiver country"> <Icon name={"car"} /></Tooltip>}>
            </TitleColumn>,
            render: (_text: string, record) =>
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
                        <Popover
                            content={<SimplePopup
                                items={[
                                    { uuid: record.uuid, title: "Country", description: record.receiverCountry } as PopupItem,
                                    { uuid: record.uuid, title: "City", description: record.receiverCity },
                                    { uuid: record.uuid, title: "Zip", description: record.receiverZip },
                                    { uuid: record.uuid, title: "Address", description: record.receiverAddress },
                                    { uuid: record.uuid, title: "Full name", description: record.receiverFullName },
                                    { uuid: record.uuid, title: "Phone", description: record.receiverPhone },
                                    { uuid: record.uuid, title: "E-mail", description: record.receiverEMail },
                                    { uuid: record.uuid, title: "Comment", description: record.receiverComment },
                                ] as PopupItem[]}
                                width={350}
                            />}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="right"
                            overlayClassName="doc-list-popover"
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`} />
                                <div style={{ fontSize: '8px' }}>{record.receiverCountry}</div>
                            </div>
                        </Popover>
                    }
                >
                </TableCell>,
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: <TitleColumn
                className='no-padding'
                minWidth="26px"
                maxWidth="26px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="If order has photos from warehouse" >
                        <span><Icon name={"webcam"} className='header-icon' /></span>
                    </Tooltip>
                }
            />,
            render: (_text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="26px"
                        maxWidth="26px"
                        contentPosition="center"
                        childrenBefore={
                            record?.WarehouseAssemblyPhotos && (
                                <div style={{
                                    minHeight: '8px',
                                    minWidth: '8px',
                                    backgroundColor: 'var(--color-blue)',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    alignSelf: 'center',
                                }} />
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'WarehouseAssemblyPhotos',
            key: 'WarehouseAssemblyPhotos',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        },
        ...ClaimsColumns,
        {
            title: <TitleColumn
                className='no-padding'
                minWidth="26px"
                maxWidth="26px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="If order has Trouble statuses">
                        <span><Icon name={"trouble"} className='header-icon' /></span>
                    </Tooltip>
                }
            />,
            render: (_text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="26px"
                        maxWidth="26px"
                        contentPosition="center"
                        childrenBefore={
                            record.troubleStatusesExist && (
                                <Popover
                                    content={record.troubleStatuses.length ? <SimplePopup
                                        items={record.troubleStatuses.map(orderItem => ({
                                            uuid: record.uuid,
                                            title: formatDateTimeToStringWithDotWithoutSeconds(orderItem.period),
                                            description: orderItem.troubleStatus + ': ' + orderItem.additionalInfo,
                                        }))}
                                        width={500}
                                        needScroll={true}
                                    /> : null}
                                    trigger={isTouchDevice ? 'click' : 'hover'}
                                    placement="right"
                                    overlayClassName="doc-list-popover"
                                >
                                    <div style={{
                                        minHeight: '8px',
                                        minWidth: '8px',
                                        backgroundColor: 'red',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        alignSelf: 'center',
                                    }} />

                                </Popover>
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'troubleStatusesExist',
            key: 'troubleStatusesExist',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        },
        ...OrderIssueColumns,
        {
            title: <TitleColumn
                title=""
                minWidth="20px"
                maxWidth="20px" contentPosition="start"
            />,
            render: (_text: string, record: OrderType) => (
                <TableCell
                    className='no-padding'
                    minWidth="20px"
                    maxWidth="20px"
                    contentPosition="center"
                    childrenAfter={
                        <span style={{ marginTop: '3px' }}>{record.notifications && hasCorrectNotifications(record, notifications) ? <Icon name="notification" /> : null}</span>}
                >
                </TableCell>

            ),
            dataIndex: 'notifications',
            key: 'notifications',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn
                minWidth="60px"
                maxWidth="100px"
                contentPosition="start"
                childrenBefore={<Tooltip title="Current condition of an order">
                    <>
                        <span>Status</span>
                        {sortColumn === 'status' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'status' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </>
                </Tooltip>}
            />,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.status === 'Error' ? record.status : record.statusGroup);
                return (
                    <TableCell
                        minWidth="50px"
                        maxWidth="90px"
                        contentPosition="start"
                        childrenAfter={
                            <Popover
                                content={<SimplePopup
                                    items={[
                                        {
                                            uuid: record.uuid,
                                            title: formatDateTimeToStringWithDotWithoutSeconds(record.lastUpdateDate),
                                            description: record.statusAdditionalInfo
                                        } as PopupItem,
                                    ]}
                                    width={400}
                                />}
                                trigger={isTouchDevice ? 'click' : 'hover'}
                                placement="right"
                                overlayClassName="doc-list-popover"
                            >
                                <span style={{
                                    borderBottom: `2px solid ${underlineColor}`,
                                    display: 'inline-block',
                                }}>{text}</span>
                            </Popover>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            // sorter: (a, b) => a.status < b.status ? 1 : -1,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="60px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="When an order was created">
                        <>
                            <span>Date</span>
                            {sortColumn === 'date' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'date' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell minWidth="60px" maxWidth="80px" contentPosition="start"
                    childrenAfter={
                        <div className="table-date-time-container">
                            <span className="table-date">{formatDateStringToDisplayString(text)}</span>
                            <span className="table-time">{formatTimeStringFromString(text)}</span>
                        </div>
                    }
                />

            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="100px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Order identifier within the warehouse system">
                        <>
                            <span>WH number</span>
                            {sortColumn === 'wapiTrackingNumber' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'wapiTrackingNumber' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </>
                    </Tooltip>} />,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="100px"
                    maxWidth="100px"
                    contentPosition="start"
                    textColor='var(--color-blue)'
                    cursor='pointer'
                />
            ),
            dataIndex: 'wapiTrackingNumber',
            key: 'wapiTrackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => { handleEditOrder(record.uuid) }
                };
            },
        },
        {
            title: <TitleColumn
                minWidth="55px"
                maxWidth="55px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="The sum of cash on delivery">
                        <>
                            <span>COD</span>
                            {sortColumn === 'codAmount' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'codAmount' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </>
                    </Tooltip>} />,
            render: (text: string, record) => {
                if (record.codCurrency) {
                    const currencySymbol = getSymbolFromCurrency(record.codCurrency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="55px"
                            maxWidth="55px"
                            contentPosition="center">
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="55px"
                            maxWidth="55px"
                            contentPosition="center">
                        </TableCell>
                    );
                }
            },
            dataIndex: 'codAmount',
            key: 'codAmount',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip
                        title="Unique code for order identification in the seller's system">
                        <>
                            <span>Order ID</span>
                            {sortColumn === 'clientOrderID' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'clientOrderID' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </>
                    </Tooltip>} />,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="120px" contentPosition="start" />
            ),

            dataIndex: 'clientOrderID',
            key: 'clientOrderID',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['md'],
        },
        ...SellerColumns,
        {
            title: <TitleColumn
                minWidth="70px"
                maxWidth="70px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Code of warehouse">
                        <>
                            <span>Warehouse</span>
                            {sortColumn === 'warehouse' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'warehouse' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="70px" maxWidth="70px" contentPosition="start" />
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="75px"
                maxWidth="75px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Service responsible for transporting and delivering packages">
                        <>
                            <span>Courier</span>
                            {sortColumn === 'courierService' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'courierService' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </>
                    </Tooltip>}
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="75px" maxWidth="75px" contentPosition="start" />
            ),
            dataIndex: 'courierService',
            key: 'courierService',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="70px"
                maxWidth="70px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Number for monitoring the movement of products during transportation/delivery">
                        <>
                            <span>Tracking</span>
                            {sortColumn === 'trackingNumber' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'trackingNumber' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </>
                    </Tooltip>}
            />,
            render: (_text: string, record) => (
                <TableCell minWidth="70px" maxWidth="70px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer' childrenBefore={record.trackingNumber && <span className='track-link' >Track<Icon name='track' /></span>} />
            ),
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {
                        if (record.trackingNumber) {
                            window.open(record.trackingLink, '_blank');
                        }
                    },
                };
            },
            responsive: ['lg'],
        },
        {
            title: <TitleColumn
                minWidth="50px"
                maxWidth="100px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Products" >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span><Icon name={"shopping-cart"} /></span>
                            {sortColumn === 'productLines' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                            {sortColumn === 'productLines' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                        </span>
                    </Tooltip>
                }
            />,
            render: (_text: string, record: OrderType) => (
                <TableCell
                    minWidth="50px"
                    maxWidth="100px"
                    contentPosition="center"
                    childrenAfter={
                        <Popover
                            content={record.products.length ? <SimplePopup
                                items={record.products.map(item => ({
                                    uuid: record.uuid,
                                    title: item.product,
                                    description: item.quantity,
                                }))}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span style={{ width: curWidth }} className="products-cell-style">{record.productLines} <Icon name="info" /></span>
                        </Popover>
                    }
                >
                </TableCell>

            ),
            dataIndex: 'productsCount',
            key: 'productsCount',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        },

    ];

    return (
        <div className="table order-list">
            <SearchContainer>
                <Button type="button" disabled={false} onClick={() => setIsFiltersVisible(prev => !prev)} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                {startDate && endDate && onPeriodChange && (
                    <DateInput
                        handleRangeChange={(newRange: DateRangeType) => onPeriodChange(newRange.startDate, newRange.endDate)}
                        currentRange={{
                            startDate: new Date(startDate),
                            endDate: new Date(endDate)
                        }}
                    />
                )}
                {/*<Button onClick={handleRefresh}>Refresh</Button>*/}
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
                    <SelectField
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
                    <FiltersChosen filters={activeOrderFilters.filter(item => item !== null) as FilterComponentType[]} />
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

            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredOrders?.length ? '' : 'is-empty'}`}>
                <Table<OrderType>
                    dataSource={filteredOrders.map(item => ({ ...item, key: item.uuid })) as OrderType[]}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 700 }}
                    showSorterTooltip={false}
                // onChange={handleTableChange}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total orders:<span className='order-products-total__list-item__value'>{totalOrders}</span></li>
                    </ul>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={totalOrders}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>
            <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible} onClearFilters={clearAllFilters} onApplyFilters={applyFilters} hasUnappliedChanges={hasUnappliedChanges}>
                <FiltersListWithOptions filters={orderFilters.filter(item => item !== null)} />
            </FiltersContainer>
        </div>
    );
};

export default React.memo(OrderList);
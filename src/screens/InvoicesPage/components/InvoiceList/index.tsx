import React, { useCallback, useMemo, useState } from "react";
import { Table, TableColumnProps, Tooltip } from 'antd';
import { ColumnType } from "antd/es/table";
import styles from "./styles.module.scss";
import "@/styles/tables.scss";
import { InvoiceType, InvoiceFilterDataType } from "@/types/invoices";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import { PageOptions } from '@/constants/pagination';
import getSymbolFromCurrency from "currency-symbol-map";
import { getInvoiceForm } from "@/services/invoices";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import Loader from "@/components/Loader";
import { FormFieldTypes } from "@/types/forms";
import Button, { ButtonVariant } from "@/components/Button/Button";
import SearchField from "@/components/SearchField";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchContainer from "@/components/SearchContainer";
import DateInput from "@/components/DateInput";
import FiltersContainer from "@/components/FiltersContainer";
import { formatDateStringToDisplayString } from "@/utils/date";
import { sendUserBrowserInfo } from "@/services/userInfo";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import useTenant from "@/context/tenantContext";
import { FILTER_TYPE } from "@/types/utility";
import { FilterComponentType } from "@/types/filters";
import { Pagination } from 'antd';
import { InvoiceFilters } from "../../types";
import { DateRangeType } from "@/types/dashboard";


export const StatusColors = {
    "Paid": "#29CC39",
    "Credit note": "#5380F5",
    "Unpaid": "#FEDB4F",
    "Partiallity paid": "#5380F5",
    "Overdue": "#FF4000",
    "Overpaid": "#29CC39",
};

type InvoiceListType = {
    invoices: InvoiceType[];
    isLoading: boolean;
    totalInvoices: number;
    filterMetadata?: InvoiceFilterDataType | null;
    currentPage: number;
    pageSize: number;
    searchTerm: string;
    fullTextSearch: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    selectedFilters: Record<string, any>;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onSearchChange: (search: string, fullTextSearch?: boolean) => void;
    onSortChange: (col: string, order: 'asc' | 'desc') => void;
    onFiltersChange: (filters: Partial<InvoiceFilters>) => void;
    onClearFilters: () => void;
    selectedSeller: string;
    startDate: string;
    endDate: string;
    onPeriodChange: (start: Date, end: Date) => void;
}

const InvoiceList: React.FC<InvoiceListType> = ({
    invoices,
    isLoading,
    totalInvoices,
    filterMetadata,
    currentPage,
    pageSize,
    searchTerm: propSearchTerm = '',
    fullTextSearch,
    sortBy,
    sortOrder,
    selectedFilters,
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    onSortChange,
    onFiltersChange,
    onClearFilters,
    // selectedSeller,
    startDate,
    endDate,
    onPeriodChange,
}) => {

    const [isDownloading, setIsDownloading] = useState(false);

    // Local search term: typing doesn't trigger API — only Enter/Search button does
    const [searchTerm, setSearchTerm] = useState(propSearchTerm);
    React.useEffect(() => { setSearchTerm(propSearchTerm); }, [propSearchTerm]);

    const handleSearchSubmit = (value: string) => {
        onSearchChange(value.trim(), fullTextSearch);
    };

    const handleSearchClear = () => {
        setSearchTerm('');
        onSearchChange('', fullTextSearch);
    };

    const { tenantData: { alias } } = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList } = useAuth();

    // ── Sorting — delegated to server; local state only tracks header arrows ──
    const sortColumn = sortBy as keyof InvoiceType;
    const sortDirection = sortOrder === 'asc' ? 'ascend' : 'descend';

    const handleHeaderCellClick = useCallback((columnDataIndex: keyof InvoiceType) => {
        const newOrder: 'asc' | 'desc' =
            sortColumn === columnDataIndex && sortOrder === 'asc' ? 'desc' : 'asc';
        onSortChange(String(columnDataIndex), newOrder);
    }, [sortColumn, sortOrder, onSortChange]);

    // ── Search ───────────────────────────────────────────────────────────────
    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearch',
        label: 'Full text search',
        checked: fullTextSearch,
        onChange: () => onSearchChange(searchTerm, !fullTextSearch),
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    };
    // ── Filters ──────────────────────────────────────────────────────────────
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

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => setIsFiltersVisible(prev => !prev);

    const transformedStatuses = useMemo(() => {
        if (!filterMetadata?.statuses) return [];
        return filterMetadata.statuses.map(status => ({
            value: status.id || status.name,
            label: status.name || status.id,
            amount: status.count,
            color: StatusColors[(status.id || status.name) as keyof typeof StatusColors] || 'white',
        }));
    }, [filterMetadata?.statuses]);

    const selectedFiltersString = JSON.stringify(selectedFilters);
    React.useEffect(() => {
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
        if (onFiltersChange) {
            onFiltersChange(fullUpdate);
        }
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

    const invoiceFilters = [
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
    ] as FilterComponentType[];

    const activeInvoiceFilters = useMemo(() => [
        {
            filterTitle: 'Status',
            icon: 'status' as any,
            filterDescriptions: '',
            filterType: FILTER_TYPE.COLORED_CIRCLE,
            filterOptions: transformedStatuses,
            filterState: selectedFilters?.status ? (typeof selectedFilters.status === 'string' ? [selectedFilters.status] : selectedFilters.status) : [],
            setFilterState: () => { },
            isOpen: false,
            setIsOpen: () => { },
            onClose: () => {
                if (onFiltersChange) {
                    onFiltersChange({ status: [] });
                }
            },
            onClick: () => { setIsFiltersVisible(true); setFilterOpen('status', true) },
        }
    ] as FilterComponentType[], [selectedFilters, transformedStatuses, onFiltersChange, setFilterOpen, onPageChange]);

    // ── Date range ───────────────────────────────────────────────────────────
    const handleDateRangeSave = (newRange: DateRangeType) => {
        onPeriodChange(newRange.startDate, newRange.endDate);
    };

    const currentRange: DateRangeType = useMemo(() => ({
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
    }), [startDate, endDate]);

    // ── Invoice download ─────────────────────────────────────────────────────
    const handleDownloadInvoice = async (uuid: string, type = 'download') => {
        setIsDownloading(true);
        try {
            const requestData = { token: token, alias, uuid, type };

            try {
                sendUserBrowserInfo({ ...getBrowserInfo('GetInvoicePrintForm', AccessObjectTypes["Finances/Invoices"], AccessActions.DownloadPrintForm), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }

            if (!isActionIsAccessible(AccessObjectTypes["Finances/Invoices"], AccessActions.DownloadPrintForm)) {
                return null;
            }

            const response = await getInvoiceForm(superUser && ui ? { ...requestData, ui } : requestData);

            if (response && response.data) {
                const files = response.data;
                if (files.length) {
                    files.forEach(file => {
                        const decodedData = atob(file.data);
                        const arrayBuffer = new Uint8Array(decodedData.length);
                        for (let i = 0; i < decodedData.length; i++) {
                            arrayBuffer[i] = decodedData.charCodeAt(i);
                        }
                        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

                        if (type === 'preview') {
                            const url = URL.createObjectURL(blob);
                            const newTab = window.open(url, '_blank');
                            if (newTab) {
                                newTab.document.title = file.name;
                            } else {
                                alert('Please allow pop-ups for this site to open the file.');
                            }
                        } else {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = file.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    });
                }
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching invoice print form:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    // ── Seller column ────────────────────────────────────────────────────────
    const getSellerName = useCallback((sellerUid: string) => {
        const t = sellersList.find(item => item.value === sellerUid);
        return t ? t.label : ' - ';
    }, [sellersList]);

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    const SellerColumns: TableColumnProps<InvoiceType>[] = [];
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
            render: (_text: string, record) => (
                <TableCell
                    className='no-padding'
                    minWidth="90px"
                    maxWidth="100px"
                    contentPosition="left"
                    childrenBefore={<div className="seller-container">{getSellerName(record.seller)}</div>}
                >
                </TableCell>
            ),
            dataIndex: 'seller',
            key: 'seller',
            sorter: false,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<InvoiceType>);
    }

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnType<InvoiceType>[] = useMemo(() => [
        {
            title: <TitleColumn
                title=""
                minWidth="100px"
                maxWidth="100px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Status</span>
                        {sortColumn === 'status' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'status' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.status);
                return (
                    <TableCell
                        minWidth="100px"
                        maxWidth="100px"
                        contentPosition="start"
                        value={text}
                        childrenBefore={
                            <span style={{
                                borderBottom: `2px solid ${underlineColor}`,
                                display: 'inline-block',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                backgroundColor: underlineColor,
                                marginRight: '5px',
                                justifyContent: 'center',
                            }}>
                            </span>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title=""
                minWidth="60px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Number</span>
                        {sortColumn === 'number' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'number' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="80px" contentPosition="start" />
            ),
            dataIndex: 'number',
            key: 'number',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title=""
                minWidth="60px"
                maxWidth="150px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Date</span>
                        {sortColumn === 'date' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'date' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="60px" maxWidth="80px" contentPosition="start" />
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        ...SellerColumns,
        {
            title: <TitleColumn
                title=""
                minWidth="60px"
                maxWidth="150px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Amount</span>
                        {sortColumn === 'amount' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'amount' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return <TableCell value={`${text} ${currencySymbol}`} minWidth="60px" maxWidth="150px" contentPosition="start" textColor={textColor} />;
                }
                return <TableCell value={'-'} minWidth="60px" maxWidth="150px" contentPosition="start" textColor={textColor} />;
            },
            dataIndex: 'amount',
            key: 'amount',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title=""
                minWidth="60px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Due date</span>
                        {sortColumn === 'dueDate' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'dueDate' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="60px" maxWidth="150px" contentPosition="start" />
            ),
            dataIndex: 'dueDate',
            key: 'dueDate',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title=""
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Overdue</span>
                        {sortColumn === 'overdue' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'overdue' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start" />
            ),
            dataIndex: 'overdue',
            key: 'overdue',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title=""
                minWidth="75px"
                maxWidth="75px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Paid</span>
                        {sortColumn === 'paid' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'paid' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return <TableCell value={`${text} ${currencySymbol}`} minWidth="75px" maxWidth="75px" contentPosition="start" textColor={textColor} />;
                }
                return <TableCell value={'-'} minWidth="75px" maxWidth="75px" contentPosition="start" textColor={textColor} />;
            },
            dataIndex: 'paid',
            key: 'paid',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title=""
                minWidth="75px"
                maxWidth="75px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Debt</span>
                        {sortColumn === 'debt' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'debt' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return <TableCell value={`${text} ${currencySymbol}`} minWidth="75px" maxWidth="75px" contentPosition="start" textColor={textColor} />;
                }
                return <TableCell value={'-'} minWidth="75px" maxWidth="75px" contentPosition="start" textColor={textColor} />;
            },
            dataIndex: 'debt',
            key: 'debt',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="" minWidth="80px" maxWidth="130px" contentPosition="start" />,
            render: (_text: string, record: InvoiceType) => (
                <div className={styles['services-cell-style__wrapper']}>
                    <TableCell
                        minWidth="35px"
                        maxWidth="60px"
                        contentPosition="center"
                        childrenBefore={
                            <span className={styles['services-cell-style']} onClick={() => handleDownloadInvoice(record.uuid)}>
                                <Icon name="download-file" />
                            </span>}
                    >
                    </TableCell>
                    <TableCell
                        minWidth="35px"
                        maxWidth="60px"
                        contentPosition="center"
                        childrenBefore={
                            <span className={styles['services-cell-style']} onClick={() => handleDownloadInvoice(record.uuid, 'preview')}>
                                <Icon name="preview" />
                            </span>}
                    >
                    </TableCell>
                </div>
            ),
            dataIndex: 'uuid',
            key: 'uuid',
            sorter: false,
        },
    ], [handleHeaderCellClick, sortColumn, sortDirection]);

    return (
        <div className={`table ${styles['invoices-list']}`}>
            {isDownloading && <Loader />}

            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <div className='search-block'>
                    <SearchField
                        searchTerm={searchTerm}
                        handleSearch={handleSearchSubmit}
                        handleClear={handleSearchClear}
                        manualSearch={true}
                    />
                    <FieldBuilder {...fullTextSearchField} />
                </div>
            </SearchContainer>

            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    <FiltersChosen filters={activeInvoiceFilters} />
                </div>
                <div className="page-size-container">
                    <span className="page-size-text"></span>
                    <PageSizeSelector
                        options={PageOptions}
                        value={pageSize}
                        onChange={(value: number) => onPageSizeChange(value)}
                    />
                </div>
            </div>

            <div className={`card table__container mb-md fade-in-down ${invoices?.length ? '' : 'is-empty'} ${isLoading ? 'is-loading' : ''}`}>
                <Table
                    dataSource={invoices.map(item => ({ ...item, key: item.tableKey || item.uuid }))}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 700 }}
                    loading={isLoading}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total invoices:<span className='order-products-total__list-item__value'>{totalInvoices}</span></li>
                    </ul>
                </div>
            </div>

            <div className={'custom-pagination'}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    onChange={onPageChange}
                    total={totalInvoices}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>

            <FiltersContainer 
                isFiltersVisible={isFiltersVisible} 
                setIsFiltersVisible={setIsFiltersVisible} 
                onClearFilters={onClearFilters ? onClearFilters : () => updateDraftFilter('status', [])}
                onApplyFilters={applyFilters}
                hasUnappliedChanges={hasUnappliedChanges}
            >
                <FiltersListWithOptions filters={invoiceFilters} />
            </FiltersContainer>
        </div>
    );
};

export default React.memo(InvoiceList);
import React, { useCallback, useMemo, useState } from "react";
import { Pagination, Table, TableColumnProps, Tooltip } from 'antd';
import { ColumnType } from "antd/es/table";
import styles from "./styles.module.scss";
import "@/styles/tables.scss";
import { CodReportType } from "@/types/codReports";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import { PageOptions } from '@/constants/pagination';
import getSymbolFromCurrency from "currency-symbol-map";
import DateInput from "@/components/DateInput";
import { getCODReportForm } from "@/services/codReports";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import Loader from "@/components/Loader";
import { formatDateStringToDisplayString } from "@/utils/date";
import SearchField from "@/components/SearchField";
import SearchContainer from "@/components/SearchContainer";
import { sendUserBrowserInfo } from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import { DateRangeType } from "@/types/dashboard";


type CodReportsListType = {
    codReports: CodReportType[];
    isLoading: boolean;
    totalCodReports: number;
    currentPage: number;
    pageSize: number;
    searchTerm: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onSearchChange: (search: string) => void;
    onSortChange: (col: string, order: 'asc' | 'desc') => void;
    selectedSeller: string;
    startDate: string;
    endDate: string;
    onPeriodChange: (start: Date, end: Date) => void;
}

const CODReportsList: React.FC<CodReportsListType> = ({
    codReports,
    isLoading,
    totalCodReports,
    currentPage,
    pageSize,
    searchTerm: propSearchTerm = '',
    sortBy,
    sortOrder,
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    onSortChange,
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
        onSearchChange(value.trim());
    };

    const handleSearchClear = () => {
        setSearchTerm('');
        onSearchChange('');
    };

    const { tenantData: { alias } } = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList } = useAuth();

    // ── Sorting — delegated to server; local state only tracks header arrows ──
    const sortColumn = sortBy as keyof CodReportType;
    const sortDirection = sortOrder === 'asc' ? 'ascend' : 'descend';

    const handleHeaderCellClick = useCallback((columnDataIndex: keyof CodReportType) => {
        const newOrder: 'asc' | 'desc' =
            sortColumn === columnDataIndex && sortOrder === 'asc' ? 'desc' : 'asc';
        onSortChange(String(columnDataIndex), newOrder);
    }, [sortColumn, sortOrder, onSortChange]);

    // ── Date range ───────────────────────────────────────────────────────────
    const handleDateRangeSave = (newRange: DateRangeType) => {
        onPeriodChange(newRange.startDate, newRange.endDate);
    };

    const currentRange: DateRangeType = useMemo(() => ({
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
    }), [startDate, endDate]);

    // ── COD Report download ───────────────────────────────────────────────────
    const handleDownloadCODReport = async (uuid: string) => {
        setIsDownloading(true);
        try {
            const requestData = { token: token, alias, uuid: uuid };

            try {
                sendUserBrowserInfo({ ...getBrowserInfo('GetCODReportPrintForm', AccessObjectTypes["Finances/CODReports"], AccessActions.DownloadPrintForm), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }

            if (!isActionIsAccessible(AccessObjectTypes["Finances/CODReports"], AccessActions.DownloadPrintForm)) {
                return null;
            }

            const response = await getCODReportForm(superUser && ui ? { ...requestData, ui } : requestData);

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
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                }
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching COD report print form:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    // ── Seller column ────────────────────────────────────────────────────────
    const getSellerName = useCallback((sellerUid: string) => {
        const t = sellersList.find(item => item.value === sellerUid);
        return t ? t.label : ' - ';
    }, [sellersList]);

    const SellerColumns: TableColumnProps<CodReportType>[] = [];
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
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<CodReportType>);
    }

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnType<CodReportType>[] = useMemo(() => [
        {
            title: <TitleColumn
                title=""
                minWidth="80px"
                maxWidth="80px"
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
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start" />
            ),
            dataIndex: 'number',
            key: 'number',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
        },
        {
            title: <TitleColumn
                title=""
                minWidth="80px"
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
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="80px" maxWidth="150px" contentPosition="start" />
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
        },
        ...SellerColumns,
        {
            title: <TitleColumn
                title=""
                minWidth="100px"
                maxWidth="100px"
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
                const textColor = isNegative ? 'red' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return <TableCell value={`${text} ${currencySymbol}`} minWidth="100px" maxWidth="200px" contentPosition="start" textColor={textColor} />;
                }
                return <TableCell value={'-'} minWidth="100px" maxWidth="200px" contentPosition="start" textColor={textColor} />;
            },
            dataIndex: 'amount',
            key: 'amount',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
        },
        {
            title: <TitleColumn
                title=""
                minWidth="150px"
                maxWidth="200px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Period</span>
                        {sortColumn === 'period' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'period' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="150px" maxWidth="200px" contentPosition="start" />
            ),
            dataIndex: 'period',
            key: 'period',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title=""
                minWidth="80px"
                maxWidth="150px"
                contentPosition="start"
                childrenBefore={
                    <div className='sorter-col-wrapper'>
                        <span className='table-header-title'>Orders count</span>
                        {sortColumn === 'ordersCount' && sortDirection === 'ascend' ? <span className='lm-6'><Icon name='arrow-asc' /></span> : null}
                        {sortColumn === 'ordersCount' && sortDirection === 'descend' ? <span className='lm-6'><Icon name='arrow-desc' /></span> : null}
                    </div>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="150px" contentPosition="start" />
            ),
            dataIndex: 'ordersCount',
            key: 'ordersCount',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="" minWidth="100px" maxWidth="800px" contentPosition="end" />,
            render: (_text: string, _record: CodReportType) => (
                <TableCell
                    minWidth="100px"
                    maxWidth="800px"
                    contentPosition="end"
                    childrenBefore={
                        <span className={styles['lines-cell-style']}>
                            <Icon name="download-file" />
                        </span>}
                >
                </TableCell>
            ),
            dataIndex: 'uuid',
            key: 'uuid',
            sorter: false,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
            onCell: (record) => ({
                onClick: () => { handleDownloadCODReport(record.uuid) }
            }),
            responsive: ['lg'],
        },
    ], [handleHeaderCellClick, sortColumn, sortDirection]);

    return (
        <div className='table'>
            {isDownloading && <Loader />}

            <SearchContainer>
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <div className='search-block'>
                    <SearchField
                        searchTerm={searchTerm}
                        handleSearch={handleSearchSubmit}
                        handleClear={handleSearchClear}
                        manualSearch={true}
                    />
                </div>
            </SearchContainer>

            <div className="page-size-container">
                <span className="page-size-text"></span>
                <PageSizeSelector
                    options={PageOptions}
                    value={pageSize}
                    onChange={(value: number) => onPageSizeChange(value)}
                />
            </div>

            <div className={`card table__container mb-md fade-in-down ${codReports?.length ? '' : 'is-empty'} ${isLoading ? 'is-loading' : ''}`}>
                <Table
                    dataSource={codReports.map(item => ({ ...item, key: item.tableKey || item.uuid }))}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 700 }}
                    loading={isLoading}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total COD reports:<span className='order-products-total__list-item__value'>{totalCodReports}</span></li>
                    </ul>
                </div>
            </div>

            <div className={'custom-pagination'}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    onChange={onPageChange}
                    total={totalCodReports}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default React.memo(CODReportsList);
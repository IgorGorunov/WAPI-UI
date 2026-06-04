import React, { useState, useCallback } from "react";

import { Table, Pagination, Tooltip } from "antd";
import type { TableColumnProps } from "antd";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Loader from "@/components/Loader";
import Icon from "@/components/Icon";
import { AntiFraudResultType } from "@/screens/AntiFraudResultsPage/types";
import {ZONE_COLORS, ANTIFRAUD_ACTIONS, SUBSCRIPTION_OPTIONS} from "@/screens/AntiFraudSettingsPage/types";
import { PageOptions } from "@/constants/pagination";
import {
    formatDateStringToDisplayString,
    formatTimeStringFromString
} from "@/utils/date";
import styles from "./styles.module.scss";
import "@/styles/tables.scss";
import PageSizeSelector from "@/components/LabelSelect";

type ResultsTableProps = {
    results: AntiFraudResultType[];
    isLoading?: boolean;
    totalCount?: number;
    currentPage?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
    onRowClick?: (uuid: string) => void;
};

const ACTION_COLORS: Record<string, string> = {
    [ANTIFRAUD_ACTIONS.Allow]: "#29CC39",  //#238b45
    [ANTIFRAUD_ACTIONS.Block]: "#E62E2E",  //#8b0000
};

const ResultsTable: React.FC<ResultsTableProps> = ({
    results,
    isLoading,
    totalCount,
    currentPage = 1,
    pageSize: propPageSize = 10,
    sortBy: propSortBy,
    sortOrder: propSortOrder,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onRowClick,
}) => {
    const [current, setCurrent] = useState(currentPage);
    const [pageSize, setPageSize] = useState(propPageSize);
    const [sortColumn, setSortColumn] = useState<keyof AntiFraudResultType | null>(
        propSortBy as keyof AntiFraudResultType ?? "requestPeriod"
    );
    const [sortDirection, setSortDirection] = useState<"ascend" | "descend">(
        propSortOrder === "asc" ? "ascend" : "descend"
    );


    const handleHeaderCellClick = useCallback(
        (dataIndex: keyof AntiFraudResultType) => {
            const newDir = sortColumn === dataIndex && sortDirection === "ascend" ? "descend" : "ascend";
            setSortDirection(newDir);
            setSortColumn(dataIndex);
            if (onSortChange) onSortChange(String(dataIndex), newDir === "ascend" ? "asc" : "desc");
        },
        [sortColumn, sortDirection, onSortChange]
    );

    const headerCell = (label: string, dataIndex: keyof AntiFraudResultType, minW: string, maxW: string, tooltip?: string) => (
        <TitleColumn
            minWidth={minW}
            maxWidth={maxW}
            contentPosition="left"
            childrenBefore={
                <Tooltip title={tooltip || label}>
                    <span className="table-header-title">{label}</span>
                    {sortColumn === dataIndex && sortDirection === "ascend" && <span className="lm-6"><Icon name="arrow-asc" /></span>}
                    {sortColumn === dataIndex && sortDirection === "descend" && <span className="lm-6"><Icon name="arrow-desc" /></span>}
                </Tooltip>
            }
        />
    );

    const columns: TableColumnProps<AntiFraudResultType>[] = [
        {
            title: headerCell("Date", "requestPeriod", "110px", "140px"),
            dataIndex: "requestDate",
            key: "requestDate",
            render: (_val, record) => (
                // <TableCell minWidth="110px" maxWidth="140px" contentPosition="left" childrenBefore={
                //     <span className={styles["cell-text"]}>
                //         {formatDateTimeToStringWithDotWithoutSeconds(record.requestDate)}
                //     </span>
                // } />
                <TableCell minWidth="60px" maxWidth="80px" contentPosition="start"
                           childrenAfter={
                               <div className={styles["table-date-time-container"]}>
                                   <span className={styles["table-date"] || "table-date"}>{formatDateStringToDisplayString(record.requestPeriod)}</span>
                                   <span className={styles["table-time"] || "table-time"}>{formatTimeStringFromString(record.requestPeriod)}</span>
                               </div>
                           }
                />
            ),
            onHeaderCell: () => ({ onClick: () => handleHeaderCellClick("requestPeriod") }),
        },
        {
            title: headerCell("WH number / Phone number", "numberForDisplay", "120px", "180px"),
            dataIndex: "numberForDisplay",
            key: "numberForDisplay",
            render: (_val, record) => (
                <TableCell minWidth="120px" maxWidth="180px" contentPosition="left" childrenBefore={
                    <span className={`${styles["cell-text"]} ${styles["cell-text--phone"]}`}>
                        {record.shipmentOrder==='None' ? <Icon name={'phone'}/> : <Icon name={'orders'}/>}{record.numberForDisplay || "—"}
                    </span>
                } />
            ),
            onHeaderCell: () => ({ onClick: () => handleHeaderCellClick("shipmentOrder") }),
        },
        {
            title: headerCell("Subscription", "subscription", "90px", "300px"),
            dataIndex: "subscription",
            key: "subscription",
            render: (_val, record) => {
                return (
                    <TableCell minWidth="100px" maxWidth="300px" contentPosition="left" childrenBefore={
                        <span
                            className={styles["badge"]}
                            style={{ whiteSpace: "wrap" }}
                        >
                            {SUBSCRIPTION_OPTIONS.find(item => item.value === record.subscription)?.label || record.subscription}
                        </span>
                    } />
                );
            },
            onHeaderCell: () => ({ onClick: () => handleHeaderCellClick("subscription") }),
            responsive: ["sm"],
        },
        {
            title: headerCell("Successful %", "successfullPercent", "140px", "180px", "Average fraud score percentage"),
            dataIndex: "averagePercent",
            key: "averagePercent",
            render: (_val, record) => {
                const zoneColor = ZONE_COLORS[record.zone as keyof typeof ZONE_COLORS] || "#7D8FB3";
                return (
                    <TableCell minWidth="140px" maxWidth="180px" contentPosition="left" childrenBefore={
                        <div className={styles["score-cell"]}>
                            <div className={styles["score-bar-track"]} title={`${record.successfullPercent}%`}>
                                <div
                                    className={styles["score-bar-fill"]}
                                    style={{
                                        width: `${Math.min(record.successfullPercent, 100)}%`,
                                        backgroundColor: zoneColor,
                                    }}
                                />
                            </div>
                            <span className={styles["score-value"]}>{record.successfullPercent}%</span>
                        </div>
                    } />
                );
            },
            onHeaderCell: () => ({ onClick: () => handleHeaderCellClick("successfullPercent") }),
        },
        {
            title: headerCell("Zone", "zone", "80px", "100px"),
            dataIndex: "zone",
            key: "zone",
            render: (_val, record) => {
                const color = ZONE_COLORS[record.zone as keyof typeof ZONE_COLORS] || "#7D8FB3";
                return (
                    <TableCell minWidth="80px" maxWidth="100px" contentPosition="left" childrenBefore={
                        <span
                            className={styles["badge"]}
                            style={{ backgroundColor: `${color}11`, color, borderColor: `${color}55`, fontWeight: "bold"}}
                        >
                            {record.zone || "—"}
                        </span>
                    } />
                );
            },
            onHeaderCell: () => ({ onClick: () => handleHeaderCellClick("zone") }),
            responsive: ["md"],
        },
        {
            title: headerCell("Action", "action", "80px", "100px"),
            dataIndex: "action",
            key: "action",
            render: (_val, record) => {
                const color = ACTION_COLORS[record.action] || "var(--color-light-blue-gray)";
                return (
                    <TableCell minWidth="80px" maxWidth="100px" contentPosition="left" childrenBefore={
                        <span
                            className={styles["badge"]}
                            style={{ color, borderColor: `${color}55` }}
                        >
                            {record.action || "—"}
                        </span>
                    } />
                );
            },
            onHeaderCell: () => ({ onClick: () => handleHeaderCellClick("action") }),
            responsive: ["md"],
        },
        // {
        //     title: headerCell("Accrual services", "accrualServices", "120px", "200px"),
        //     dataIndex: "accrualServices",
        //     key: "accrualServices",
        //     render: (_val, record) => (
        //         <TableCell minWidth="120px" maxWidth="200px" contentPosition="left" childrenBefore={
        //             <span className={styles["cell-text"]}>{record.accrualServices || "—"}</span>
        //         } />
        //     ),
        //     onHeaderCell: () => ({ onClick: () => handleHeaderCellClick("accrualServices") }),
        //     responsive: ["lg"],
        // },
        {
            title: headerCell("Status", "status", "100px", "260px"),
            dataIndex: "status",
            key: "status",
            render: (_val, record) => (
                <TableCell minWidth="100px" maxWidth="260px" contentPosition="left" childrenBefore={
                    <span className={styles["cell-text"]}>{record.status || "—"}</span>
                } />
            ),
            onHeaderCell: () => ({ onClick: () => handleHeaderCellClick("status") }),
            responsive: ["lg"],
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrent(page);
        if (onPageChange) onPageChange(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrent(1);
        if (onPageSizeChange) onPageSizeChange(size);
    };

    return (
        <div className={`table ${styles["results-table-wrapper"]} `}>
            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    {/*<FiltersChosen filters={activeOrderFilters.filter(item => item !== null) as FilterComponentType[]} />*/}
                </div>
                <div className="page-size-container">
                    <span className="page-size-text"></span>
                    <PageSizeSelector
                        options={PageOptions}
                        value={pageSize}
                        onChange={(val) => handlePageSizeChange(Number(val))}
                    />
                </div>
            </div>
            <div className={`card ${styles["results-table"]} ${isLoading ? styles["results-table--loading"] : ""} table__container`}>
                <Table<AntiFraudResultType>
                    dataSource={results.map(r => ({ ...r, key: r.uuid }))}
                    columns={columns}
                    pagination={false}
                    loading={{ spinning: isLoading && results.length === 0, indicator: <Loader  /> }}
                    onRow={(record) => ({
                        onClick: () => onRowClick?.(record.uuid),
                        className: styles["results-row"],
                    })}
                    locale={{ emptyText: isLoading ? " " : "No results found" }}
                    className="wapi-table"
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total number of checks:<span className='order-products-total__list-item__value'>{totalCount}</span></li>
                    </ul>
                </div>
            </div>

            {(totalCount > pageSize || results.length > 0) && (
                <div className={'custom-pagination'}>
                    <Pagination
                        current={current}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        total={totalCount}
                        hideOnSinglePage
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default ResultsTable;

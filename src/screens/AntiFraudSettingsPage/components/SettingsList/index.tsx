import React, { useState } from "react";
import { Table, Pagination } from "antd";
import type { TableColumnProps } from "antd";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import {AntiFraudSettingsFormType, SUBSCRIPTION_OPTIONS} from "@/screens/AntiFraudSettingsPage/types";
import { formatDateStringToDisplayString } from "@/utils/date";
import styles from "./styles.module.scss";
import PageSizeSelector from "@/components/LabelSelect";
import {PageOptions} from "@/constants/pagination";
import Icon from "@/components/Icon";

export type SettingsListPropsType = {
    settingsList: AntiFraudSettingsFormType[];
    handleEdit: (code: string) => void;
};

const SettingsList: React.FC<SettingsListPropsType> = ({ settingsList, handleEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const columns: TableColumnProps<AntiFraudSettingsFormType>[] = [
        {
            title: <TitleColumn title="Setting ID" minWidth="100px" maxWidth="150px" contentPosition="left" />,
            dataIndex: "code",
            key: "code",
            render: (text) => <TableCell minWidth="100px" maxWidth="150px" value={text || '-'} contentPosition="left" />,
        },
        {
            title: <TitleColumn title="Period" minWidth="170px" maxWidth="180px" contentPosition="left" />,
            key: "period",
            render: (_, record) => {
                const start = record.startDate ? formatDateStringToDisplayString(record.startDate) : 'N/A';
                const end = record.endDate ? formatDateStringToDisplayString(record.endDate) : 'N/A';
                return <TableCell minWidth="170px" maxWidth="3180px" value={`${start} - ${end}`} contentPosition="left" />;
            },
        },
        {
            title: <TitleColumn title="Subscription" minWidth="150px" maxWidth="300px" contentPosition="left" />,
            dataIndex: "subscription",
            key: "subscription",
            render: (text) => <TableCell minWidth="150px" maxWidth="300px" value={SUBSCRIPTION_OPTIONS.find(item=> item.value==text)?.label || '-'} contentPosition="left" />,
        },
        {
            title: <TitleColumn title="COD type" minWidth="100px" maxWidth="100px" contentPosition="left" />,
            dataIndex: "codType",
            key: "codType",
            render: (text) => <TableCell minWidth="100px" maxWidth="100px" value={text || '-'} contentPosition="left" />,
        },
        {
            title: <TitleColumn title="Description" minWidth="200px" maxWidth="700px" contentPosition="left" />,
            dataIndex: "description",
            key: "description",
            render: (text) => <TableCell minWidth="200px" maxWidth="700px" value={text || '-'} contentPosition="left" />,
        },

        {
            title: <TitleColumn title="Checker is enabled" minWidth="50px" maxWidth="120px" contentPosition="left" />,
            key: "use",
            render: (_, record) => (
                <div className={`${styles['use-checkbox']}`}>{record.use ? <Icon name={"biggest-check"}/> : ''}</div>
            ),
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = settingsList.slice(startIndex, startIndex + pageSize);

    return (
        <div className={styles["settings-table-wrapper"]}>
            <div className={`table ${styles["settings-table"]}`}>
                <div className='filter-and-pagination-container'>
                    <div className='current-filter-container'>
                    </div>
                    <div className="page-size-container">
                        <span className="page-size-text"></span>
                        <PageSizeSelector
                            options={PageOptions}
                            value={pageSize}
                            onChange={(value: number) => handlePageSizeChange(value)}
                        />
                    </div>
                </div>

                <div className={`card table__container`}>
                    <Table<AntiFraudSettingsFormType>
                        dataSource={paginatedData.map((r, i) => ({ ...r, key: r.code || `row_${i}` }))}
                        columns={columns}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        onRow={(record) => ({
                            onClick: () => {
                                if (record.code) {
                                    handleEdit(record.code);
                                }
                            },
                            className: styles["settings-row"],
                            style: { cursor: 'pointer' }
                        })}
                        locale={{ emptyText: "No settings found" }}
                        className="wapi-table"
                    />
                </div>
                {settingsList.length > 0 && (
                    <div className={'custom-pagination'}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            total={settingsList?.length || 0}
                            hideOnSinglePage
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsList;
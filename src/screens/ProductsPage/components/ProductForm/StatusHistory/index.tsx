import React from "react";
import { StatusHistoryType} from "@/types/products";
import "./styles.scss";
import {formatDateTimeToStringWithDot} from "@/utils/date";
import {useTranslations} from "next-intl";
type PropsType = {
    statusHistory?: StatusHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {
    const t = useTranslations('ProductsPage.productColumns.statusHistoryColumns');
    return (
        <div className="status-history">
            <div className="status-history__header">
                <div className='date-column'>{t('period')}</div>
                <div className='status-column'>{t('status')}</div>
                <div className='comment-column'>{t('comment')}</div>
            </div>
            <ul className="status-history__list">
                {statusHistory &&
                    statusHistory.map((status: StatusHistoryType, index: number) => (
                        <li
                            key={status.status + "_" + index}
                            className={`status-history__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{formatDateTimeToStringWithDot(status.date)}</div>
                            <div className='status-column'>{status.status}</div>
                            <div className='comment-column'>{status.comment}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

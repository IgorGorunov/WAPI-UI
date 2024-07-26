import React, {useCallback} from "react";
import {AmazonPrepOrderHistoryType} from "@/types/amazonPrep";
import "./styles.scss";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";
import {formatDateTimeToStringWithDot} from "@/utils/date";
import {useTranslations} from "next-intl";

type PropsType = {
    statusHistory?: AmazonPrepOrderHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {
    const t = useTranslations('AmazonPrep.amazonColumns.statusHistory');

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    return (
        <div className="order-status-history">
            <div className="order-status-history__header">
                <div className='date-column'>{t('period')}</div>
                <div className='column status-column'>{t('status')}</div>
                <div className='column tracking-number-column'>{t('trackingNumber')}</div>
                <div className='column comment-column'>{t('additionalIngo')}</div>
            </div>
            <ul className="order-status-history__list">
                {statusHistory &&
                    statusHistory.map((status: AmazonPrepOrderHistoryType, index: number) => (
                        <li
                            key={status.status + "_" + index}
                            className={`order-status-history__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{formatDateTimeToStringWithDot(status.period)}</div>
                            <div className='column status-column'>
                                <span style={{
                                    borderBottom: `2px solid ${getUnderlineColor(status.statusGroup)}`,
                                    display: 'inline-block',
                                }}>
                                    {status.status}
                                </span>
                            </div>
                            <div className='column tracking-number-column'>{status.trackingNumber}</div>
                            <div className='column comment-column'>{status.additionalInfo}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

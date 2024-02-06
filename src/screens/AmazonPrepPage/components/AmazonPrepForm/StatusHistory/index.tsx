import React, {useCallback} from "react";
import {AmazonPrepOrderHistoryType} from "@/types/amazonPrep";
import "./styles.scss";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";
import {formatDateTimeToStringWithDot} from "@/utils/date";

type PropsType = {
    statusHistory?: AmazonPrepOrderHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const hours = date.getHours().toString();
        const mins = date.getMinutes().toString();
        return `${date.toLocaleDateString()}  ${hours.length<2 ? '0':''}${hours}:${mins.length<2 ? '0':''}${mins}`;
    }

    return (
        <div className="order-status-history">
            <div className="order-status-history__header">
                <div className='date-column'>Period</div>
                <div className='column status-column'>Status</div>
                <div className='column tracking-number-column'>Tracking #</div>
                <div className='column comment-column'>Additional information</div>

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

import React, {useCallback} from "react";
import {OrderHistoryType, SingleOrderType} from "@/types/orders";
import "./styles.scss";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";

type PropsType = {
    statusHistory?: OrderHistoryType[] ;
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
                <div className='status-column'>Status</div>
                <div className='tracking-number-column'>Tracking #</div>
                <div className='trouble-status-column'>Trouble status</div>
                <div className='comment-column'>Additional information</div>

            </div>
            <ul className="order-status-history__list">
                {statusHistory &&
                    statusHistory.map((status: OrderHistoryType, index: number) => (
                        <li
                            key={status.status + "_" + index}
                            className={`order-status-history__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{formatDate(status.period)}</div>
                            <div className='status-column'>
                                <span style={{
                                    borderBottom: `2px solid ${getUnderlineColor(status.statusGroup)}`,
                                    display: 'inline-block',
                                }}>
                                    {status.status}
                                </span>
                            </div>
                            <div className='tracking-number-column'>{status.trackingNumber}</div>
                            <div className='trouble-status-column'>{status.troubleStatus}</div>
                            <div className='comment-column'>{status.additionalInfo}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

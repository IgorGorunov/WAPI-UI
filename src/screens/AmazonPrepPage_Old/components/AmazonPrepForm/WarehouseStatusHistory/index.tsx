import React, {useCallback} from "react";
import {AmazonPrepOrderHistoryType, AmazonPrepOrderWarehouseStatusHistoryType} from "@/types/amazonPrep";
import "./styles.scss";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";
import {formatDateTimeToStringWithDot} from "@/utils/date";

type PropsType = {
    statusHistory?: AmazonPrepOrderWarehouseStatusHistoryType[] ;
};

const WarehouseStatusHistory: React.FC<PropsType> = ({ statusHistory }) => {

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    return (
        <div className="amazon-warehouse-status-history">
            <div className="amazon-warehouse-status-history__header">
                <div className='date-column'>Period</div>
                <div className='column status-column'>Status</div>
                <div className='column comment-column'>Additional information</div>
            </div>
            <ul className="amazon-warehouse-status-history__list">
                {statusHistory &&
                    statusHistory.map((status: AmazonPrepOrderHistoryType, index: number) => (
                        <li
                            key={status.status + "_" + index}
                            className={`amazon-warehouse-status-history__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{formatDateTimeToStringWithDot(status.period)}</div>
                            <div className='column status-column'>
                                <span style={{
                                    //borderBottom: `2px solid ${getUnderlineColor(status.statusGroup)}`,
                                    display: 'inline-block',
                                }}>
                                    {status.status}
                                </span>
                            </div>
                            <div className='column comment-column'>{status.additionalInfo}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default WarehouseStatusHistory;

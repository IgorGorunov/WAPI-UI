import React from "react";
import {OrderHistoryType, SingleOrderType} from "@/types/orders";
import "./styles.scss";

type PropsType = {
    statusHistory?: OrderHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {
    console.log("history:", statusHistory)

    return (
        <div className="status-history">
            <div className="status-history__header">
                <div className='date-column'>Period</div>
                <div className='status-column'>Status</div>
                <div className='tracking-number-column'>Tracking number</div>
                <div className='comment-column'>Additional information</div>
            </div>
            <ul className="status-history__list">
                {statusHistory &&
                    statusHistory.map((status: OrderHistoryType, index: number) => (
                        <li
                            key={status.status + "_" + index}
                            className={`status-history__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{new Date(status.period).toLocaleDateString()}</div>
                            <div className='status-column'>{status.status}</div>
                            <div className='tracking-number-column'>{status.trackingNumber}</div>
                            <div className='comment-column'>{status.additionalInfo}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

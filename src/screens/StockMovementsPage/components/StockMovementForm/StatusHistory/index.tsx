import React from "react";
import "./styles.scss";
import {StockMovementHistoryType} from "@/types/stockMovements";

type PropsType = {
    statusHistory?: StockMovementHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const hours = date.getHours().toString();
        const mins = date.getMinutes().toString();
        return `${date.toLocaleDateString()}  ${hours.length<2 ? '0':''}${hours}:${mins.length<2 ? '0':''}${mins}`;
    }

    return (
        <div className="stock-movement-status-history">
            <div className="stock-movement-status-history__header">
                <div className='date-column'>Period</div>
                <div className='column status-column'>Status</div>
                <div className='column etd-column'>ETD</div>
                <div className='column eta-column'>ETA</div>
                <div className='column freight-supplier-column'>Freight supplier</div>

            </div>
            <ul className="stock-movement-status-history__list">
                {statusHistory &&
                    statusHistory.map((status: StockMovementHistoryType, index: number) => (
                        <li
                            key={status.status + "_" + index}
                            className={`stock-movement-status-history__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{formatDate(status.period)}</div>
                            <div className='column status-column'>
                                {status.status}
                            </div>
                            <div className='column etd-column'>{status.estimatedTimeDepartures}</div>
                            <div className='column eta-column'>{status.estimatedTimeArrives}</div>
                            <div className='column freight-supplier-column'>{status.freightSupplier}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

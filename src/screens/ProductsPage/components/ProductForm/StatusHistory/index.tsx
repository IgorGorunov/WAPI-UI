import React from "react";
import { StatusHistoryType} from "@/types/products";
import "./styles.scss";
import satori from "next/dist/compiled/@vercel/og/satori";

type PropsType = {
    statusHistory?: StatusHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {


    return (
        <div className="status-history">
            <div className="status-history__header">
                <div className='date-column'>Date</div>
                <div className='status-column'>Status</div>
                <div className='comment-column'>Comment</div>
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
                            <div className='date-column'>{new Date(status.date).toLocaleDateString()}</div>
                            <div className='status-column'>{status.status}</div>
                            <div className='comment-column'>{status.comment}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

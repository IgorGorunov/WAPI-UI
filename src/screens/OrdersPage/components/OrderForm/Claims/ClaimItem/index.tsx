import React from "react";
import {ClaimType} from "@/types/orders";
import "./styles.scss";

type PropsType = {
    claim?: ClaimType;
};

const Claim: React.FC<PropsType> = ({ claim }) => {
    return (
        <div className="order-claim-item">
            <p>Date: <span>{claim.date}</span></p>
            <p>Claim #: <span>{claim.number}</span></p>
            <p>Status: <span>{claim.status}</span></p>
            <div className='order-claim-item__status-history'>
                <p className='order-claim-item__status-history__title'>Status history:</p>
                <div className="order-claim-item__status-history__table">
                    <div className="order-claim-item__status-history__table-header">
                        <div className='date-column'>Period</div>
                        <div className='column status-column'>Status</div>
                    </div>
                    <ul className="order-claim-item__status-history__table-list">
                        {claim.statusHistory &&
                            claim.statusHistory.map((status, index: number) => (
                                <li
                                    key={status.Status + "_" + index}
                                    className={`order-claim-item__status-history__table-list-item ${
                                        index % 2 === 1 ? "highlight" : " "
                                    }`}
                                >
                                    {/*<div className='date-column'>{formatDate(status.date)}</div>*/}
                                    <div className='date-column'>{status.date}</div>
                                    <div className='column status-column'>{status.Status}</div>
                                    </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Claim;

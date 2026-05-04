import React from "react";
import {ClaimType} from "@/types/orders";
import styles from "./styles.module.scss";
import {formatDateStringToDisplayString, formatDateTimeToStringWithDot} from "@/utils/date";

type PropsType = {
    claim?: ClaimType;
};

const Claim: React.FC<PropsType> = ({ claim }) => {
    return (
        <div className={styles["order-claim-item"]}>
            <p>Date: <span>{formatDateTimeToStringWithDot(claim.date)}</span></p>
            <p>Claim #: <span>{claim.number}</span></p>
            <p>Status: <span>{claim.status}</span></p>
            <div className={styles['order-claim-item__status-history']}>
                <p className={styles['order-claim-item__status-history__title']}>Status history:</p>
                <div className={styles["order-claim-item__status-history__table"]}>
                    <div className={styles["order-claim-item__status-history__table-header"]}>
                        <div className={styles['date-column']}>Period</div>
                        <div className={`${styles['column']} ${styles['status-column']}`}>Status</div>
                    </div>
                    <ul className={styles["order-claim-item__status-history__table-list"]}>
                        {claim.statusHistory &&
                            claim.statusHistory.map((status, index: number) => (
                                <li
                                    key={status.Status + "_" + index}
                                    className={`${styles['order-claim-item__status-history__table-list-item']} ${index % 2 === 1 ? styles['highlight'] : ''}`}
                                >
                                    {/*<div className={styles['date-column']}>{formatDate(status.date)}</div>*/}
                                    <div className={styles['date-column']}>{formatDateStringToDisplayString(status.date)}</div>
                                    <div className={`${styles['column']} ${styles['status-column']}`}>{status.Status}</div>
                                    </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Claim;

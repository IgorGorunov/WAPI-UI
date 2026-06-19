import React from "react";
import { StatusHistoryType} from "@/types/products";
import styles from "./styles.module.scss";
import {formatDateTimeToStringWithDot} from "@/utils/date";
type PropsType = {
    statusHistory?: StatusHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {
    return (
        <div className={styles["status-history"]}>
            <div className={styles["status-history__header"]}>
                <div className={styles['date-column']}>Period</div>
                <div className={styles['status-column']}>Status</div>
                <div className={styles['comment-column']}>Comment</div>
            </div>
            <ul className={styles["status-history__list"]}>
                {statusHistory &&
                    statusHistory.map((status: StatusHistoryType, index: number) => (
                        <li
                            key={status.status + "_" + index}
                            className={`${styles['status-history__list-item']} ${
                                index % 2 === 1 ? styles["highlight"] : " "
                            }`}
                        >
                            <div className={styles['date-column']}>{formatDateTimeToStringWithDot(status.date)}</div>
                            <div className={styles['status-column']}>{status.status}</div>
                            <div className={styles['comment-column']}>{status.comment}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

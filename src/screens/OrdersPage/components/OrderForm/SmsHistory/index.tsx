import React, {useCallback} from "react";
import {OrderSmsHistoryType} from "@/types/orders";
import styles from "./styles.module.scss";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";
import {formatDateTimeToStringWithDot} from "@/utils/date";

type PropsType = {
    smsHistory?: OrderSmsHistoryType[] ;
};

const SmsHistory: React.FC<PropsType> = ({ smsHistory }) => {

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    return (
        <div className={styles["order-sms-history"]}>
            <div className={styles["order-sms-history__header"]}>
                <div className={styles['date-column']}>Period</div>
                {/*<div className={`${styles['column']} ${styles['status-column']}`}>Status</div>*/}
                <div className={`${styles['column']} ${styles['recipient-column']}`}>Recipient</div>
                <div className={`${styles['column']} ${styles['text-column']}`}>Sms text</div>

            </div>
            <ul className={styles["order-sms-history__list"]}>
                {smsHistory &&
                    smsHistory.map((sms: OrderSmsHistoryType, index: number) => (
                        <li
                            key={sms.smsPeriod + "_" + index}
                            className={`${styles['order-sms-history__list-item']} ${index % 2 === 1 ? styles['highlight'] : ''}`}
                        >
                            <div className={styles['date-column']}>{formatDateTimeToStringWithDot(sms.smsPeriod)}</div>
                            {/*<div className={`${styles['column']} ${styles['status-column']}`}>*/}
                            {/*    <span style={{*/}
                            {/*        borderBottom: `2px solid ${getUnderlineColor(sms.smsStatus)}`,*/}
                            {/*        display: 'inline-block',*/}
                            {/*    }}>*/}
                            {/*        {sms.smsStatus}*/}
                            {/*    </span>*/}
                            {/*</div>*/}
                            <div className={`${styles['column']} ${styles['recipient-column']}`}>{sms.smsRecipient}</div>
                            <div className={`${styles['column']} ${styles['text-column']}`}>{sms.smsText}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default SmsHistory;

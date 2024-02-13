import React, {useCallback} from "react";
import {OrderSmsHistoryType} from "@/types/orders";
import "./styles.scss";
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
        <div className="order-sms-history">
            <div className="order-sms-history__header">
                <div className='date-column'>Period</div>
                <div className='column status-column'>Status</div>
                <div className='column recipient-column'>Recipient</div>
                <div className='column text-column'>Sms text</div>

            </div>
            <ul className="order-sms-history__list">
                {smsHistory &&
                    smsHistory.map((sms: OrderSmsHistoryType, index: number) => (
                        <li
                            key={sms.smsPeriod + "_" + index}
                            className={`order-sms-history__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{formatDateTimeToStringWithDot(sms.smsPeriod)}</div>
                            <div className='column status-column'>
                                <span style={{
                                    borderBottom: `2px solid ${getUnderlineColor(sms.smsStatus)}`,
                                    display: 'inline-block',
                                }}>
                                    {sms.smsStatus}
                                </span>
                            </div>
                            <div className='column recipient-column'>{sms.smsRecipient}</div>
                            <div className='column text-column'>{sms.smsText}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default SmsHistory;

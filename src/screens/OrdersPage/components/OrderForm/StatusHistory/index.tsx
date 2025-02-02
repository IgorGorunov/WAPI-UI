import React, {useCallback} from "react";
import {OrderHistoryType} from "@/types/orders";
import "./styles.scss";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";
import {Countries} from "@/types/countries";
import {formatDateTimeToStringWithDot} from "@/utils/date";

type PropsType = {
    statusHistory?: OrderHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {

    const formatCommentMessage = (message: string) => {
        try {
            const commentMessage = JSON.parse(message);

            if (Object.hasOwn(commentMessage, 'action')) {
                //it is a comment
                const action = commentMessage.action;
                const displayedMessage = [`Action: ${action}`];

                if (Object.hasOwn(commentMessage, 'comment')) {
                    displayedMessage.push(`Comment: ${commentMessage.comment}`);
                }

                if (Object.hasOwn(commentMessage, 'receiver')) {
                    displayedMessage.push(`Receiver full name: ${commentMessage.receiver.fullName}`);
                    displayedMessage.push(`Country: ${Countries[commentMessage?.receiver?.country] ? Countries[commentMessage?.receiver?.country] : commentMessage?.receiver?.country}`);
                    if (commentMessage?.receiver?.county) {
                        displayedMessage.push(`County: ${commentMessage.receiver?.county}`);
                    }
                    displayedMessage.push(`City: ${commentMessage.receiver.city}`);
                    displayedMessage.push(`Zip: ${commentMessage.receiver.zip || commentMessage.receiver.zipCode}`);
                    displayedMessage.push(`Address: ${commentMessage.receiver.address}`);
                    displayedMessage.push(`Phone: ${commentMessage.receiver.phone}`);
                    if (commentMessage?.receiver?.email) {
                        displayedMessage.push(`City: ${commentMessage.receiver.email}`);
                    }
                }

                if (Object.hasOwn(commentMessage, 'deliveryDate')) {
                    displayedMessage.push(`Delivery date: ${commentMessage.deliveryDate.date} from ${commentMessage.deliveryDate.hourFrom} to ${commentMessage.deliveryDate.hourTo}`);
                }

                // return displayedMessage.join(' \n')

                return (
                    <>
                        {displayedMessage.map(line => <span className='new-line'>{line}</span>)}
                    </>
                )

            } else {
                //for now leave it as it is
                return message;
            }

        } catch {
            return message;
        }
    }

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    return (
        <div className="order-status-history">
            <p className={`order-status-history__info-text`}>
                {/*<span><Icon name='info' /></span>*/}
                Time in status history - in time zone UTC 0
            </p>
            <div className="order-status-history__header">
                <div className='date-column'>Period / Status</div>
                {/*<div className='column status--column'>Status</div>*/}
                <div className='column tracking-number--column'>Tracking #</div>
                <div className='column trouble-status--column'>Trouble status</div>
                <div className='column event-column'>Event</div>
                <div className='column location-column'>Location</div>
                <div className='column comment--column'>Additional information</div>

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
                            <div className='date-column'>
                                <span>{formatDateTimeToStringWithDot(status.period)}</span>
                                <span style={{
                                    borderBottom: `2px solid ${getUnderlineColor(status.statusGroup)}`,
                                    display: 'inline-block',
                                }}>
                                    {status.status}
                                </span>
                            </div>
                            {/*<div className='column status--column'>*/}
                            {/*    <span style={{*/}
                            {/*        borderBottom: `2px solid ${getUnderlineColor(status.statusGroup)}`,*/}
                            {/*        display: 'inline-block',*/}
                            {/*    }}>*/}
                            {/*        {status.status}*/}
                            {/*    </span>*/}
                            {/*</div>*/}
                            <div className='column tracking-number--column tp'>{status.trackingNumber}</div>
                            <div className='column trouble-status--column  tp'>{status.troubleStatus}</div>
                            <div className='column event-column  tp'>{status?.event || ''}</div>
                            <div className='column location-column  tp'>{status?.location || ''}</div>
                            <div className='column comment--column'>{formatCommentMessage(status.additionalInfo)}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

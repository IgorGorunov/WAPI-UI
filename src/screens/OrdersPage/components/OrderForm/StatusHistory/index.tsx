import React, {useCallback} from "react";
import {OrderHistoryType} from "@/types/orders";
import "./styles.scss";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";
import {Countries} from "@/types/countries";
import {formatDateTimeToStringWithDot} from "@/utils/date";
import {useTranslations} from "next-intl";

type PropsType = {
    statusHistory?: OrderHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {
    const tFields = useTranslations('Fulfillment.orderFields');
    const tColumns = useTranslations('Fulfillment.orderTabsInfo.statusHistory');

    const formatCommentMessage = (message: string) => {
        try {
            const commentMessage = JSON.parse(message);

            if (Object.hasOwn(commentMessage, 'action')) {
                //it is a comment
                const action = commentMessage.action;
                const displayedMessage = [`${tColumns('action')}: ${action}`];

                if (Object.hasOwn(commentMessage, 'comment')) {
                    displayedMessage.push(`${tColumns('comment')}: ${commentMessage.comment}`);
                }

                if (Object.hasOwn(commentMessage, 'receiver')) {
                    displayedMessage.push(`${tColumns('receiverFullName')}: ${commentMessage.receiver.fullName}`);
                    displayedMessage.push(`${tFields('receiverCountry')}: ${Countries[commentMessage?.receiver?.country] ? Countries[commentMessage?.receiver?.country] : commentMessage?.receiver?.country}`);
                    if (commentMessage?.receiver?.county) {
                        displayedMessage.push(`${tFields('receiverCounty')}: ${commentMessage.receiver?.county}`);
                    }
                    displayedMessage.push(`${tFields('receiverCity')}: ${commentMessage.receiver.city}`);
                    displayedMessage.push(`${tFields('receiverZip')}: ${commentMessage.receiver.zip || commentMessage.receiver.zipCode}`);
                    displayedMessage.push(`${tFields('receiverAddress')}: ${commentMessage.receiver.address}`);
                    displayedMessage.push(`${tFields('receiverPhone')}: ${commentMessage.receiver.phone}`);
                    if (commentMessage?.receiver?.email) {
                        displayedMessage.push(`${tFields('receiverEMail')}: ${commentMessage.receiver.email}`);
                    }
                }

                if (Object.hasOwn(commentMessage, 'deliveryDate')) {
                    displayedMessage.push(`${tColumns('deliveryDate')}: ${commentMessage.deliveryDate.date} from ${commentMessage.deliveryDate.hourFrom} to ${commentMessage.deliveryDate.hourTo}`);
                }

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
            <div className="order-status-history__header">
                <div className='date-column'>{tColumns('date')}</div>
                {/*<div className='column status--column'>Status</div>*/}
                <div className='column tracking-number--column'>{tColumns('trackingNumber')}</div>
                <div className='column trouble-status--column'>{tColumns('troubleStatus')}</div>
                <div className='column event-column'>{tColumns('event')}</div>
                <div className='column location-column'>{tColumns('location')}</div>
                <div className='column comment--column'>{tColumns('additionalInfo')}</div>

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

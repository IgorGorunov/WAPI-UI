import React from "react";
import {ClaimType} from "@/types/orders";
import "./styles.scss";
import {formatDateStringToDisplayString, formatDateTimeToStringWithDot} from "@/utils/date";
import {useTranslations} from "next-intl";

type PropsType = {
    claim?: ClaimType;
};

const Claim: React.FC<PropsType> = ({ claim }) => {
    const t = useTranslations('Fulfillment.orderTabsInfo.claims');

    return (
        <div className="order-claim-item">
            <p><span className='header-col'>{t('date')}: </span><span>{formatDateTimeToStringWithDot(claim.date)}</span></p>
            <p><span className='header-col'>{t('claim')} #: </span><span>{claim.number}</span></p>
            <p><span className='header-col'>{t('status')}: </span><span>{claim.status}</span></p>
            <div className='order-claim-item__status-history'>
                <p className='order-claim-item__status-history__title'>{t('statusHistory')}:</p>
                <div className="order-claim-item__status-history__table">
                    <div className="order-claim-item__status-history__table-header">
                        <div className='date-column'>{t('period')}</div>
                        <div className='column status-column'>{t('status')}</div>
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
                                    <div className='date-column'>{formatDateStringToDisplayString(status.date)}</div>
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

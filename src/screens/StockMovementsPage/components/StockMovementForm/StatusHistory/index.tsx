import React from "react";
import "./styles.scss";
import {StockMovementHistoryType} from "@/types/stockMovements";
import {formatDateStringToDisplayString, formatDateTimeToStringWithDot} from "@/utils/date";
import {useTranslations} from "next-intl";

type PropsType = {
    statusHistory?: StockMovementHistoryType[] ;
};

const StatusHistory: React.FC<PropsType> = ({ statusHistory }) => {
    const t = useTranslations('StockMovements.docColumns.statusHistory');
    return (
        <div className="stock-movement-status-history">
            <div className="stock-movement-status-history__header">
                <div className='date-column'>{t('period')}</div>
                <div className='column status-column'>{t('status')}</div>
                <div className='column eta-column'>{t('eta')}</div>
                <div className='column statusAdditionalInfo-column'>{t('additionalIngo')}</div>

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
                            <div className='date-column'>{formatDateTimeToStringWithDot(status.period)}</div>
                            <div className='column status-column'>
                                {status.status}
                            </div>
                            <div className='column eta-column'>{formatDateStringToDisplayString(status.estimatedTimeArrives)}</div>
                            <div className='column statusAdditionalInfo-column'>{status.statusAdditionalInfo}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default StatusHistory;

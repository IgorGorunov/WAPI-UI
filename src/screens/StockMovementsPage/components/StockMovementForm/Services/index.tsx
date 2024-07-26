import React from "react";
import {StockMovementServiceType} from "@/types/stockMovements";
import "./styles.scss";
import {formatDateStringToDisplayString} from "@/utils/date";
import {useTranslations} from "next-intl";

type PropsType = {
    services?: StockMovementServiceType[] ;
};

const Services: React.FC<PropsType> = ({ services }) => {
    const t = useTranslations('StockMovements.docColumns.services')

    const totalSum = services && services.length ? services.reduce((acc, cur) => acc+cur.amountEuro, 0) : 0;

    return (
        <div className="stock-movement-service">
            <div className="stock-movement-service__header">
                <div className='date-column'>{t('date')}</div>
                <div className='column service-column'>{t('service')}</div>
                <div className='column quantity-column'>{t('quantity')}</div>
                <div className='column price-column'>{t('price')}</div>
                <div className='column currency-column'>{t('currency')}</div>
                <div className='column amount-column'>{t('amount')}</div>
                <div className='column amount-euro-column'>{t('amountEur')}</div>
            </div>
            <ul className="stock-movement-service-history__list">
                {services &&
                    services.map((service: StockMovementServiceType, index: number) => (
                        <li
                            key={service.service + "_" + index}
                            className={`stock-movement-service__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{formatDateStringToDisplayString(service.period)}</div>
                            <div className='column service-column'>
                                {service.service}
                            </div>
                            <div className='column quantity-column'>{service.quantity}</div>
                            <div className='column price-column'>{service.price}</div>
                            <div className='column currency-column'>{service.currency}</div>
                            <div className='column amount-column'>{service.amount}</div>
                            <div className='column amount-euro-column'>{service.amountEuro}</div>
                        </li>
                    ))}
            </ul>
            <div className="stock-movement-service-total">
                <ul className='stock-movement-service-total__list'>
                    <li className='stock-movement-service-total__list-item'>{t('totalEur')}: <span className='stock-movement-service-total__list-item__value'>{totalSum}</span></li>
                </ul>
            </div>
        </div>
    );
};

export default Services;

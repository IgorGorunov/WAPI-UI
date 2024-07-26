import React from "react";
import {OrderServiceType} from "@/types/orders";
import "./styles.scss";
import {formatDateStringToDisplayString} from "@/utils/date";
import {useTranslations} from "next-intl";

type PropsType = {
    services?: OrderServiceType[] ;
};

const Services: React.FC<PropsType> = ({ services }) => {
    const t = useTranslations('Fulfillment.orderTabsInfo.services');

    const totalSum = services && services.length ? services.reduce((acc, cur) => acc+cur.amountEuro, 0) : 0;

    return (
        <div className="order-service">
            <div className="order-service__header">
                <div className='date-column'>{t('date')}</div>
                <div className='column service-column'>{t('service')}</div>
                <div className='column quantity-column'>{t('quantity')}</div>
                <div className='column sale-price-column'>{t('price')}</div>
                <div className='column currency-column'>{t('currency')}</div>
                <div className='column amount-column'>{t('amount')}</div>
                <div className='column vol-weight-column'>{t('volWeight')}</div>
                <div className='column tracking-number-column'>{t('trackingNumber')}</div>
                <div className='column sum-column'>{t('sumEUR')}</div>
            </div>
            <ul className="order-service-history__list">
                {services &&
                    services.map((service: OrderServiceType, index: number) => (
                        <li
                            key={service.service + "_" + index}
                            className={`order-service__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='date-column'>{formatDateStringToDisplayString(service.period)}</div>
                            <div className='column service-column'>
                                {service.service}
                            </div>
                            <div className='column quantity-column'>{service.quantity}</div>
                            <div className='column sale-price-column'>{service.price}</div>
                            <div className='column currency-column'>{service.currency}</div>
                            <div className='column amount-column'>{service.amount}</div>
                            <div className='column vol-weight-column'>{service.weight}</div>
                            <div className='column tracking-number-column'>{service.trackingNumber}</div>
                            <div className='column sum-column'>{service.amountEuro}</div>
                        </li>
                    ))}
            </ul>
            <div className="order-service-total">
                <ul className='order-service-total__list'>
                    <li className='order-service-total__list-item'>{t('totalSumEUR')}: <span className='order-service-total__list-item__value'>{Math.round(totalSum*100)/100}</span></li>
                </ul>
            </div>
        </div>
    );
};

export default Services;

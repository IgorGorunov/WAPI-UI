import React from "react";
import {AmazonPrepOrderServiceType} from "@/types/amazonPrep";
import "./styles.scss";
import {formatDateStringToDisplayString} from "@/utils/date";

type PropsType = {
    services?: AmazonPrepOrderServiceType[] ;
};

const Services: React.FC<PropsType> = ({ services }) => {

    const totalSum = services && services.length ? services.reduce((acc, cur) => acc+cur.amountEuro, 0) : 0;

    return (
        <div className="order-service">
            <div className="order-service__header">
                <div className='date-column'>Date</div>
                <div className='column service-column'>Service</div>
                <div className='column quantity-column'>Quantity</div>
                <div className='column unit-column'>Unit</div>
                <div className='column sale-price-column'>Price</div>
                <div className='column currency-column'>Currency</div>
                <div className='column amount-column'>Amount</div>
                <div className='column sum-column'>Σ EUR</div>
            </div>
            <ul className="order-service-history__list">
                {services &&
                    services.map((service: AmazonPrepOrderServiceType, index: number) => (
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
                            <div className='column unit-column'>{service.unit}</div>
                            <div className='column sale-price-column'>{service.price}</div>
                            <div className='column currency-column'>{service.currency}</div>
                            <div className='column amount-column'>{service.amount}</div>
                            <div className='column sum-column'>{service.amountEuro}</div>
                        </li>
                    ))}
            </ul>
            <div className="order-service-total">
                <ul className='order-service-total__list'>
                    <li className='order-service-total__list-item'>Total Σ EUR: <span className='order-service-total__list-item__value'>{totalSum}</span></li>
                </ul>
            </div>
        </div>
    );
};

export default Services;

import React from "react";
import {OrderServiceType} from "@/types/orders";
import "./styles.scss";

type PropsType = {
    services?: OrderServiceType[] ;
};

const Services: React.FC<PropsType> = ({ services }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const hours = date.getHours().toString();
        const mins = date.getMinutes().toString();
        return `${date.toLocaleDateString()}  ${hours.length<2 ? '0':''}${hours}:${mins.length<2 ? '0':''}${mins}`;
    }

    const totalSum = services && services.length ? services.reduce((acc, cur) => acc+cur.amountEuro, 0) : 0;
    return (
        <div className="order-service">
            <div className="order-service__header">
                <div className='date-column'>Date</div>
                <div className='column service-column'>Service</div>
                <div className='column quantity-column'>Quantity</div>
                <div className='column sale-price-column'>Price</div>
                <div className='column currency-column'>Currency</div>
                <div className='column amount-column'>Amount</div>
                <div className='column vol-weight-column'>Vol.weight</div>
                <div className='column tracking-number-column'>Tracking #</div>
                <div className='column sum-column'>Σ EUR</div>
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
                            <div className='date-column'>{formatDate(service.period)}</div>
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
                    <li className='order-service-total__list-item'>Total Σ EUR: <span className='order-service-total__list-item__value'>{totalSum}</span></li>
                </ul>
            </div>
        </div>
    );
};

export default Services;

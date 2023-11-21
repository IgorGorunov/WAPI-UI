import React, {useCallback} from "react";
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
    return (
        <div className="order-service">
            <div className="order-service__header">
                <div className='date-column'>Date</div>
                <div className='service-column'>Service</div>
                <div className='quantity-column'>Quantity</div>
                <div className='sale-price-column'>Sale price</div>
                <div className='currency-column'>Currency</div>
                <div className='amount-column'>Amount</div>
                <div className='vol-weight-column'>Vol.weight</div>
                <div className='tracking-number-column'>Tracking #</div>
                <div className='sum-column'>Σ EUR</div>
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
                            <div className='service-column'>
                                {service.service}
                            </div>
                            <div className='quantity-column'>{service.quantity}</div>
                            <div className='sale-price-column'>{service.price}</div>
                            <div className='currency-column'>{service.currency}</div>
                            <div className='amount-column'>{service.amount}</div>
                            <div className='vol-weight-column'>{service.weight}</div>
                            <div className='tracking-number-column'>{service.trackingNumber}</div>
                            <div className='sum-column'>{service.amountEuro}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Services;

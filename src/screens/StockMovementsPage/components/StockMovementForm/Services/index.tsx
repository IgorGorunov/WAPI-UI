import React from "react";
import {StockMovementServiceType} from "@/types/stockMovements";
import "./styles.scss";
import {formatDateStringToDisplayString} from "@/utils/date";

type PropsType = {
    services?: StockMovementServiceType[] ;
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
        <div className="stock-movement-service">
            <div className="stock-movement-service__header">
                <div className='date-column'>Date</div>
                <div className='column service-column'>Service</div>
                <div className='column quantity-column'>Quantity</div>
                <div className='column price-column'>Price</div>
                <div className='column currency-column'>Currency</div>
                <div className='column amount-column'>Amount</div>
                <div className='column amount-euro-column'>Amount (EUR)</div>
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
                    <li className='stock-movement-service-total__list-item'>Total Σ EUR: <span className='stock-movement-service-total__list-item__value'>{totalSum}</span></li>
                </ul>
            </div>
        </div>
    );
};

export default Services;

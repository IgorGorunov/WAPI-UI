import React from "react";
import {AmazonPrepOrderServiceType} from "@/types/amazonPrep";
import styles from "./styles.module.scss";
import {formatDateStringToDisplayString} from "@/utils/date";

type PropsType = {
    services?: AmazonPrepOrderServiceType[] ;
};

const Services: React.FC<PropsType> = ({ services }) => {

    const totalSum = services && services.length ? services.reduce((acc, cur) => acc+cur.amountEuro, 0) : 0;

    return (
        <div className={styles["order-service"]}>
            <div className={styles["order-service__header"]}>
                <div className={styles['date-column']}>Date</div>
                <div className={`${styles['column']} ${styles['service-column']}`}>Service</div>
                <div className={`${styles['column']} ${styles['quantity-column']}`}>Quantity</div>
                <div className={`${styles['column']} ${styles['unit-column']}`}>Unit</div>
                <div className={`${styles['column']} ${styles['sale-price-column']}`}>Price</div>
                <div className={`${styles['column']} ${styles['currency-column']}`}>Currency</div>
                <div className={`${styles['column']} ${styles['amount-column']}`}>Amount</div>
                <div className={`${styles['column']} ${styles['sum-column']}`}>Σ EUR</div>
            </div>
            <ul className={styles["order-service-history__list"]}>
                {services &&
                    services.map((service: AmazonPrepOrderServiceType, index: number) => (
                        <li
                            key={service.service + "_" + index}
                            className={`${styles["order-service__list-item"]} ${
                                index % 2 === 1 ? styles["highlight"] : " "
                            }`}
                        >
                            <div className={styles['date-column']}>{formatDateStringToDisplayString(service.period)}</div>
                            <div className={`${styles['column']} ${styles['service-column']}`}>
                                {service.service}
                            </div>
                            <div className={`${styles['column']} ${styles['quantity-column']}`}>{service.quantity}</div>
                            <div className={`${styles['column']} ${styles['unit-column']}`}>{service.unit}</div>
                            <div className={`${styles['column']} ${styles['sale-price-column']}`}>{service.price}</div>
                            <div className={`${styles['column']} ${styles['currency-column']}`}>{service.currency}</div>
                            <div className={`${styles['column']} ${styles['amount-column']}`}>{service.amount}</div>
                            <div className={`${styles['column']} ${styles['sum-column']}`}>{service.amountEuro}</div>
                        </li>
                    ))}
            </ul>
            <div className={styles["order-service-total"]}>
                <ul className={styles['order-service-total__list']}>
                    <li className={styles['order-service-total__list-item']}>Total Σ EUR: <span className={styles['order-service-total__list-item__value']}>{totalSum}</span></li>
                </ul>
            </div>
        </div>
    );
};

export default Services;

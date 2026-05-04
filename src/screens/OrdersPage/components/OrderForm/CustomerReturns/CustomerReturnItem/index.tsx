import React from "react";
import {OrderCustomerReturnProductType, OrderCustomerReturnType} from "@/types/orders";
import styles from "./styles.module.scss";

type PropsType = {
    customerReturn?: OrderCustomerReturnType;
};

const CustomerReturnItem: React.FC<PropsType> = ({ customerReturn }) => {
    return (
        <div className={styles["order-customer-return-item"]}>
            {/*<p>Date: <span>{formatDateTimeToStringWithDot(customerReturn.date)}</span></p>*/}
            {/*<p>Customer return #: <span>{customerReturn.number}</span></p>*/}
            {/*<p>Status: <span>{customerReturn.status}</span></p>*/}
            <div className={styles['order-customer-return-item__products']}>
                {/*<p className={styles['order-customer-return-item__status-history__title']}>Pro:</p>*/}
                <div className={styles["order-customer-return-item__products__table"]}>
                    <div className={styles["order-customer-return-item__products__table-header"]}>
                        <div className={`${styles['column']} ${styles['sku-column']}`}>SKU</div>
                        <div className={`${styles['column']} ${styles['product-column']}`}>Product</div>
                        <div className={`${styles['column']} ${styles['quantity-column']}`}>Quantity</div>
                        <div className={`${styles['column']} ${styles['quality-column']}`}>Quality</div>
                    </div>
                    <ul className={styles["order-customer-return-item__products__table-list"]}>
                        {customerReturn &&
                            customerReturn.products.map((product: OrderCustomerReturnProductType, index: number) => (
                                <li
                                    key={product?.product?.uuid || (new Date()).toISOString()+ "_" + index}
                                    className={`${styles['order-customer-return-item__products__table-list-item']} ${index % 2 === 1 ? styles['highlight'] : ''}`}
                                >
                                    {/*<div className={styles['date-column']}>{formatDate(status.date)}</div>*/}
                                    <div className={`${styles['column']} ${styles['sku-column']}`}>{product?.product?.sku || '-'}</div>
                                    <div className={`${styles['column']} ${styles['product-column']}`}>{product?.product?.name || '-'}</div>
                                    <div className={`${styles['column']} ${styles['quantity-column']}`}>{product?.quantity || ''}</div>
                                    <div className={`${styles['column']} ${styles['quality-column']}`}>{product?.quality || ''}</div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CustomerReturnItem;

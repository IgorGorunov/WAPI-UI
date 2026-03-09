import React from "react";
import {OrderCustomerReturnProductType, OrderCustomerReturnType} from "@/types/orders";
import "./styles.scss";

type PropsType = {
    customerReturn?: OrderCustomerReturnType;
};

const CustomerReturnItem: React.FC<PropsType> = ({ customerReturn }) => {
    return (
        <div className="order-customer-return-item">
            {/*<p>Date: <span>{formatDateTimeToStringWithDot(customerReturn.date)}</span></p>*/}
            {/*<p>Customer return #: <span>{customerReturn.number}</span></p>*/}
            {/*<p>Status: <span>{customerReturn.status}</span></p>*/}
            <div className='order-customer-return-item__products'>
                {/*<p className='order-customer-return-item__status-history__title'>Pro:</p>*/}
                <div className="order-customer-return-item__products__table">
                    <div className="order-customer-return-item__products__table-header">
                        <div className='column sku-column'>SKU</div>
                        <div className='column product-column'>Product</div>
                        <div className='column quantity-column'>Quantity</div>
                        <div className='column quality-column'>Quality</div>
                    </div>
                    <ul className="order-customer-return-item__products__table-list">
                        {customerReturn &&
                            customerReturn.products.map((product: OrderCustomerReturnProductType, index: number) => (
                                <li
                                    key={product?.product?.uuid || (new Date()).toISOString()+ "_" + index}
                                    className={`order-customer-return-item__products__table-list-item ${
                                        index % 2 === 1 ? "highlight" : " "
                                    }`}
                                >
                                    {/*<div className='date-column'>{formatDate(status.date)}</div>*/}
                                    <div className='column sku-column'>{product?.product?.sku || '-'}</div>
                                    <div className='column product-column'>{product?.product?.name || '-'}</div>
                                    <div className='column quantity-column'>{product?.quantity || ''}</div>
                                    <div className='column quality-column'>{product?.quality || ''}</div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CustomerReturnItem;

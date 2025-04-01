import React from "react";
import {OrderCustomerReturnType} from "@/types/orders";
import "./styles.scss";
import {formatDateStringToDisplayString} from "@/utils/date";
import Accordion from "@/components/Accordion";
import CustomerReturnItem from "@/screens/OrdersPage/components/OrderForm/CustomerReturns/CustomerReturnItem";

type PropsType = {
    customerReturns?: OrderCustomerReturnType[] ;
};

const CustomerReturns: React.FC<PropsType> = ({ customerReturns }) => {
    return (
        <div className="order-customer-returns">
            {customerReturns.map((item, index) => (
                <div key={`${item.date}_${item.status}_${index}`} className='customer-return'>
                    <Accordion title={`Customer return #${item.number} from ${formatDateStringToDisplayString(item.date)}. Status: ${item.status}`}>
                        <CustomerReturnItem customerReturn={item} />
                    </Accordion>
                </div>
            ))}
        </div>
    );
};

export default CustomerReturns;

import React from "react";
import "./styles.scss";

const NextStep:React.FC = () => {

    return (
        <ul className='next-step__container'>
            <li key='next-step__list-item-1'>
                <p>If you have any questions about warehouses, prices, contract or integration - please leave a request and we will connect with you by email.</p>
            </li>
            <li key='next-step__list-item-2'>
                <p>If everything is clear and you are ready to submit a contract - we will check the information and send you documents for signing.</p>
            </li>
            <li key='next-step__list-item-3'>
                <p>After signing the contract you will get credentials for the full version of UI platform and will start your business with WAPI!</p>
            </li>
        </ul>
);
};

export default NextStep;
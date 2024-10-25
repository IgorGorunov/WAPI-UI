import React from "react";
import "./styles.scss";

const NextStep:React.FC = () => {

    return (
        <div className='next-step__container'>
            <p>If you have any questions about warehouses, prices, contract or integration - please leave a request and we will connect with you by email.</p>
            <p>If everything is clear and you are ready to submit a conctract - we will check the information and send you documents for signing.</p>
            <p>After signing the contract you will get credentials for the full version of UI platform and will start your business with WAPI!</p>
        </div>
    );
};

export default NextStep;
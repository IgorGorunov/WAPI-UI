import React from "react";
import {ClaimType} from "@/types/orders";
import "./styles.scss";
import Accordion from "@/components/Accordion";
import Claim from "./ClaimItem";

type PropsType = {
   claims?: ClaimType[] ;
};

const Claims: React.FC<PropsType> = ({ claims }) => {

    return (
        <div className="order-claims">
            {claims.map(item => (<div key={item.number+item.status} className='claim'> <Accordion title={`Claim #${item.number} from ${item.date}. Status: ${item.status}`}><Claim claim={item} /></Accordion></div>))}
        </div>
    );
};

export default Claims;

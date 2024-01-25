import React from "react";
import {ClaimType} from "@/types/orders";
import "./styles.scss";

type PropsType = {
    claim?: ClaimType ;
};

const Claim: React.FC<PropsType> = ({ claim }) => {
    return (
        <div className="order-claim-item">
            <p>Date: <span>{claim.date}</span></p>
            <p>Claim #: <span>{claim.number}</span></p>
            <p>Status: <span>{claim.status}</span></p>

        </div>
    );
};

export default Claim;

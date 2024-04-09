import React from "react";
import "./styles.scss";
import useAuth from "@/context/authContext";

const WaitingInfo = () => {
    const { getTextInfo } = useAuth();

    return (
        <div className={`card lead-page__waiting-info`}>
            <p>{getTextInfo() || 'Please, wait for verification...'}</p>
        </div>
    );
};

export default WaitingInfo;

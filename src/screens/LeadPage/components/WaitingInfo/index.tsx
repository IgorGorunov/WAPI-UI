import React from "react";
import "./styles.scss";
import useAuth from "@/context/authContext";

const WaitingInfo = () => {
    const { getTextInfo } = useAuth();

    return (
        <div className={`card lead-page__waiting-info`}>
            <p>{getTextInfo() || 'Your request is being processed. Confirmation will be sent to your email...'}</p>
        </div>
    );
};

export default WaitingInfo;

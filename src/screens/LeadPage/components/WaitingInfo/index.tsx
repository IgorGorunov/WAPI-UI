import React from "react";
import "./styles.scss";
import useAuth from "@/context/authContext";

const WaitingInfo = () => {
    const { getTextInfo } = useAuth();

    return (
        <div className={`card lead-page__waiting-info`}>
            {/*<p>{getTextInfo() || 'Your request is being processed. Confirmation will be sent to your email...'}</p>*/}

            <div className='lead-page__waiting-info__message'>
                <p className='lead-page__waiting-info__message-title'>Thank you! We're currently reviewing your data.<br/> You can expect a confirmation email to arrive in your inbox shortly.</p>
                <p className='lead-page__waiting-info__message-text-title'>Here's what to do next:</p>
                <div className='lead-page__waiting-info__message-text-wrapper'>
                    <p className='lead-page__waiting-info__message-text'><span className='text-bold'>Step 1:</span> Keep an eye out for the confirmation email.</p>
                    <p className='lead-page__waiting-info__message-text'><span className='text-bold'>Step 2:</span> Check your inbox.</p>
                    <p className='lead-page__waiting-info__message-text'><span className='text-bold'>Step 3:</span> Follow the instructions provided in the email carefully.!</p>
                </div>
            </div>
        </div>
    );
};

export default WaitingInfo;

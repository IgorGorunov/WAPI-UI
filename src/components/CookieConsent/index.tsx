import React, {useEffect, useRef, useState} from "react";
import "./styles.scss";
import useAuth from "@/context/authContext";
import {Routes} from "@/types/routes";
import Link from "next/link";
import Button from "@/components/Button/Button";

const CookieConsent = () => {
    const { setCookieConsentReceived } = useAuth();

    const cookieConsentRef = useRef<HTMLDivElement>(null);
    const [cookieConsentHeight, setCookieConsentHeight] = useState<number>(0);

    useEffect(() => {
        if (cookieConsentRef?.current) {
            const height = cookieConsentRef.current.getBoundingClientRect().height;
            setCookieConsentHeight(height);
        } else {
            setCookieConsentHeight(0)
        }
    }, []);

    const handleConsent = () => {
        setCookieConsentReceived();
    }

    return (
        <div className={`cookie-consent`} style={{height: cookieConsentHeight}}>
            <div className='cookie-consent__wrapper' ref={cookieConsentRef}>
                <p>We use cookies to enhance your experience on our site. Review our cookie policy
                    <Link className='is-link' href={Routes.CookiePolicy} target='_blank'>here</Link>
                </p>
                <Button classNames='cookie-consent__consent-btn' onClick={handleConsent}>OK</Button>
            </div>
        </div>
    );
};

export default CookieConsent;

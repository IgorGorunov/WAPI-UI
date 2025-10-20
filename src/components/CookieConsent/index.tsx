import React, {useCallback, useEffect, useRef, useState} from "react";
import "./styles.scss";
import useAuth from "@/context/authContext";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import {ModalTypes} from "@/types/utility";
import CookieConsentSettings from "@/components/CookieConsent/CookieConsentSettings";
import Cookie from "js-cookie";

export type CookieConsentType = {
    essential: boolean;
    functional: boolean;
    performance: boolean;
}

export const CONSENT_COOKIE = 'cookie_consent';

export const FULL_CONSENT = {
    essential: true,
    functional: true,
    performance: true,
} as CookieConsentType;

export const ONLY_ESSENTIAL_CONSENT = {
    essential: true,
    functional:false,
    performance: false,
} as CookieConsentType;

export const CLARITY_CONSENT_EVENT = "clarity-consent";

const CookieConsent = () => {
    const { cookieConsent, setReceivedCookieConsent } = useAuth();

    const [showFullCookieBanner, setShowFullCookieBanner] = useState(false);
    const [showCookieSettings, setShowCookieSettings] = useState(false);

    const cookieConsentRef = useRef<HTMLDivElement>(null);
    const [cookieConsentHeight, setCookieConsentHeight] = useState<number>(0);

    const saveConsent = useCallback((newConsent: CookieConsentType) => {
        setReceivedCookieConsent(newConsent);

        if (!newConsent?.functional) {
            Cookie.remove('tutorialData');
            Cookie.remove('userName');
            Cookie.remove('inbound-hints-cancel-number');
            Cookie.remove('visited-stock-movements');

            //temp
            Cookie.remove('visited-inbounds-number');
        }

        window.dispatchEvent(
            new CustomEvent(CLARITY_CONSENT_EVENT, {
                detail: { performance: newConsent?.performance || false },
            })
        );

        setShowFullCookieBanner(false);
    }, []);

    //get cookies
    useEffect(() => {
        if (cookieConsent) {
            setShowFullCookieBanner(!cookieConsent?.essential);
        } else {
            // If unknown/null, keep the banner open
            setShowFullCookieBanner(true);
        }
    }, [cookieConsent]);



    useEffect(() => {
        if (cookieConsentRef?.current && !cookieConsent) {
            const height = cookieConsentRef.current.getBoundingClientRect().height;
            setCookieConsentHeight(height);
        } else {
            setCookieConsentHeight(0)
        }
        console.log('cookie consent height', cookieConsentHeight);
    }, [cookieConsent, showCookieSettings]);


    return (
        <div className={`cookie-consent`} style={{height: cookieConsentHeight}}>
            {showCookieSettings && (
                <div className={`cookie-consent__settings`}>
                    <Modal modalType={ModalTypes.MAIN} title="Cookie settings" onClose={()=>setShowCookieSettings(false)}  classNames={'cookie-consent__settings-modal'}>
                        <CookieConsentSettings onSuccess={()=>setShowCookieSettings(false)}/>
                    </Modal>
                </div>
            )}
            {!showCookieSettings ? showFullCookieBanner ? (
                <div className={`cookie-consent-container`}>
                    <div className='cookie-consent__wrapper' ref={cookieConsentRef}>

                        <Icon name='cookie' />
                        <div className='cookie-consent__text'>
                            {/*<p> We use essential cookies to run our site (login, security, access control).*/}
                            {/*    We’d also like to use <strong>functional cookies</strong> that make your*/}
                            {/*    experience smoother (remembering completed tutorials and showing your*/}
                            {/*    account name), and <strong>performance cookies</strong> (Microsoft Clarity)*/}
                            {/*    to help us improve. You can accept or reject optional cookies now, or change*/}
                            {/*    your choice later in <em>Cookie Settings</em>.*/}
                            {/*</p>*/}
                            <p>
                                We use <strong>essential cookies</strong> to make our site work (login, permissions, and security).
                                We also use <strong>functional cookies</strong> to improve your experience — for example, remembering
                                completed tutorials and showing your account name — and <strong>performance cookies</strong> (Microsoft
                                Clarity) to help us understand how people use our site.
                            </p>
                            <p>
                                You can accept or reject optional cookies now or change your choice later in Cookie Settings.
                            </p>
                            <p>Learn more in our <a className='is-link' href={'/cookie-policy'} target='_blank'> Cookie Policy</a>.</p>
                            <div className='cookie-consent__text-buttons'>
                                <Button classNames='cookie-consent' onClick={()=>saveConsent(FULL_CONSENT)}>Accept All</Button>
                                <Button classNames='cookie-consent' onClick={()=>saveConsent(ONLY_ESSENTIAL_CONSENT)}>Reject Non-Essential</Button>
                                <Button classNames='cookie-consent' onClick={()=>setShowCookieSettings(true)}>Cookie settings</Button>
                            </div>

                        </div>

                        {/*<p>We use cookies to enhance your experience on our site. Review our cookie policy*/}
                        {/*    <Link className='is-link' href={Routes.CookiePolicy} target='_blank'>here</Link>*/}
                        {/*</p>*/}
                        {/*<Button classNames='cookie-consent__consent-btn' onClick={handleConsent}>OK</Button>*/}
                    </div>
                </div>)
                : <div className='cookie-consent__wrapper--small'>
                    <button className={`cookie-consent-settings__btn`} onClick={()=>setShowCookieSettings(true)} >
                        <Icon name='cookie' />
                        <span className="tooltip-text">Change cookie settings</span>
                    </button>

                </div>
                : null
            }
        </div>
    );
};

export default CookieConsent;

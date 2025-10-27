import React, {useState} from 'react';
import './styles.scss';
import Accordion from "./CookieAccordion";
import useAuth from "@/context/authContext";
import Button from "@/components/Button/Button";
import {
    CLARITY_CONSENT_EVENT,
    CookieConsentType,
    FULL_CONSENT,
    ONLY_ESSENTIAL_CONSENT
} from "@/components/CookieConsent/index";
import Cookie from "js-cookie";


const CookieConsentSettings = ({onSuccess}: {onSuccess:() => void}) => {
    const {cookieConsent, setReceivedCookieConsent} = useAuth();

    const [functionalCookiesEnabled, setFunctionalCookiesEnabled] = useState(cookieConsent?.functional || false);
    const [performanceCookiesEnabled, setPerformanceCookiesEnabled] = useState(cookieConsent?.performance || false);

    const handleSave = (newConsent: CookieConsentType) => {
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

        onSuccess();
    }

    return (
        <div className='cookie-consent-settings'>
            <div className='cookie-consent-settings__content'>
                <div className='cookie-consent-settings__content-wrapper'>
                    <p>
                        We use cookies to make our website work and to improve your experience. Some cookies are essential
                        for the site to function, while others are optional and help us make your experience smoother or
                        understand how our services are used.
                    </p>
                    <p>
                        You can adjust your preferences below. Essential cookies are always active. You can change your
                        choices at any time in these Cookie Settings.
                    </p>

                    <Accordion
                        title={'Essential Cookies (always active)'}
                        description={'Required for login, session management, permissions, and security. They include the cookie used for\n' +
                        'mandatory audit logging of user actions. Without these cookies, our service cannot operate properly.'}
                        toggleName={'essential_cookies'}
                        hasToggle={false}
                        toggleTitle={'Always active'}
                    >
                        <>
                            <p>
                                <ul>
                                    <li><strong>cookie_consent</strong> — stores your cookie consent preferences (6 months)</li>
                                    <li><strong>token, userStatus, navAccess, userActions, userType</strong> — enable login, session management, and permissions control (Session)</li>
                                    <li><strong>userEmail</strong> — stores your login email to record your actions for required audit and security logs (Session)</li>
                                    <li><strong>sellers</strong> — identifies which seller or tenant account the user belongs to, required to display the correct data for that account (Session)</li>
                                </ul>
                            </p>
                            <p>These cookies do not require your consent.</p>
                       </>
                    </Accordion>
                    {/*<p className={'text-bold'}> Essential Cookies (always active) </p>*/}

                    {/*<p>*/}
                    {/*    Required for login, session management, permissions, and security. They include the cookie used for*/}
                    {/*    mandatory audit logging of user actions. Without these cookies, our service cannot operate properly.*/}
                    {/*</p>*/}

                    {/*<p>*/}
                    {/*    Examples:*/}
                    {/*    <ul>*/}
                    {/*        <li>CookieConsent — stores your cookie consent preferences (6 months)</li>*/}
                    {/*        <li>token, userStatus, navAccess, userActions, userType — enable login, session management, and permissions control (Session)</li>*/}
                    {/*        <li>userEmail — stores your login email to record your actions for required audit and security logs (Session)</li>*/}
                    {/*    </ul>*/}
                    {/*</p>*/}



                    <Accordion
                        title={'Functional Cookies (optional)'}
                        description={"Functional cookies make your experience smoother and more personalized. They are not essential but improve how the website works for you. For example, they help remember that you’ve already completed a tutorial and show your account name so you know which account you’re logged in under."}
                        toggleName={'functional_cookies'}
                        hasToggle={true}
                        toggleValue={functionalCookiesEnabled}
                        onToggleChange={()=>setFunctionalCookiesEnabled((prevState)=>!prevState)}
                    >
                        <>
                            <p>
                                <ul>
                                    <li><strong>userName</strong> — displays your account name in the interface</li>
                                    <li><strong>tutorialData</strong> — remembers which tutorials you’ve already completed</li>
                                    <li><strong>inbound-hints-cancel-number</strong> — remembers your choices about viewing inbound creation hints to ask you only twice</li>
                                    <li><strong>visited-stock-movements</strong> — remembers if you created any stock management documents to determine if hints for their creation are needed</li>
                                </ul>
                            </p>
                            <p>
                                If you disable these cookies, some personalized or convenience features may not work as intended.
                            </p>
                        </>
                    </Accordion>

                    {/*<p className={'text-bold'}> Functional Cookies (optional)</p>*/}

                    {/*<p>*/}
                    {/*    Functional cookies make your experience smoother and more personalized. They are not essential*/}
                    {/*    but improve how the website works for you. For example, they help remember that you’ve already completed a tutorial*/}
                    {/*    and show your account name so you know which account you’re logged in under.*/}
                    {/*</p>*/}
                    {/*<p>*/}
                    {/*    Examples:*/}
                    {/*    <ul>*/}
                    {/*        <li>userName — displays your account name in the interface</li>*/}
                    {/*        <li>tutorialData — remembers which tutorials you’ve already completed</li>*/}
                    {/*    </ul>*/}
                    {/*</p>*/}
                    {/*<p>*/}
                    {/*    If you disable these cookies, some personalized or convenience features may not work as intended.*/}
                    {/*</p>*/}
                    <Accordion
                        title={'Performance cookies (optional)'}
                        description={"Help us understand how visitors use our website. We use Microsoft Clarity for anonymized analytics and heatmaps to improve usability and performance."}
                        toggleName={'performance_cookies'}
                        hasToggle={true}
                        toggleValue={performanceCookiesEnabled}
                        onToggleChange={()=>setPerformanceCookiesEnabled((prevState)=>!prevState)}
                    >
                        <>
                            <p>
                                <ul>
                                    <li><strong>_clck</strong> — maintains Clarity user ID and preferences (1 year)</li>
                                    <li><strong>_clsk</strong> — groups multiple page views into a single Clarity session (1 year)</li>
                                    <li><strong>CLID</strong> — identifies the first time Clarity saw this user across sites or domains (1 year)</li>
                                </ul>
                            </p>
                            <p>
                                If disabled, we won’t collect analytics data about how you use our site.
                            </p>
                        </>
                    </Accordion>
                    {/*<p className={'text-bold'}>*/}
                    {/*    Performance cookies (optional)*/}
                    {/*</p>*/}
                    {/*<p>*/}
                    {/*    Help us understand how visitors use our website. We use Microsoft Clarity for anonymized analytics*/}
                    {/*    and heatmaps to improve usability and performance.*/}
                    {/*</p>*/}
                    {/*<p>*/}
                    {/*    Examples:*/}
                    {/*    <ul>*/}
                    {/*        <li>_clck — maintains Clarity user ID and preferences (1 day)</li>*/}
                    {/*        <li>_clsk — groups multiple page views into a single Clarity session (1 year)</li>*/}
                    {/*    </ul>*/}
                    {/*</p>*/}
                    {/*<p>*/}
                    {/*    If disabled, we won’t collect analytics data about how you use our site.*/}
                    {/*</p>*/}
                    <p/>
                    <p className={'text-bold'}>Your choices</p>
                    <p>
                        <ul>
                            <li>Accept all cookies — enable Essential, Functional, and Performance cookies.</li>
                            <li>Reject non-essential — keep only Essential cookies active.</li>
                            <li>Adjust preferences above and click Save.</li>
                        </ul>
                    </p>
                    <p>
                        You can change your preferences anytime in Cookie Settings.
                    </p>
                    ⸻

                    <p>Learn more</p>

                    <p>Read our full <a className='is-link' href={'/cookie-policy'} target='_blank'> Cookie Policy</a> and <a className='is-link' href={'/privacy-policy'} target='_blank'> Privacy Policy</a> for
                        details on how we use and protect your information.</p>
                </div>
            </div>
            <div className='cookie-consent-settings__btns'>
                <Button classNames='cookie-consent' onClick={()=>handleSave(FULL_CONSENT)}>Accept All</Button>
                <Button classNames='cookie-consent' onClick={()=>handleSave(ONLY_ESSENTIAL_CONSENT)}>Reject Non-Essential</Button>
                <Button classNames='cookie-consent' onClick={()=>handleSave({essential: true, functional: functionalCookiesEnabled, performance: performanceCookiesEnabled} as CookieConsentType)}>Save selected</Button>
            </div>

        </div>
    )
}

export default CookieConsentSettings;
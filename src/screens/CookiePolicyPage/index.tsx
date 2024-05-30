import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import useAuth from "@/context/authContext";
import Header from "@/components/Header";
import {UserStatusType} from "@/types/leads";
import Link from "next/link";

const CookiePolicyPage = () => {
    const { userStatus} = useAuth();

        return (
            <Layout hasFooter>
                <div className="cookie-policy-page__container">
                    <Header pageTitle='Cookie policy' toRight noMenu={userStatus !== UserStatusType.user} needNotifications={userStatus === UserStatusType.user} />

                    <div className="cookie-policy-page__text-wrapper">
                        <p>This Cookie Policy explains how we use cookies and similar tracking technologies when you visit
                            our website <Link className='is-link' href='/'>https://ui.wapi.com</Link>. By continuing to
                            browse the site, you are agreeing to our use
                            of cookies as outlined in this policy.</p>
                        <p className='text-bold'>What are cookies? </p>

                        <p>Cookies are small text files that are placed on your computer or mobile device when you visit a
                            website. They are widely used to make websites work more efficiently and to provide information
                            to website owners. </p>
                        <p className='text-bold'>How do we use cookies? </p>
                        <p>We use cookies for the following purposes: </p>
                        <ol className='simple-list'>
                            <li><p><span className='text-bold'>Essential Cookies:</span> These cookies are necessary for the
                                website to function properly. They enable you to navigate the website and use its features.
                            </p></li>
                            <li><p><span className='text-bold'>Functionality Cookies:</span> These cookies are used to
                                recognize you when you return to our website. This enables us to personalize our content for
                                you, greet you by name, and remember your preferences (for example, your choice of language
                                or region).</p></li>
                            <li><p><span className='text-bold'>Performance Cookies:</span> These cookies collect information
                                about how visitors use our website, such as which pages are visited most often. This
                                information is aggregated and anonymous, and is used to improve the functionality of the
                                website. We use Microsoft Clarity to help us understand how our users interact with our website.</p></li>
                        </ol>
                        <p className='text-bold'>List of cookies we use: </p>
                        <table className='cookie-policy-page__cookie-list-table'>
                            <thead>
                            <tr>
                                <th><span className='text-bold'>Name</span></th>
                                <th><span className='text-bold'>Type</span></th>
                                <th><span className='text-bold'>Description</span></th>
                                <th><span className='text-bold'>Duration</span></th>

                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>WAPI_CookieConsent</td>
                                <td>Essential</td>
                                <td>Stores user's cookie consent.</td>
                                <td>6 months</td>
                            </tr>
                            <tr>
                                <td>token</td>
                                <td>Essential</td>
                                <td>Used to identify the user once logged in.</td>
                                <td>Session</td>
                            </tr>
                            <tr>
                                <td>userStatus</td>
                                <td>Essential</td>
                                <td>Used to identify logged user status.</td>
                                <td>Session</td>
                            </tr>
                            <tr>
                                <td>userName</td>
                                <td>Essential</td>
                                <td>Stores user's name to display in UI.</td>
                                <td>Session</td>
                            </tr>
                            <tr>
                                <td>currentDate</td>
                                <td>Essential</td>
                                <td>Stores current date.</td>
                                <td>Session</td>
                            </tr>
                            <tr>
                                <td>tutorialData</td>
                                <td>Essential</td>
                                <td>Stores information about UI tutorials user watched to not display these tutorials
                                    again.
                                </td>
                                <td>Session</td>
                            </tr>
                            <tr>
                                <td>WAPI_profile_info</td>
                                <td>Essential</td>
                                <td>Stores logged user's profile info.</td>
                                <td>Session</td>
                            </tr>
                            <tr>
                                <td>WAPI_navAccess</td>
                                <td>Essential</td>
                                <td>Stores logged user's navigation access info.</td>
                                <td>Session</td>
                            </tr>

                            {/* clarity cookies */}
                            <tr>
                                <td>_clck</td>
                                <td>Performance</td>
                                <td>Used by Microsoft Clarity. Persists the Clarity User ID and preferences, unique to that site, on the browser. This ensures that behavior in subsequent visits to the same site will be attributed to the same user ID.</td>
                                <td>1 day</td>
                            </tr>
                            <tr>
                                <td>_clsk</td>
                                <td>Performance</td>
                                <td>Used by Microsoft Clarity. Connects multiple page views by a user into a single Clarity session recording.</td>
                                <td>1 year</td>
                            </tr>
                            </tbody>
                        </table>
                        <p className='text-bold'>Updates to this Cookie Policy </p>
                        <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for
                            other operational, legal, or regulatory reasons. Please revisit this page periodically to stay
                            informed about our use of cookies. </p>
                        <p>By using our website, you consent to the use of cookies as described in this Cookie Policy.</p>
                    </div>
                </div>
            </Layout>
        );
};

export default CookiePolicyPage;

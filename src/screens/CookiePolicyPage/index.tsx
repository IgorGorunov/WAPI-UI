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
                        our website <Link className='is-link' href='/'>https://ui.wapi.com</Link>. By continuing to browse the site, you are agreeing to our use
                        of cookies as outlined in this policy.</p>
                    <p className='text-bold'>What are cookies? </p>

                    <p>Cookies are small text files that are placed on your computer or mobile device when you visit a
                        website. They are widely used to make websites work more efficiently and to provide information
                        to website owners. </p>
                    <p className='text-bold'>How do we use cookies? </p>
                    <p>We use cookies for the following purposes: </p>
                    <ol className='simple-list'>
                        <li><p><span className='text-bold'>Essential Cookies:</span> These cookies are necessary for the website to function properly. They enable you to navigate the website and use its features.</p></li>
                        <li><p><span className='text-bold'>Functionality Cookies:</span> These cookies are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name, and remember your preferences (for example, your choice of language or region).</p></li>
                    </ol>
                    <p className='text-bold'>Updates to this Cookie Policy </p>
                    <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about our use of cookies. </p>
                    <p>By using our website, you consent to the use of cookies as described in this Cookie Policy.</p>
                </div>
            </div>
        </Layout>
    );
};

export default CookiePolicyPage;

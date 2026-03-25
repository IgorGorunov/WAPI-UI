import React from "react";
// import dynamic from "next/dynamic";
import Layout from "@/components/Layout/Layout";
import useTenant from "@/context/tenantContext";
import {TENANTS} from "@/lib/tenants";
import "./styles.scss";
import SignUpForm from "@/screens/SignUpPage/SignUpForm";

// Dynamically import heavy form component to reduce blocking JavaScript
// const SignUpForm = dynamic(() => import("@/screens/SignUpPage/SignUpForm"), {
//     // ssr: false,
//     loading: () => <div style={{ minHeight: '400px' }} />
// });

const SignUpPage = () => {
    const { tenant } = useTenant();

    return (
        <Layout hasFooter>
            {/*<SeoHead title='Sign up' description='Our sign up page' />*/}
            <div className={`sign-up-page__container${tenant === TENANTS.WAPI ? ' has-bg' : ''}`}>
                <div className="sign-up-page__text-wrapper">
                    <h1>SIGN UP</h1>
                    <h2>Account details</h2>
                </div>
                <SignUpForm />
            </div>
        </Layout>
    );
};

export default SignUpPage;

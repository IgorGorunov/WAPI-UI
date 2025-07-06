import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Head from "next/head";
import SignUpForm from "@/screens/SignUpPage/SignUpForm";
import SeoHead from "@/components/SeoHead";

const SignUpPage = () => {

    return (
        <Layout hasFooter>
            <SeoHead title='Sign up' description='Our sign up page' />
            {/*<BackgroundLogo />*/}
            <div className="sign-up-page__container">
                <div className="sign-up-page__text-wrapper">
                    <h1>SIGN UP</h1>
                    <h3>Account details</h3>
                </div>
                <SignUpForm />
            </div>
        </Layout>
    );
};

export default SignUpPage;

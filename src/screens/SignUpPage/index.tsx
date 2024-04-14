import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Head from "next/head";
import SignUpForm from "@/screens/SignUpPage/SignUpForm";

const SignUpPage = () => {
    return (
        <Layout hasFooter>
            <Head>
                <title>Sign up</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
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

import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Head from "next/head";
import SignUpForm from "@/screens/SignUpPage/SignUpForm";
import {useTranslations} from "next-intl";

const SignUpPage = () => {
    const t = useTranslations('SignUp');
    return (
        <Layout hasFooter>
            <Head>
                <title>{t('signUp')}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div className="sign-up-page__container">
                <div className="sign-up-page__text-wrapper">
                    <h1>{t('signUp').toUpperCase()}</h1>
                    <h3>{t('accountDetails')}</h3>
                </div>
                <SignUpForm />
            </div>
        </Layout>
    );
};

export default SignUpPage;

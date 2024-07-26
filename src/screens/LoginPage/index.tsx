import React, {useEffect, useState} from "react";
import Layout from "@/components/Layout/Layout";
import LoginForm from "./LoginForm/LoginForm";
import SignUpBlock from "./SignUpForm/SignUpBlock";
import "./styles.scss";
import Head from "next/head";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {useTranslations} from "next-intl";

const LoginPage = () => {
    const t = useTranslations('Login');

    const { logout } = useAuth();
    const router = useRouter();

    const [oneTimeToken, setOneTimeToken] = useState<string>('');

    useEffect(() => {
        setOneTimeToken('');
    }, []);

    useEffect(() => {
        logout();
    }, []);

    //getting uuid from query
    useEffect(() => {
        const { oneTimeToken } = router.query;
        setOneTimeToken(Array.isArray(oneTimeToken) ? (oneTimeToken.length ? oneTimeToken[0] : '') : oneTimeToken);
    }, [router.query]);

    return (
        <Layout hasFooter>
            <Head>
                <title>{t('login')}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>

            <div className="login-page__container">
                <div className="login-page__text-wrapper">
                    <h1>{t('signInTitle').toUpperCase()}</h1>
                    <h3>{t('welcomeBack')}</h3>
                </div>

                <LoginForm oneTimeToken={oneTimeToken} setOneTimeToken={setOneTimeToken} />
                <SignUpBlock />
            </div>
        </Layout>
    );
};

export default LoginPage;

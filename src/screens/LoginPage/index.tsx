import React, {useEffect, useState} from "react";
import Layout from "@/components/Layout/Layout";
import LoginForm from "./LoginForm/LoginForm";
import SignUpBlock from "./SignUpForm/SignUpBlock";
import "./styles.scss";
import Head from "next/head";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import SeoHead from "@/components/SeoHead";
import useTenant from "@/context/tenantContext";
import {TENANTS} from "@/lib/tenants";

const LoginPage = () => {
    const { logout } = useAuth();
    const { tenant } = useTenant();
    const router = useRouter();

    const [oneTimeToken, setOneTimeToken] = useState<string>('');
    const [utmQuery, setUtmQuery] = useState<any>({});

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

        const query = router.query;
        const utmQuery = {};
        const keys = Object.keys(query).filter(key => key!=='oneTimeToken');
        keys.map(key => {
            utmQuery[key.replace('amp;','')]=query[key];
        })

        setUtmQuery(utmQuery);
    }, [router.query]);

    return (
        <Layout hasFooter>
            <SeoHead title="Login" description="Login page" />
            <div className={`login-page__container${tenant === TENANTS.WAPI ? ' has-bg' : ''}`}>
                <div className="login-page__text-wrapper">
                    <h1>SIGN IN</h1>
                    <h3>Welcome back</h3>
                </div>

                <LoginForm oneTimeToken={oneTimeToken} setOneTimeToken={setOneTimeToken} />
                {tenant === TENANTS.WAPI ? <SignUpBlock utmQuery={utmQuery} /> : null}

            </div>
        </Layout>
    );
};

export default LoginPage;
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout/Layout";
import styles from "./styles.module.scss";
import useAuth from "@/context/authContext";
import { useRouter } from "next/router";
import useTenant from "@/context/tenantContext";
import { TENANTS } from "@/lib/tenants";
import Cookie from "js-cookie";

// Dynamically import heavy components to reduce initial JavaScript blocking render
const LoginForm = dynamic(() => import("./LoginForm/LoginForm"), {
    ssr: false, // Client-side only to prevent blocking initial HTML render
    loading: () => <div style={{ minHeight: '285px' }} /> // Reserve space to prevent layout shift
});

const SignUpBlock = dynamic(() => import("./SignUpForm/SignUpBlock"), {
    ssr: false,
    loading: () => <div style={{ minHeight: '200px' }} />
});

const LoginPage = () => {
    const { logout } = useAuth();
    const { tenant } = useTenant();
    const router = useRouter();

    const [oneTimeToken, setOneTimeToken] = useState<string>('');
    const [utmQuery, setUtmQuery] = useState<any>({});

    useEffect(() => {
        setOneTimeToken('');
    }, []);

    // Only clear an EXISTING session when landing on the login page.
    // Do NOT run logout() if there's no session — this prevents it from
    // clearing cookies that were just set by a successful login+redirect.
    useEffect(() => {
        const hadSession = !!Cookie.get('token') || !!Cookie.get('userStatus');
        if (hadSession) {
            logout();
        }
    }, []);

    //getting uuid from query
    useEffect(() => {
        const { oneTimeToken } = router.query;
        setOneTimeToken(Array.isArray(oneTimeToken) ? (oneTimeToken.length ? oneTimeToken[0] : '') : oneTimeToken);

        const query = router.query;
        const utmQuery = {};
        const keys = Object.keys(query).filter(key => key !== 'oneTimeToken');
        keys.map(key => {
            utmQuery[key.replace('amp;', '')] = query[key];
        })

        setUtmQuery(utmQuery);
    }, [router.query]);

    return (
        <Layout hasFooter>
            {/*<SeoHead title="Login" description="Login page" />*/}
            <div className={`${styles['login-page__container']}${tenant === TENANTS.WAPI ? ` ${styles['has-bg']}` : ''}`}>
                <div className={styles['login-page__text-wrapper']}>
                    <h1>SIGN IN</h1>
                    <h2>Welcome back</h2>
                </div>

                <LoginForm oneTimeToken={oneTimeToken} setOneTimeToken={setOneTimeToken} />
                {tenant === TENANTS.WAPI ? <SignUpBlock utmQuery={utmQuery} /> : null}

            </div>
        </Layout>
    );
};

export default LoginPage;
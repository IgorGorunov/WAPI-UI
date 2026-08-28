import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm/LoginForm";
import SignUpBlock from "./SignUpForm/SignUpBlock";
import Layout from "@/components/Layout/Layout";
import styles from "./styles.module.scss";
import useAuth from "@/context/authContext";
import { useRouter } from "next/router";
import useTenant from "@/context/tenantContext";
import { TENANTS } from "@/lib/tenants";
import Cookie from "js-cookie";


// const LoginForm = dynamic(() => import("./LoginForm/LoginForm"));
// const SignUpBlock = dynamic(() => import("./SignUpForm/SignUpBlock"));

const MAINTENANCE_START_UTC = '2026-08-29T09:00:00Z';
const MAINTENANCE_END_UTC = '2026-08-29T17:00:00Z';

const LoginPage = () => {
    const { logout } = useAuth();
    const { tenant } = useTenant();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const [oneTimeToken, setOneTimeToken] = useState<string>('');
    const [utmQuery, setUtmQuery] = useState<any>({});

    useEffect(() => {
        setMounted(true);
        setOneTimeToken('');
    }, []);

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


    //+ TEMPORARY
    const [isMaintenanceVisible, setIsMaintenanceVisible] = useState<boolean>(false);
    useEffect(() => {
        const checkMaintenanceStatus = () => {
            const now = new Date().getTime();

            const start = new Date(MAINTENANCE_START_UTC).getTime();
            const end = new Date(MAINTENANCE_END_UTC).getTime();
            console.log('now: ', now, start, end)
            // Show only when current time is within the window
            setIsMaintenanceVisible(now >= start && now <= end);
        };

        // Run check immediately on mount
        checkMaintenanceStatus();

        // Check every 30 seconds to auto-show/auto-hide without page reload
        const interval = setInterval(checkMaintenanceStatus, 30_000);

        return () => clearInterval(interval);
    }, []);
    //-

    return (
        <Layout hasFooter>
            {/*<SeoHead title="Login" description="Login page" />*/}
            <div className={`${styles['login-page__container']}${mounted && tenant === TENANTS.WAPI ? ` ${styles['has-bg']}` : ''}`}>
                {isMaintenanceVisible ? <div style={{margin: '-24px auto 16px', maxWidth: '670px'}}>
                    <div style={{padding: '6px 16px', background:'#B91C1C', color: 'white', borderRadius:'9px', fontWeight:'bold'}}>
                        <p>Technical maintenance is currently underway. All platform services and data exchanges with WAPI will remain unavailable until 20:00 Riga time (17:00 UTC). Thank you for your patience.</p>
                    </div>
                </div> : null}

                <div className={styles['login-page__text-wrapper']}>
                    <h1>SIGN IN</h1>
                    <h2>Welcome back</h2>
                </div>
                <LoginForm oneTimeToken={oneTimeToken} setOneTimeToken={setOneTimeToken} />
                {mounted && tenant === TENANTS.WAPI ? <SignUpBlock utmQuery={utmQuery} /> : null}

            </div>
        </Layout>
    );
};

export default LoginPage;
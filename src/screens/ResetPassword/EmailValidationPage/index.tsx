import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import useTenant from '@/context/tenantContext';
import { TENANTS } from '@/lib/tenants';
import { Routes } from '@/types/routes';
import { passwordRecoveryVerify } from '@/services/passwordRecovery';
import styles from '../styles.module.scss';
import Loader from '@/components/Loader';
import Link from 'next/link';

type PageState = 'loading' | 'error';

const EmailValidationPage = () => {
    const { tenant, tenantData } = useTenant();
    const router = useRouter();

    const [pageState, setPageState] = useState<PageState>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        // Wait until query params are available (Next.js router hydration)
        if (!router.isReady) return;

        const token = typeof router.query.token === 'string' ? router.query.token : '';
        const email = typeof router.query.email === 'string' ? router.query.email : '';

        if (!token) {
            setErrorMessage('Invalid recovery link. Please make a password recovery request again.');
            setPageState('error');
            return;
        }

        const verify = async () => {
            try {
                const res = await passwordRecoveryVerify({
                    alias: tenantData?.alias || '',
                    login: email,
                    token,
                });

                if (res?.status === 200) {
                    await router.replace({
                        pathname: Routes.CreatePassword,
                        query: { token, email },
                    });
                } else {
                    setErrorMessage('This link has expired. Please make a password recovery request again.');
                    setPageState('error');
                }
            } catch (err: unknown) {
                const axiosErr = err as { response?: { data?: unknown } };
                const responseData = axiosErr?.response?.data;
                const serverMessage =
                    typeof responseData === 'string' && responseData.trim()
                        ? responseData.trim()
                        : 'This link has expired. Please make a password recovery request again.';
                setErrorMessage(serverMessage);
                setPageState('error');
            }
        };

        verify();
    }, [router.isReady]);

    return (
        <Layout hasFooter>
            <div
                className={`${styles['forgotten-password__container']}${
                    tenant === TENANTS.WAPI ? ` ${styles['has-bg']}` : ''
                }`}
            >
                {pageState === 'loading' && (
                    <div className={styles['forgotten-password__answer-wrapper']}>
                        <Loader />
                        <p>Verifying your link…</p>
                    </div>
                )}

                {pageState === 'error' && (
                    <>
                        <div className={styles['forgotten-password__answer-wrapper']}>
                            {/*<h1>Link verification failed</h1>*/}
                            <p className={styles['forgotten-password__text-error']}>{errorMessage}</p>
                            {/*<div className={styles['forgotten-password__submit-block']}>*/}
                                <Link href={Routes.ForgottenPassword} className={styles['forgotten-password__link-btn']}>
                                    Request a new recovery link
                                </Link>
                            {/*</div>*/}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default EmailValidationPage;
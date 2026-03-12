import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TENANTS } from '@/lib/tenants';
import Layout from '@/components/Layout/Layout';
import useTenant from '@/context/tenantContext';
import styles from '../styles.module.scss';
import { Controller, useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import TextField from '@/components/FormBuilder/TextInput/TextField';
import Button from '@/components/Button/Button';
import { passwordRecoveryReset } from '@/services/passwordRecovery';
import { Routes } from '@/types/routes';
import Loader from '@/components/Loader';
import { WidthType } from '@/types/forms';
import Link from 'next/link';

const CreatePasswordPage = () => {
    const { tenant, tenantData } = useTenant();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const { control, handleSubmit, watch } = useForm({
        mode: 'onSubmit',
    });

    const newPassword = watch('newPassword');

    const handleFormSubmit = async (data: FieldValues) => {
        // Next.js router hydration check
        if (!router.isReady) return;

        const token = typeof router.query.token === 'string' ? router.query.token : '';
        const email = typeof router.query.email === 'string' ? router.query.email : '';

        if (!token) {
            setError('Invalid or missing recovery token. Please request a new link.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const res = await passwordRecoveryReset({
                alias: tenantData?.alias || '',
                login: email,
                token,
                psw: data.newPassword,
            });

            if (res?.status === 200) {
                setIsSuccess(true);
            } else {
                setError('Something went wrong. Please try again or request a new link.');
            }
        } catch (err: unknown) {
            console.error(err);
            const axiosErr = err as { response?: { data?: unknown; status?: number } };
            const responseData = axiosErr?.response?.data;
            const serverMessage =
                typeof responseData === 'string' && responseData.trim()
                    ? responseData.trim()
                    : 'Something went wrong. Please try again or request a new link.';
            setError(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout hasFooter>
            <div
                className={`${styles['forgotten-password__container']}${tenant === TENANTS.WAPI ? ` ${styles['has-bg']}` : ''
                    }`}
            >
                <div className={styles['forgotten-password__text-wrapper']}>
                    <h1>Create new password</h1>
                    {!isSuccess && <h2 className={styles['forgotten-password__text-desc']}>Enter a strong password for your account.</h2>}
                </div>
                {isLoading && <Loader />}

                {isSuccess ? (
                    <div className={styles['forgotten-password__answer-wrapper']}>
                        <p className={styles['forgotten-password__text-success']} style={{ textAlign: 'center' }}>
                            Your password has been successfully reset! You can now sign in with your new password.
                        </p>
                        <div className={styles['forgotten-password__submit-block']} style={{ marginTop: '20px' }}>
                            <Link href={Routes.Login} passHref legacyBehavior>
                                <Button type="button" icon="arrow-right" iconOnTheRight={true}>
                                    Go to Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className={`card ${styles['forgotten-password__form-wrapper']}`}>

                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div key="newPassword" className="grid-row">
                                <Controller
                                    name="newPassword"
                                    control={control}
                                    rules={{
                                        required: 'Please enter a new password!',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters long!',
                                        },
                                        validate: {
                                            hasLetter: (v: string) =>
                                                /[a-zA-Z]/.test(v) || 'Password must contain at least one letter.',
                                            hasDigit: (v: string) =>
                                                /\d/.test(v) || 'Password must contain at least one number.',
                                            hasSpecial: (v: string) =>
                                                /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                                                'Password must contain at least one special character.',
                                        },
                                    }}
                                    render={({ field: { ...props }, fieldState: { error: fieldError } }) => (
                                        <TextField
                                            {...props}
                                            type="password"
                                            name="newPassword"
                                            label="New password"
                                            // placeholder="********"
                                            errorMessage={fieldError?.message}
                                            isRequired={true}
                                            width={WidthType.w100}
                                            classNames="big-version"
                                        />
                                    )}
                                />
                            </div>

                            <div key="confirmPassword" className="grid-row">
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{
                                        required: 'Please confirm your new password!',
                                        validate: (value) =>
                                            value === newPassword || 'Passwords do not match.',
                                    }}
                                    render={({ field: { ...props }, fieldState: { error: fieldError } }) => (
                                        <TextField
                                            {...props}
                                            type="password"
                                            name="confirmPassword"
                                            label="Confirm new password"
                                            // placeholder="********"
                                            errorMessage={fieldError?.message}
                                            isRequired={true}
                                            width={WidthType.w100}
                                            classNames="big-version"
                                        />
                                    )}
                                />
                            </div>

                            {error && <p className={styles['forgotten-password__text-error']}>{error}</p>}

                            <div className={styles['forgotten-password__submit-block']}>
                                <Button type="submit" disabled={isLoading}>
                                    Save password
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CreatePasswordPage;

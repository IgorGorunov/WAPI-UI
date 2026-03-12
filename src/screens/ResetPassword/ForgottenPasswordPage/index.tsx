import React, { useState, useEffect } from 'react';
import { TENANTS } from "@/lib/tenants";
import Layout from "@/components/Layout/Layout";
import useTenant from "@/context/tenantContext";
import styles from "../styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import TextField from "@/components/FormBuilder/TextInput/TextField";
import Button from "@/components/Button/Button";
import { passwordRecoveryRequest } from "@/services/passwordRecovery";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { WidthType } from "@/types/forms";

const ForgottenPasswordPage = () => {

    const { tenant, tenantData } = useTenant();
    const router = useRouter();

    // Prefill email from query param if redirected from Login page
    const emailFromQuery = typeof router.query.email === 'string' ? router.query.email : '';

    const {
        control,
        handleSubmit,
        watch,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            email: emailFromQuery,
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const emailValue = watch("email");

    useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [emailValue]);

    const handleFormSubmit = async (data: FieldValues) => {
        const { email } = data;

        try {
            setIsLoading(true);
            setError(null);

            const res = await passwordRecoveryRequest({
                alias: tenantData?.alias || '',
                login: email.trim(),
            });

            console.log('resss:', res);

            if (res?.status === 200) {
                setIsSuccess(true);
            } else if (res?.response?.status === 404) {
                setError('Email is not found. Please, check your e-mail address and try again.');

            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err: unknown) {
            console.error(err);
            const axiosErr = err as { response?: { data?: unknown; status?: number } };
            const responseData = axiosErr?.response?.data;
            const serverMessage = typeof responseData === 'string' && responseData.trim()
                ? responseData.trim()
                : 'Something went wrong. Please try again.';
            setError(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout hasFooter>
            {/*<SeoHead title="Forgot password" description="Password recovery page" />*/}
            <div className={`${styles['forgotten-password__container']}${tenant === TENANTS.WAPI ? ` ${styles['has-bg']}` : ''}`}>


                {isSuccess ? (
                    <div className={`${styles['forgotten-password__answer-wrapper']}`}>
                        <p className={styles['forgotten-password__text-success']}>
                            Password recovery information have been sent to your email. Please check your inbox and follow the instructions to reset your password.
                        </p>
                        {/*<p className={styles['forgotten-password__text-success']}>*/}
                        {/*    If you don't receive the email within a few minutes, please check your spam folder or contact support for assistance.*/}
                        {/*</p>*/}
                    </div>
                ) : (
                    <>
                        <div className={styles['forgotten-password__text-wrapper']}>
                            <h1>Forgot password?</h1>
                            <p className={styles["forgotten-password__text-desc"]}>Please, enter the email connected to your account!</p>
                        </div>
                        <div className={`card ${styles['forgotten-password__form-wrapper']}`}>
                            {isLoading && <Loader />}
                            <form onSubmit={handleSubmit(handleFormSubmit)}>
                                <div key="email" className='grid-row'>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "Email is required!",
                                            validate: {
                                                matchPattern: (v) =>
                                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ||
                                                    "Please, enter valid email address",
                                            },
                                        }}
                                        render={({ field: { ...props }, fieldState: { error: fieldError } }) => (
                                            <TextField
                                                {...props}
                                                type="text"
                                                name="email"
                                                label="Your email"
                                                placeholder=""
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
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        Recover password
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default ForgottenPasswordPage;
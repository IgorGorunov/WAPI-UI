import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
// import type { FieldValues } from "react-hook-form";
import type { FormBuilderType } from "@/types/forms";
import { Routes } from "@/types/routes";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Button from "@/components/Button/Button";
import Turnstile, { type TurnstileRef } from "@/components/Turnstile";
import styles from "./styles.module.scss";
import { signUpFormFields } from "./SingUpFormFields";
import Link from "next/link";
import "react-phone-number-input/style.css";
// import { ApiResponseType } from "@/types/api";
import { signUp } from "@/services/signUp";
import ModalStatus, { ModalStatusType } from "@/components/ModalStatus";
import { STATUS_MODAL_TYPES } from "@/types/utility";
import Router, { useRouter } from "next/router";

type SignUpFormValues = {
    contact: string;
    phone: string;
    email: string;
    personalData: boolean;
};

type SignUpFormPropsType = {
    utm?: Record<string, string>;
}
const SignUpForm: React.FC<SignUpFormPropsType> = ({ utm }) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [utmQuery, setUtmQuery] = useState<Record<string, string>>({});
    const [turnstileToken, setTurnstileToken] = useState<string>("");
    const [honeypot, setHoneypot] = useState<string>("");
    const turnstileRef = useRef<TurnstileRef | null>(null);

    //getting uuid from query
    useEffect(() => {
        const query = router.query;
        const utmQuery = {};
        const keys = Object.keys(query).filter(key => key !== 'oneTimeToken');
        keys.map(key => {
            utmQuery[key.replace('amp;', '')] = query[key];
        });

        if (utmQuery['ref'] == 'direct') {
            const landingPage = utmQuery['landing_page'] || '';
            delete utmQuery['ref'];
            delete utmQuery['landing_page'];
            utmQuery['utm_source'] = `wapi.com/${landingPage.split('/')[1] || ''}`;

        }

        setUtmQuery(utmQuery);
    }, [router.query]);

    const {
        control,
        handleSubmit,
        watch,
        reset,
    } = useForm({ mode: "onSubmit" });

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    const closeSuccessModal = useCallback(() => {
        setShowStatusModal(false);
        reset();
        Router.push(Routes.Login);
    }, []);
    const closeErrorModal = useCallback(() => {
        setShowStatusModal(false);
    }, [])

    const handleFormSubmit = async (data: Record<string, unknown>) => {
        if (!turnstileToken) {
            setError("Please complete the security check.");
            return;
        }

        const lead = {
            lead: data as SignUpFormValues,
            utm: utm || utmQuery,
            turnstileToken,
            website_hp: honeypot,
        };

        try {
            setIsLoading(true);
            setError(null);
            const res = await signUp(lead);
            // console.log("utm lead", lead.utm);

            if (res?.status === 200) {
                //success modal
                setModalStatusInfo({
                    statusModalType: STATUS_MODAL_TYPES.SUCCESS,
                    title: "Success",
                    subtitle: `Congratulations! Sign-up complete!
                The confirmation email is on its way to the email you provided.`,
                    onClose: closeSuccessModal,
                    disableAutoClose: true,
                });
                setShowStatusModal(true);
            } else {
                // Extract error message from any response format
                const errData = (res as any)?.response?.data ?? (res as any)?.data;
                let errorMessages: string[] = [];

                if (typeof errData === 'string' && errData.trim().length > 0) {
                    errorMessages = [errData];
                } else if (errData?.errorMessage) {
                    errorMessages = Array.isArray(errData.errorMessage)
                        ? errData.errorMessage
                        : [String(errData.errorMessage)];
                } else if (errData?.message) {
                    errorMessages = Array.isArray(errData.message)
                        ? errData.message
                        : [String(errData.message)];
                } else if (errData?.error) {
                    errorMessages = Array.isArray(errData.error)
                        ? errData.error
                        : [String(errData.error)];
                } else {
                    errorMessages = ['Something went wrong. Please, try again a bit later.'];
                }

                setModalStatusInfo({
                    statusModalType: STATUS_MODAL_TYPES.ERROR,
                    title: "Error",
                    text: errorMessages,
                    onClose: closeErrorModal,
                });
                setShowStatusModal(true);
            }
        } catch (err: any) {
            console.error(err);
            const errData = err?.response?.data;
            let errorText: string[] = [];

            if (typeof errData === 'string' && errData.trim().length > 0) {
                errorText = [errData];
            } else if (errData?.errorMessage) {
                errorText = Array.isArray(errData.errorMessage)
                    ? errData.errorMessage
                    : [String(errData.errorMessage)];
            } else if (errData?.message) {
                errorText = Array.isArray(errData.message)
                    ? errData.message
                    : [String(errData.message)];
            } else {
                errorText = ['Something went wrong. Please, try again a bit later.'];
            }

            setModalStatusInfo({
                statusModalType: STATUS_MODAL_TYPES.ERROR,
                title: "Error",
                text: errorText,
                onClose: closeErrorModal,
            });
            setShowStatusModal(true);
        } finally {
            setIsLoading(false);
            setTurnstileToken("");
            turnstileRef.current?.reset();
        }
    };

    const checkbox = watch('personalData');

    return (
        <div className={`card ${styles['sign-up-form']}`}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                {signUpFormFields.map((curField: FormBuilderType) => (
                    <div key={curField.name} className='grid-row'>
                        <Controller
                            name={curField.name}
                            control={control}
                            render={({ field: { ...props }, fieldState: { error } }) => (
                                <FieldBuilder
                                    {...curField}
                                    {...props}
                                    type={curField.type}
                                    name={curField.name}
                                    label={curField.label}
                                    fieldType={curField.fieldType}
                                    placeholder={curField.placeholder}
                                    errorMessage={error?.message}
                                    isRequired={!!curField.rules?.required || false}
                                />)}
                            rules={curField.rules}
                        />
                    </div>

                ))}

                {error && <p className={styles['sign-up-error']}>{error}</p>}

                {/* Honeypot field invisible to humans, traps automated scrapers */}
                <div
                    style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}
                    aria-hidden="true"
                    tabIndex={-1}
                >
                    <input
                        type="text"
                        name="website_hp"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                    />
                </div>

                {/* Cloudflare Turnstile bot verification */}
                <div className={styles['sign-up-turnstile']}>
                    <Turnstile
                        ref={turnstileRef}
                        onVerify={(token) => {
                            setTurnstileToken(token);
                            setError(null);
                        }}
                        onExpire={() => setTurnstileToken("")}
                    />
                </div>

                <div className={styles['sign-up-submit-block']}>
                    <Button
                        type="submit"
                        icon={"arrow-right"}
                        iconOnTheRight={true}
                        disabled={isLoading || !checkbox || !turnstileToken}
                    >
                        Register
                    </Button>
                </div>

            </form>
            <div className={styles['sign-up--login']}>
                Already have an account? <Link href={Routes.Login} className={styles['sign-up--login-link']}>Login</Link>
            </div>
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </div>
    );
};

export default SignUpForm;

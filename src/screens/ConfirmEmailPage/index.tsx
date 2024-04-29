import React, {useCallback, useEffect, useState} from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Head from "next/head";
import {useRouter} from "next/router";
import {ApiResponseType} from "@/types/api";
import {confirmEmail} from "@/services/signUp";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import Loader from "@/components/Loader";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import Link from "next/link";
import {Routes} from "@/types/routes";

const ConfirmEmailPage = () => {
    const router = useRouter();

    const [confirmToken, setConfirmToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    //getting uuid from query
    useEffect(() => {
        const { uuid } = router.query;
        setConfirmToken(Array.isArray(uuid) ? (uuid.length ? uuid[0] : '') : uuid);
    }, [router.query]);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    // const closeSuccessModal = useCallback(()=>{
    //     setShowStatusModal(false);
    // }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
        setHasError(true);
    }, [])

    useEffect(() => {
        if (confirmToken) {
            //send confirmation to endpoint
            const sendConfirm = async(confirmToken: string) => {
                try {
                    setIsLoading(true);
                    const res: ApiResponseType = await confirmEmail({uuid: confirmToken});

                    if (res?.status === 200) {
                        setIsLoaded(true);

                    } else {
                        //error
                        //error modal
                        const errResponse = res.response;

                        if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                            const errorMessages = errResponse?.data.errorMessage;

                            setModalStatusInfo({
                                statusModalType: STATUS_MODAL_TYPES.ERROR,
                                title: "Error",
                                text: errorMessages,
                                onClose: closeErrorModal
                            })
                            setShowStatusModal(true);
                        }
                    }


                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }

            sendConfirm(confirmToken);
        }
    }, [confirmToken]);


    return (
        <Layout hasFooter>
            <Head>
                <title>Confirm email</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>

            <div className="email-confirm-page">
                {isLoading && <Loader />}
                {isLoaded ?
                    <div className='email-confirm-page__success'>
                        <p className='email-confirm-page__success-title'>Almost there! Your email confirmation is complete!</p>
                        <p className='email-confirm-page__success-text-title'>Next steps:</p>
                        <div className='email-confirm-page__success-text-wrapper'>
                            <p className='email-confirm-page__success-text'><span className='confirm-step text-bold'>Step 1:</span> You'll soon receive an email with your login details.</p>
                            <p className='email-confirm-page__success-text'><span className='confirm-step text-bold'>Step 2:</span> Please sign in using these credentials.</p>
                            <p className='email-confirm-page__success-text'><span className='confirm-step text-bold'>Step 3:</span> Ready to explore? Let's go!</p>
                        </div>
                        <div className='email-confirm-page__success-btns'>Proceed to <Link
                            href={Routes.Login}>Login</Link></div>
                    </div>
                    : hasError ?
                        <div className='email-confirm-page__success'>
                            <div className='email-confirm-page__success-btns'>
                                Proceed to <Link href={Routes.Login}>Login</Link>
                            </div>
                        </div>
                        : null
                }
            </div>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </Layout>
    );
};

export default ConfirmEmailPage;

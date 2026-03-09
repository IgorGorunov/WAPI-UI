import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import "./styles.scss";
import { setInterceptorErrorCallback, setInterceptorRedirectCallback } from "@/services/api";
import { ModalTypes, STATUS_MODAL_TYPES } from "@/types/utility";
import ModalStatus from "@/components/ModalStatus";
import { useRouter } from "next/router";
import useAuth from "@/context/authContext";
import { Routes } from "@/types/routes";
import BackToTop from "@/components/BackToTop";

// Dynamically import non-critical components
const Footer = dynamic(() => import("@/components/Footer/Footer"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });

type Props = {
    hasHeader?: boolean;
    hasFooter?: boolean;
    isWide?: boolean;
    children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({
    hasFooter = false,
    isWide = false,
    children,
}) => {
    const router = useRouter();
    const { logout } = useAuth();

    // Defer cookie consent loading to reduce TBT
    const [showCookieConsent, setShowCookieConsent] = useState(false);

    const [apiErrorTitle, setApiErrorTitle] = useState<string>('');
    const [apiErrorText, setApiErrorText] = useState<string>('');

    useEffect(() => {
        setInterceptorErrorCallback((title: string, message: string) => {
            setApiErrorTitle(title);
            setApiErrorText(message);
        });

        setInterceptorRedirectCallback(async () => {
            console.log('[Layout] API interceptor triggered redirectToLogin!');
            logout();
            await router.push(Routes.Login)
        })
    }, []);

    // Defer cookie consent until page is interactive (reduces TBT)
    useEffect(() => {
        // Use requestIdleCallback to load cookie consent when browser is idle
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                setShowCookieConsent(true);
            }, { timeout: 2000 });
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                setShowCookieConsent(true);
            }, 1000);
        }
    }, []);

    const handleClose = () => {
        setApiErrorTitle('');
        setApiErrorText('');
    };

    return (
        <main className="main">
            <div className={`main-content ${isWide ? 'is-wide' : ''}`}>
                {children}
            </div>
            {hasFooter && <Footer />}
            {showCookieConsent && <CookieConsent />}
            <div id="modal-root-main"></div>
            <div id="modal-root-status"></div>
            <div id="modal-root-preview"></div>
            <div id="modal-root-confirm"></div>
            <div id="modal-root-api-error"></div>
            {apiErrorText ? <ModalStatus
                statusModalType={STATUS_MODAL_TYPES.ERROR}
                modalType={ModalTypes.API_ERROR}
                title={apiErrorTitle || ''}
                subtitle={apiErrorText || ''}
                onClose={handleClose} /> : null
            }
            <BackToTop />
        </main>
    );
};

export default Layout;

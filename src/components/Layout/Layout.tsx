import React, {useEffect, useState} from "react";
import Footer from "@/components/Footer/Footer";
import "./styles.scss";
import {setInterceptorErrorCallback, setInterceptorRedirectCallback} from "@/services/api";
import {ModalTypes, STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus from "@/components/ModalStatus";
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import {Routes} from "@/types/routes";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";

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
    const {logout, isCookieConsentReceived} = useAuth();
    const [showCookieConsent, setShowCookieConsent] = useState(false);

    const [apiErrorTitle, setApiErrorTitle] = useState<string>('');
    const [apiErrorText, setApiErrorText] = useState<string>('');

    useEffect(() => {
        setInterceptorErrorCallback((title:string, message: string)=> {
            setApiErrorTitle(title);
            setApiErrorText(message);
        });

        setInterceptorRedirectCallback(async()=>{
            logout();
            await router.push(Routes.Login)
        })
    }, []);

    const handleClose = () => {
        setApiErrorTitle('');
        setApiErrorText('');
    };

    //const cookieConsentRef = useRef<HTMLDivElement>(null);
    //const [extraPadding, setExtraPadding] = useState<number>(0);
    //
    // useEffect(() => {
    //     if (!isCookieConsentReceived && cookieConsentRef?.current) {
    //         const height = cookieConsentRef.current.getBoundingClientRect().height;
    //         setExtraPadding(height);
    //     } else {
    //         setExtraPadding(0)
    //     }
    // }, [isCookieConsentReceived]);

    useEffect(() => {
        setShowCookieConsent(!isCookieConsentReceived);
        // if (isCookieConsentReceived && clarity.hasStarted()) {
        //     clarity.consent();
        // }
    }, [isCookieConsentReceived]);

  return (
      <div className="main">
          <div className={`main-content ${isWide ? 'is-wide' : ''}`}>
              {children}
          </div>
          {hasFooter && <Footer/>}
          {showCookieConsent ? <CookieConsent/> : null}
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
              onClose={handleClose}/> : null
          }
          <BackToTop />
      </div>
  );
};

export default Layout;

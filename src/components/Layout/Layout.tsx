import React, {useEffect, useState} from "react";
import Footer from "@/components/Footer/Footer";
import "./styles.scss";
import {setInterceptorErrorCallback, setInterceptorRedirectCallback} from "@/services/api";
import {ModalTypes, STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus from "@/components/ModalStatus";
import {useRouter} from "next/router";

type Props = {
  hasHeader?: boolean;
  hasFooter?: boolean;
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({
  hasFooter = false,
  children,
}) => {
    const router = useRouter();

    const [apiErrorTitle, setApiErrorTitle] = useState<string>('');
    const [apiErrorText, setApiErrorText] = useState<string>('');

    useEffect(() => {
        setInterceptorErrorCallback((title:string, message: string)=> {
            setApiErrorTitle(title);
            setApiErrorText(message);
        });
        setInterceptorRedirectCallback(()=>router.push('/login'))

    }, []);

    useEffect(() => {
        console.log('12311111111111', apiErrorText)
    }, [apiErrorText]);

    const handleClose = () => {
        setApiErrorTitle('');
        setApiErrorText('');
    };

  return (
      <div className="main">
          <div className="main-content">
              {children}
          </div>
          {hasFooter && <Footer/>}
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
              onClose={handleClose} /> : null}
      </div>
  );
};

export default Layout;

import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Icon from "@/components/Icon";
import "./styles.scss";
import {ModalTypes} from "@/types/utility";

type ModalType = {
    classNames?: string;
    title?: string;
    children?: React.ReactNode;
    onClose: () => void;
    modalType?: ModalTypes;
    noHeaderDecor?: boolean;
};

const Modal: React.FC<ModalType> = ({ title, children, onClose, classNames = "" , modalType= ModalTypes.MAIN, noHeaderDecor = false}) => {
    const modalWrapperRef = useRef<HTMLDivElement>();

    const handleCloseClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        onClose();
    };

    useEffect(() => {
        const modalWrapper = modalWrapperRef.current;

        if (modalWrapper) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            modalWrapper.style.top = `${scrollTop + 20}px`;
        }
    }, []);

    // useEffect(() => {
    //     if (document) {
    //         console.log("doc:", document)
    //         document.body.style.overflow = 'hidden';
    //         document.body.style.height = '100vh';
    //     }
    //
    //     return () => {
    //         document.body.style.overflow = 'auto';
    //         document.body.style.height = 'auto';
    //     }
    // }, [])

    const modalContent = (
        <div className={`modal-overlay ${classNames}`}>
            <div className="modal-wrapper" ref={modalWrapperRef}>
                <div className="modal">
                    <div className={`modal-header ${noHeaderDecor ? 'no-header-decor' : ''}`}>
                        {title && (
                            <div className="modal-header__title">
                                {title}
                            </div>
                        )}
                        <div className="modal-header__close">
                            <a href="#" onClick={handleCloseClick}>
                                <Icon name="close" />
                            </a>
                        </div>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById(`modal-root-${modalType}`)
    );
};

export default Modal;

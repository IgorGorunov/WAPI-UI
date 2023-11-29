import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Icon from "@/components/Icon";
import "./styles.scss";

type ModalType = {
    classNames?: string;
    title?: string;
    children?: React.ReactNode;
    onClose: () => void;
};

const Modal: React.FC<ModalType> = ({ title, children, onClose, classNames = "" }) => {
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

    const modalContent = (
        <div className={`modal-overlay ${classNames}`}>
            <div className="modal-wrapper" ref={modalWrapperRef}>
                <div className="modal">
                    <div className="modal-header">
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
        document.getElementById("modal-root")
    );
};

export default Modal;

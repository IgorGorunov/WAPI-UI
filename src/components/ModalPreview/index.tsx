import React, { useRef } from "react";
import ReactDOM from "react-dom";
import Icon from "@/components/Icon";
import styles from "./styles.module.scss";
import {ModalTypes} from "@/types/utility";

type ModalType = {
    classNames?: string;
    children?: React.ReactNode;
    onClose: () => void;
    modalType?: ModalTypes;
};

const Modal: React.FC<ModalType> = ({ children, onClose, classNames = "" , modalType= ModalTypes.PREVIEW,}) => {
    const modalWrapperRef = useRef<HTMLDivElement>();


    // useEffect(() => {
    //     document.body.classList.add('modalOpen');
    //
    //
    //     return () => {
    //         document.body.classList.remove('modalOpen');
    //     };
    // }, []);

    const handleCloseClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = (
        <div className={`${styles['preview-modal__overlay'] || 'preview-modal__overlay'} preview-modal__overlay ${classNames}`}  onClick={onClose}>
            <div className={`${styles['preview-modal__close'] || 'preview-modal__close'} preview-modal__close`}>
                <a href="#" onClick={handleCloseClick}>
                    <Icon name="close"/>
                </a>
            </div>
            <div className={`${styles['preview-modal'] || 'preview-modal'} preview-modal`} ref={modalWrapperRef} onClick={(e) => e.stopPropagation()}>
                <div className={`${styles['preview-modal__content'] || 'preview-modal__content'} preview-modal__content`}>

                    {children}
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

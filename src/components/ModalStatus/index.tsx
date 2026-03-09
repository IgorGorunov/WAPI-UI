import React, { useEffect } from "react";
import ReactDOM from "react-dom"
import Icon from "@/components/Icon";
import { ModalTypes, STATUS_MODAL_TYPES } from "@/types/utility";
import styles from "./styles.module.scss";

export type ObjectErrorText = {
    title: string;
    text?: string[];
}

export type ModalStatusType = {
    classNames?: string;
    statusModalType?: STATUS_MODAL_TYPES;
    title?: string;
    subtitle?: string;
    text?: string[];
    multipleObjectsErrorText?: ObjectErrorText[];
    onClose: () => void;
    modalType?: ModalTypes;
    disableAutoClose?: boolean;
}

const getStatusModalIconName = (statusModalType: STATUS_MODAL_TYPES) => {
    switch (statusModalType) {
        case STATUS_MODAL_TYPES.SUCCESS:
            return 'success';
        case STATUS_MODAL_TYPES.ERROR:
            return 'error';
        case STATUS_MODAL_TYPES.NOTIFICATION:
            return 'notification';
        case STATUS_MODAL_TYPES.WARNING:
            return 'warning';
        default:
            return 'info';
    }
}

const ModalStatus: React.FC<ModalStatusType> = ({ statusModalType = STATUS_MODAL_TYPES.ERROR, title, subtitle, text, multipleObjectsErrorText, onClose, classNames = '', modalType = ModalTypes.STATUS, disableAutoClose = false }) => {
    const handleCloseClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        onClose();
    };

    useEffect(() => {
        if (statusModalType === STATUS_MODAL_TYPES.SUCCESS && !disableAutoClose) {
            setTimeout(() => onClose(), 2000);
        }
    }, []);


    const modalContent = (
        <div className={`${styles['status-modal-overlay']} ${classNames ? classNames : ''}`}>
            <div className={styles['status-modal-wrapper']} >
                <div className={`${styles['status-modal']} ${styles[`${statusModalType}-modal`] || ''}`}>
                    <div className={styles['status-modal-header']}>
                        {title && <div className={styles['status-modal-header__title']}>
                            {title}
                        </div>}
                        <div className={styles['status-modal-header__close']}>
                            <a href="#" onClick={handleCloseClick}>
                                <Icon name='close-in-circle' />
                            </a>
                        </div>
                    </div>

                    <div className={styles['status-modal-body']}>
                        {statusModalType !== STATUS_MODAL_TYPES.MESSAGE && (<div className={`${styles['status-icon']} ${styles[statusModalType] ? styles[statusModalType] : statusModalType}`}>
                            <Icon name={getStatusModalIconName(statusModalType)} />
                        </div>)}
                        {subtitle ? <div className={styles['status-modal__subtitle']}>
                            {/*{splitMessage(subtitle, '\n')}*/}
                            {subtitle}
                        </div> : null}

                        {text && text.length &&
                            <div className={styles['status-modal__text']}>
                                <ul className={styles['status-modal__text-list']}>
                                    {text.map((item: string, index: number) => <li key={`${item}-${index}-${new Date().toISOString()}`} className={styles['status-modal__text-list-item']}>{item}</li>)}
                                </ul>
                            </div>
                        }
                        {multipleObjectsErrorText && multipleObjectsErrorText.length ?
                            <div className={styles['status-modal__multiple-text']}>
                                <ul className={styles['status-modal__multiple-text-list']}>
                                    {multipleObjectsErrorText.map((item: ObjectErrorText, index: number) => (
                                        <li key={`${item.title}-${index}-${new Date().toISOString()}`} className={styles['status-modal__multiple-text-list-item']}>
                                            <p className={styles['status-modal__multiple-text-title']}>
                                                {item.title}
                                            </p>
                                            <ul className={styles['status-modal__multiple-text-inner-list']}>
                                                {item.text ? item.text.map(((innerText, innerIndex) => (
                                                    <li key={`${innerText}-${innerIndex}-${new Date().toISOString()}`} className={styles['status-modal__multiple-text-inner-list-item']}>{innerText}</li>
                                                ))) : null}
                                            </ul>
                                        </li>)
                                    )}
                                </ul>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById(`modal-root-${modalType}`)
    );
}

export default ModalStatus;

import React from 'react';
import ReactDOM from "react-dom";
import { ModalTypes } from "@/types/utility";
import Button, { ButtonVariant } from "@/components/Button/Button";
import Icon, { IconType } from "@/components/Icon";
import styles from './styles.module.scss';

export type ConfirmModalType = {
    classNames?: string;
    title?: string | React.ReactNode;
    icon?: IconType | React.ReactNode;
    actionText?: React.ReactNode | string[];
    children?: React.ReactNode;
    onOk: () => void;
    onCancel: () => void;
    onClose?: () => void;
    modalType?: ModalTypes;
    okText?: string;
    cancelText?: string;
    okVariant?: ButtonVariant;
    cancelVariant?: ButtonVariant;
    maxWidth?: number | string;
};

const ConfirmModal: React.FC<ConfirmModalType> = ({
    title,
    icon,
    actionText = '',
    children,
    onOk,
    onCancel,
    onClose,
    modalType = ModalTypes.CONFIRM,
    classNames = '',
    okText = 'Yes',
    cancelText = 'No',
    okVariant = ButtonVariant.PRIMARY,
    cancelVariant = ButtonVariant.SECONDARY,
    maxWidth,
}) => {
    const handleClose = onClose || onCancel;

    const renderIcon = () => {
        if (!icon) return null;
        if (React.isValidElement(icon)) {
            return <div className={`${styles['confirm-modal__icon'] || 'confirm-modal__icon'}`}>{icon}</div>;
        }
        if (typeof icon === 'string') {
            return (
                <div className={`${styles['confirm-modal__icon'] || 'confirm-modal__icon'} ${styles[`is-${icon}`] || ''}`}>
                    <Icon name={icon as IconType} />
                </div>
            );
        }
        return null;
    };

    const renderBody = () => {
        if (children) {
            return (
                <div className={`${styles['confirm-modal__body'] || 'confirm-modal__body'} confirm-modal__body`}>
                    {actionText && (
                        typeof actionText === 'string' ? (
                            actionText.split('\n\n').map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))
                        ) : actionText
                    )}
                    {children}
                </div>
            );
        }

        if (Array.isArray(actionText)) {
            return (
                <div className={`${styles['confirm-modal__body'] || 'confirm-modal__body'} confirm-modal__body`}>
                    {actionText.map((p, idx) => (
                        <p key={idx}>{p}</p>
                    ))}
                </div>
            );
        }

        if (typeof actionText === 'string') {
            const paragraphs = actionText.split('\n\n').filter(Boolean);
            if (paragraphs.length > 1) {
                return (
                    <div className={`${styles['confirm-modal__body'] || 'confirm-modal__body'} confirm-modal__body`}>
                        {paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                        ))}
                    </div>
                );
            }
            return (
                <div className={`${styles['confirm-modal__body'] || 'confirm-modal__body'} confirm-modal__body`}>
                    <p>{actionText}</p>
                </div>
            );
        }

        return (
            <div className={`${styles['confirm-modal__body'] || 'confirm-modal__body'} confirm-modal__body`}>
                {actionText}
            </div>
        );
    };

    const modalContent = (
        <div className={`${styles['confirm-modal-overlay'] || 'confirm-modal-overlay'} confirm-modal-overlay ${classNames}`}>
            <div
                className={`${styles['confirm-modal-wrapper'] || 'confirm-modal-wrapper'} confirm-modal-wrapper ${!title && !icon ? styles['is-simple'] : ''}`}
                style={maxWidth ? { maxWidth } : undefined}
            >
                {onClose ? (
                    <button
                        type="button"
                        className={`${styles['confirm-modal__close'] || 'confirm-modal__close'}`}
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <Icon name="close" />
                    </button>
                ) : null}

                {renderIcon()}

                {title ? (
                    <div className={`${styles['confirm-modal__title'] || 'confirm-modal__title'} confirm-modal__title`}>
                        {title}
                    </div>
                ) : null}

                {renderBody()}

                <div className={`${styles['confirm-modal__btns'] || 'confirm-modal__btns'} confirm-modal__btns`}>
                    <Button variant={cancelVariant} onClick={onCancel}>{cancelText}</Button>
                    <Button variant={okVariant} onClick={onOk}>{okText}</Button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById(`modal-root-${modalType}`)
    );
};

export default ConfirmModal;
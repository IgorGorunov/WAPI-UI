import React from 'react';
import ReactDOM from "react-dom"
import {ModalTypes} from "@/types/utility";
import Button, {ButtonVariant} from "@/components/Button/Button";
import './styles.scss'

type ConfirmModalType = {
    classNames?: string;
    actionText?: string;
    onOk:()=>void;
    onCancel: ()=> void;
    modalType?: ModalTypes;
}
const ConfirmModal:React.FC<ConfirmModalType> = ({ actionText='', onOk, onCancel, modalType=ModalTypes.CONFIRM, classNames }) => {

    const modalContent = (
        <div className={`confirm-modal-overlay ${classNames ? classNames : ''}`}>
            <div className="confirm-modal-wrapper">
                <p>{actionText}</p>
                <div className='confirm-modal__btns'>
                    <Button variant={ButtonVariant.PRIMARY} onClick={onOk}>Yes</Button>
                    <Button variant={ButtonVariant.SECONDARY} onClick={onCancel}>No</Button>
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
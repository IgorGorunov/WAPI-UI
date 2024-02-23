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
    // return (
    //     <Modal
    //         title="Confirmation"
    //         onOk={onOk}
    //         onCancel={onCancel}
    //     >
    //         <p>Are you sure you want to {actionText}?</p>
    //     </Modal>
    // );

    console.log('123445')

    const modalContent = (
        <div className={`confirm-modal-overlay ${classNames ? classNames : ''}`}>
            <div className="confirm-modal-wrapper">
                <p>Are you sure you want to {actionText}?</p>
                <div className='confirm-modal__btns'>
                    <Button variant={ButtonVariant.PRIMARY} onClick={onOk}>Confirm</Button>
                    <Button variant={ButtonVariant.SECONDARY} onClick={onCancel}>Cancel</Button>
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
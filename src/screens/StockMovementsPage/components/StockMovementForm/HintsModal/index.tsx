import React from "react";
import "./styles.scss";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal";
import Icon from "@/components/Icon";

type PropsType = {
    docName: string;
    onClose: ()=>void;
    onOk: ()=>void;
};

const HintsModal: React.FC<PropsType> = ({ docName, onClose, onOk }) => {


    return (
        <Modal title={'Do you need help?'} onClose={onClose} classNames='hints-modal'>
            <div className='hints-modal__wrapper'>
                <h3 className='hints-modal__title'>{`Would you like to view hints about fields of the ${docName}?`}</h3>
                <p className='hints-modal__description'>
                    <span>To display or hide hints, click on </span>
                    <span className='hints-modal__icon-wrapper'><Icon name='question'/></span>
                    <span>icon, which you can find in top right corner of each block.</span>
                </p>
                <div className='hints-modal__button-wrapper'>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onOk}>Display hints</Button>
                </div>
            </div>
        </Modal>
    );
};

export default HintsModal
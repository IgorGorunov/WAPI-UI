import React, {useEffect, useRef} from "react";
import ReactDOM from "react-dom"
import Icon from "@/components/Icon";
import "./styles.scss";

export type ModalStatusType = {
    classNames?: string;
    isSuccess?: boolean;
    title?: string;
    subtitle?: string;
    text?: string[];
    onClose: ()=> void;
}
const ModalStatus:React.FC<ModalStatusType> = ({isSuccess = false, title, subtitle, text, onClose, classNames=''}) => {

    const handleCloseClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        onClose();
    };

    useEffect(() => {
        if (isSuccess) {
            setTimeout(()=>onClose(), 2000);
        }
    }, []);

    const modalContent = (
        <div className={`status-modal-overlay } ${classNames ? classNames : ''}`}>
            <div className="status-modal-wrapper" >
                <div className={`status-modal ${isSuccess ? "success-modal" : "error-modal"}`}>
                    <div className="status-modal-header">
                        {title && <div className='status-modal-header__title'>
                            {title}
                        </div>}
                        <div className='status-modal-header__close'>
                            <a href="#" onClick={handleCloseClick}>
                                <Icon name='close-in-circle' />
                            </a>
                        </div>
                    </div>

                    <div className="status-modal-body">
                        <div className='status-icon'>
                            {isSuccess ? <Icon name='success'/> : <Icon name='error' />}
                        </div>
                        {subtitle ? <div className='status-modal__subtitle'>
                            {subtitle}
                        </div> : null}

                        {text && text.length &&
                            <div className='status-modal__text'>
                                <ul className='status-modal__text-list'>
                                    {text.map((item: string, index: number)=> <li key={`${item}-${index}`} className={'status-modal__text-lis-item'}>{item}</li> )}
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root-status")
    );
}

export default ModalStatus;

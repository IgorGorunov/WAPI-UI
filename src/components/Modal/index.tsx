import React, {useRef} from "react";
import ReactDOM from "react-dom"
import Icon from "@/components/Icon";
import "./styles.scss";

type ModalType = {
    classNames?: string;
    title?: string;
    children?: React.ReactNode;
    onClose: ()=> void;
}
const Modal:React.FC<ModalType> = ({title, children, onClose, classNames=''}) => {
    const modalWrapperRef = useRef<HTMLDivElement>();

    // const backDropHandler = useCallback((e: MouseEvent) => {
    //     if (modalWrapperRef && modalWrapperRef?.current && !modalWrapperRef?.current?.contains(e.target as Node )) {
    //         onClose();
    //     }
    // }, []);
    //
    // useEffect(() => {
    //     setTimeout(() => {
    //         window.addEventListener('click', backDropHandler);
    //     })
    // }, [])
    //
    // useEffect(() => {
    //     return () => window.removeEventListener('click', backDropHandler);
    // }, []);

    const handleCloseClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = (
        <div className={`modal-overlay ${classNames ? classNames : ''}`}>
            <div className="modal-wrapper" ref={modalWrapperRef} >
                <div className="modal">
                    <div className="modal-header">
                        {title && <div className='modal-header__title'>
                            {title}
                        </div>}
                        <div className='modal-header__close'>
                            <a href="#" onClick={handleCloseClick}>
                                <Icon name='close' />
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
}

export default Modal;

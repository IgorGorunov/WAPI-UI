import React, {useCallback} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import {toast, ToastContainer} from '@/components/Toast';

export type PopupItem = {
    title: string;
    description?: string | number;
};

type PopupPropsType = {
    items: PopupItem[];
    width?: number | null;
    handleClose?: () => void;
    hasCopyBtn?: boolean;
    changePositionOnMobile?: boolean;
    needScroll?: boolean;
};

const SimplePopup: React.FC<PopupPropsType> = ({ items, width, handleClose, hasCopyBtn=false, changePositionOnMobile=false, needScroll=false }) => {

    if (items.length === 0) {
        return null;
    }

    const positionClass = `simple-popup__wrapper ${changePositionOnMobile ? 'change-on-mobile' : ''}`;
    const wrapperStyle = width !== null ? { width: width + 'px' } : {};

    const copyToClipboard = useCallback((text: string) => {
        // Create a textarea element to hold the text to copy
        const textarea = document.createElement('textarea');
        textarea.value = text;

        // Make the textarea invisible
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';

        // Append the textarea to the document
        document.body.appendChild(textarea);

        // Select the text within the textarea
        textarea.select();

        try {
            // Execute the copy command
            const successful = document.execCommand('copy');
            if (!successful) {
                console.error('Failed to copy text to clipboard');
            }
        } catch (err) {
            console.error('Failed to copy text to clipboard:', err);
        }

        // Remove the textarea from the document
        document.body.removeChild(textarea);
    }, []);

    const getInfoToCopy = (items:PopupItem[], key: keyof PopupItem) => {
        return items.reduce((acc, item)=> acc+" "+item[key], "").trim();
    }

    const handleCopy = () => {
        copyToClipboard(getInfoToCopy(items, 'title'));
        toast.success('Successfully copied to clipboard!', {
            position: "bottom-center",
            autoClose: 1500,
        })
    }

    return (
        <>
            <div className={`simple-popup ${positionClass}  ${hasCopyBtn ? 'has-copy-icon' : ''} ${needScroll ? '' : 'hide-close-btn'}`} style={wrapperStyle} >
                {hasCopyBtn && <button className='copy-btn' onClick={handleCopy}>{items.length > 1 ? 'copy all' : 'copy'}<Icon name='copy' /></button> }
                {/*{!!handleClose ? (<a className="simple-popup__close" href="#" onClick={handleClose}>*/}
                {/*    <Icon name='close' />*/}
                {/*</a>) : null }*/}
                <ul className={`simple-popup__list ${needScroll ? 'has-scroll' : ''}`}>
                    {items.map((item: PopupItem, index: number) => (
                        <li key={item.title + index} className="simple-popup__item">
                            <p className="simple-popup__item-text">{item.title}</p>
                            {item.description ? <p className='simple-popup__item-description'>{item.description}</p> : null}
                        </li>
                    ))}
                </ul>

            </div>
            <ToastContainer />
        </>
    );
};

export default SimplePopup;

import React, {useCallback} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import {toast, ToastContainer} from '@/components/Toast';

type PopupItem = {
    title: string;
    description: string | number;
};

type PopupPropsType = {
    items: PopupItem[];
    position: 'left' | 'right';
    width?: number | null;
    handleClose?: () => void;
    hasCopyBtn?: boolean;
    changePositionOnMobile?: boolean;
    needScroll?: boolean;
};

const UniversalPopup: React.FC<PopupPropsType> = ({ items, position, width, handleClose, hasCopyBtn=false, changePositionOnMobile=false, needScroll=false }) => {
    if (items.length === 0) {
        return null;
    }

    const positionClass = `universal-popup__wrapper universal-popup__wrapper--${position} ${changePositionOnMobile ? 'change-on-mobile' : ''}`;
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
        console.log('Copy');
        copyToClipboard(getInfoToCopy(items, 'title'));
        toast.success('Successfully copied to clipboard!', {
            position: "bottom-center",
            autoClose: 1500,
        })
    }

    return (
        <>
            <div className={`universal-popup ${positionClass} ${!!handleClose ? 'has-close-icon' : ''} ${hasCopyBtn ? 'has-copy-icon' : ''}`} style={wrapperStyle}>
                {hasCopyBtn && <button className='copy-btn' onClick={handleCopy}>{items.length > 1 ? 'copy all' : 'copy'}<Icon name='copy' /></button> }
                {!!handleClose ? (<a className="universal-popup__close" href="#" onClick={handleClose}>
                    <Icon name='close' />
                </a>) : null }
                <ul className={`universal-popup__list ${needScroll ? 'has-scroll' : ''}`}>
                    {items.map((item: PopupItem, index: number) => (
                        <li key={item.title + index} className="universal-popup__item">
                            <p className="universal-popup__item-text">{item.title}</p>
                            <p>{item.description}</p>
                        </li>
                    ))}
                </ul>

            </div>
            <ToastContainer />
        </>
    );
};

export default UniversalPopup;

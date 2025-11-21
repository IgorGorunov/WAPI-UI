import React, {useCallback, useState} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import {toast, ToastContainer} from '@/components/Toast';
import SingleDocument from "@/components/SingleDocument";
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";

export type PopupItem = {
    title: string;
    description?: string | number;
    docType?: NOTIFICATION_OBJECT_TYPES;
    docUuid?: string;
};

type PopupPropsType = {
    items: PopupItem[];
    width?: number | null;
    handleClose?: () => void;
    hasCopyBtn?: boolean;
    changePositionOnMobile?: boolean;
    needScroll?: boolean;
};

const SimplePopup: React.FC<PopupPropsType> = ({ items, width, hasCopyBtn=false, changePositionOnMobile=false, needScroll=false }) => {

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
            autoClose: 30,
        });
        console.log('copy');
        toast.clearWaitingQueue();
    }

    const getInfoToCopyTab = (items: PopupItem[]) => {
        return items
            .map((item) => `${item.title}\t${item.description || ''}`) // Separate columns with tab
            .join('\n'); // Separate rows with newline
    };

    const handleCopyTab = () => {
        const textToCopy = getInfoToCopyTab(items);
        copyToClipboard(textToCopy);
        toast.success('Successfully copied to clipboard!', {
            position: "bottom-center",
            autoClose: 30,
        });
        console.log('copy');
        toast.clearWaitingQueue();
    };

    const [docUuid, setDocUuid] = useState<string|null>(null);
    const [docType, setDocType] = useState<NOTIFICATION_OBJECT_TYPES|null>(null);

    const getNotificationType = (docType: string) => {
        switch (docType) {
            case 'Stock movement': return NOTIFICATION_OBJECT_TYPES.StockMovement;
            case 'Inbound': return NOTIFICATION_OBJECT_TYPES.Inbound;
            case 'Outbound': return NOTIFICATION_OBJECT_TYPES.Outbound;
            case 'Logistic service': return NOTIFICATION_OBJECT_TYPES.LogisticService;
            case 'Fulfillment': return NOTIFICATION_OBJECT_TYPES.Fullfilment;
        }
    }

    const handleDocClick = (item: PopupItem) => {
        console.log('handleDocClick', NOTIFICATION_OBJECT_TYPES[item.docType], item.docType);
        if (item.docType && item.docUuid) {
            setDocType(getNotificationType(item.docType));
            setDocUuid(item.docUuid);

        }
    }

    const onClose = () => {
        setDocUuid(null);
        setDocType(null);
    }


    return (
        <>
            {(!docUuid || !docType) && <div className={`simple-popup ${positionClass}  ${hasCopyBtn ? 'has-copy-icon' : ''} ${needScroll ? '' : 'hide-close-btn'}`} style={wrapperStyle} >
                {hasCopyBtn && <button className='copy-btn' onClick={handleCopy}>{items.length > 1 ? 'copy all' : 'copy'}<Icon name='copy' /></button> }
                {hasCopyBtn && <button className='copy-btn copy-btn-tab' onClick={handleCopyTab}>copy as table<Icon name='copy' /></button> }
                {/*{!!handleClose ? (<a className="simple-popup__close" href="#" onClick={handleClose}>*/}
                {/*    <Icon name='close' />*/}
                {/*</a>) : null }*/}
                <ul className={`simple-popup__list ${needScroll ? 'has-scroll' : ''}`}>
                    {items.map((item: PopupItem, index: number) => (
                        <li key={item.title + index} className="simple-popup__item">
                            {
                                item.docUuid && item.docType ? (
                                        <button className="simple-popup__item-btn" onClick={()=>handleDocClick(item)}>
                                            <p className="simple-popup__item-text">{item.title}</p>
                                            {item.description ? <p className='simple-popup__item-description'>{item.description}</p> : null}
                                        </button>
                                    ) :
                                <>
                                    <p className="simple-popup__item-text">{item.title}</p>
                                    {item.description ? <p className='simple-popup__item-description'>{item.description}</p> : null}
                                </>
                            }
                        </li>
                    ))}
                </ul>
            </div>}
            <ToastContainer />
            { docUuid && docType ? <SingleDocument type={docType} uuid={docUuid} onClose={onClose} /> : null}
        </>
    );
};

export default SimplePopup;

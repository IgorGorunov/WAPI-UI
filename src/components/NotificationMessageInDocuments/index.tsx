import React from "react";
import "./styles.scss";
import {NOTIFICATION_TYPES} from "@/types/notifications";
import Icon from "@/components/Icon";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";

export type NotificationMessageInDocumentsType = {
    title?: string;
    period: string;
    message: string;
    uuid: string;
    type: NOTIFICATION_TYPES;
};

const NotificationMessageInDocuments: React.FC<NotificationMessageInDocumentsType> = ({
     title, period, message, type, uuid
 }) => {
    const {setNotificationAsRead} = useMarkNotificationAsRead();

    // const handleClose = () => {
    //     setNotificationAsRead(uuid);
    // }

    return (
        <div className={`document-notification-message notification-${type}`}>
            {/*{title ? <div className='document-notification-message__title'>{title}</div> : null}*/}
            {/*<div className='document-notification-message__period'>{formatDateTimeToStringWithDotWithoutSeconds(period)}</div>*/}
            <div className='document-notification-message__icon'>
                <Icon name={type === NOTIFICATION_TYPES.ERROR ? 'error' : 'info'} />
            </div>
            <div className='document-notification-message__message'>{message}</div>
            {/*<div className='document-notification-message__close' onClick={handleClose}>*/}
            {/*    <Icon name='close'/>*/}
            {/*</div>*/}
        </div>
    );
};

export default NotificationMessageInDocuments;

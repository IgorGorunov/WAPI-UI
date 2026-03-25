import React from "react";
import styles from "./styles.module.scss";
import {NOTIFICATION_TYPES} from "@/types/notifications";
import Icon from "@/components/Icon";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";

export type NotificationMessageInDocumentsType = {
    title?: string;
    period: string;
    message: string;
    uuid: string;
    type: NOTIFICATION_TYPES;
};

const NotificationMessageInDocuments: React.FC<NotificationMessageInDocumentsType> = ({
      message, type, period
 }) => {

    // const handleClose = () => {
    //     setNotificationAsRead(uuid);
    // }

    return (
        <div className={`${styles['document-notification-message'] || 'document-notification-message'} document-notification-message ${styles[`notification-${type}`] || `notification-${type}`} notification-${type}`}>
            {/*{title ? <div className='document-notification-message__title'>{title}</div> : null}*/}
            {/*<div className='document-notification-message__period'>{formatDateTimeToStringWithDotWithoutSeconds(period)}</div>*/}
            {/*<div className='document-notification-message__icon-bell'>*/}
            {/*    <Icon name={`notification`} />*/}
            {/*</div>*/}
            <div className={`${styles['document-notification-message__icon'] || 'document-notification-message__icon'} document-notification-message__icon`}>
                {/*<Icon name={getNotificationIconName(type)} />*/}
                <Icon name={"notification"} />
            </div>
            <div className={`${styles['document-notification-message__message'] || 'document-notification-message__message'} document-notification-message__message`}>

                <span className={`${styles['document-notification-message__text'] || 'document-notification-message__text'} document-notification-message__text`}>{message}</span>
                <span className={`${styles['document-notification-message__date'] || 'document-notification-message__date'} document-notification-message__date`}>
                    {formatDateTimeToStringWithDotWithoutSeconds(period)}
                </span>
            </div>
            {/*<div className='document-notification-message__close' onClick={handleClose}>*/}
            {/*    <Icon name='close'/>*/}
            {/*</div>*/}
        </div>
    );
};

export default NotificationMessageInDocuments;

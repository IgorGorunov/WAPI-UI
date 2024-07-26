import React from "react";
import "./styles.scss";
import {NOTIFICATION_TYPES} from "@/types/notifications";
import Icon from "@/components/Icon";
import {getNotificationIconName} from "@/components/HeaderNotifications/NotificationsBlock";

export type NotificationMessageInDocumentsType = {
    title?: string;
    period: string;
    message: string;
    uuid: string;
    type: NOTIFICATION_TYPES;
};

const NotificationMessageInDocuments: React.FC<NotificationMessageInDocumentsType> = ({
      message, type
 }) => {

    return (
        <div className={`document-notification-message notification-${type}`}>
            <div className='document-notification-message__icon'>
                <Icon name={getNotificationIconName(type)} />
            </div>
            <div className='document-notification-message__message'>{message}</div>
        </div>
    );
};

export default NotificationMessageInDocuments;

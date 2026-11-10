import React, {useEffect, useRef, useState} from "react";
import Icon from "@/components/Icon";
import useAuth from "@/context/authContext";
import {checkNewNotifications, getNotifications} from "@/services/notifications";
import {markNotificationAsRead} from "@/utils/notifications";
import {
    NOTIFICATION_STATUSES,
    NOTIFICATION_TYPES,
    NotificationResponseType,
    NotificationType
} from "@/types/notifications";
import NotificationsBlock from "@/components/HeaderNotifications/NotificationsBlock";
import useNotifications from "@/context/notificationContext";
import useTenant from "@/context/tenantContext";
import styles from "./styles.module.scss";

const removeEmptyBrackets = (notificationsArray: NotificationType[]) => {
    return notificationsArray.map(item => {
        return { ...item, message: item.message.replaceAll('()', '').replaceAll('( )', '') }
    })
}

const HeaderNotifications: React.FC = () => {
    const { tenantData: { alias } } = useTenant();
    const { token, superUser, ui } = useAuth();
    const { notifications, setNotifications, newNotifications, setNewNotifications, refreshTrigger } = useNotifications();

    const [isNotificationsListOpen, setIsNotificationsListOpen] = useState(false);
    const [needAnimation, setNeedAnimation] = useState(false);

    const notificationsListRef = useRef<HTMLDivElement>(null);

    const checkNotifications = async () => {
        if (token) {
            const requestData = { token, alias };
            try {
                const res = await checkNewNotifications(superUser && ui ? {
                    ...requestData,
                    ui
                } : requestData);

                if (res?.data?.newNotifications > 0 || notifications === null) {
                    fetchNotificationsData();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    const fetchNotificationsData = async () => {
        try {
            const requestData = { token, alias };
            const res = await getNotifications(superUser && ui ? { ...requestData, ui } : requestData);
            if (res && res.data) {
                const notificationsData = res.data as NotificationResponseType;
                if (notificationsData.notifications && Array.isArray(notificationsData.notifications)) {
                    // Mark any unread DoNotShow notifications as read upon receiving
                    const unreadDoNotShow = notificationsData.notifications.filter(
                        item => item.type === NOTIFICATION_TYPES.DO_NOT_SHOW && item.status !== NOTIFICATION_STATUSES.READ
                    );
                    unreadDoNotShow.forEach(item => {
                        markNotificationAsRead(token, alias, item.uuid);
                    });

                    // Hide DoNotShow notifications from everywhere
                    const visibleNotifications = notificationsData.notifications.filter(
                        item => item.type !== NOTIFICATION_TYPES.DO_NOT_SHOW
                    );
                    setNotifications(removeEmptyBrackets(visibleNotifications));

                    const rawNewAmount = (notificationsData.notificationsStatuses?.[NOTIFICATION_STATUSES.NEW] || 0) + (notificationsData.notificationsStatuses?.[NOTIFICATION_STATUSES.UNREAD] || 0);
                    const newNotificationsAmount = Math.max(0, rawNewAmount - unreadDoNotShow.length);
                    setNewNotifications(newNotificationsAmount);

                    if (newNotificationsAmount > 0) {
                        setNeedAnimation(true);
                    }
                }
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (!notifications) {
            checkNotifications();
        }

        // Set up interval to call fetchData every 120 seconds
        const fetchDataInterval = setInterval(() => checkNotifications(), 120000);

        // Clean up function to clear interval when component unmounts
        return () => {
            clearInterval(fetchDataInterval);
        };
    }, [notifications]);

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchNotificationsData();
        }
    }, [refreshTrigger]);

    // useEffect(() => {
    //     //setNotifications(null);
    //     console.log('token change in notifications', token)
    // }, [token]);

    const handleClick = () => {
        setIsNotificationsListOpen(prevState => !prevState);
        setNeedAnimation(false);
    }

    return (
        <div className={`${styles['header-notifications'] || 'header-notifications'} header-notifications`} ref={notificationsListRef}>
            <button
                className={`${styles['header-notifications__wrapper'] || 'header-notifications__wrapper'} header-notifications__wrapper ${notifications && newNotifications ? `${styles['has-notifications'] || 'has-notifications'} has-notifications` : ''}  ${needAnimation ? ` ${styles['animated'] || 'animated'} animated` : ''}`}
                onClick={handleClick}
            >
                <Icon name='notification' />
                {notifications && newNotifications > 0 ? (
                    <div className={`${styles['notifications-amount'] || 'notifications-amount'} notifications-amount`}>{newNotifications > 99 ? '99' : newNotifications}</div>
                ) : null}
            </button>
            {notifications ? <NotificationsBlock notificationsList={notifications || []} isNotificationsBlockOpen={isNotificationsListOpen} onClose={() => setIsNotificationsListOpen(false)} /> : null}
        </div>
    );
};

export default HeaderNotifications;

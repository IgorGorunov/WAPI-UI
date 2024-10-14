import React, {useEffect, useRef, useState} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import useAuth from "@/context/authContext";
import {ApiResponseType} from "@/types/api";
import {checkNewNotifications, getNotifications} from "@/services/notifications";
import {NOTIFICATION_STATUSES, NotificationResponseType, NotificationType} from "@/types/notifications";
import NotificationsBlock from "@/components/HeaderNotifications/NotificationsBlock";
import useNotifications from "@/context/notificationContext";

const removeEmptyBrackets = (notificationsArray: NotificationType[]) => {
    return notificationsArray.map(item => {
        return {...item, message: item.message.replaceAll('()', '').replaceAll('( )', '')}
    })
}

const HeaderNotifications: React.FC = () => {
    const { token, superUser, ui } = useAuth();
    const { notifications, setNotifications, newNotifications, setNewNotifications} = useNotifications();

    const [isNotificationsListOpen, setIsNotificationsListOpen] = useState(false);
    const [needAnimation, setNeedAnimation] = useState(false);

    const notificationsListRef = useRef<HTMLDivElement>(null);

    const checkNotifications = async() => {
        if (token) {
            const requestData = {token};
            const res: ApiResponseType = await checkNewNotifications(superUser && ui ? {
                ...requestData,
                ui
            } : requestData);

            if (res?.data?.newNotifications > 0 || notifications === null) {
                fetchNotificationsData();
            }
        }
    };

    const fetchNotificationsData = async() => {
        try {
            const requestData = {token};
            const res: ApiResponseType = await getNotifications(superUser && ui ? {...requestData, ui} : requestData);
            if (res && res.data) {
                const notificationsData = res.data as NotificationResponseType;
                if (notificationsData.notifications && Array.isArray(notificationsData.notifications)) {
                    setNotifications(removeEmptyBrackets(notificationsData.notifications));
                    setNeedAnimation(true);
                    const newNotificationsAmount = notificationsData.notificationsStatuses[NOTIFICATION_STATUSES.NEW]+notificationsData.notificationsStatuses[NOTIFICATION_STATUSES.UNREAD];
                    setNewNotifications(newNotificationsAmount);
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
        const fetchDataInterval = setInterval(()=>checkNotifications(), 120000);

        // Clean up function to clear interval when component unmounts
        return () => {
            clearInterval(fetchDataInterval);
        };
    }, [notifications]);

    // useEffect(() => {
    //     //setNotifications(null);
    //     console.log('token change in notifications', token)
    // }, [token]);

    const handleClick = () => {
        setIsNotificationsListOpen(prevState => !prevState);
        setNeedAnimation(false);
    }

    return (
        <div className={`header-notifications`} ref={ notificationsListRef }>
            <button
                className={`header-notifications__wrapper ${notifications && newNotifications ? 'has-notifications' : ''}  ${needAnimation ? ' animated' : ''}`}
                onClick={handleClick}
            >
                <Icon name='notification' />
                {notifications && newNotifications > 0 ? (
                    <div className='notifications-amount'>{newNotifications > 99 ? '99' : newNotifications}</div>
                ): null}
            </button>
            {notifications ? <NotificationsBlock  notificationsList={notifications || []} isNotificationsBlockOpen={isNotificationsListOpen} onClose={()=>setIsNotificationsListOpen(false)} /> : null}
        </div>
    );
};

export default HeaderNotifications;

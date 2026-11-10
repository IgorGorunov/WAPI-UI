import useNotifications from "@/context/notificationContext";
import {markNotificationAsRead, setNotificationStatusFn} from "@/utils/notifications";
import useAuth from "@/context/authContext";
import {NOTIFICATION_STATUSES, NOTIFICATION_TYPES, NotificationType} from "@/types/notifications";
import useTenant from "@/context/tenantContext";

export const useMarkNotificationAsRead = () => {
    const {notifications, setNotifications, setNewNotifications} = useNotifications();
    const { tenantData } = useTenant();
    const alias = tenantData?.alias || '';
    const {token} = useAuth();

    const setNotificationAsRead = (uuid: string) => {
        if (!uuid) {
            //set all non-mandatory notifications status as read
            const hasMandatory = notifications?.some(item => item.type === NOTIFICATION_TYPES.STOCK_MOVEMENTS_COST_APPROVAL);
            if (hasMandatory) {
                const nonMandatoryUnread = notifications?.filter(item => item.type !== NOTIFICATION_TYPES.STOCK_MOVEMENTS_COST_APPROVAL && item.type !== NOTIFICATION_TYPES.DO_NOT_SHOW && item.status !== NOTIFICATION_STATUSES.READ) || [];
                nonMandatoryUnread.forEach(item => {
                    markNotificationAsRead(token, alias, item.uuid);
                });
            } else {
                markNotificationAsRead(token, alias, '');
            }

            setNotifications((prevState: NotificationType[]) => {
                return prevState ? prevState.map(item =>
                    item.type === NOTIFICATION_TYPES.STOCK_MOVEMENTS_COST_APPROVAL
                        ? item
                        : { ...item, status: NOTIFICATION_STATUSES.READ }
                ) : [];
            });

            // setNewNotifications(() => {
            //     const unreadMandatory = notifications
            //         ? notifications.filter(item => item.type === NOTIFICATION_TYPES.STOCK_MOVEMENTS_COST_APPROVAL && item.status !== NOTIFICATION_STATUSES.READ).length
            //         : 0;
            //     return unreadMandatory;
            // });

        } else {
            markNotificationAsRead(token, alias, uuid);

            //set one notification status
            setNotifications((prevState: NotificationType[]) => {
                const newStatusNotification = prevState ? prevState.filter(item => item.uuid === uuid && item.status !== NOTIFICATION_STATUSES.READ) : [];
                if (newStatusNotification.length) {
                    return [...(prevState || []).filter(item => item.uuid!==uuid), {...newStatusNotification[0], status: NOTIFICATION_STATUSES.READ}].sort((a,b)=>(a.period < b.period ? 1 : -1));
                }
                return prevState;
            });

            setNewNotifications(prevState => prevState>0 ? prevState-1 : prevState);
        }
    }

    const setNotificationAsUnread = (uuid: string) => {
        setNotificationStatusFn(token, alias, uuid, NOTIFICATION_STATUSES.UNREAD);

        setNotifications((prevState: NotificationType[]) => {
            const newStatusNotification = prevState ? prevState.filter(item => item.uuid === uuid && item.status === NOTIFICATION_STATUSES.READ) : [];
            if (newStatusNotification.length) {
                return [...(prevState || []).filter(item => item.uuid!==uuid), {...newStatusNotification[0], status: NOTIFICATION_STATUSES.UNREAD}].sort((a,b)=>(a.period < b.period ? 1 : -1));
            }
            return prevState;
        });

        setNewNotifications(prevState => prevState>=0 ? prevState+1 : prevState);
    }

    const setDocNotificationsAsRead = (docUuid: string) => {
        const docNotifications = notifications ? notifications.filter(item => item.objectUuid===docUuid && item.status !== NOTIFICATION_STATUSES.READ && item.type !== NOTIFICATION_TYPES.STOCK_MOVEMENTS_COST_APPROVAL && item.type !== NOTIFICATION_TYPES.DO_NOT_SHOW) :[];

        docNotifications.forEach(notification => {
            setNotificationAsRead(notification.uuid)
        })
    }

    const setDocMandatoryNotificationsAsRead = (docUuid: string) => {
        const docNotifications = notifications ? notifications.filter(item => item.objectUuid === docUuid && item.status !== NOTIFICATION_STATUSES.READ && item.type === NOTIFICATION_TYPES.STOCK_MOVEMENTS_COST_APPROVAL) : [];

        docNotifications.forEach(notification => {
            setNotificationAsRead(notification.uuid);
        });
    }

    return {setNotificationAsRead, setDocNotificationsAsRead, setDocMandatoryNotificationsAsRead, setNotificationAsUnread};
}
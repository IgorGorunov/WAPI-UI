import useNotifications from "@/context/notificationContext";
import {markNotificationAsRead, setNotificationStatusFn} from "@/utils/notifications";
import useAuth from "@/context/authContext";
import {NOTIFICATION_STATUSES, NotificationType} from "@/types/notifications";

export const useMarkNotificationAsRead = () => {
    const {notifications, setNotifications, setNewNotifications} = useNotifications();
    const {token} = useAuth();

    const setNotificationAsRead = (uuid: string) => {
        markNotificationAsRead(token, uuid);

        if (!uuid) {
            //set all notifications status as read
            setNotifications((prevState: NotificationType[]) => {
                return [...prevState.map(item => ({...item, status: NOTIFICATION_STATUSES.READ}))];
            });

            setNewNotifications(0);

        } else {
            //set one notification status
            setNotifications((prevState: NotificationType[]) => {
                const newStatusNotification = prevState.filter(item => item.uuid === uuid && item.status !== NOTIFICATION_STATUSES.READ);
                if (newStatusNotification.length) {
                    return [...prevState.filter(item => item.uuid!==uuid), {...newStatusNotification[0], status: NOTIFICATION_STATUSES.READ}].sort((a,b)=>(a.period < b.period ? 1 : -1));
                }
                return prevState;
            });

            setNewNotifications(prevState => prevState>0 ? prevState-1 : prevState);
        }


    }

    const setNotificationAsUnread = (uuid: string) => {
        setNotificationStatusFn(token, uuid, NOTIFICATION_STATUSES.UNREAD);

        setNotifications((prevState: NotificationType[]) => {
            const newStatusNotification = prevState.filter(item => item.uuid === uuid && item.status === NOTIFICATION_STATUSES.READ);
            if (newStatusNotification.length) {
                return [...prevState.filter(item => item.uuid!==uuid), {...newStatusNotification[0], status: NOTIFICATION_STATUSES.UNREAD}].sort((a,b)=>(a.period < b.period ? 1 : -1));
            }
            return prevState;
        });

        setNewNotifications(prevState => prevState>=0 ? prevState+1 : prevState);
    }

    const setDocNotificationsAsRead = (docUuid: string) => {
        const docNotifications = notifications ? notifications.filter(item => item.objectUuid===docUuid && item.status !== NOTIFICATION_STATUSES.READ) :[];

        docNotifications.forEach(notification => {
            setNotificationAsRead(notification.uuid)
        })
    }



    return {setNotificationAsRead, setDocNotificationsAsRead, setNotificationAsUnread};
}
import React, {
    createContext,
    PropsWithChildren,
    useContext, useState,
} from "react";
import {NotificationType} from "@/types/notifications";

type notificationsContextType = {
    notifications: NotificationType[];
    setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
    newNotifications: number;
    setNewNotifications: React.Dispatch<React.SetStateAction<number>>;

};

const NotificationsContext = createContext<notificationsContextType>({} as notificationsContextType);

const useNotifications = (): notificationsContextType => {
    return useContext(NotificationsContext);
};

export const NotificationsProvider = (props: PropsWithChildren) => {
    const [notifications, setNotifications] = useState<NotificationType[] | null>(null);
    const [newNotifications, setNewNotifications] = useState(0);

    return (
        <NotificationsContext.Provider value={{
            notifications,
            setNotifications,
            newNotifications,
            setNewNotifications,
        }}>
            {props.children}
        </NotificationsContext.Provider>
    );
};

export default useNotifications;

import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext, useState,
} from "react";
import {NotificationType} from "@/types/notifications";

type notificationsContextType = {
    notifications: NotificationType[];
    setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
    newNotifications: number;
    setNewNotifications: React.Dispatch<React.SetStateAction<number>>;
    refreshNotifications: () => void;
    refreshTrigger: number;
};

const NotificationsContext = createContext<notificationsContextType>({} as notificationsContextType);

const useNotifications = (): notificationsContextType => {
    return useContext(NotificationsContext);
};

export const NotificationsProvider = (props: PropsWithChildren) => {
    const [notifications, setNotifications] = useState<NotificationType[] | null>(null);
    const [newNotifications, setNewNotifications] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshNotifications = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    return (
        <NotificationsContext.Provider value={{
            notifications,
            setNotifications,
            newNotifications,
            setNewNotifications,
            refreshNotifications,
            refreshTrigger,
        }}>
            {props.children}
        </NotificationsContext.Provider>
    );
};

export default useNotifications;

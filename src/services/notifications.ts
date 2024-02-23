import {AuthApiResponseType} from "@/types/api";
import {api} from "@/services/api";
import {NOTIFICATION_STATUSES} from "@/types/notifications";

const getNotifications = async (data: {
    token: string;
    limit?: number;
}) => {
    try {
        const response: AuthApiResponseType = await api.post(`/GetNotifications`,
            data
        );
        return response;
    } catch (err) {
        return err;
    }
}

const setNotificationStatus = async (data: {
    token: string;
    uuid: string;
    status: NOTIFICATION_STATUSES;
}) => {
    try {
        const response: AuthApiResponseType = await api.post(`/SetNotificationStatus`,
            data
        );
        return response;
    } catch (err) {
        return err;
    }
}

const checkNewNotifications = async (data: {
    token: string;
}) => {
    try {
        const response: AuthApiResponseType = await api.post(`/CheckNewNotifications`,
            data
        );
        return response;
    } catch (err) {
        return err;
    }
}

export {getNotifications, setNotificationStatus, checkNewNotifications};
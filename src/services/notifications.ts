import {NOTIFICATION_STATUSES} from "@/types/notifications";
import {api, noErrorApi} from "@/services/api";


const getNotifications = async (data: {
    token: string;
    limit?: number;
}) => {
    try {
        const response: any = await api.post(
            `/GetNotifications`,
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
        const response: any = await api.post(
            `/SetNotificationStatus`,
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
        const response: any = await noErrorApi.post(
            `/CheckNewNotifications`,
            data
        );
        return response;
    } catch (err) {
        return err;
    }
}

export {getNotifications, setNotificationStatus, checkNewNotifications};
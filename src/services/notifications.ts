import type {
    NewNotificationsCountType,
    NOTIFICATION_STATUSES,
    NotificationResponseType,
} from "@/types/notifications";
import {api, noErrorApi} from "@/services/api";
import type {ApiResponseType} from "@/types/api";


const getNotifications = async (data: {
    token: string;
    alias: string;
    limit?: number;
    ui?: string;
}): Promise<ApiResponseType<NotificationResponseType>> => {
    return api.post(`/GetNotifications`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetNotifications`,
    //         data
    //     );
    //     return response;
    // } catch (err) {
    //     return err;
    // }
}

const setNotificationStatus = async (data: {
    token: string;
    alias: string;
    uuid: string;
    status: NOTIFICATION_STATUSES;
    ui?: string;
}): Promise<ApiResponseType<unknown>> => {
    return api.post(`/SetNotificationStatus`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/SetNotificationStatus`,
    //         data
    //     );
    //     return response;
    // } catch (err) {
    //     return err;
    // }
}

const checkNewNotifications = async (data: {
    token: string;
    alias: string;
    ui?: string;
}): Promise<ApiResponseType<NewNotificationsCountType>> => {
    return noErrorApi.post(`/CheckNewNotifications`, data);
    // try {
    //     const response: unknown = await noErrorApi.post(
    //         `/CheckNewNotifications`,
    //         data
    //     );
    //     return response;
    // } catch (err) {
    //     return err;
    // }
}

export {getNotifications, setNotificationStatus, checkNewNotifications};
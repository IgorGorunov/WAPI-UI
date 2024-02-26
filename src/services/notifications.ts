// import {AuthApiResponseType} from "@/types/api";
// import {api} from "@/services/api";
import {NOTIFICATION_STATUSES} from "@/types/notifications";
import axios from "axios";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";


const getNotifications = async (data: {
    token: string;
    limit?: number;
}) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetNotifications`,
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
        const response: any = await axios.post(
            `${API_ENDPOINT}/SetNotificationStatus`,
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
        const response: any = await axios.post(
            `${API_ENDPOINT}/CheckNewNotifications`,
            data
        );
        return response;
    } catch (err) {
        return err;
    }
}

export {getNotifications, setNotificationStatus, checkNewNotifications};
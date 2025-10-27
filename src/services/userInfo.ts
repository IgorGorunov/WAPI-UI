import axios from 'axios';
import {api} from "@/services/api";

// const LOGGING_URL = 'https://api.wapi.com/UILOG/hs/v1/UI/WriteLog';
const LOGGING_URL = 'https://api.wapi.com/UILOG/hs/v1/UI/WriteLog'

export type LocationType = {
    latitude: number;
    longitude: number;
};

// Function to get the user's IP address
export async function getUserIP(): Promise<string> {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        //throw new Error('Unable to fetch IP address');
        return '';
    }

}


export function getUserLanguage(): string {
    return navigator.language || navigator.languages[0] || 'en';
}

export function getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}


export type SendUserBrowserInfoType = {
    headers: any;
    body: any;
    action: string;
    clientName: string;
    email: string;
    token: string;
    forbidden: boolean;
    superUserName: string;
}

export async function sendUserBrowserInfo(dataToSend: SendUserBrowserInfoType): Promise<void> {
    try {
        const response = await axios.post(LOGGING_URL, dataToSend, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            //console.log('User info sent successfully');
        } else {
            //console.error('Failed to send user info:', response.statusText);
        }
    } catch (error) {
        //console.error('Error sending data to backend:', error);
    }
}

export const getUserProfile = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetUserProfile`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// // Call the function to gather and send user info
// sendUserInfoToBackend();
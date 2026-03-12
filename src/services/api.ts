import axios, { type AxiosError } from "axios";
import { type BackendError } from "@/types/api";

const API_URL = "https://api.wapi.com/WAPI/hs/v1/UI";
// const API_URL = "https://api2.wapi.com/DB3/hs/v1/UI";

let setError: (title: string, messages: string[]) => void;

export const setInterceptorErrorCallback = (callback: (title: string, messages: string[]) => void) => {
    setError = callback;
};

let redirectToLogin: () => void;
export const setInterceptorRedirectCallback = (callback: () => void) => { redirectToLogin = callback; }

const maintenanceErrorText = 'We are sorry for inconvenience. Maintenance is currently underway. Please, try a bit later. If in 10 minutes this problem is still present, please check your internet connection!';
const administratorErrorText = 'Something went wrong. We are already fixing this. Please contact support manager.';
const forbiddenErrorText = "You have limited access to this action";

const handleGlobalError = (error: AxiosError<BackendError>) => {
    let errorMessage = '';
    let errorTitle = '';

    console.log('error 123: ', error, error.response.data)

    // Logic for Timeouts
    if (error.code === "ECONNABORTED") {
        errorTitle = 'Maintenance';
        errorMessage = maintenanceErrorText;
    }
    // Logic for Response Errors (4xx, 5xx)
    else if (error.response) {
        const errorStatus = error.response.status;
        const errorData = error.response.data;

        if (errorStatus === 401) {
            redirectToLogin?.();
            return Promise.reject(error);
        }

        if (errorStatus === 403) {
            errorTitle = 'Error';
            errorMessage = forbiddenErrorText;
        } else if (errorStatus === 404) {
            // Let calling components handle 404 with their own inline error message
            return Promise.reject(error);
        } else if (errorStatus === 500) {
            // Check if backend provided a specific message
            const hasDetail = errorData?.message || errorData?.errorMessage;
            if (hasDetail) {
                errorTitle = 'Error';
                errorMessage = administratorErrorText;
            } else {
                errorTitle = 'Maintenance';
                errorMessage = maintenanceErrorText;
            }
        } else {
            // For errorMessage, let the calling component handle the display
            if (errorData?.errorMessage) {
                return Promise.resolve(error);
            }
            errorTitle = 'Error';
            errorMessage = administratorErrorText;
        }
    }

    // Trigger your UI callback
    if (errorMessage && setError) {
        setError(errorTitle, [errorMessage]);
    }

    // IMPORTANT: Always reject so the service/component knows it failed
    return Promise.reject(error);
};

const loginApi = axios.create(
    {
        baseURL: API_URL,
        timeout: 200000,
        headers: {
            "content-type": "application/json",
            // "IBSession": "start",
        },
    }
);

loginApi.interceptors.response.use(
    response => response,
    error => handleGlobalError(error)
);

const api = axios.create(
    {
        baseURL: API_URL,
        timeout: 10000000,
        headers: {
            //'Accept-Encoding': 'gzip',
            "content-type": "application/json",
        },
    }
);

api.interceptors.response.use(
    response => response,
    error => handleGlobalError(error)
);

const noErrorApi = axios.create(
    {
        baseURL: API_URL,
        timeout: 10000,
        headers: {
            "content-type": "application/json",
        },
    }
);

noErrorApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            redirectToLogin();
        }
        return Promise.reject(error);
    }
);



export { loginApi, api, noErrorApi };

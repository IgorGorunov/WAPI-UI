import axios from "axios";


//const API_URL = "https://api2.wapi.com/DB1/hs/v1/UI"; //"https://api.wapi.com/WAPI/hs/v1/UI";
// const API_URL = "https://api.wapi.com/WAPI/hs/v1/UI";
const API_URL = "https://api2.wapi.com/DB3/hs/v1/UI";
//const API_URL = "https://first.wapi.com:4443/DB1/hs/UI/ROOT/";

let setError: (title:string, message: string) => void;

export const setInterceptorErrorCallback = (callback: (title: string, message: string) => void) => {
    setError = callback;
};

let redirectToLogin: () => void;
export const setInterceptorRedirectCallback = (callback:()=>void)=> {redirectToLogin = callback;}

const maintenanceErrorText = 'We are sorry for inconvenience. Maintenance is currently underway. Please, try a bit later.';
const administratorErrorText = 'Something went wrong. We are already fixing this. Please contact Wapi IT department.';
const forbiddenErrorText = "You have limited access to this action";

const loginApi = axios.create(
    {
        baseURL: API_URL,
        timeout: 20000,
        headers: {
            "content-type": "application/json",
            // "IBSession": "start",
        },
    }
);

loginApi.interceptors.response.use(response=> {
    if (response.status === 200) {
        return  response;
    }
    return  response;
}, function (error) {

    let errorMessage = '';
    let errorTitle = '';

    if (error.code === "ECONNABORTED") {
        // Request timed out
        errorTitle = 'Maintenance';
        errorMessage = maintenanceErrorText
    } else {
        const errorStatus = error.response.status;

        if (errorStatus === 401) {
            //const errorMessage = error.response.data.message || error.response.data.errorMessage || 'Wrong login or password';
        } else if (errorStatus === 500) {
            const errorResponseMessage = error.response.data.message || error.response.data.errorMessage || 'Something went wrong. Please, contact administrator.';

            if (errorResponseMessage) {
                errorTitle = 'Error';
                errorMessage = administratorErrorText;
            } else {
                errorTitle = 'Maintenance';
                errorMessage = maintenanceErrorText;
            }
        }
    }
    setError(errorTitle, errorMessage);

    return Promise.reject(error);
});

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

api.interceptors.response.use(response=> {

    if (response.status === 200) {
        return  response;
    }
    return  response;
}, error => {

    let errorMessage = '';
    let errorTitle = '';


    if (error.code === "ERR_BAD_RESPONSE" || error.code === "ERR_BAD_REQUEST") {
        const errorStatus = error.response.status;
        if (errorStatus === 400 && error?.response?.data?.errorMessage) {
            return Promise.reject(error);
        }

        if (errorStatus === 401) {
            redirectToLogin();
        } else if (errorStatus === 403) {
            errorTitle = 'Error';
            errorMessage = forbiddenErrorText;
        } else if (errorStatus === 500) {
            const errorResponseMessage = error.response.data.message || error.response.data.errorMessage || 'Something went wrong. Please, contact administrator.';

            if (errorResponseMessage) {
                errorTitle = 'Error';
                errorMessage = administratorErrorText
            } else {
                errorTitle = 'Maintenance';
                errorMessage = maintenanceErrorText
            }
        } else {
            errorTitle = 'Error';
            errorMessage = administratorErrorText;
        }

        setError(errorTitle, errorMessage);
        return Promise.reject(error);
    }

    if (error.code === "ECONNABORTED") {
        // Request timed out
        errorTitle = 'Maintenance';
        errorMessage = maintenanceErrorText;
    }

    setError(errorTitle, errorMessage);
    return Promise.reject(error);
});


const noErrorApi = axios.create(
    {
        baseURL: API_URL,
        timeout: 10000,
        headers: {
            "content-type": "application/json",
        },
    }
);

noErrorApi.interceptors.response.use(response=> {
    if (response.status === 200) {
        return  response;
    }
    return  response;
}, error => {

    if (error.code === "ECONNABORTED") {
        // Request timed out
        // show no errors
    } else {
        const errorStatus = error.response.status;

        if (errorStatus === 401) {
            redirectToLogin();
        }
    }
    return Promise.reject(error);
});



export {loginApi, api, noErrorApi};

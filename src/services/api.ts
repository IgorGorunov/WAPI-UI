import axios from "axios";


const API_URL = "https://api.wapi.com/WAPI/hs/v1/UI"; //"https://api.wapi.com/DB1/hs/v1/UI"; //"https://api.wapi.com/WAPI/hs/v1/UI";

let setError: (title:string, message: string) => void;

export const setInterceptorErrorCallback = (callback: (title: string, message: string) => void) => {
    setError = callback;
};

let redirectToLogin: () => void;
export const setInterceptorRedirectCallback = (callback:()=>void)=> {redirectToLogin = callback;}

const maintenanceErrorText = 'We are sorry for inconvenience. Maintenance is currently underway. Please, try a bit later.';
const administratorErrorText = 'Something went wrong. We are already fixing this. Please contact Wapi IT department.';

const loginApi = axios.create(
    {
        baseURL: API_URL,
        timeout: 2000,
        headers: {
            "content-type": "application/json",
        },
    }
);

loginApi.interceptors.response.use(response=> {
    if (response.status === 200) {
        return  response;
    } else if (response.status === 401) {
        console.log('Unauthorized!');
    }
    return  response;
}, function (error) {
    console.log('get error', error);

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

const verifyTokenApi = axios.create(
    {
        baseURL: API_URL,
        timeout: 2000,
        headers: {
            "content-type": "application/json",
        },
    }
);

verifyTokenApi.interceptors.response.use(response=> {
    if (response.status === 200) {
        return  response;
    } else if (response.status === 401) {
        console.log('Unauthorized!');
    }
    return  response;
}, function (error) {
    console.log('get error 123', error);

    let errorMessage = '';
    let errorTitle = '';

    if (error.code === "ERR_BAD_RESPONSE") {
        const errorStatus = error.response.status;

        if (errorStatus === 401) {
            redirectToLogin();
            //const errorMessage = error.response.data.message || error.response.data.errorMessage || 'Wrong login or password';
        } else if (errorStatus === 500) {
            const errorResponseMessage = error.response.data.message || error.response.data.errorMessage || 'Something went wrong. Please, contact administrator.';

            if (errorResponseMessage) {
                errorTitle = 'Error';
                errorMessage = administratorErrorText
            } else {
                errorTitle = 'Maintenance';
                errorMessage = maintenanceErrorText;
            }
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

const api = axios.create(
    {
        baseURL: API_URL,
        timeout: 300000,
        headers: {
            "content-type": "application/json",
        },
    }
);

api.interceptors.response.use(response=> {
    if (response.status === 200) {
        return  response;
    } else if (response.status === 401) {
        console.log('Unauthorized!');
    }
    return  response;
}, error => {
    console.log('get error 123', error, error.code);
    //const router = useRouter();

    let errorMessage = '';
    let errorTitle = '';

    if (error.code === "ERR_BAD_RESPONSE") {
        const errorStatus = error.response.status;

        if (errorStatus === 401) {
            redirectToLogin();
            //const errorMessage = error.response.data.message || error.response.data.errorMessage || 'Wrong login or password';
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
    } else if (response.status === 401) {
        console.log('Unauthorized!');
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



export {loginApi, verifyTokenApi, api, noErrorApi};

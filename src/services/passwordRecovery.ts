import {loginApi} from "@/services/api";
import type {ApiResponseType} from "@/types/api";

export const passwordRecoveryRequest = async (
    data: {
        // tokenUI: string;
        alias: string;
        login: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return loginApi.post('/PasswordRecoveryRequest', {...data, tokenUI: process.env.NEXT_PUBLIC_PASSWORD_RECOVERY_TOKEN_UI || ''});
};


export const passwordRecoveryVerify = async (
    data: {
        // tokenUI: string;
        alias: string;
        login: string;
        token: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return loginApi.post('/PasswordRecoveryVerify', {...data, tokenUI: process.env.NEXT_PUBLIC_PASSWORD_RECOVERY_TOKEN_UI || ''});
};


export const passwordRecoveryReset = async (
    data: {
        // tokenUI: string;
        alias: string;
        login: string;
        token: string;
        psw: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return loginApi.post('/PasswordRecoveryReset', {...data, tokenUI: process.env.NEXT_PUBLIC_PASSWORD_RECOVERY_TOKEN_UI || ''});
};


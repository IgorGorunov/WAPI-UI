import type { UserStatusType } from "@/types/leads";
import type { NavAccessItemType, USER_TYPES, UserAccessActionType } from "@/context/authContext";
import type { SellerType } from "@/types/utility";

export type ApiResponseType<T> = {
    data?: T;
    status?: number;
    ok?: boolean;
    response?: {
        data?: {
            errorMessage: string[];
            data?: T;
        }
        status?: number;
    }
};

export type BackendError = {
    message?: string;
    errorMessage?: string | string[];
    code?: string;
}

export type LoginResponseDataType = {
    accessToken: string;
    userPresentation: string;
    currentDate: string;
    traningStatus: string[];
    userStatus: UserStatusType;
    textInfo: string;
    access: NavAccessItemType[];
    userProfile: {
        userInfo: {
            userLogin: string;
            client: string;
            userName: string;
            testMode: boolean;
        }
    };
    superUser: boolean;
    actionAccessSettings: UserAccessActionType[];
    whiteLabelUserType: USER_TYPES;
    seilers: SellerType[];
}

export type AuthApiResponseType = ApiResponseType<LoginResponseDataType>;
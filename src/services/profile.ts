import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";
import type {AttachedFilesType} from "@/types/utility";
import type {ApiProtocolType, UserContractType, UserPriceType, WarehouseInfoType} from "@/types/profile";

export const getApiProtocols = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ApiProtocolType[]>> => {
    return api.post('/GetDeliveryProtocols', data);
};

export const getApiProtocol = async (
    data: {
        uuid: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<AttachedFilesType[]>> => {
    return api.post('/GetDeliveryProtocolFile', data);
};

export const changePassword = async (
    data: {
        token: string;
        alias: string;
        currentPassword: string;
        newPassword: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post('/ChangePassword', data);
}

export const getUserPrices = async (
    data: {
        token: string,
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<UserPriceType[]>> => {
    return api.post(`/GetClientPriceList`, data);
};

export const getUserPriceFile = async (
    data: {
        token: string,
        alias: string;
        ui?: string;
        uuid: string,
    }
): Promise<ApiResponseType<AttachedFilesType[]>> => {
    return api.post(`/GetClientPrice`, data);
};

export const getUserContracts = async (
    data: {
        token: string,
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<UserContractType[]>> => {
    return api.post(`/GetContractsList`, data);
};

export const getUserContractFile = async (

    data: {
        token: string,
        alias: string;
        ui?: string;
        uuid: string,
    }
): Promise<ApiResponseType<AttachedFilesType[]>> => {
    return api.post(`/GetFileByUUID`, data);
};

export const getWarehouseInfo = async (
    data: {
        token: string,
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<WarehouseInfoType[]>> => {
    return api.post(`/GetWarehouseInfo`, data);
};
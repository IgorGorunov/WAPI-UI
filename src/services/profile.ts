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
    // try {
    //     const response: unknown = await api.post(
    //         `/GetDeliveryProtocols`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export const getApiProtocol = async (
    data: {
        uuid: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<AttachedFilesType[]>> => {
    return api.post('/GetDeliveryProtocolFile', data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetDeliveryProtocolFile`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
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
    return api.post('/ChangePassword', data)
    // try {
    //     const response: unknown = await api.post(
    //         `/ChangePassword`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
}

export const getUserPrices = async (
    data: {
        token: string,
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<UserPriceType[]>> => {
    return api.post(`/GetClientPriceList`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `GetClientPriceList`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export const getUserPriceFile = async (
    data: {
        token: string,
        alias: string;
        ui?: string;
        uuid: string,
    }
): Promise<ApiResponseType<AttachedFilesType[]>> => {
    return api.post(`/GetFileByUUID`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetClientPrice`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export const getUserContracts = async (
    data: {
        token: string,
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<UserContractType[]>> => {
    return api.post(`/GetContractsList`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetContractsList`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
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
    // try {
    //     const response: unknown = await api.post(
    //         `/GetFileByUUID`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export const getWarehouseInfo = async (
    data: {
        token: string,
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<WarehouseInfoType[]>> => {
    return api.post(`/GetWarehouseInfo`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetWarehouseInfo`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};
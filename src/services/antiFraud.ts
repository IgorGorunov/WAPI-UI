import type {ApiResponseType} from "@/types/api";
import {api} from "@/services/api";
import {
    AntiFraudSettingsFormType,
    AntiFraudSettingsListType
} from "@/screens/AntiFraudSettingsPage/types";


export const getAntiFraudSettingsList = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<AntiFraudSettingsListType>> => {
    return api.post(`/GetAntiFraudSettingsList`, data);
};

export const saveAntiFraudSettings = async (data: {
    token: string;
    alias: string;
    ui?: string;
    settings: AntiFraudSettingsFormType;
}): Promise<ApiResponseType<boolean>> => {
    const payload = {
        token: data.token,
        alias: data.alias,
        ui: data.ui,
        ...data.settings
    };
    return api.post(`/CreateUpdateAntiFraudSettings`, payload);
};

export const getAntiFraudResultList = async (data: {
    token: string;
    alias: string;
    ui?: string;
    startDate: string;
    endDate: string;
}): Promise<ApiResponseType<{ data: string }>> => {
    return api.post(`/GetAntiFraudResultsList`, data);
};

export const getAntiFraudResultDetails = async (data: {
    token: string;
    alias: string;
    ui?: string;
    uuid: string;
}): Promise<ApiResponseType<{ data: string }>> => {
    return api.post(`/GetAntiFraudResult`, data);
};

export const getAntiFraudResultByPhoneNumber = async (data: {
    token: string;
    alias: string;
    ui?: string;
    phoneNumber: string;
}): Promise<ApiResponseType<{ data: string }>> => {
    return api.post(`/GetAntiFraudResultByPhoneNumber`, data);
};
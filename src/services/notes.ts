import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";

export const getNotes = async (
    data: {
        token: string;
        alias: string;
        uuid: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/GetNotes`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetNotes`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export const sendNote = async (
    data: {
        token: string;
        alias: string;
        uuid: string;
        //period: string;
        note: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CreateNote`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/CreateNote`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};
import type { AttachedFilesType } from "@/types/utility";
import { api } from "@/services/api";
import {type ApiResponseType} from "@/types/api";


// const getDashboardData = async (
//     data: DashboardRequestParams
// ): Promise<ApiResponseType<DashboardDataType[]>> => {
//     return api.post<DashboardDataType[]>(`/GetDashboardData`, data);
//

export type SyncAttachedFileAction = 'new' | 'update' | 'delete';

export type SyncAttachedFileItemType = {
    action: SyncAttachedFileAction;
    id: string;
    name: string;
    dueDate: string;
    country: string;
    data: string;
};

export const sendDocumentFiles = async (
    data: {
        attachedFiles: AttachedFilesType[],
        token: string;
        alias: string;
        uuid: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/PutAttachedFiles`, data);
};

export const syncAttachedFiles = async (
    data: {
        attachedFiles: SyncAttachedFileItemType[];
        token: string;
        alias?: string;
        uuid: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/SyncAttachedFiles`, data);
};
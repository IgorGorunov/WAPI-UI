import type { AttachedFilesType } from "@/types/utility";
import { api } from "@/services/api";
import {type ApiResponseType} from "@/types/api";


// const getDashboardData = async (
//     data: DashboardRequestParams
// ): Promise<ApiResponseType<DashboardDataType[]>> => {
//     return api.post<DashboardDataType[]>(`/GetDashboardData`, data);
//

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
    // try {
    //     const response:  = await api.post(
    //         `/PutAttachedFiles`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};
import { api } from "@/services/api";
import { type ApiResponseType } from "@/types/api";
import { type CODIndicatorsType, type CodReportType } from "@/types/codReports";
import { type AttachedFilesType } from "@/types/utility";

const getCodReports = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<CodReportType[]>> => {
    return api.post(`/GetCODReportsList`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetCODReportsList`,
    //         data
    //
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getCODReportForm = async (
    data: {
        token: string;
        alias: string;
        uuid: string;
        ui?: string;
    }
): Promise<ApiResponseType<AttachedFilesType[]>> => {
    return api.post(`/GetCODReportPrintForm`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetCODReportPrintForm`,
    //         data,
    //         //{responseType: 'blob',} // Important for handling binary data
    //     );
    //
    //     //Create a Blob object from the binary data
    //     //const blob = new Blob([response.data], { type: response.headers['content-type'] });
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getCODIndicators = async (
    data: {
        token: string;
        alias: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<CODIndicatorsType>> => {
    return api.post(`/GetCODIndicators`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetCODIndicators`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export { getCodReports, getCODReportForm, getCODIndicators};
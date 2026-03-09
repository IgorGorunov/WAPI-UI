import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";
import type {AllReportsRowArrayType, ReportParametersType} from "@/types/reports";


const getReportData = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        reportType: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<AllReportsRowArrayType>> => {
    return api.post(`/GetReportData`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetReportData`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getReportParams = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        ui?: string;
        // reportType: string;
    }
): Promise<ApiResponseType<ReportParametersType>> => {
    return api.post(`/GetReportParameters`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetReportParameters`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export {getReportData, getReportParams}
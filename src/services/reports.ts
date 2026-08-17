import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";
import type {AllReportsRowArrayType, ReportParametersType} from "@/types/reports";


const getReportData = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        reportType: string;
        startDate?: string;
        endDate?: string;
        ui?: string;
    }
): Promise<ApiResponseType<AllReportsRowArrayType>> => {
    return api.post(`/GetReportData`, data);
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
};

export {getReportData, getReportParams}
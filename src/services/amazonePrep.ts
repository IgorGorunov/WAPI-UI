import type {
    AmazonPrepOrderParamsType,
    AmazonPrepOrderType,
    SingleAmazonPrepOrderFormType,
    SingleAmazonPrepOrderType
} from "@/types/amazonPrep";
import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";
import type {AttachedFilesType} from "@/types/utility";

const getAmazonPrep = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<AmazonPrepOrderType[]>> => {
    return api.post<AmazonPrepOrderType[]>(`/GetAmazonPrepsList`, data);
};

const getSingleAmazonPrepData = async (
    //token: string,
    data: {
        uuid: string;
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<SingleAmazonPrepOrderType>> => {
    return api.post(`/GetAmazonPrepData`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetAmazonPrepData`,
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


const getAmazonPrepParameters = async (

    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<AmazonPrepOrderParamsType>> => {
    return api.post(`/GetAmazonPrepParameters`, data);
    // try {
    //     const ress = await api.post(
    //         `/GetAmazonPrepParameters`,
    //         data
    //     );
    //
    //     return ress
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendAmazonPrepData = async (
    data: {
        orderData: SingleAmazonPrepOrderFormType,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<{errorMessage?: string[]}>> => {
    return api.post(`/CreateUpdateAmazonPrep`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/CreateUpdateAmazonPrep`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendAmazonPrepFiles = async (
    data: {
        files: AttachedFilesType[],
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/BulkOrdersCreate`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/BulkOrdersCreate`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export { getAmazonPrep, getSingleAmazonPrepData, getAmazonPrepParameters, sendAmazonPrepData, sendAmazonPrepFiles};

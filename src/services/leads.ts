import {api} from "@/services/api";
import type {LegalInfoFormType, PriceInfoType, QuestionnaireFormType, QuestionnaireParamsType} from "@/types/leads";
import type {ApiResponseType, LoginResponseDataType} from "@/types/api";
import type {AttachedFilesType} from "@/types/utility";

const getLeadParameters = async (
    data: {
        token: string;
        alias: string;
    }
): Promise<ApiResponseType<QuestionnaireParamsType>> => {
    return api.post( `/GetLeadParameters`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetLeadParameters`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendQuestionnaire = async (

    data: {
        token: string,
        alias: string;
        leadData: QuestionnaireFormType,
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post( `/UpdateLeadQuestionnaire`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/UpdateLeadQuestionnaire`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendLegalInfo = async (
    data: {
        token: string,
        alias: string;
        legalData: LegalInfoFormType,
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/UpdateLeadLegal`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/UpdateLeadLegal`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getPricesInfo = async (
    data: {
        token: string,
        alias: string;
    }
): Promise<ApiResponseType<PriceInfoType[]>> => {
    return api.post( `/GetLeadDefaulPrices`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetLeadDefaulPrices`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getPriceFile = async (
    data: {
        token: string,
        alias: string;
        uuid: string,
    }
): Promise<ApiResponseType<AttachedFilesType[]>> => {
    return api.post( `/GetDefaultPriceList`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetDefaultPriceList`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getLegalData = async (
    data: {
        token: string,
        alias: string;
    }
): Promise<ApiResponseType<LegalInfoFormType>> => {
    return api.post( `/GetLeadLegal`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetLeadLegal`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};


const sendSignNDA = async (
    data: {
        token: string,
        alias: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post( `/UpdateLeadNDA`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/UpdateLeadNDA`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const checkLeadStatus = async (
    data: {
        lead: string,
        alias: string;
    }
): Promise<ApiResponseType<LoginResponseDataType>> => {
    return api.post( `/Authorize`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/Authorize`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendQuestion = async (
    data: {
        token: string,
        alias: string;
        questionText: string
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post( `/LeadEmailSupport`, data);
    // try {
    //     const response: ApiResponseType = await api.post(
    //         `/LeadEmailSupport`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};


export { getLeadParameters, sendQuestionnaire, sendLegalInfo, getPricesInfo, getPriceFile, sendSignNDA, getLegalData, checkLeadStatus, sendQuestion };

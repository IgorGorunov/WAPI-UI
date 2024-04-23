import {api} from "@/services/api";
import {LegalInfoFormType, QuestionnaireFormType} from "@/types/leads";

const getLeadParameters = async (
    // data: {
    //     token: string;
    // }
) => {
    try {
        const response: any = await api.post(
            `/GetLeadParameters`,
            // data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const sendQuestionnaire = async (

    data: {
        token: string,
        leadData: QuestionnaireFormType,
    }
) => {
    try {
        const response: any = await api.post(
            `/UpdateLeadQuestionnaire`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const sendLegalInfo = async (

    data: {
        token: string,
        legalData: LegalInfoFormType,
    }
) => {
    try {
        const response: any = await api.post(
            `/UpdateLeadLegal`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getPricesInfo = async (

    data: {
        token: string,
    }
) => {
    try {
        const response: any = await api.post(
            `/GetLeadDefaulPrices`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getPriceFile = async (

    data: {
        token: string,
        uuid: string,
    }
) => {
    try {
        const response: any = await api.post(
            `/GetDefaultPriceList`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getLegalData = async (

    data: {
        token: string,
    }
) => {
    try {
        const response: any = await api.post(
            `/GetLeadLegal`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};


const sendSignNDA = async (

    data: {
        token: string,
    }
) => {
    try {
        const response: any = await api.post(
            `/UpdateLeadNDA`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const checkLeadStatus = async (
    data: {
        lead: string,
    }
) => {
    try {
        const response: any = await api.post(
            `/Authorize`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};



export { getLeadParameters, sendQuestionnaire, sendLegalInfo, getPricesInfo, getPriceFile, sendSignNDA, getLegalData, checkLeadStatus };

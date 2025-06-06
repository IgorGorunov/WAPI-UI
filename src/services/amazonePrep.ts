import {AttachedFilesType, SingleAmazonPrepOrderFormType} from "@/types/amazonPrep";
import {api} from "@/services/api";

const getAmazonPrep = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetAmazonPrepsList`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};
const getSingleAmazonPrepData = async (
    //token: string,
    data: {
        uuid: string;
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetAmazonPrepData`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};


const getAmazonPrepParameters = async (

    data: {
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const ress = await api.post(
            `/GetAmazonPrepParameters`,
            data
        );

        return ress
    } catch (err) {
        console.error(err);
        return err;
    }
};



const sendAmazonPrepData = async (
    data: {
        orderData: SingleAmazonPrepOrderFormType,
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/CreateUpdateAmazonPrep`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const sendAmazonPrepFiles = async (
    data: {
        files: AttachedFilesType[],
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/BulkOrdersCreate`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getAmazonPrep, getSingleAmazonPrepData, getAmazonPrepParameters, sendAmazonPrepData, sendAmazonPrepFiles};

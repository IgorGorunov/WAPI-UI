import axios from "axios";
import {AttachedFilesType, SingleAmazonPrepOrderFormType} from "@/types/amazonPrep";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getAmazonPrep = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetAmazonPrepsList`,
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
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetAmazonPrepData`,
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
    }
) => {
    try {
        const ress = await axios.post(
            `${API_ENDPOINT}/GetAmazonPrepParameters`,
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
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/CreateUpdateAmazonPrep`,
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
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/BulkOrdersCreate`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getAmazonPrep, getSingleAmazonPrepData, getAmazonPrepParameters, sendAmazonPrepData, sendAmazonPrepFiles};

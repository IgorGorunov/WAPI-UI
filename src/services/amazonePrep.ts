import axios from "axios";
import {AttachedFilesType, SingleAmazonPrepOrderType} from "@/types/amazonPrep";

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
const getAmazonPrepData= async (
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
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetAmazonPrepParameters`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};



const sendAmazonPrepData = async (
    data: {
        orderData: SingleAmazonPrepOrderType,
        token: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/CreateUpdateOrder`,
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

export { getAmazonPrep, getAmazonPrepData, getAmazonPrepParameters, sendAmazonPrepData, sendAmazonPrepFiles};

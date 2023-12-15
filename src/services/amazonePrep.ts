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

// const getSingleAmazonPrepData = async (
//     //token: string,
//     data: {
//         uuid: string;
//         token: string;
//     }
// ) => {
//     try {
//         const response = await fetch('https://api.example.com/data');
//
//         // Check if the request was successful (status code 2xx)
//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }
//
//         // Parse the JSON response
//         const data: any = await response.json();
//         console.log("data:", data)
//         return data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error; // Rethrow the error to handle it elsewhere if needed
//     }
// };


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
        console.log("params:", ress);
        return ress
    } catch (err) {
        console.error(err);
        return err;
    }
};

// const getAmazonPrepParameters = async (
//
//     data: {
//         token: string;
//     }
// ) => {
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//     };
//     try {
//
//         const response = await fetch(`${API_ENDPOINT}/GetAmazonPrepParameters`, requestOptions)
//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }
//         //console.log('data 0:', response);
//         // Parse the JSON response
//         const data: any = await response.json();
//         //console.log("data:", data);
//         return data;
//         // return await axios.post(
//         //     `${API_ENDPOINT}/GetAmazonPrepParameters`,
//         //     data
//         // );;
//     } catch (err) {
//         console.error(err);
//         return err;
//     }
// };


const sendAmazonPrepData = async (
    data: {
        orderData: SingleAmazonPrepOrderType,
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

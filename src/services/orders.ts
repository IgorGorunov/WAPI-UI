import axios from "axios";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getOrders = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetOrdersList`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};
const getOrderData= async (
    //token: string,
    data: {
        uuid: string;
        token: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetOrderData`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getOrderParameters = async (

    data: {
        token: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetOrderParameters`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getOrders, getOrderData, getOrderParameters};

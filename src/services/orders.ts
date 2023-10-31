import axios from "axios";

const API_ENDPOINT = "https://first.wapi.com:4443/WAPI/hs/v1/UI";

const getOrders = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        console.log("data: ", data)
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
        token: string;
    }
) => {
    try {
        console.log("data: ", data)
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

export { getOrders, getOrderData};
import axios from "axios";
import {SingleProductType} from "@/types/products";
import {SingleOrderType} from "@/types/orders";

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


const getOrderPickupPoints = async (
    data: {
        courierService: string;
        token: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetPickupPoints`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const sendOrderData = async (
    data: {
        orderData: SingleOrderType,
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

export { getOrders, getOrderData, getOrderParameters, getOrderPickupPoints, sendOrderData};

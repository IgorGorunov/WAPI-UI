import {SingleOrderType, OrderCommentType} from "@/types/orders";
import {AttachedFilesType } from '@/types/utility';
import {api} from "@/services/api";


const getOrders = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetOrdersList`,
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
        const response: any = await api.post(
            `/GetOrderData`,
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
        const response: any = await api.post(
            `/GetOrderParameters`,
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
        const response: any = await api.post(
            `/GetPickupPoints`,
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
        const response: any = await api.post(
            `/CreateUpdateOrder`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const sendOrderComment = async (
    data: {
        comment: OrderCommentType,
        token: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/SendCommentToCourierService`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const sendOrderFiles = async (
    data: {
        files: AttachedFilesType[],
        token: string;
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


export { getOrders, getOrderData, getOrderParameters, getOrderPickupPoints, sendOrderData, sendOrderFiles, sendOrderComment};

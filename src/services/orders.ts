import {SingleOrderType, OrderCommentType} from "@/types/orders";
import {AttachedFilesType } from '@/types/utility';
import {api} from "@/services/api";


const getOrders = async (
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
        alias: string;
        token: string;
        ui?: string;
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
        alias: string;
        ui?: string;
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
        alias: string;
        ui?: string;
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
        alias: string;
        ui?: string;
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
        alias: string;
        ui?: string;
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

const cancelOrder = async (
    data: {
        uuid: string,
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/CancelOrder`,
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

const sendAddressData = async (
    data: {
        addressData: {
            clientOrderID: string;
            uuid: string,
            receiverAddress?: string;
            receiverCity?: string;
            receiverComment?: string;
            receiverCounty?: string;
            receiverEMail?: string;
            receiverFullName?: string;
            receiverPhone?: string;
            receiverPickUpAddress?:string;
            receiverPickUpCity?:string;
            receiverPickUpDescription?: string;
            receiverPickUpID?: string;
            receiverPickUpName?: string;
            receiverZip?: string;
        },
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/UpdateAddressShipmentOrder`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};


export { getOrders, getOrderData, getOrderParameters, getOrderPickupPoints, sendOrderData, sendOrderFiles, sendOrderComment, cancelOrder, sendAddressData};

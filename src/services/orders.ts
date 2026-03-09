import {
    CreateOrderRequestType,
    OrderCommentType, OrderFiltersSelectedType,
    OrderParamsType,
    OrderType, OrderFilterDataType, PickupPointsType,
    SingleOrderType, OrderTempPropsType, PagedOrderListType
} from "@/types/orders";
import type {BulkCreateRequestType} from '@/types/utility';
import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";


const getOrders = async (
    //token: string,
    data: {
        token: string;
        // client: string;
        alias?: string;
        startDate: string;
        endDate: string;
        ui?: string;
        // page: number;
        // limit: number;
    }
): Promise<ApiResponseType<PagedOrderListType>> => {
    return api.post(`/GetOrdersList`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetPagedOrdersList`,
    //         data
    //
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getOrders_Old = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<OrderType[]>> => {
    return api.post(`/GetOrdersList`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetOrdersList`,
    //         data
    //
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};
const getOrderData= async (
    //token: string,
    data: {
        uuid: string;
        alias: string;
        token: string;
        ui?: string;
    }
): Promise<ApiResponseType<SingleOrderType>> => {
    return api.post(`/GetOrderData`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetOrderData`,
    //         data
    //
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getOrderParameters = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<OrderParamsType>> => {
    return api.post(`/GetOrderParameters`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetOrderParameters`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getOrderPickupPoints = async (
    data: {
        courierService: string;
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<PickupPointsType[]>> => {
    return api.post(`/GetPickupPoints`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetPickupPoints`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendOrderData = async (
    data: CreateOrderRequestType
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CreateUpdateOrder`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/CreateUpdateOrder`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendOrderComment = async (
    data: {
        comment: OrderCommentType,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/SendCommentToCourierService`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/SendCommentToCourierService`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const cancelOrder = async (
    data: {
        uuid: string,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CancelOrder`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/CancelOrder`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendOrderFiles = async (
    data: BulkCreateRequestType
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/BulkOrdersCreate`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/BulkOrdersCreate`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
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
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/UpdateAddressShipmentOrder`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/UpdateAddressShipmentOrder`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export const getOrderFilters = async (
    data: OrderTempPropsType
    // data: {
    //     token: string;
    //     alias?: string;
    //     startDate: string;
    //     endDate: string;
    //     ui?: string;
    // }
): Promise<ApiResponseType<OrderFilterDataType>> => {
    return api.post(`/GetPagedFilters`, data);
    // try {
    //     const response: any = await api.post(
    //         `/GetPagedFilters`,
    //         data
    //     );
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
}

export const getOrdersPage = async (
    data: {
        token: string;
        alias?: string;
        startDate: string;
        endDate: string;
        page: number;
        limit: number;
        ui?: string;
        filter?: Partial<OrderFiltersSelectedType>;
    }
): Promise<ApiResponseType<OrderType[]>> => {
    return api.post(`/GetPagedOrdersList`, data);
}


export { getOrders, getOrders_Old, getOrderData, getOrderParameters, getOrderPickupPoints, sendOrderData, sendOrderFiles, sendOrderComment, cancelOrder, sendAddressData};

import {
    CreateOrderRequestType,
    OrderCommentType, OrderFiltersSelectedType,
    OrderParamsType,
    OrderType, OrderFilterDataType, PickupPointsType,
    SingleOrderType, OrderTempPropsType, PagedOrderListType
} from "@/types/orders";
import type {BulkCreateRequestType, AttachedFilesType} from '@/types/utility';
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
};

const getOrderParameters = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<OrderParamsType>> => {
    return api.post(`/GetOrderParameters`, data);
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
};

const sendOrderData = async (
    data: CreateOrderRequestType
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CreateUpdateOrder`, data);
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
};

const sendOrderFiles = async (
    data: BulkCreateRequestType
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/BulkOrdersCreate`, data);
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
};

export const getOrderFilters = async (
    data: OrderTempPropsType
): Promise<ApiResponseType<OrderFilterDataType>> => {
    return api.post(`/GetPagedFilters`, data);
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

// https://api.wapi.com/WAPI/hs/v1/UI/GetPagedOrderListFile
export const getOrdersExcel = async (
    data: {
        token: string;
        alias?: string;
        startDate: string;
        endDate: string;
        ui?: string;
        filter?: Partial<OrderFiltersSelectedType>;
        search?: string;
        fullTextSearch?: boolean;
        sortBy?: string;
        sortOrder?: string;
    }
): Promise<ApiResponseType<AttachedFilesType>> => {
    return api.post(`/GetPagedOrderListFile`, data);
}

export { getOrders, getOrders_Old, getOrderData, getOrderParameters, getOrderPickupPoints, sendOrderData, sendOrderFiles, sendOrderComment, cancelOrder, sendAddressData};

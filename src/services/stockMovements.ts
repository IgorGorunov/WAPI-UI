import type {
    SingleStockMovementFormType,
    SingleStockMovementType,
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementParamsType,
    StockMovementType
} from "@/types/stockMovements";
import type {AttachedFilesType} from "@/types/utility";
import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";


const getInbounds = async (
    //token: string,
    //type: STOCK_MOVEMENT_DOC_TYPE,

    data: {
        token: string;
        alias: string;
        documentType: STOCK_MOVEMENT_DOC_TYPE;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<StockMovementType[]>> => {
    const docEndpoint = 'GetStockMovementList';

    return api.post(`/${docEndpoint}`, data);

    // try {
    //     const response: unknown = await api.post(
    //         `/${docEndpoint}`,
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
const getInboundData = async (
    //token: string,
    //type: STOCK_MOVEMENT_DOC_TYPE,
    data: {
        uuid: string;
        alias: string;
        documentType: STOCK_MOVEMENT_DOC_TYPE,
        token: string;
        ui?: string;
    }
): Promise<ApiResponseType<SingleStockMovementType>> => {
    const docEndpoint = 'GetStockMovementData';
    return api.post(`/${docEndpoint}`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/${docEndpoint}`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getInboundParameters = async (
    //type: STOCK_MOVEMENT_DOC_TYPE,
    data: {
        documentType: STOCK_MOVEMENT_DOC_TYPE;
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<StockMovementParamsType>> => {
    const docEndpoint = 'GetStockMovementParameters';
    return api.post(`/${docEndpoint}`, data);
    // try {
    //     const docEndpoint = 'GetStockMovementParameters';
    //
    //     const response: unknown = await api.post(
    //         `/${docEndpoint}`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};




const sendInboundData = async (
    data: {
        documentType: STOCK_MOVEMENT_DOC_TYPE,
        documentData: SingleStockMovementFormType,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CreateStockMovement`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/CreateStockMovement`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const updateInboundData = async (
    data: {
        //documentType: STOCK_MOVEMENT_DOC_TYPE,
        documentData: {
            uuid: string,
            estimatedTimeArrives: string,
            courierServiceTrackingNumber: string,
        },
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/UpdateStockMovement`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/UpdateStockMovement`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const sendInboundFiles = async (
    data: {
        files: AttachedFilesType[],
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/FillStockMovementFromFile`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/FillStockMovementFromFile`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

// const fillInboundByStock = async (
//     data: {
//         token: string;
//         alias: string;
//         ui?: string;
//         quality: string[];
//         warehouse: string;
//     }
// ) => {
//     try {
//         const response: unknown = await api.post(
//             `/FillStockMovementAllStock`,
//             data
//         );
//
//         return response;
//     } catch (err) {
//         console.error(err);
//         return err;
//     }
// };

export const cancelStockMovement = async (
    data: {
        uuid: string,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CancelStockMovement`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/CancelStockMovement`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export { getInbounds, getInboundData, getInboundParameters, sendInboundData, updateInboundData, sendInboundFiles};

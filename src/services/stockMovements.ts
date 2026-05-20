import {
    SingleStockMovementFormType, SingleStockMovementProductType,
    SingleStockMovementType,
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementParamsType,
    StockMovementType
} from "@/types/stockMovements";
import type {AttachedFilesType} from "@/types/utility";
import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";
import {OrderFiltersSelectedType} from "@/types/orders";


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
};
const getInboundData = async (
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
};

export const fillInboundByStock = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
        // quality: string[];
        warehouse: string;
    }
): Promise<ApiResponseType<SingleStockMovementProductType[]>> => {
    return api.post(`/FillStockMovementAllStock`, data);
};

export const cancelStockMovement = async (
    data: {
        uuid: string,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CancelStockMovement`, data);
};

export const getStockMovementsExcel = async (
    data: {
        token: string;
        alias?: string;
        documentType: STOCK_MOVEMENT_DOC_TYPE;
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
    return api.post(`/GetPagedStockMovementListFile`, data);
}

export { getInbounds, getInboundData, getInboundParameters, sendInboundData, updateInboundData, sendInboundFiles};

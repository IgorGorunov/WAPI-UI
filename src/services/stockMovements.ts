import {SingleStockMovementType, STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import {AttachedFilesType} from "@/types/utility";
import {api} from "@/services/api";


const getInbounds = async (
    //token: string,
    //type: STOCK_MOVEMENT_DOC_TYPE,

    data: {
        token: string;
        documentType: STOCK_MOVEMENT_DOC_TYPE;
        startDate: string;
        endDate: string;
        ui?: string;
    }
) => {
    const docEndpoint = 'GetStockMovementList';

    try {
        const response: any = await api.post(
            `/${docEndpoint}`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};
const getInboundData = async (
    //token: string,
    //type: STOCK_MOVEMENT_DOC_TYPE,
    data: {
        uuid: string;
        documentType: STOCK_MOVEMENT_DOC_TYPE,
        token: string;
        ui?: string;
    }
) => {
    const docEndpoint = 'GetStockMovementData';
    try {
        const response: any = await api.post(
            `/${docEndpoint}`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getInboundParameters = async (
    //type: STOCK_MOVEMENT_DOC_TYPE,
    data: {
        documentType: STOCK_MOVEMENT_DOC_TYPE;
        token: string;
        ui?: string;
    }
) => {
    try {
        const docEndpoint = 'GetStockMovementParameters';

        const response: any = await api.post(
            `/${docEndpoint}`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};




const sendInboundData = async (
    data: {
        documentType: STOCK_MOVEMENT_DOC_TYPE,
        documentData: SingleStockMovementType,
        token: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/CreateStockMovement`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
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
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/UpdateStockMovement`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const sendInboundFiles = async (
    data: {
        files: AttachedFilesType[],
        token: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/FillStockMovementFromFile`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const fillInboundByStock = async (
    data: {
        token: string;
        ui?: string;
        quality: string[];
        warehouse: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/FillStockMovementAllStock`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const cancelStockMovement = async (
    data: {
        uuid: string,
        token: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/CancelStockMovement`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getInbounds, getInboundData, getInboundParameters, sendInboundData, updateInboundData, sendInboundFiles, fillInboundByStock};

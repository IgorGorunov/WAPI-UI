import axios from "axios";
import {SingleStockMovementType, STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getInbounds = async (
    //token: string,
    type: STOCK_MOVEMENT_DOC_TYPE,

    data: {
        token: string;
        startDate: string;
        endDate: string;
    }
) => {
    const docEndpoint = type===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS ? 'GetInboundList' : type===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND ? 'GetOutboundList' : 'GetStockMovementList'

    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/${docEndpoint}`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};
const getInboundData= async (
    //token: string,
    type: STOCK_MOVEMENT_DOC_TYPE,
    data: {
        uuid: string;
        token: string;
    }
) => {
    const docEndpoint = type===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS ? 'GetInboundData' : type===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND ? 'GetOutboundData' : 'GetStockMovementData'
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/${docEndpoint}`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getInboundParameters = async (
    type: STOCK_MOVEMENT_DOC_TYPE,
    data: {
        token: string;
    }
) => {
    try {
        const docEndpoint = type===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS ? 'GetInboundParameters' : type===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND ? 'GetOutboundParameters' : 'GetStockMovementParameters'

        const response: any = await axios.post(
            `${API_ENDPOINT}/${docEndpoint}`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};




const sendInboundData = async (
    type: STOCK_MOVEMENT_DOC_TYPE,
    data: {
        documentType: STOCK_MOVEMENT_DOC_TYPE,
        documentData: SingleStockMovementType,
        token: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/CreateStockMovement`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};


export { getInbounds, getInboundData, getInboundParameters, sendInboundData};

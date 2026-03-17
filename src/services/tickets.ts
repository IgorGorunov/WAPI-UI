import { api } from "@/services/api";
import type { AttachedFilesType } from "@/types/utility";
import type {ApiResponseType} from "@/types/api";
import type {ChatMessageType, SingleTicketType, TicketParamsType, TicketType} from "@/types/tickets";

const getTickets = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<TicketType[]>> => {
    return api.post(`/GetTicketList`, data);
};
const getSingleTicket = async (
    //token: string,
    data: {
        uuid: string;
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<SingleTicketType>> => {
    return api.post(`/GetTicketData`, data);
};

const getTicketParams = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<TicketParamsType>> => {
    return api.post(`/GetTicketParameters`, data);
};

const createTicket = async (
    data: {
        ticket: Record<string, unknown>;
        alias: string;
        token: string;
        ui?: string;
    }
): Promise<ApiResponseType<string>> => {
    return api.post(`/CreateTicket`, data);
};

const reopenTicket = async (
    data: {
        uuid: string,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/ReopenTicket`, data);
};

const sendTicketMessage = async (
    data: {
        message: string;
        objectUuid: string;
        token: string;
        alias: string;
        attachedFiles: AttachedFilesType[];
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CreateMessageForObject`, data);
};

const getTicketMessages = async (
    data: {
        uuid: string;
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ChatMessageType[]>> => {
    return api.post(`/GetMessagesByObject`, data);
};


export { getTickets, getSingleTicket, getTicketParams, createTicket, sendTicketMessage, getTicketMessages, reopenTicket };

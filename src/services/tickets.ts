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
    // try {
    //     const response: unknown = await api.post(
    //         `/GetTicketList`,
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
    // try {
    //     const response: unknown = await api.post(
    //         `/GetTicketData`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
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
    // try {
    //     const response: unknown = await api.post(
    //         `/GetTicketParameters`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
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
    // try {
    //     const response: unknown = await api.post(
    //         `/CreateTicket`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
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
    // try {
    //     const response: unknown = await api.post(
    //         `/ReopenTicket`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
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
    // try {
    //     const response: unknown = await api.post(
    //         `/CreateMessageForObject`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
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
    // try {
    //     const response: unknown = await api.post(
    //         `GetMessagesByObject`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};


export { getTickets, getSingleTicket, getTicketParams, createTicket, sendTicketMessage, getTicketMessages, reopenTicket };

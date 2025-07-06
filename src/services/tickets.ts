import {api} from "@/services/api";
import {AttachedFilesType} from "@/types/utility";

const getTickets = async (
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
            `/GetTicketList`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};
const getSingleTicket = async (
    //token: string,
    data: {
        uuid: string;
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetTicketData`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getTicketParams = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetTicketParameters`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const createTicket = async (
    data: {
        ticket: any;
        alias: string;
        token: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/CreateTicket`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const reopenTicket = async (
    data: {
        uuid: string,
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/ReopenTicket`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
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
) => {
    try {
        const response: any = await api.post(
            `/CreateMessageForObject`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getTicketMessages = async (
    data: {
        uuid: string;
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `GetMessagesByObject`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};


export { getTickets, getSingleTicket, getTicketParams, createTicket, sendTicketMessage, getTicketMessages, reopenTicket};

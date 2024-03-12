import {api} from "@/services/api";
import {AttachedFilesType} from "@/types/utility";

const getTickets = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
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
        ticket: any,
        token: string;
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
        attachedFiles: AttachedFilesType[];
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

import {api} from "@/services/api";

export const getNotes = async (
    data: {
        token: string;
        uuid: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetNotes`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const sendNote = async (
    data: {
        token: string;
        uuid: string;
        //period: string;
        note: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/CreateNote`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};
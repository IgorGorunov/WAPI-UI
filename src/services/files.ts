import {AttachedFilesType} from "@/types/utility";
import {api} from "@/services/api";

export const sendDocumentFiles = async (
    data: {
        attachedFiles: AttachedFilesType[],
        token: string;
        alias: string;
        uuid: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/PutAttachedFiles`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};
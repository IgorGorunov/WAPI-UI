import {api} from "@/services/api";

export const getApiProtocols = async (
    data: {
        token: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetDeliveryProtocols`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const getApiProtocol = async (
    data: {
        uuid: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetDeliveryProtocolFile`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const changePassword = async (
    data: {
        token: string;
        currentPassword: string;
        newPassword: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/ChangePassword`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
}
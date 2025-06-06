import {api} from "@/services/api";

export const getProductSelection = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetProductsSelection`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};
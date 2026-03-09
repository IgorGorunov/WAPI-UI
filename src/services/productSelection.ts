import { api } from "@/services/api";
import type {ApiResponseType} from "@/types/api";
import type {ProductsSelectionType} from "@/types/utility";

export const getProductSelection = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductsSelectionType[]>> => {
    return api.post(`/GetProductsSelection`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetProductsSelection`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};
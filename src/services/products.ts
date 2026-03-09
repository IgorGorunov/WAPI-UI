import type {
    ProductParamsType,
    ProductStockType,
    ProductType,
    SingleProductSendFormType,
    SingleProductType
} from '@/types/products';
import type {AttachedFilesType} from "@/types/utility";
import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";


const getProducts = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductType[]>> => {
    return api.post<ProductType[]>(`/GetProductsList`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetProductsList`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getProductByUID = async (
    data: {
        token: string;
        alias: string;
        uuid: string;
        ui?: string;
    }
): Promise<ApiResponseType<SingleProductType>> => {
    return api.post(`/GetProductData`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetProductData`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getProductParameters = async (

    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductParamsType>> => {
    return api.post(`/GetProductParameters`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetProductParameters`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getProductsStock = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductStockType[]>> => {
    return api.post(`/GetProductsStock`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetProductsStock`,
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

//send product info

const sendProductInfo = async (
    data: {
        productData: SingleProductSendFormType,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CreateUpdateProduct`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/CreateUpdateProduct`,
    //         data
    //
    //     );
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
}

const sendProductFiles = async (
    data: {
        files: AttachedFilesType[],
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/BulkProductsCreate`, data);
    // try {
    //     const response: Aunknown = await api.post(
    //         `/BulkProductsCreate`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export { getProducts, getProductByUID, getProductParameters, getProductsStock, sendProductInfo, sendProductFiles};
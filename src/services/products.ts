import {SingleProductType} from '@/types/products';
import {AttachedFilesType} from "@/types/utility";
import {api} from "@/services/api";


const getProducts = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetProductsList`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getProductByUID = async (
    data: {
        token: string;
        alias: string;
        uuid: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetProductData`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getProductParameters = async (

    data: {
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetProductParameters`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getProductsStock = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetProductsStock`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

//send product info

const sendProductInfo = async (
    data: {
        productData: SingleProductType,
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/CreateUpdateProduct`,
            data

        );
        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
}

const sendProductFiles = async (
    data: {
        files: AttachedFilesType[],
        token: string;
        alias: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/BulkProductsCreate`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getProducts, getProductByUID, getProductParameters, getProductsStock, sendProductInfo, sendProductFiles};
import axios from "axios";
import {SingleProductType} from '@/types/products';

const API_ENDPOINT = "https://ui.wapi.com/WAPI/hs/v1/UI";

const getProducts = async (
    //token: string,
    data: {
        token: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetProductsList`,
            data
            //   {
            //     headers: {
            //       Authorization: token,
            //     },
            //   }
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
        uuid: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetProductData`,
            data
            //   {
            //     headers: {
            //       Authorization: token,
            //     },
            //   }
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
    }
) => {
    try {
        console.log("data: ", data)
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetProductParameters`,
            data
            //   {
            //     headers: {
            //       Authorization: token,
            //     },
            //   }
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
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetProductsStock`,
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
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/CreateUpdateProduct`,
            data

        );
        console.log("edit product: ", response);
        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
}

export { getProducts, getProductByUID, getProductParameters, getProductsStock, sendProductInfo};
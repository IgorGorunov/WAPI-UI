import axios from "axios";

const API_ENDPOINT = "https://first.wapi.com:4443/WAPI/hs/v1/UI";

const getProducts = async (
    //token: string,
    data: {
        token: string;
    }
) => {
    try {
        console.log("data: ", data)
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
const getProductsStock = async (
    //token: string,
    data: {
        token: string;
    }
) => {
    try {
        console.log("data: ", data)
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

export { getProducts, getProductsStock};
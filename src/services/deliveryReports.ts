import axios from "axios";
import { DeliveryReportType } from "@/types/deliveryReports";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getDeliveryReports = async (
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

export { getDeliveryReports };
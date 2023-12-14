import axios from "axios";
import { CodReportType } from "@/types/codReports";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getCodReports = async (
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

export { getCodReports };
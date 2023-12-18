import axios from "axios";
import { CodReportType } from "@/types/codReports";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getCodReports = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetCODReportsList`,
            data

        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getCODReportForm = async (
    data: {
        token: string;
        uuid: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetCODReportPrintForm`,
            data,
            //{responseType: 'blob',} // Important for handling binary data
        );

        //Create a Blob object from the binary data
        //const blob = new Blob([response.data], { type: response.headers['content-type'] });

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getCodReports, getCODReportForm};
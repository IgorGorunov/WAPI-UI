import axios from "axios";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getReportData = async (
    //token: string,
    data: {
        token: string;
        reportType: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetReportData`,
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

const getReportParams = async (
    //token: string,
    data: {
        token: string;
        // reportType: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetReportParameters`,
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

export {getReportData, getReportParams}
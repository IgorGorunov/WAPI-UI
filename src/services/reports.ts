import {api} from "@/services/api";


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
        const response: any = await api.post(
            `/GetReportData`,
            data
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
        const response: any = await api.post(
            `/GetReportParameters`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export {getReportData, getReportParams}
import {api} from "@/services/api";

const getCodReports = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetCODReportsList`,
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
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetCODReportPrintForm`,
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

const getCODIndicators = async (
    data: {
        token: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetCODIndicators`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getCodReports, getCODReportForm, getCODIndicators};
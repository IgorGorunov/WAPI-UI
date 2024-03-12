import {api} from "@/services/api";

const getInvoices = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetInvoicesList`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const getInvoiceForm = async (
    data: {
        token: string;
        uuid: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetInvoicePrintForm`,
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

const getInvoicesDebts = async (
    data: {
        token: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/GetInvoicesDebt`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getInvoices, getInvoiceForm, getInvoicesDebts };
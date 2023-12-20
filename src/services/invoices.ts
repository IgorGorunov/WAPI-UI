import axios from "axios";
import { InvoiceType } from "@/types/invoices";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getInvoices = async (
    //token: string,
    data: {
        token: string;
        startDate: string;
        endDate: string;
    }
) => {
    try {
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetInvoicesList`,
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
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetInvoicePrintForm`,
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
        const response: any = await axios.post(
            `${API_ENDPOINT}/GetInvoicesDebt`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

export { getInvoices, getInvoiceForm, getInvoicesDebts };
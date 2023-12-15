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

export { getInvoices };
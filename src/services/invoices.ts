import { api } from "@/services/api";
import { type ApiResponseType } from "@/types/api";
import { type InvoiceBalanceType, type InvoiceType } from "@/types/invoices";
import { type AttachedFilesType } from "@/types/utility";

const getInvoices = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<InvoiceType[]>> => {
    return await api.post(`/GetInvoicesList`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetInvoicesList`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getInvoiceForm = async (
    data: {
        token: string;
        alias: string;
        uuid: string;
        ui?: string;
        type: string; //download / preview
    }
): Promise<ApiResponseType<AttachedFilesType[]>> => {
    return await api.post(`/GetInvoicePrintForm`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetInvoicePrintForm`,
    //         data,
    //         //{responseType: 'blob',} // Important for handling binary data
    //     );
    //
    //     //Create a Blob object from the binary data
    //     //const blob = new Blob([response.data], { type: response.headers['content-type'] });
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const getInvoicesDebts = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<InvoiceBalanceType>> => {
    return await api.post(`/GetInvoicesDebt`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/GetInvoicesDebt`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

export { getInvoices, getInvoiceForm, getInvoicesDebts };
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
};

const getInvoicesPage = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        startDate: string;
        endDate: string;
        ui?: string;
    }
): Promise<ApiResponseType<InvoiceType[]>> => {
    return await api.post(`/GetPagedInvoicesList`, data);
};

// PLACEHOLDER — wire up when export endpoint is confirmed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getInvoicesExcel = async (_data: {
    token: string;
    alias: string;
    ui?: string;
    startDate?: string;
    endDate?: string;
    filter?: Record<string, unknown>;
    search?: string;
    fullTextSearch?: boolean;
    sortBy?: string;
    sortOrder?: string;
}): Promise<ApiResponseType<import('@/types/utility').AttachedFilesType>> => {
    return api.post(`/GetPagedInvoicesListFile`, _data);
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
};

const getInvoicesDebts = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<InvoiceBalanceType>> => {
    return await api.post(`/GetInvoicesDebt`, data);
};

export { getInvoices, getInvoicesPage, getInvoiceForm, getInvoicesDebts, getInvoicesExcel };
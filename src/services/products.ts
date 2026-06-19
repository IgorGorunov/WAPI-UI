import type {
    ProductParamsType,
    ProductStockType,
    ProductType,
    SingleProductSendFormType,
    SingleProductType,
    ProductFilterDataType,
    ProductStockFilterDataType
} from '@/types/products';
import type {AttachedFilesType} from "@/types/utility";
import {api} from "@/services/api";
import type {ApiResponseType} from "@/types/api";
import {OrderFiltersSelectedType} from "@/types/orders";


const getProducts = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductType[]>> => {
    return api.post<ProductType[]>(`/GetProductsList`, data);
};

const getPagedProducts = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
        page
    }
): Promise<ApiResponseType<ProductType[]>> => {
    return api.post<ProductType[]>(`/GetProductsList`, data);
};

const getProductByUID = async (
    data: {
        token: string;
        alias: string;
        uuid: string;
        ui?: string;
    }
): Promise<ApiResponseType<SingleProductType>> => {
    return api.post(`/GetProductData`, data);
};

const getProductParameters = async (

    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductParamsType>> => {
    return api.post(`/GetProductParameters`, data);
};

const getProductsStock = async (
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductStockType[]>> => {
    return api.post(`/GetProductsStock`, data);
};

export const getProductsPage = async (
    data: {
        token: string;
        alias?: string;
        ui?: string;
        page: number;
        limit: number;
        search?: string;
        fullTextSearch?: boolean;
        sortBy?: string;
        sortOrder?: string;
        filter?: any;
    }
): Promise<ApiResponseType<ProductType[]>> => {
    return api.post(`/GetPagedProductsList`, data);
};

export const getProductsFilters = async (
    data: {
        token: string;
        alias?: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductFilterDataType>> => {
    return api.post(`/GetPagedFiltersProduct`, data);
};

export const getProductsStockPage = async (
    data: {
        token: string;
        alias?: string;
        ui?: string;
        page: number;
        limit: number;
        search?: string;
        fullTextSearch?: boolean;
        sortBy?: string;
        sortOrder?: string;
        filter?: any;
    }
): Promise<ApiResponseType<ProductStockType[]>> => {
    return api.post(`/GetPagedProductsStock`, data);
};

export const getProductsStockFilters = async (
    data: {
        token: string;
        alias?: string;
        ui?: string;
    }
): Promise<ApiResponseType<ProductStockFilterDataType>> => {
    return api.post(`/GetPagedFiltersProductStock`, data);
};

//send product info

const sendProductInfo = async (
    data: {
        productData: SingleProductSendFormType,
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CreateUpdateProduct`, data);
}

const sendProductFiles = async (
    data: {
        files: AttachedFilesType[],
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/BulkProductsCreate`, data);
};


export const getProductsExcel = async (
    data: {
        token: string;
        alias?: string;
        startDate: string;
        endDate: string;
        ui?: string;
        filter?: Partial<OrderFiltersSelectedType>;
        search?: string;
        fullTextSearch?: boolean;
        sortBy?: string;
        sortOrder?: string;
    }
): Promise<ApiResponseType<AttachedFilesType>> => {
    return api.post(`/GetPagedProductsListFile`, data);
}

export const getProductsStockExcel = async (
    data: {
        token: string;
        alias?: string;
        // startDate: string;
        // endDate: string;
        ui?: string;
        filter?: Partial<OrderFiltersSelectedType>;
        search?: string;
        fullTextSearch?: boolean;
        sortBy?: string;
        sortOrder?: string;
    }
): Promise<ApiResponseType<AttachedFilesType>> => {
    return api.post(`/GetPagedProductsStockFile`, data);
}

export { getProducts, getProductByUID, getProductParameters, getProductsStock, sendProductInfo, sendProductFiles};
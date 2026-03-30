import type {ApiResponseType} from "@/types/api";
import {api} from "@/services/api";
import {WarehouseCalendarType} from "@/types/warehouseCalendar";

export const getWarehouseCalendars = async (
    //token: string,
    data: {
        token: string;
        alias: string;
        ui?: string;
    }
): Promise<ApiResponseType<WarehouseCalendarType[]>> => {
    return api.post(`/GetNonWorkingDays`, data);
};
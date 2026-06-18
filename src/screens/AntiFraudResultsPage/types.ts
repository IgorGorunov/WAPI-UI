import {AntiFraudActionType, ANTIFRAUD_ACTIONS} from "@/screens/AntiFraudSettingsPage/types";

export type PremiumProductTypeResultsType = {
    [key: string]: {
        ordersCount: number;
        successful: number;
        failure: number;
        buyout: number;
        inTransit: number;
        averageCheck: number;
        averageProductsCount: number;
        orderHasProduct: boolean;
        zone: string;
    }
}

export type AntiFraudExtendedResultsType = {
    ordersCount: number,
    successful: number;
    failure: number;
    inTransit: number;
    buyout: number;
    averageCheck: number;
    averageProductsCount: number;
    lastOrderDate: string;
    productsTypes: string[] | PremiumProductTypeResultsType;
}


export type AntiFraudResultObject = {
    //standard
    subscription: string,
    zone: string,
    action: AntiFraudActionType,
    status: string,

    //extended
    result?: AntiFraudExtendedResultsType,
    uuid?: string,
    requestPeriod?: string,
    shipmentOrder?: string,
    phoneNumber?: string,
    buyout?: number,
    accrualServices?: string,
}

export type AntiFraudResultType = {
    uuid: string;
    requestPeriod: string;
    shipmentOrder: string;
    phoneNumber: string;
    subscription: string;
    buyout: number;
    zone: string;
    action: ANTIFRAUD_ACTIONS;
    accrualServices: string; //for now, change later
    status: string;
    numberForDisplay?: string;
    result?: AntiFraudResultObject;
    orderStatus?: string;
}

// export const statusColors = {
//     [GroupStatuses["Ready for dispatch"]]: "#FEDB4F",
//     //[GroupStatuses["Ready for dispatch"]]: "orange",
//     [GroupStatuses.Delivered]: "#29CC39",
//     [GroupStatuses["In transit"]]: "#5380F5",
//     [GroupStatuses.Returned]: "#FF4000",
//     [GroupStatuses.Returning]: "#FF4000",
//     [GroupStatuses["Other statuses"]]: "#FEDB4F",
//     [GroupStatuses.Error]: "#FF4000",
// }

export const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("return")) return "#FF4000";
    if (status.toLowerCase().includes("error")) return "#FF4000";
    if (status.toLowerCase().includes("delivered")) return "#29CC39";
    if (status.toLowerCase().includes("in transit")) return "#5380F5";
    // if (status.toLowerCase().includes("ready for dispatch")) return "#FEDB4F";

    return "#FEDB4F";
}

/** In-memory cache for extra-info detail responses, keyed by result uuid */
export type AntiFraudResultDetailsCache = Record<string, AntiFraudResultObject>;
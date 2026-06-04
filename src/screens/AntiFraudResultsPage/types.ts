import {AntiFraudActionType, ANTIFRAUD_ACTIONS} from "@/screens/AntiFraudSettingsPage/types";

export type PremiumProductTypeResultsType = {
    [key: string]: {
        ordersCount: number;
        succesfull: number;
        failure: number;
        ransom: number;
        averageCheck: number;
        averageProductsCount: number;
        orderHasProduct: boolean;
    }
}

export type AntiFraudExtendedResultsType = {
    ordersCount: number,
    succesfull: number;
    failure: number;
    ransom: number;
    averageCheck: number;
    averageProductsCount: number;
    productsTypes: string[] | PremiumProductTypeResultsType;
}


export type AntiFraudResultObject = {
    //standard
    subscription: string,
    zone: string,
    action: AntiFraudActionType,
    status: string,

    //extended
    antiFraudResult?: AntiFraudExtendedResultsType,
}

export type AntiFraudResultType = {
    uuid: string;
    requestPeriod: string;
    shipmentOrder: string;
    phoneNumber: string;
    subscription: string;
    successfullPercent: number;
    zone: string;
    action: ANTIFRAUD_ACTIONS;
    accrualServices: string; //for now, change later
    status: string;
    numberForDisplay?: string;
    result?: AntiFraudResultObject;
}

/** In-memory cache for extra-info detail responses, keyed by result uuid */
export type AntiFraudResultDetailsCache = Record<string, AntiFraudResultObject>;
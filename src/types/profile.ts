// "path": "Delivery protocols/Test",
//     "name": "UpdateStatusHistory.epf",
//     "uuid": "e83a0e3f-00ac-11ef-af7c-04421a1aac94"

export type ApiProtocolType = {
    path: string;
    name: string;
    uuid: string;
}


export type UserPriceType = {
    //country: string;
    name: string;
    uuid: string;
    startDate: string;
    endDate: string;
}

export type UserContractType = {
    uuid: string;
    name: string;
    startDate: string;
    endDate: string;
}
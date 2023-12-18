export type CodReportType = {
    tableKey: string,
    uuid: string;
    number: string,
    date: string,
    amount: number,
    period: string,
    currency: string;
    ordersCount:number,
}


export type CODIndicatorType = {
    currency: string;
    amount: number;
}

export type CODIndicatorsType = {
    yearAmount?: CODIndicatorType[];
    monthAmount?: CODIndicatorType[];
    currentAmount?: CODIndicatorType[];
}
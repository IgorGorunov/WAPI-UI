
export enum COD_REPORT_VARIANTS  {
    OFF = 'Without grouping',
    COD_REPORT = 'COD report',
}

export type CodReportRowType = {
    order: string;
    status: string;
    deliveryDate: string;
    codReport: string;
    currency: string;
    codAmount: number;
    reported: number;
    codBalance: string;
}


export type CodReportReportType = {
    reportData: CodReportRowType[];
}

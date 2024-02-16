export enum SALE_DYNAMIC_VARIANTS  {
    COUNTRY = 'Country',
}

export type SaleDynamicRowType = {
    country: string;
    countryCode: string;
}

export type SaleDynamicReportType = {
    reportData: SaleDynamicRowType[];
}

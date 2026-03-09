export enum SALE_DYNAMIC_VARIANTS  {
    COUNTRY = 'Country',
}

export type SaleDynamicRowType = {
    country: string;
    countryCode: string;

    seller?: string;
}

export type SaleDynamicReportType = {
    reportData: SaleDynamicRowType[];
}

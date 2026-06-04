import type { BaseFilterMetadata, FilterType } from "@/types/filters";

export type AmazonPrepFilters = {
    receiverCountry?: string | string[];
    status?: string | string[];
    warehouse?: string | string[];
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
    search?: string;
    fullTextSearch?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    seller?: string;
};

export type AmazonPrepFilterDataType = BaseFilterMetadata & {
    receiverCountry?: FilterType[];
    statuses?: FilterType[];
    warehouses?: FilterType[];
};

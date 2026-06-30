import type { BaseFilterMetadata, FilterType } from "@/types/filters";

export type TicketsFilters = {
    status?: string;
    topic?: string;
    newMessages?: string;
    documentType?: string;
    warehouse?: string;
    receiverCountry?: string;
    courierService?: string;
    seller?: string;
}

export type TicketFilterDataType = BaseFilterMetadata & {
    statuses?: FilterType[];
    topic?: FilterType[];
    countNewMessages?: number;
    documentType?: FilterType[];
    warehouse?: FilterType[];
    receiverCountry?: FilterType[];
    courierService?: FilterType[];
    total?: number;
}

import type { BaseFilterMetadata, FilterType } from "@/types/filters";

/**
 * StockMovement-specific filter keys for use with usePagedListState<StockMovementsFilters>
 * These are the filter URL params specific to the StockMovements page.
 * Base pagination/date/search params are handled by the hook itself.
 */
export type StockMovementsFilters = {
    status?: string;
    sender?: string;
    senderCountry?: string;
    receiver?: string;
    receiverCountry?: string;
    seller?: string;
    tickets?: string;
    openTickets?: string;
}

/**
 * Shape of filter metadata returned by the backend for StockMovements.
 * Extends BaseFilterMetadata so it can be used with useFilterMetadata<T>.
 */
export type StockMovementFilterDataType = BaseFilterMetadata & {
    statuses?: FilterType[];
    senders?: FilterType[];
    senderCountries?: FilterType[];
    receivers?: FilterType[];
    receiverCountries?: FilterType[];
    countTicket?: number;
    countTicketOpen?: number;
    total?: number;
}

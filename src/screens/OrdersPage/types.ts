/**
 * Order-specific filter keys for use with usePagedListState<OrdersFilters>
 * These are the filter URL params specific to the Orders page.
 * Base pagination/date/search params are handled by the hook itself.
 */
export type OrdersFilters = {
    status?: string;
    warehouse?: string;
    courierService?: string;
    troubleStatus?: string;
    nonTroubleStatus?: string;
    marketplace?: string;
    seller?: string;
    receiverCountry?: string;
    claims?: string;
    logisticComment?: string;
    commentToCourierService?: string;
    selfCollect?: string;
    sentSMS?: string;
    tickets?: string;
    openTickets?: string;
    photos?: string;
    customerReturns?: string;
}

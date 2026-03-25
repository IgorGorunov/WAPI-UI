import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { ApiResponseType } from '@/types/api';
import { PagedListUrlState } from './usePagedListState';

export type FilterValue = string | number | boolean | string[] | boolean[];

type SortPayload = {
    column: string;
    sortOrder: string;
};

type RequestPayload = {
    token: string;
    startDate: string;
    endDate: string;
    // client: string;
    page: number;
    limit: number;
    alias?: string;
    ui?: string;
    search?: string;
    fullTextSearch?: boolean;
    sort?: SortPayload;
    filter?: Record<string, FilterValue>;
};

type UsePagedDataOptions = {
    token: string;
    alias?: string;
    ui?: string;
    enabled?: boolean; // If false, don't fetch
}

type PagedResponse<T> = {
    data: T[];
    count?: number;
    page?: number;
    limit?: number;
}

export const processFiltersForApi = (filters?: Record<string, FilterValue>) => {
    if (!filters || Object.keys(filters).length === 0) {
        return undefined;
    }

    const processedFilters: Record<string, FilterValue> = {};
    Object.entries(filters).forEach(([key, value]) => {
        // Skip undefined, null, or empty string values
        if (value === undefined || value === null || value === '') {
            return;
        }

        if (value === 'true') {
            processedFilters[key] = [true];
        } else if (value === 'false') {
            processedFilters[key] = [false];
        } else if (typeof value === 'string') {
            // Convert comma-separated strings to array, and wrap single values in array
            // This ensures backend receives ["id1", "id2"] or ["id1"] instead of strings
            processedFilters[key] = value.includes(',') ? value.split(',') : [value];
        } else {
            processedFilters[key] = value as FilterValue;
        }
    });

    // Only attach filter object if we have actual filters
    const actualFilters: Record<string, FilterValue> = {};

    Object.entries(processedFilters).forEach(([key, val]) => {
        // Check for boolean "All" case (both true and false selected)
        // Value can be array or comma-separated string
        let valuesArray: string[] = [];
        if (Array.isArray(val)) {
            valuesArray = val.map(v => String(v));
        } else if (typeof val === 'string') {
            valuesArray = val.split(',');
        } else {
            valuesArray = [String(val)];
        }

        if (valuesArray.includes('true') && valuesArray.includes('false')) {
            return; // Skip this filter completely (implies All)
        }

        actualFilters[key] = val;
    });

    if (Object.keys(actualFilters).length > 0) {
        return actualFilters;
    }
    
    return undefined;
};

/**
 * Universal hook for fetching paginated data from any endpoint
 * Automatically refetches when state changes
 */
export function usePagedData<TData = object>(
    endpoint: string,
    state: PagedListUrlState,
    options: UsePagedDataOptions
) {
    const { token, alias, ui, enabled = true } = options;

    const [data, setData] = useState<TData[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Parse filters from state (excluding pagination and date fields)
                const { page, limit, startDate, endDate, search, fullTextSearch, sortBy, sortOrder, filters } = state;

                // Build request payload
                const requestData: RequestPayload = {
                    // tempToken: "qwert123456BVCXZ",
                    token: token,
                    startDate: state.startDate,
                    endDate: state.endDate,
                    // client: "1207df90-c9c2-11ee-af7c-04421a1aac94",
                    ui: ui || '',
                    page: page || 1,
                    limit: limit || 10,
                };

                // Add optional fields
                if (alias) requestData.alias = alias;
                if (ui) requestData.ui = ui;
                if (search) requestData.search = search;
                if (fullTextSearch) requestData.fullTextSearch = fullTextSearch;
                if (sortBy) {
                    requestData.sort = {
                        column: sortBy,
                        sortOrder: (sortOrder || 'desc').toUpperCase(),
                    };
                }

                // Add filters (convert string "true"/"false" to actual booleans for API)
                const apiFilters = processFiltersForApi(filters as Record<string, FilterValue>);
                if (apiFilters) {
                    requestData.filter = apiFilters;
                }

                const response: ApiResponseType<PagedResponse<TData>> = await api.post(endpoint, requestData);

                if (response && 'data' in response) {
                    const responseData = response.data;

                    // Handle both direct array and paginated response formats
                    if (Array.isArray(responseData)) {
                        setData(responseData);
                        setCount(responseData.length);
                    } else if (responseData && 'data' in responseData) {
                        setData(responseData.data);
                        setCount(responseData.count || responseData.data.length);
                    } else {
                        console.warn('Unexpected response format from', endpoint);
                        setData([]);
                        setCount(0);
                    }
                } else {
                    console.error('API did not return expected data from', endpoint);
                    setData([]);
                    setCount(0);
                }
            } catch (err) {
                console.error('Error fetching data from', endpoint, err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
                setData([]);
                setCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [
        endpoint,
        state.page,
        state.limit,
        state.startDate,
        state.endDate,
        state.search,
        state.fullTextSearch,
        state.sortBy,
        state.sortOrder,
        JSON.stringify(state.filters), // Serialize object to stable string
        token,
        alias,
        ui,
        enabled
    ]);

    return {
        data,
        count,
        isLoading,
        error,
    };
}

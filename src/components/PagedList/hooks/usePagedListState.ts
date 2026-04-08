import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { formatDateToString } from '@/utils/date';
import { DateRangeType } from '@/types/dashboard';

/** Primitive values that can be written to the URL query string */
type UrlQueryValue = string | number | boolean | undefined;

/** Broader pre-serialisation value (arrays are joined before hitting the URL) */
type UrlValue = UrlQueryValue | string[];

/**
 * The flat URL parameter shape — only primitives, suitable for Next.js router.query.
 * Used as the parameter type for usePagedData.
 */
export type PagedListUrlState = {
    page: number;
    limit: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    fullTextSearch?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    /** Raw filter values parsed from URL string keys (comma-separated strings) */
    filters: Record<string, UrlValue>;
}

type UsePagedListStateOptions = {
    defaultPageSize?: number;
    defaultDateRange?: DateRangeType;
    defaultSortBy?: string;
    defaultSortOrder?: 'asc' | 'desc';
    disableDateRange?: boolean;
}

/**
 * Universal hook for managing paginated list state via URL parameters
 * Supports pagination, date range, search, and custom filters
 * All state is synced with URL for shareability and browser navigation
 */
export function usePagedListState<TFilters extends Record<string, UrlValue> = Record<string, UrlValue>>(
    defaultFilters: Partial<TFilters> = {},
    options: UsePagedListStateOptions = {}
) {
    const router = useRouter();
    const { defaultPageSize = 10, defaultDateRange, defaultSortBy, defaultSortOrder, disableDateRange = false } = options;

    // Parse all state from URL parameters
    const state = useMemo(() => {
        const query = router.query;

        // Get default dates if provided and not disabled
        const defaultStart = !disableDateRange && defaultDateRange
            ? formatDateToString(defaultDateRange.startDate)
            : !disableDateRange ? formatDateToString(new Date()) : undefined;
        const defaultEnd = !disableDateRange && defaultDateRange
            ? formatDateToString(defaultDateRange.endDate)
            : !disableDateRange ? formatDateToString(new Date()) : undefined;

        // Parse filters from URL (excluding reserved keys)
        const reservedKeys = ['page', 'limit', 'startDate', 'endDate', 'search', 'fullTextSearch', 'sortBy', 'sortOrder'];
        const filters: Partial<TFilters> = { ...defaultFilters };

        Object.keys(query).forEach(key => {
            if (!reservedKeys.includes(key) && query[key]) {
                (filters as Record<string, UrlValue>)[key] = query[key] as string;
            }
        });

        const resultState: PagedListUrlState = {
            page: Number(query.page) || 1,
            limit: Number(query.limit) || defaultPageSize,
            search: (query.search as string) || '',
            fullTextSearch: query.fullTextSearch === 'true',
            sortBy: (query.sortBy as string) || defaultSortBy,
            sortOrder: ((query.sortOrder as 'asc' | 'desc') || defaultSortOrder) ?? undefined,
            filters,
        };

        if (!disableDateRange) {
            resultState.startDate = (query.startDate as string) || defaultStart;
            resultState.endDate = (query.endDate as string) || defaultEnd;
        }

        return resultState as any; // typed implicitly above but generic filters makes it tricky
    }, [router.query, defaultPageSize, defaultDateRange, defaultSortBy, defaultSortOrder, disableDateRange]);

    // Update URL with new state (shallow routing)
    const updateState = useCallback((updates: Record<string, UrlQueryValue>) => {
        const newQuery = { ...router.query };

        // Apply updates
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === '' || value === null) {
                delete newQuery[key];
            } else {
                newQuery[key] = String(value);
            }
        });

        router.push(
            {
                pathname: router.pathname,
                query: newQuery,
            },
            undefined,
            { shallow: true }
        );
    }, [router]);

    // Helper: Update date period (always reset to page 1)
    const updatePeriod = useCallback((startDate: Date, endDate: Date) => {
        updateState({
            startDate: formatDateToString(startDate),
            endDate: formatDateToString(endDate),
            page: 1,
        });
    }, [updateState]);

    // Helper: Update filters (always reset to page 1)
    const updateFilters = useCallback((newFilters: Partial<TFilters>) => {
        const updates: Record<string, UrlQueryValue> = { page: 1 };

        Object.entries(newFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Convert arrays to comma-separated strings for URL
                updates[key] = value.length > 0 ? value.join(',') : undefined;
            } else {
                updates[key] = value as UrlQueryValue;
            }
        });

        updateState(updates);
    }, [updateState]);

    // Helper: Update search + fullTextSearch together (always reset to page 1)
    // When search is empty, fullTextSearch is also cleared from the URL
    const updateSearch = useCallback((search: string, fullTextSearch?: boolean) => {
        updateState({
            search: search || undefined,
            page: 1,
            fullTextSearch: search ? fullTextSearch : undefined,
        });
    }, [updateState]);

    // Helper: Update page
    const updatePage = useCallback((page: number) => {
        updateState({ page });
    }, [updateState]);

    // Helper: Update page size (always reset to page 1)
    const updatePageSize = useCallback((limit: number) => {
        updateState({ limit, page: 1 });
    }, [updateState]);

    // Helper: Update sort (always reset to page 1)
    const updateSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        updateState({ sortBy, sortOrder, page: 1 });
    }, [updateState]);

    // Helper: Toggle full text search
    const toggleFullTextSearch = useCallback(() => {
        updateState({
            fullTextSearch: !state.fullTextSearch,
            page: 1,
        });
    }, [state.fullTextSearch, updateState]);

    // Helper: Set full text search to an explicit value
    const updateFullTextSearch = useCallback((value: boolean) => {
        updateState({ fullTextSearch: value, page: 1 });
    }, [updateState]);

    // Helper: Clear all filters
    const clearAllFilters = useCallback(() => {
        const clearedQuery: Record<string, string | number> = {
            page: 1,
            limit: state.limit,
        };

        if (!disableDateRange && state.startDate && state.endDate) {
            clearedQuery.startDate = state.startDate;
            clearedQuery.endDate = state.endDate;
        }

        router.push(
            {
                pathname: router.pathname,
                query: clearedQuery,
            },
            undefined,
            { shallow: true }
        );
    }, [router, state.limit, state.startDate, state.endDate, disableDateRange]);

    // Helper: Add a value to a specific filter (handling comma-separated arrays)
    const addFilterValue = useCallback((key: keyof TFilters, value: string) => {
        const currentVal = state.filters[key];
        let newValues: string[] = [];

        if (Array.isArray(currentVal)) {
            newValues = [...currentVal];
        } else if (typeof currentVal === 'string' && currentVal) {
            newValues = currentVal.split(',');
        }

        if (!newValues.includes(value)) {
            newValues.push(value);
            updateFilters({ [key]: newValues } as Partial<TFilters>);
        }
    }, [state.filters, updateFilters]);

    // Helper: Remove a value from a specific filter
    const removeFilterValue = useCallback((key: keyof TFilters, value: string) => {
        const currentVal = state.filters[key];
        let newValues: string[] = [];

        if (Array.isArray(currentVal)) {
            newValues = [...currentVal];
        } else if (typeof currentVal === 'string' && currentVal) {
            newValues = currentVal.split(',');
        }

        if (newValues.includes(value)) {
            newValues = newValues.filter(v => v !== value);
            updateFilters({ [key]: newValues } as Partial<TFilters>);
        }
    }, [state.filters, updateFilters]);

    return {
        state,
        updatePeriod,
        updateFilters,
        addFilterValue,
        removeFilterValue,
        updateSearch,
        updatePage,
        updatePageSize,
        updateSort,
        toggleFullTextSearch,
        updateFullTextSearch,
        clearAllFilters,
    };
}

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { ApiResponseType } from '@/types/api';
import { BaseFilterMetadata } from "@/types/filters";

type UseFilterMetadataOptions = {
    token: string;
    alias?: string;
    ui?: string;
    enabled?: boolean;
    /** Extra fields merged into the request payload (e.g. { documentType: 'Inbound' }) */
    extraParams?: Record<string, string | number | boolean>;
}

/**
 * Universal hook for fetching filter metadata (counts, available options)
 * from a backend endpoint
 */
export function useFilterMetadata<
    TMetadata extends BaseFilterMetadata
>(
    endpoint: string,
    state: {
        startDate?: string;
        endDate?: string;
    },
    options: UseFilterMetadataOptions
) {
    const { token, alias, ui, enabled = true, extraParams } = options;

    const [metadata, setMetadata] = useState<TMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!enabled || !token) {
            return;
        }

        const fetchMetadata = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const requestData: Record<string, string | number | boolean> = {
                    token,
                    ui: ui || '',
                };

                if (state.startDate) requestData.startDate = state.startDate;
                if (state.endDate) requestData.endDate = state.endDate;

                if (alias) requestData.alias = alias;
                if (ui) requestData.ui = ui;

                // Merge any caller-supplied extra params (e.g. documentType)
                if (extraParams) {
                    Object.assign(requestData, extraParams);
                }

                const response: ApiResponseType<TMetadata> = await api.post(endpoint, requestData);

                if (response && 'data' in response) {
                    setMetadata(response.data);
                } else {
                    console.error('API did not return expected metadata from', endpoint);
                    setMetadata(null);
                }
            } catch (err) {
                console.error('Error fetching filter metadata from', endpoint, err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
                setMetadata(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetadata();
    }, [endpoint, state.startDate, state.endDate, token, alias, ui, enabled, JSON.stringify(extraParams)]);

    return {
        metadata,
        isLoading,
        error,
    };
}

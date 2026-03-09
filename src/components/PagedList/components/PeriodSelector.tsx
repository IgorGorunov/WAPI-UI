import React, { useMemo } from 'react';
import DateInput from '@/components/DateInput';
import { DateRangeType } from '@/types/dashboard';

type PeriodSelectorProps = {
    startDate: string; // ISO date string from URL
    endDate: string;   // ISO date string from URL
    onPeriodChange: (startDate: Date, endDate: Date) => void;
    className?: string;
}

/**
 * Universal period selector component
 * Syncs with URL state via parent hooks
 */
export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
    startDate,
    endDate,
    onPeriodChange,
    className,
}) => {
    // Convert ISO strings to Date objects for DateInput
    const currentRange = useMemo<DateRangeType>(() => ({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    }), [startDate, endDate]);

    const handleSave = (newRange: DateRangeType) => {
        onPeriodChange(newRange.startDate, newRange.endDate);
    };

    return (
        <DateInput
            currentRange={currentRange}
            handleRangeChange={handleSave}
        />
    );
};

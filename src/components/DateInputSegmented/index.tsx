import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export interface DateInputSegmentedProps {
    dateStr: string;
    onChange: (val: string) => void;
    id?: string;
    onEnter?: () => void;
}

const DateInputSegmented: React.FC<DateInputSegmentedProps> = ({ dateStr, onChange, id, onEnter }) => {
    const parts = dateStr.split('.');
    const [day, setDay] = useState(parts[0] || '');
    const [month, setMonth] = useState(parts[1] || '');
    const [year, setYear] = useState(parts[2] || '');

    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const p = dateStr.split('.');
        if (p.length === 3) {
            // Only update local state if the user is NOT actively typing in that specific field.
            // This prevents the parent's formatting (like leading zeros) from interrupting their keystrokes.
            if (document.activeElement !== dayRef.current) setDay(p[0]);
            if (document.activeElement !== monthRef.current) setMonth(p[1]);
            if (document.activeElement !== yearRef.current) setYear(p[2]);
        }
    }, [dateStr]);

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const cleaned = val.replace(/\D/g, '');
        setDay(cleaned);
        
        if (cleaned.length >= 2 || val.includes('.')) {
            setTimeout(() => {
                monthRef.current?.focus();
                monthRef.current?.select();
            }, 10);
        }
        onChange(`${cleaned}.${month}.${year}`);
    }

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const cleaned = val.replace(/\D/g, '');
        setMonth(cleaned);
        
        if (cleaned.length >= 2 || val.includes('.')) {
            setTimeout(() => {
                yearRef.current?.focus();
                yearRef.current?.select();
            }, 10);
        }
        onChange(`${day}.${cleaned}.${year}`);
    }

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        setYear(val);
        onChange(`${day}.${month}.${val}`);
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select();
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
        e.preventDefault(); // Prevents browser from placing the cursor
        e.currentTarget.focus();
        e.currentTarget.select();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'day' | 'month' | 'year') => {
        if (e.key === 'ArrowRight') {
            if (field === 'day') {
                e.preventDefault();
                monthRef.current?.focus();
                monthRef.current?.select();
            } else if (field === 'month') {
                e.preventDefault();
                yearRef.current?.focus();
                yearRef.current?.select();
            }
        } else if (e.key === 'ArrowLeft') {
            if (field === 'year') {
                e.preventDefault();
                monthRef.current?.focus();
                monthRef.current?.select();
            } else if (field === 'month') {
                e.preventDefault();
                dayRef.current?.focus();
                dayRef.current?.select();
            }
        } else if (e.key === 'Enter' && onEnter && field === 'year') {
            onEnter();
        }
    }

    const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT') {
            e.preventDefault();
            dayRef.current?.focus();
            dayRef.current?.select();
        }
    }

    return (
        <div className={styles['segmented-input-container']} onPointerDown={handleContainerPointerDown}>
            <input id={id} type="text" placeholder="dd" value={day} onChange={handleDayChange} onFocus={handleFocus} onPointerDown={handlePointerDown} onKeyDown={(e) => handleKeyDown(e, 'day')} maxLength={3} ref={dayRef} />
            <span>.</span>
            <input type="text" placeholder="mm" value={month} onChange={handleMonthChange} onFocus={handleFocus} onPointerDown={handlePointerDown} onKeyDown={(e) => handleKeyDown(e, 'month')} maxLength={3} ref={monthRef} />
            <span>.</span>
            <input type="text" placeholder="yyyy" value={year} onChange={handleYearChange} onFocus={handleFocus} onPointerDown={handlePointerDown} onKeyDown={(e) => handleKeyDown(e, 'year')} maxLength={4} ref={yearRef} className={styles['year-input']} />
        </div>
    )
}

export default DateInputSegmented;

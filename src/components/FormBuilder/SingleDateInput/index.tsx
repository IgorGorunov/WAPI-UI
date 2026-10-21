'use client'
import React, { useState, forwardRef, useRef, useLayoutEffect, useEffect } from "react";
import { Calendar } from 'react-date-range';

import TimePicker from 'react-time-picker';

import styles from "./styles.module.scss";
import { FieldPropsType } from "@/types/forms";
import {
    addWorkingDays, formatDateToDisplayString,
    formatDateToDisplayStringWithTime, setTimeToDate
} from '@/utils/date'
import Icon from "@/components/Icon";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import Draggable from 'react-draggable';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    size,
    useDismiss,
    useInteractions,
    FloatingPortal,
    FloatingFocusManager,
} from "@floating-ui/react";

export const EMPTY_DATE_AS_STRING = '0001-01-01T00:00:00';
export const EMPTY_DATE_AS_STRING2 = '1901-01-01T00:00:00';
export const EMPTY_DATE = new Date(EMPTY_DATE_AS_STRING);
export const isDateEmpty = (date: Date) => {
    if (!date || isNaN(date.getTime())) return true;
    return date.getFullYear() === 1 || date.getFullYear() === 1901;
}

export const parseDateString = (
    val: string,
    inputType: string = 'date',
    defaultTime: string = '12:00'
): Date | null => {
    if (!val || !val.trim()) return null;

    const trimmed = val.trim();
    let datePart = trimmed;
    let timePart = '';

    if (trimmed.includes('T')) {
        [datePart, timePart] = trimmed.split('T');
    } else if (trimmed.includes(' ')) {
        const parts = trimmed.split(/\s+/);
        datePart = parts[0];
        timePart = parts.slice(1).join(' ');
    }

    let day = 0;
    let month = 0;
    let year = 0;

    const separators = /[./-]/;
    if (separators.test(datePart)) {
        const parts = datePart.split(separators);
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                // YYYY-MM-DD
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                day = parseInt(parts[2], 10);
            } else {
                // DD.MM.YYYY
                day = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                year = parseInt(parts[2], 10);
                if (parts[2].length === 2) {
                    year += 2000;
                }
            }
        } else {
            return null;
        }
    } else if (/^\d{8}$/.test(datePart)) {
        // DDMMYYYY
        day = parseInt(datePart.slice(0, 2), 10);
        month = parseInt(datePart.slice(2, 4), 10) - 1;
        year = parseInt(datePart.slice(4, 8), 10);
    } else {
        return null;
    }

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (month < 0 || month > 11) return null;
    if (day < 1 || day > 31) return null;
    if (year < 1900 || year > 2100) return null;

    let hours = 12;
    let minutes = 0;

    if (inputType === 'date-time') {
        const timeToUse = timePart || defaultTime || '12:00';
        const [h, m] = timeToUse.split(':');
        const parsedH = parseInt(h, 10);
        const parsedM = parseInt(m, 10);
        if (!isNaN(parsedH) && !isNaN(parsedM) && parsedH >= 0 && parsedH <= 23 && parsedM >= 0 && parsedM <= 59) {
            hours = parsedH;
            minutes = parsedM;
        }
    }

    const parsedDate = new Date(year, month, day, hours, minutes, 0, 0);
    if (isNaN(parsedDate.getTime())) return null;

    if (parsedDate.getDate() !== day || parsedDate.getMonth() !== month || parsedDate.getFullYear() !== year) {
        return null;
    }

    return parsedDate;
};

export const formatDateMask = (
    val: string,
    prevVal: string = '',
    isDateTime: boolean = false
): string => {
    if (!val) return '';

    // If backspacing a dot
    if (prevVal && prevVal.endsWith('.') && val === prevVal.slice(0, -1)) {
        val = val.slice(0, -1);
    }
    // If backspacing a colon in time
    if (prevVal && prevVal.endsWith(':') && val === prevVal.slice(0, -1)) {
        val = val.slice(0, -1);
    }

    // Check if ISO date was pasted: YYYY-MM-DD or YYYY.MM.DD
    const isoMatch = val.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(.*)$/);
    if (isoMatch) {
        const y = isoMatch[1];
        const m = isoMatch[2].padStart(2, '0');
        const d = isoMatch[3].padStart(2, '0');
        const rest = isoMatch[4] || '';
        val = `${d}.${m}.${y}${rest}`;
    }

    let dateInput = val;
    let timeInput = '';

    if (val.includes(' ')) {
        const spaceIdx = val.indexOf(' ');
        dateInput = val.slice(0, spaceIdx);
        timeInput = val.slice(spaceIdx).trimStart();
    } else if (val.length > 10 && !val.includes('.')) {
        // e.g. 111120201430
        dateInput = val.slice(0, 8);
        timeInput = val.slice(8);
    }

    const rawParts = dateInput.split('.');
    let day = '';
    let month = '';
    let year = '';

    if (rawParts.length > 1) {
        day = rawParts[0].replace(/\D/g, '');
        // If user typed e.g. "5.", pad day to "05"
        if (day.length === 1 && (rawParts.length > 2 || rawParts[1] !== '' || val.includes('.'))) {
            if (dateInput.startsWith(day + '.')) {
                day = day.padStart(2, '0');
            }
        }

        if (rawParts.length === 2) {
            const rawMonth = rawParts[1].replace(/\D/g, '');
            month = rawMonth.slice(0, 2);
            if (rawMonth.length > 2) {
                year = rawMonth.slice(2, 6);
            }
        } else if (rawParts.length >= 3) {
            month = rawParts[1].replace(/\D/g, '');
            if (month.length === 1 && (rawParts.length > 3 || rawParts[2] !== '' || dateInput.endsWith('.'))) {
                month = month.padStart(2, '0');
            }
            year = rawParts[2].replace(/\D/g, '').slice(0, 4);
        }
    } else {
        // Pure digits without dots
        const clean = dateInput.replace(/\D/g, '');
        day = clean.slice(0, 2);
        month = clean.slice(2, 4);
        year = clean.slice(4, 8);
    }

    day = day.slice(0, 2);
    month = month.slice(0, 2);
    year = year.slice(0, 4);

    let result = day;
    if (day.length === 2) {
        result += '.';
        if (month.length > 0) {
            result += month;
            if (month.length === 2) {
                result += '.';
                if (year.length > 0) {
                    result += year;
                }
            }
        }
    } else if (rawParts.length > 1 && day.length > 0) {
        result = day.padStart(2, '0') + '.';
    }

    if (isDateTime && result.length === 10) {
        const cleanTime = timeInput.replace(/[^\d:]/g, '');
        if (cleanTime.length > 0 || val.endsWith(' ')) {
            result += '  ';
            const timeParts = cleanTime.split(':');
            let hours = timeParts[0] ? timeParts[0].slice(0, 2) : '';
            let minutes = timeParts[1] ? timeParts[1].slice(0, 2) : '';
            if (cleanTime.length >= 2 && !cleanTime.includes(':')) {
                hours = cleanTime.slice(0, 2);
                minutes = cleanTime.slice(2, 4);
            }
            if (hours) {
                result += hours;
                if (hours.length === 2) {
                    result += ':';
                    if (minutes) {
                        result += minutes;
                    }
                }
            }
        }
    }

    return result;
};

type Bounds = { left: number; right: number; top: number; bottom: number };

const SingleDateInput = forwardRef<HTMLInputElement, FieldPropsType>(({
    classNames = '',
    name,
    label = '',
    type = 'date',
    onChange,
    isRequired = false,
    placeholder = '',
    errorMessage,
    disabled,
    value = '',
    width,
    isClearable = false,
    hint = '',
    disableWeekends = false,
    disablePreviousDays = false,
    disableDaysAfterToday = 0,
    disableDaysTime = '0',
    allowManualInput = false,
    isManualInput = false,
    manualInput = false,
    maxLength,
    placeholderColor,
}, ref) => {

    const manualAllowed = !!(allowManualInput || isManualInput || manualInput);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
    };

    const getDate = (dateVal: string | Date | undefined | null) => {
        if (!dateVal) return EMPTY_DATE;
        if (dateVal instanceof Date) {
            return isNaN(dateVal.getTime()) ? EMPTY_DATE : dateVal;
        }
        const d = new Date(dateVal);
        return isNaN(d.getTime()) ? EMPTY_DATE : d;
    };

    const formatDisplay = (d: Date) => {
        if (isDateEmpty(d)) return "";
        return type === "date"
            ? formatDateToDisplayString(d)
            : formatDateToDisplayStringWithTime(d);
    };

    const getTimeFromDateStr = (dateVal: string | Date | undefined | null) => {
        if (!dateVal) {
            const cur = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${pad(cur.getHours())}:${pad(cur.getMinutes())}`;
        }
        const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
        if (isNaN(d.getTime()) || isDateEmpty(d)) {
            const cur = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${pad(cur.getHours())}:${pad(cur.getMinutes())}`;
        }
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const disableDays = (date: Date) => {
        let isDisabled = false;
        if (disableWeekends) {
            const dayOfWeek = date.getDay();
            isDisabled = dayOfWeek === 0 || dayOfWeek === 6;
        }
        if (disablePreviousDays) {
            isDisabled = isDisabled || date < addWorkingDays(disableDaysAfterToday, disableDaysTime);
        }
        return isDisabled;
    };

    const [selectedDate, setSelectedDate] = useState<Date>(getDate(value as string));
    const [inputValue, setInputValue] = useState<string>(formatDisplay(getDate(value as string)));
    const [open, setOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedTime, setSelectedTime] = useState(getTimeFromDateStr(value as string));

    useEffect(() => {
        const newDate = getDate(value as string);
        setSelectedDate(newDate);
        if (type === 'date-time' && value && !isDateEmpty(newDate)) {
            setSelectedTime(getTimeFromDateStr(value as string));
        }
        if (document.activeElement !== inputRef.current) {
            setInputValue(formatDisplay(newDate));
        }
    }, [value, type]);

    // Floating UI: position calendar relative to the input wrapper
    const {
        refs,
        floatingStyles,
        context
    } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: "bottom-start",
        strategy: 'fixed',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(8),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
            // Make the popover at least as wide as the input
            size({
                apply({ elements, rects }) {
                    Object.assign(elements.floating.style, {
                        minWidth: `${rects.reference.width}px`,
                        maxWidth: "min(100vw - 16px, 480px)",
                        maxHeight: "calc(100vh - 24px)",
                    });
                },
            }),
        ],
    });

    const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
    const { getFloatingProps } = useInteractions([dismiss]);

    const handleDateSelect = (date: Date) => {
        const newDate = setTimeToDate(date, type === 'date-time' ? selectedTime : `12:00`);
        setSelectedDate(newDate);
        setInputValue(formatDisplay(newDate));
        setOpen(false);
        if (onChange) onChange(newDate.toISOString());
    };

    const handleTimeSelect = (time: string | null) => {
        if (!time) {
            return;
        }
        setSelectedTime(time);
        const newDate = setTimeToDate(selectedDate, time);
        setSelectedDate(newDate);
        setInputValue(formatDisplay(newDate));

        if (onChange) onChange(newDate.toISOString());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!manualAllowed) return;
        const inputElement = e.target;
        const rawVal = inputElement.value;
        const prevVal = inputValue;
        const selectionStart = inputElement.selectionStart;

        // Allow digits, '.', '/', '-', and for date-time ' ' and ':'
        const allowedPattern = type === 'date-time' ? /^[0-9./\- :]*$/ : /^[0-9./\-]*$/;
        if (!allowedPattern.test(rawVal)) {
            return;
        }

        const formatted = formatDateMask(rawVal, prevVal, type === 'date-time');
        setInputValue(formatted);

        // Adjust cursor position if auto-mask added a dot
        if (inputElement && selectionStart !== null) {
            if (formatted.length > rawVal.length && selectionStart === formatted.length - 1) {
                requestAnimationFrame(() => {
                    inputElement.setSelectionRange(formatted.length, formatted.length);
                });
            }
        }

        const parsed = parseDateString(formatted, type, selectedTime);
        if (parsed && !disableDays(parsed)) {
            setSelectedDate(parsed);
            if (onChange) onChange(parsed.toISOString());
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!manualAllowed) return;
        const trimmed = inputValue.trim();
        if (!trimmed) {
            setSelectedDate(EMPTY_DATE);
            setInputValue("");
            if (onChange) {
                const emptyDateWithTime = setTimeToDate(EMPTY_DATE, type === 'date-time' ? selectedTime : '12:00');
                onChange(emptyDateWithTime.toISOString());
            }
            return;
        }

        const parsed = parseDateString(trimmed, type, selectedTime);
        if (parsed && !disableDays(parsed)) {
            setSelectedDate(parsed);
            setInputValue(formatDisplay(parsed));
            if (onChange) onChange(parsed.toISOString());
        } else {
            setInputValue(formatDisplay(selectedDate));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (manualAllowed) {
                const trimmed = inputValue.trim();
                if (!trimmed) {
                    setSelectedDate(EMPTY_DATE);
                    setInputValue("");
                    if (onChange) {
                        const emptyDateWithTime = setTimeToDate(EMPTY_DATE, type === 'date-time' ? selectedTime : '12:00');
                        onChange(emptyDateWithTime.toISOString());
                    }
                } else {
                    const parsed = parseDateString(trimmed, type, selectedTime);
                    if (parsed && !disableDays(parsed)) {
                        setSelectedDate(parsed);
                        setInputValue(formatDisplay(parsed));
                        if (onChange) onChange(parsed.toISOString());
                    } else {
                        setInputValue(formatDisplay(selectedDate));
                    }
                }
                inputRef.current?.blur();
            }
        }
    };

    const handleInputClick = () => {
        if (disabled) return;
        if (!manualAllowed) {
            setOpen((v) => !v);
        } else if (open) {
            setOpen(false);
        }
    };

    const handleInputFocus = () => {
        setIsFocused(true);
        if (manualAllowed && open) {
            setOpen(false);
        }
    };

    const [dragBounds, setDragBounds] = useState<Bounds | undefined>(undefined);
    const calendarRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!open || !calendarRef.current) return;
        const rect = calendarRef.current.getBoundingClientRect();

        // How far we can move in each direction without leaving the viewport
        const left = -rect.left;
        const top = -rect.top;
        const right = window.innerWidth - rect.right;
        const bottom = window.innerHeight - rect.bottom;

        setDragBounds({ left, top, right, bottom });
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onResize = () => {
            if (!calendarRef.current) return;
            const r = calendarRef.current.getBoundingClientRect();
            setDragBounds({
                left: -r.left,
                top: -r.top,
                right: window.innerWidth - r.right,
                bottom: window.innerHeight - r.bottom,
            });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [open]);

    return (
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-" + width : ""}`}>
            <div className={`form-control ${styles['form-control-date'] || 'form-control-date'} form-control-date ${classNames ? classNames : ""} ${isRequired ? `${styles['required'] || 'required'} required` : ''} ${errorMessage ? `${styles['has-error'] || 'has-error'} has-error` : ''} ${disabled ? `${styles['is-disabled'] || 'is-disabled'} is-disabled` : ''}`}>
                {label && <label htmlFor={name}>{label}</label>}
                <div className={`${styles['date-input'] || 'date-input'} date-input`} ref={refs.setReference}>
                    <div className={`${styles['date-input__wrapper'] || 'date-input__wrapper'} date-input__wrapper`}>
                        <input
                            type="text"
                            value={inputValue}
                            readOnly={disabled || !manualAllowed}
                            onClick={handleInputClick}
                            onFocus={handleInputFocus}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            id={name}
                            placeholder={
                                isFocused
                                    ? (manualAllowed ? (type === 'date-time' ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY') : (placeholder || ''))
                                    : (placeholder || '')
                            }
                            disabled={disabled}
                            onKeyDown={handleKeyDown}
                            ref={setRefs}
                            maxLength={maxLength || (manualAllowed ? (type === 'date-time' ? 19 : 10) : undefined)}
                            className={!manualAllowed ? (styles['clickable'] || 'clickable') : ''}
                            style={placeholderColor ? ({ '--placeholder-color': placeholderColor } as React.CSSProperties) : undefined}
                        />
                        {!disabled && isClearable && !isDateEmpty(selectedDate) ? (
                            <div className={`${styles['clear-icon'] || 'clear-icon'} clear-icon`} onClick={() => handleDateSelect(EMPTY_DATE)}>
                                <Icon name="clear" />
                            </div>
                        ) : null}
                        <div className={`${styles['calendar-icon'] || 'calendar-icon'} calendar-icon`} onClick={() => !disabled && setOpen((v) => !v)}>
                            <Icon name="calendar" />
                        </div>
                    </div>
                </div>

                {open && !disabled && (
                    <>
                        <FloatingPortal>
                            <FloatingFocusManager
                                context={context}
                                modal={false} // don’t trap focus like a dialog; feel free to set true if you prefer
                            >
                                <div
                                    // floating container lives under body — no clipping by parents
                                    ref={refs.setFloating}
                                    {...getFloatingProps()}
                                    style={{ ...floatingStyles, zIndex: 1000 }}
                                >
                                    <Draggable
                                        nodeRef={calendarRef}
                                        handle=".drag-handle"
                                        cancel="input,textarea,select,button,.time-picker-wrapper *,.close-calendar"
                                        bounds={dragBounds}
                                        defaultPosition={{ x: 0, y: 8 }}
                                    >
                                        <div ref={calendarRef} className={`${styles['custom-calendar-wrapper'] || 'custom-calendar-wrapper'} custom-calendar-wrapper`}>
                                            <div className="calendar-header drag-handle">
                                                <a
                                                    href="#"
                                                    className={`${styles['close-calendar'] || 'close-calendar'} close-calendar`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Icon name="close" />
                                                </a>

                                                <Calendar
                                                    className="custom-calendar"
                                                    date={isDateEmpty(selectedDate) ? new Date() : selectedDate}
                                                    onChange={handleDateSelect}
                                                    showDateDisplay={false}
                                                    showMonthAndYearPickers={false}
                                                    disabledDay={disableDays}
                                                />
                                                {type === "date-time" ? (
                                                    <div className={`${styles['time-picker-wrapper'] || 'time-picker-wrapper'} time-picker-wrapper`}>
                                                        <Icon name="clock" />
                                                        <TimePicker
                                                            value={selectedTime}
                                                            disableClock={true}
                                                            onChange={(val) => handleTimeSelect(val)}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Draggable>
                                </div>
                            </FloatingFocusManager>
                        </FloatingPortal>
                    </>
                )}
                {errorMessage && <p className={`${styles['error'] || 'error'} error`}>{errorMessage}</p>}
            </div>
        </TutorialHintTooltip>
    )
});


SingleDateInput.displayName = 'SingleDateInput';

export default SingleDateInput;
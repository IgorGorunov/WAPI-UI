'use client'
import React, {useState, forwardRef, useRef, useLayoutEffect, useEffect} from "react";
import { Calendar } from 'react-date-range';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import "./styles.scss";
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
export     const isDateEmpty = (date: Date) => {
    return date.getFullYear() === 1 || date.getFullYear() === 1901;
}

type Bounds = { left: number; right: number; top: number; bottom: number };

const SingleDateInput = forwardRef<HTMLInputElement, FieldPropsType>(({
                                                                          classNames='',
                                                                          name,
                                                                          label='',
                                                                          type='date',
                                                                          onChange,
                                                                          isRequired = false,
                                                                          placeholder = '',
                                                                          errorMessage,
                                                                          disabled ,
                                                                          value='',
                                                                          width,
                                                                          isClearable = false,
                                                                          hint='',
                                                                          disableWeekends = false,
                                                                          disablePreviousDays = false,
                                                                          disableDaysAfterToday = 0,
                                                                          disableDaysTime = '0',
                                                                      }, ref) => {

    // const {currentDate} = useAuth();

    const getDate = (dateStr: string) => {
        if (!dateStr) return EMPTY_DATE;

        return  new Date(dateStr);
    }

    // const calendarRef = useRef<HTMLDivElement>(null);

    const [selectedDate, setSelectedDate] = useState(getDate(value as string));
    // const [showCalendar, setShowCalendar] = useState(false);
    const [open, setOpen] = useState(false);

    const curDate = new Date();
    // const pad = (n: number) => String(n).padStart(2, "0");
    const [selectedTime, setSelectedTime] = useState(`${curDate.getHours()}:${curDate.getMinutes()}`);

    // Floating UI: position calendar relative to the input wrapper
    const {
        refs,
        floatingStyles,
        context
    }  = useFloating({
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
        const newDate = setTimeToDate(date, type==='date-time' ? selectedTime : `12:00`);
        setSelectedDate(newDate);
        // setShowCalendar(false);
        setOpen(false);
        if (onChange) onChange(newDate.toISOString());
    };

    const handleTimeSelect = (time: string|null) => {
        if (!time) {
            return;
        }
        setSelectedTime(time);
        const newDate = setTimeToDate(selectedDate, time);
        setSelectedDate(newDate);
        //setShowCalendar(false);

        if (onChange) onChange(newDate.toISOString());
    };

    // const handleCloseDatePicker = () => {
    //     setShowCalendar(false)
    // }

    // const dateInputRef = useRef<HTMLDivElement>(null);
    // useOutsideClick(dateInputRef, handleCloseDatePicker);

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
    }

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
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`}>
            <div className={`form-control form-control-date ${classNames ? classNames : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
                {label && <label htmlFor={name}>{label}</label>}
                <div className="date-input" ref={refs.setReference}>
                    <div className="date-input__wrapper">
                        <input
                            type="text"
                            value={
                                isDateEmpty(selectedDate)
                                    ? ""
                                    : type === "date"
                                        ? formatDateToDisplayString(selectedDate)
                                        : formatDateToDisplayStringWithTime(selectedDate)
                            }
                            readOnly
                            onClick={() => !disabled && setOpen((v) => !v)}
                            id={name}
                            placeholder={placeholder}
                            disabled={disabled}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.preventDefault();
                            }}
                            ref={ref}
                        />
                        {!disabled && isClearable && !isDateEmpty(selectedDate) ? (
                            <div className="clear-icon" onClick={() => handleDateSelect(EMPTY_DATE)}>
                                <Icon name="clear" />
                            </div>
                        ) : null}
                        <div className="calendar-icon" onClick={() => !disabled && setOpen((v) => !v)}>
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
                                    cancel="input,textarea,select,.time-picker-wrapper *,.close-calendar"
                                    bounds={dragBounds}
                                    defaultPosition={{ x: 0, y: 8 }}
                                >
                                    <div ref={calendarRef} className="custom-calendar-wrapper">
                                        <div className="calendar-header drag-handle">
                                            <a
                                                href="#"
                                                className="close-calendar"
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
                                                <div className="time-picker-wrapper">
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
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </TutorialHintTooltip>
    )
});


SingleDateInput.displayName = 'SingleDateInput';

export default SingleDateInput;
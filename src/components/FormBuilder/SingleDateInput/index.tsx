import React, {useState, forwardRef, useRef} from "react";
import { Calendar} from "react-date-range";
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
import useAuth from "@/context/authContext";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import useOutsideClick from "@/hooks/useOutsideClick";

const EMPTY_DATE_AS_STRING = '0001-01-01T00:00:00';
const EMPTY_DATE = new Date(EMPTY_DATE_AS_STRING);

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
       rules,
       errors,
       width,
       isClearable = false,
       hint='',
       notDisable,
       disableWeekends = false,
       disablePreviousDays = false,
       disableDaysAfterToday = 0,
       disableDaysTime = '0',
       ...otherProps
}, ref) => {

    const {currentDate} = useAuth();

    const getDate = (dateStr: string) => {
        return !dateStr ? currentDate : new Date(dateStr);
    }

    const isDateEmpty = (date) => {
        return date.getFullYear() === 1;
    }

    const [selectedDate, setSelectedDate] = useState(getDate(value as string));
    const [showCalendar, setShowCalendar] = useState(false);

    const curDate = new Date();
    const [selectedTime, setSelectedTime] = useState(`${curDate.getHours()}:${curDate.getMinutes()}`);


    const handleDateSelect = (date) => {
        const newDate = setTimeToDate(date, type==='date-time' ? selectedTime : '0:0');
        setSelectedDate(newDate);
        setShowCalendar(false);

        if (onChange) onChange(newDate.toISOString());
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        const newDate = setTimeToDate(selectedDate, time);
        setSelectedDate(newDate);
        //setShowCalendar(false);

        if (onChange) onChange(newDate.toISOString());
    };

    const handleCloseDatePicker = () => {
        setShowCalendar(false)
    }

    const dateInputRef = useRef<HTMLDivElement>(null);
    useOutsideClick(dateInputRef, handleCloseDatePicker);

    const disableDays = (date: Date) => {
        let isDisadled = false;
        if (disableWeekends) {
            const dayOfWeek = date.getDay();
            isDisadled = dayOfWeek === 0 || dayOfWeek === 6;
        }
        if (disablePreviousDays) {
            isDisadled = isDisadled || date < addWorkingDays(disableDaysAfterToday, disableDaysTime);
        }
        return isDisadled;
    }

    return (
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`}>
            <div className={`form-control-date ${classNames ? classNames : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
                {label && <label htmlFor={name}>{label}</label>}
                <div className='date-input' ref={dateInputRef}>
                    {showCalendar && !disabled &&
                        <div className='custom-calendar-wrapper'>
                            <a href="#" className='close-calendar' onClick={handleCloseDatePicker}>
                                <Icon name='close' />
                            </a>
                            <Calendar
                                className='custom-calendar'
                                date={selectedDate.getFullYear()<2000 ? currentDate : selectedDate }
                                onChange={handleDateSelect}
                                showDateDisplay={false}
                                showMonthAndYearPickers={false}
                                color="#5380F5"
                                disabledDay={disableDays}
                            />
                            {type==='date-time' ? <div className='time-picker-wrapper'> <Icon name='clock' /><TimePicker
                                value={selectedTime}
                                disableClock={true}
                                onChange={(val)=>{handleTimeSelect(val)}}
                            /></div> : null}
                        </div>}
                    <div className='date-input__wrapper'>
                        <input
                            type="text"
                            //value={formatDateToDisplayString(selectedDate)}
                            value = {type==='date' ? formatDateToDisplayString(selectedDate) : formatDateToDisplayStringWithTime(selectedDate)}
                            readOnly onClick={()=>setShowCalendar((prevState) => !prevState)}
                            id={name}
                            placeholder={placeholder}
                            disabled={disabled}
                            onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                            {...otherProps}
                            ref={ref}
                        />
                        {!disabled && isClearable && !isDateEmpty(selectedDate)  ? <div className='clear-icon' onClick={()=>handleDateSelect(EMPTY_DATE)}>
                            <Icon name='clear'  />
                        </div> : null}
                        <div className='calendar-icon' onClick={()=>setShowCalendar((prevState) => !prevState)}>
                            <Icon name='calendar'  />
                        </div>
                    </div>
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </TutorialHintTooltip>
    )
});

export default SingleDateInput;
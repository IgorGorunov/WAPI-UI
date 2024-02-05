import React, {useState, forwardRef} from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./styles.scss";
import { FieldPropsType } from "@/types/forms";
import {formatDateToDisplayString} from '@/utils/date'
import Icon from "@/components/Icon";
import useAuth from "@/context/authContext";

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

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);

        if (onChange) onChange(date.toISOString());
    };

    return (
        <div className={`form-control-date ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <div className='date-input'>
                {showCalendar && !disabled &&
                    <div className='custom-calendar-wrapper'>
                        <a href="#" className='close-calendar' onClick={()=>setShowCalendar(false)}>
                            <Icon name='close' />
                        </a>
                        <Calendar
                            className='custom-calendar'
                            date={selectedDate.getFullYear()<2000 ? currentDate : selectedDate }
                            onChange={handleDateSelect}
                            showDateDisplay={false}
                            showMonthAndYearPickers={false}
                            color="#5380F5"
                        />
                    </div>}
                <div className='date-input__wrapper'>
                    <input
                        type="text"
                        value={formatDateToDisplayString(selectedDate)} readOnly onClick={()=>setShowCalendar((prevState) => !prevState)}
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
    )
});

export default SingleDateInput;
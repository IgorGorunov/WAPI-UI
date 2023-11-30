import React, {useEffect, useState} from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./styles.scss";
import { FieldPropsType } from "@/types/forms";
import {formatDateToDisplayString} from '@/utils/date'
import Icon from "@/components/Icon";

const SingleDateInput: React.FC<FieldPropsType> = ({
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
       ...otherProps
}) => {

    const getDate = (dateStr: string) => {
        return !dateStr ? new Date() : new Date(dateStr);
    }

    const [selectedDate, setSelectedDate] = useState(getDate(value as string));
    const [showCalendar, setShowCalendar] = useState(false);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
        if (onChange) onChange(date.toISOString());
    };

    const CustomDateInput = () => {
        // Your custom date input JSX here
        return (
            <div className='date-input__wrapper'>
                <input
                    type="text"
                    value={formatDateToDisplayString(selectedDate)} readOnly onClick={()=>setShowCalendar((prevState) => !prevState)}
                    id={name}
                    placeholder={placeholder}
                    disabled={disabled}
                    onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                    {...otherProps}
                />
                <div className='calendar-icon' onClick={()=>setShowCalendar((prevState) => !prevState)}>
                    <Icon name='calendar'  />
                </div>
            </div>);
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
                            date={selectedDate}
                            onChange={handleDateSelect}
                            showDateDisplay={false}
                            showMonthAndYearPickers={false}
                            color="#5380F5"
                        />
                    </div>}
                <CustomDateInput  />

            </div>
        </div>)

}

export default SingleDateInput;
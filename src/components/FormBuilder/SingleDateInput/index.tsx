import React, {useState, forwardRef} from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./styles.scss";
import { FieldPropsType } from "@/types/forms";
import {formatDateToDisplayString} from '@/utils/date'
import Icon from "@/components/Icon";
import useAuth from "@/context/authContext";

// const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
//     (props: CustomInputProps, ref: Ref<HTMLInputElement>) => {
//         return <input ref={ref} {...props} />;
//     }
// );
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
       ...otherProps
}, ref) => {

    const {currentDate} = useAuth();

    const getDate = (dateStr: string) => {
        return !dateStr ? currentDate : new Date(dateStr);
    }

    const [selectedDate, setSelectedDate] = useState(getDate(value as string));
    const [showCalendar, setShowCalendar] = useState(false);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
        if (onChange) onChange(date.toISOString());
    };

    // const CustomDateInput = (ref) => {
    //     // Your custom date input JSX here
    //     return (
    //         <div className='date-input__wrapper'>
    //             <input
    //                 type="text"
    //                 value={formatDateToDisplayString(selectedDate)} readOnly onClick={()=>setShowCalendar((prevState) => !prevState)}
    //                 id={name}
    //                 placeholder={placeholder}
    //                 disabled={disabled}
    //                 onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
    //                 {...otherProps}
    //                 ref={ref}
    //             />
    //             <div className='calendar-icon' onClick={()=>setShowCalendar((prevState) => !prevState)}>
    //                 <Icon name='calendar'  />
    //             </div>
    //         </div>);
    // };

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
                    <div className='calendar-icon' onClick={()=>setShowCalendar((prevState) => !prevState)}>
                        <Icon name='calendar'  />
                    </div>
                </div>
            </div>
        </div>
    )
});

export default SingleDateInput;
import React, {FormEvent, useCallback, useState} from "react";
import "./styles.scss";
import {FieldPropsType} from "@/types/forms";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const SingleDateInput: React.FC<FieldPropsType> = ({
       classNames='',
       name,
       label='',
       type='date',
       onChange,
       isRequired = false,
       placeholder = '',
       errorMessage,
       disabled = false,
       value='',
       rules,
       errors,
       width,
       ...otherProps
}) => {

    const getDate = (dateStr: string) => {
        const date = !dateStr ? new Date() : new Date(dateStr);
        return date.toISOString().substring(0,10);
    }
    //date from props in Date type
    const curDate = getDate(value as string);

    const handleChange = useCallback((event: FormEvent) => {
        const {value} = event.target as HTMLInputElement;
        if (onChange) onChange(value);
    } ,[] )

    return (
        <div className={`form-control-date ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <div className='date-input'>
                {/*<Calendar />*/}
            </div>
        </div>)

}

export default SingleDateInput;
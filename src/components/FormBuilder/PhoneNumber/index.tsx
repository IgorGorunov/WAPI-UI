import React, {useCallback, forwardRef } from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import {E164Number} from "libphonenumber-js";


const TextField = forwardRef<HTMLInputElement, FieldPropsType>(
    ({
        classNames='',
        name,
        label='',
        type='text',
        onChange,
        isRequired = false,
        placeholder = '',
        errorMessage,
        disabled = false,
        value='',
        rules,
        errors,
        needToasts=true,
        width,
        hint='',
        noCounters = true,
        valPhone,
        onPhoneChange,
        ...otherProps
    }, ref) => {

    const handleChange = useCallback((phoneNumber: E164Number) => {
        if (onChange) onChange(phoneNumber);
    } ,[] )

    const getDate = (dateStr: string) => {
        const date = !dateStr ? new Date() : new Date(dateStr);
        return date.toISOString().substring(0,10);
    }

    return (
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`}>
            <div className={`form-control phone-number ${classNames ? classNames : ""}  ${isRequired ? "required" : ''} ${disabled ? "is-disabled" : ''}  ${errorMessage ? 'has-error' : ''}`}>
                {label && <label htmlFor={name}>{label}</label>}
                <PhoneInput
                    name={name}
                    placeholder="Enter phone number"
                    defaultCountry="ee"
                    //value={valPhone}
                    value={value as E164Number}
                    onChange={handleChange}
                    disabled={disabled}
                />

                {errorMessage && <p className="error">{errorMessage}</p>}
                {errors && name in errors ? (
                    <p className="error er1">
                        {(errors && errors[name]?.message) || errorMessage}
                    </p>
                ) : null}
            </div>
        </TutorialHintTooltip>

    );
});

export default TextField;

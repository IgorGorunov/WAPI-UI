import React, { useCallback, forwardRef } from "react";
import { FieldPropsType } from "@/types/forms";
import styles from "./styles.module.scss";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import { E164Number } from "libphonenumber-js";
import dynamic from 'next/dynamic';

// Lazy load the PhoneInput component to reduce initial bundle size
const PhoneInput = dynamic(
    () => import('react-international-phone').then(mod => mod.PhoneInput),
    {
        ssr: false,
        loading: () => <input type="tel" placeholder="Loading phone input..." disabled />
    }
);

const TextField = forwardRef<HTMLInputElement, FieldPropsType>(
    ({
        classNames = '',
        name,
        label = '',
        type = 'text',
        onChange,
        isRequired = false,
        placeholder = '',
        errorMessage,
        disabled = false,
        value = '',
        rules,
        errors,
        needToasts = true,
        width,
        hint = '',
        noCounters = true,
        valPhone,
        onPhoneChange
    }, ref) => {

        const handleChange = useCallback((phoneNumber: E164Number) => {
            if (onChange) onChange(phoneNumber);
        }, [onChange]);

        return (
            <TutorialHintTooltip hint={hint} classNames={`${width ? "width-" + width : ""}`}>
                <div className={`${styles['form-control'] || 'form-control'} phone-number ${classNames ? classNames : ""}  ${isRequired ? "required" : ''} ${disabled ? `${styles['is-disabled'] || 'is-disabled'} is-disabled` : ''}  ${errorMessage ? 'has-error' : ''}`}>
                    {label && <label htmlFor={name}>{label}</label>}
                    <PhoneInput
                        name={name}
                        placeholder="Enter phone number"
                        defaultCountry="ee"
                        value={value as E164Number}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    {errorMessage && <p className={styles.error || 'error'}>{errorMessage}</p>}
                </div>
            </TutorialHintTooltip>
        );
    });

export default TextField;

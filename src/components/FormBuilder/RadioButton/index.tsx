import React, {forwardRef, useCallback, useEffect, useState} from "react";
import {FieldPropsType, OptionType} from "@/types/forms";
import styles from "./styles.module.scss";

const RadioButton = forwardRef<HTMLDivElement, FieldPropsType>(({
                                                   classNames= '',
                                                   name,
                                                   label = '',
                                                   options,
                                                   value,
                                                   onChange,
                                                   disabled = false,
                                                   errorMessage,
                                                   width,
                                                   isCountry = false,
                                                    alignFlexH,
                                               },ref) => {

    const [curValue, setCurValue] = useState(value || options.length && options[0] ? options[0]?.value : '');

    useEffect(() => {
        if (value) {
            setCurValue(value as string);
        } else if (options.length) {
            setCurValue(options[0].value)
        }
    }, [options, value]);

    const handleChange = useCallback((selectedOption) => {
        if (!disabled) {
            setCurValue(selectedOption);

            if (onChange) {
                onChange(selectedOption);
            }
        }
    } ,[] )
    useEffect(() => {
        if (!value && options && options.length) {
            onChange(options[0].value);
        }
    }, []);

    const getCountry = useCallback((options:OptionType[], value: string) => {
        const foundOption = options.filter(item => item.value === value);
        if (foundOption.length) {
            return foundOption[0].extraInfo || '';
        }
        return '';
    },[])


    return (
        <div className={`${styles['radio-button__wrapper'] || 'radio-button__wrapper'} ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${disabled ? `${styles['is-disabled'] || 'is-disabled'} is-disabled` : `${styles['is-active'] || 'is-active'} is-active`}`}>
            {label ? <label className={styles['radio-button-label'] || 'radio-button-label'}>{label}</label> : null}
            {options && options.length && <div className={`${styles['radio-button__group'] || 'radio-button__group'} ${alignFlexH ? 'align-'+alignFlexH : ''}`}>
                {options && options.length >0 ? options.map((item, index) => (
                    item.isDisabled
                        ? <div key={`${name}_${index}`} className={`${styles['radio-button__option'] || 'radio-button__option'} ${curValue===item.value ? styles['is-checked'] || 'is-checked' : ''} ${styles['is-disabled'] || 'is-disabled'} is-disabled`}>
                            <span className={styles['radio-button__option-decor'] || 'radio-button__option-decor'}/> <span>{item.label}{isCountry && getCountry(options, item.value as string) ? <span className={`fi fi-${getCountry(options, item.value as string).toLowerCase()} flag-icon`}></span> : null}</span>
                        </div>

                        : <a href="#" key={`${name}_${index}`} tabIndex={disabled || item.isDisabled ? -1 : 0} className={`${styles['radio-button__option'] || 'radio-button__option'} ${curValue===item.value ? styles['is-checked'] || 'is-checked' : ''} ${item.isDisabled ? 'id-disabled' : ''}`}
                               onClick={()=>handleChange(item.value)}
                               onKeyDown={(e) => { if (e.key !== 'Tab') { if (!item.isDisabled) {handleChange(item.value);} e.preventDefault();} }}
                            >
                            <span className={styles['radio-button__option-decor'] || 'radio-button__option-decor'}/> <span>{item.label}{isCountry && getCountry(options, item.value as string) ? <span className={`fi fi-${getCountry(options, item.value as string).toLowerCase()} flag-icon`}></span> : null}</span>
                        </a>
                )) : null}
            </div>}
            {errorMessage && <p className="error">{errorMessage}</p>}

        </div>
    );
});

export default RadioButton;

import React, {forwardRef, useCallback, useEffect, useState} from "react";
import {FieldPropsType, OptionType} from "@/types/forms";
import "./styles.scss"

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
        <div className={`radio-button__wrapper ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${disabled ? 'is-disabled' : 'is-active'}`}>
            {label ? <label className="radio-button-label">{label}</label> : null}
            {options && options.length && <div className={`radio-button__group ${alignFlexH ? 'align-'+alignFlexH : ''}`}>
                {options && options.length && options.map((item, index) => (
                    item.isDisabled
                        ? <div key={`${name}_${index}`} className={`radio-button__option ${curValue===item.value ? 'is-checked' : ''} is-disabled`}>
                            <span className='radio-button__option-decor'/> <span>{item.label}{isCountry && getCountry(options, item.value as string) ? <span className={`fi fi-${getCountry(options, item.value as string).toLowerCase()} flag-icon`}></span> : null}</span>
                        </div>

                        : <a href="#" key={`${name}_${index}`} tabIndex={disabled || item.isDisabled ? -1 : 0} className={`radio-button__option ${curValue===item.value ? 'is-checked' : ''} ${item.isDisabled ? 'id-disabled' : ''}`}
                               onClick={()=>handleChange(item.value)}
                               onKeyDown={(e) => { if (e.key !== 'Tab') { if (!item.isDisabled) {handleChange(item.value);} e.preventDefault();} }}
                            >
                            <span className='radio-button__option-decor'/> <span>{item.label}{isCountry && getCountry(options, item.value as string) ? <span className={`fi fi-${getCountry(options, item.value as string).toLowerCase()} flag-icon`}></span> : null}</span>
                        </a>
                ))}
            </div>}
            {errorMessage && <p className="error">{errorMessage}</p>}

        </div>
    );
});

export default RadioButton;

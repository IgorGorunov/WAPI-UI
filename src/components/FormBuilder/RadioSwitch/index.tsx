import React, {useCallback, useState} from "react";
import {FieldPropsType, OptionType} from "@/types/forms";
import "./styles.scss"

const RadioSwitch: React.FC<FieldPropsType> = ({
        classNames= '',
        name,
        label = '',
        options,
        value,
        onChange,
        errors,
        errorMessage,
        width,
        ...otherProps
    }) => {

    const [curValue, setCurValue] = useState(value || options[0].value);

    const handleChange = useCallback((selectedOption) => {
        console.log('selected: ', selectedOption);
        setCurValue(selectedOption);

        if (onChange) {
            onChange(selectedOption);
        }
    } ,[] )

    console.log("valie", value)

    if (!value) {
        value = options && options.length ? options[0].value : '';
    }

    return (
        <div className={`radio-switch__wrapper ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
            {label ? <label className="radio-switch-label">{label}</label> : null}
            {options && options.length && <div className={`radio-switch`}>
                {options && options.length && options.map((item, index) => (
                    <a href="#" key={`${name}_${index}`} className={`radio-switch__option ${curValue===item.value ? 'is-checked' : ''}`}
                            onClick={()=>handleChange(item.value)}
                            onKeyDown={(e) => { if (e.key !== 'Tab') { handleChange(item.value); e.preventDefault();} }}
                    >
                        <span>{item.label}</span>
                    </a>
                ))}
            </div>}
            {errorMessage && <p className="error">{errorMessage}</p>}

        </div>
    );
};

export default RadioSwitch;

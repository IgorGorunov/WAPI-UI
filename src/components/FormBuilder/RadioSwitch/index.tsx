import React, {useCallback} from "react";
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

    const handleChange = useCallback((selectedOption) => {
        console.log('selected: ', selectedOption)
        // if (onChange) {
        //     if (selectedOption) {
        //         onChange(selectedOption.value);
        //     } else {
        //         onChange('');
        //     }
        // }

        //return onChange(selectedOption.value);
    } ,[] )

    return (
        <div className={`radio-switch ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
            {label ? <label className="radio-switch-label">{label}</label> : null}
            {options && options.length && options.map((item, index) => (
                <div className='radio-button-wrapper'>
                    <input
                    {...otherProps}
                    type='radio'
                    name={name}
                    id={`${name}-radio_${index}`}
                    onChange={handleChange}
                    onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                    />
                </div>
            ))}

            {errorMessage && <p className="error">{errorMessage}</p>}
            {errors && name in errors ? (
                <p className="error">
                    {(errors && errors[name]?.message) || errorMessage}
                </p>
            ) : null}
        </div>
    );
};

export default RadioSwitch;

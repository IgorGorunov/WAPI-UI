import React, {forwardRef} from "react";
import {FieldPropsType} from "@/types/forms";
import "./styles.scss"

const ToggleSwitch =  forwardRef<HTMLInputElement, FieldPropsType>(({
        classNames= '',
        name,
        label = '',
        value,
        isRequired = false,
        checked = false,
        onChange,
        errors,
        errorMessage,
        width,
        hideTextOnMobile = false,
        ...otherProps
   },ref) => {

    return (
        <div className={`toggle-switch ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${hideTextOnMobile ? 'hide-text-on-mobile' : ''}`}>
            <input
               {...otherProps}
               className='toggle-switch-checkbox'
               type='checkbox'
               name={name}
               id={`${name}-toggle`}
               ref={ref}
               checked={!!value || checked}
               onChange={onChange}
               onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
            />
            <label className="toggle-switch-label" htmlFor={`${name}-toggle`}>
                <span className="toggle-switch-inner" />
                <span className="toggle-switch-switch" />
            </label>
            <span className='toggle-switch-label-text'>{label}</span>
        </div>
    );
});

export default ToggleSwitch;

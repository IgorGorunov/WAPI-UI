import React, {useCallback, useEffect, useState} from "react";
import {FieldPropsType} from "@/types/forms";
import "./styles.scss"

const ToggleSwitch: React.FC<FieldPropsType> = ({
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
        ...otherProps
   }) => {

    return (
        <div className={`toggle-switch ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
            <input
               {...otherProps}
               className='toggle-switch-checkbox'
               type='checkbox'
               name={name}
               id={`${name}-toggle`}
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
};

export default ToggleSwitch;

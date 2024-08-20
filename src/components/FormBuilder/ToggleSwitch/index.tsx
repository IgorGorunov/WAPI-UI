import React, {forwardRef} from "react";
import {FieldPropsType} from "@/types/forms";
import "./styles.scss"
import TutorialHintTooltip from "@/components/TutorialHintTooltip";

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
        hint='',
        disabled = false,
        ...otherProps
   },ref) => {

    return (
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`} position='left'>
            <div className={`toggle-switch ${classNames ? classNames : ""} ${hideTextOnMobile ? 'hide-text-on-mobile' : ''}`}>
                <input
                   {...otherProps}
                   className='toggle-switch-checkbox'
                   type='checkbox'
                   name={name}
                   id={`${name}-toggle`}
                   ref={ref}
                   checked={!!value || checked}
                   onChange={onChange}
                   disabled={disabled}
                   onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                />
                <label className={`toggle-switch-label ${disabled ? 'is-disabled' : ''}`} htmlFor={`${name}-toggle`} aria-disabled={disabled}>
                    <span className="toggle-switch-inner" />
                    <span className="toggle-switch-switch" />
                </label>
                <span className='toggle-switch-label-text'>{label}</span>
            </div>
        </TutorialHintTooltip>
    );
});

export default ToggleSwitch;

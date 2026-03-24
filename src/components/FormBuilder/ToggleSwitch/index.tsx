import React, {forwardRef} from "react";
import {FieldPropsType} from "@/types/forms";
import styles from "./styles.module.scss"
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
            <div
                className={`${styles['toggle-switch'] || 'toggle-switch'} toggle-switch ${classNames ? classNames : ""} ${hideTextOnMobile ? `${styles['hide-text-on-mobile'] || 'hide-text-on-mobile'} hide-text-on-mobile` : ''}`}>
                <input
                    {...otherProps}
                    className={`${styles['toggle-switch-checkbox'] || 'toggle-switch-checkbox'} toggle-switch-checkbox`}
                    type='checkbox'
                    name={name}
                    id={`${name}-toggle`}
                    ref={ref}
                    checked={!!value || checked}
                    onChange={onChange}
                    disabled={disabled}
                    onKeyDown={(e) => {
                        e.key === 'Enter' && e.preventDefault();
                    }}
                />
                <label className={`${styles['toggle-switch-label'] || 'toggle-switch-label'} toggle-switch-label ${disabled ? `${styles['is-disabled'] || 'is-disabled'} is-disabled` : ''}`} htmlFor={`${name}-toggle`}
                       aria-disabled={disabled}>
                    <span className={`${styles['toggle-switch-inner'] || 'toggle-switch-inner'} toggle-switch-inner`}>
                        <span className={`${styles['toggle-switch-inner--before'] || 'toggle-switch-inner--before'} toggle-switch-inner--before`} />
                        <span className={`${styles['toggle-switch-inner--after'] || 'toggle-switch-inner--after'} toggle-switch-inner--after`} />
                    </span>
                    <span className={`${styles['toggle-switch-switch'] || 'toggle-switch-switch'} toggle-switch-switch`}/>
                </label>
                <span className={`${styles['toggle-switch-label-text'] || 'toggle-switch-label-text'} toggle-switch-label-text`}>{label}</span>
            </div>
        </TutorialHintTooltip>
    );
});

export default ToggleSwitch;

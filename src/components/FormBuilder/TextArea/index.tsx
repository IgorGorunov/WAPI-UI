import React, {FormEvent, forwardRef, useCallback} from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";


const TextArea= forwardRef<HTMLTextAreaElement, FieldPropsType>(({
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
     rows = 4,
     hint='',
     ...otherProps
 }, ref) => {

    const handleChange = useCallback((event: FormEvent) => {
        const {value} = event.target as HTMLInputElement;
        if (onChange) onChange(value);
    } ,[] )

    return (
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`}>
            <div className={`form-control-text-area ${classNames ? classNames : ""} ${isRequired ? "required" : ''} ${disabled ? "is-disabled" : ''}  ${errorMessage ? 'has-error' : ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <textarea
                id={name}
                placeholder={placeholder}
                onChange={handleChange}
                value={value as string}
                disabled={disabled}
                rows={rows}
                //onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                {...otherProps}
                ref={ref}
                autoComplete="new-user-email"
                aria-autocomplete='none'
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

export default TextArea;

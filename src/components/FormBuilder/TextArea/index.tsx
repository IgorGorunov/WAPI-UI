import React, {FormEvent, forwardRef, useCallback} from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss";


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
     ...otherProps
 }, ref) => {

    const handleChange = useCallback((event: FormEvent) => {
        const {value} = event.target as HTMLInputElement;
        if (onChange) onChange(value);
    } ,[] )

    return (
        <div className={`form-control ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${disabled ? "is-disabled" : ''}  ${errorMessage ? 'has-error' : ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <textarea
                id={name}
                placeholder={placeholder}
                onChange={handleChange}
                value={value as string}
                disabled={disabled}
                rows={4}
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
    );
});

export default TextArea;

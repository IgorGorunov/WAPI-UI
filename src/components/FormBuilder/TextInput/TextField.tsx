import React, {FormEvent, useCallback, forwardRef } from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss";

const TextField = forwardRef<HTMLInputElement, FieldPropsType>(({
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

  const getDate = (dateStr: string) => {
      const date = !dateStr ? new Date() : new Date(dateStr);
      return date.toISOString().substring(0,10);
  }

  const curVal = (type === 'number') ? value as number : type=== 'date' ? (getDate(value as string)) : value as string;

  return (
    <div className={`form-control ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${disabled ? "is-disabled" : ''}  ${errorMessage ? 'has-error' : ''}`}>
        {label && <label htmlFor={name}>{label}</label>}
          <input
            ref={ref}
            id={name}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            value={curVal || ""}
            disabled={disabled}
            onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
            {...otherProps}
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

export default TextField;

import React, {FormEvent, useCallback, useEffect } from "react";
import { FieldPropsType } from "@/types/forms";
import {toast, ToastContainer} from '@/components/Toast';
import "./styles.scss";

const TextField: React.FC<FieldPropsType> = ({
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
}) => {

  const handleChange = useCallback((event: FormEvent) => {
      const {value} = event.target as HTMLInputElement;
      if (onChange) onChange(value);
  } ,[] )

  const getDate = (dateStr: string) => {
      const date = !dateStr ? new Date() : new Date(dateStr);
      return date.toISOString().substring(0,10);
  }

  const curVal = (type === 'number') ? value as number : type=== 'date' ? (getDate(value as string)) : value as string;

  useEffect (()=> {
      if (errorMessage && needToasts) {
          toast.warn(errorMessage, {
              position: "top-right",
              autoClose: 1000,
          });
      }
  },);

  return (
    <div className={`form-control ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${disabled ? "is-disabled" : ''}  ${errorMessage ? 'has-error' : ''}`}>
        <ToastContainer />
        {label && <label htmlFor={name}>{label}</label>}
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            value={curVal || ""}
            disabled={disabled}
            onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
            {...otherProps}
          />
        {errorMessage && <p className="error">{errorMessage}</p>}
      {errors && name in errors ? (
        <p className="error er1">
          {(errors && errors[name]?.message) || errorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default TextField;

import React, {FormEvent, useCallback} from "react";
import { FieldPropsType } from "@/types/forms";
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
  //innerRef,
  value='',
  //registerInput,
  rules,
  errors,
  width,
  // isFullWidth = false,
   ...otherProps
}) => {

  const handleChange = useCallback((event: FormEvent) => {
      const {value} = event.target as HTMLInputElement;
      // return onChange(value);
      if (onChange) onChange(value);
  } ,[] )

    const curVal = value && (type === 'number') ? value as number : value as string;

  return (
    <div className={`form-control ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''}`}>
        {label && <label htmlFor={name}>{label}</label>}
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            value={curVal || ""}
            {...otherProps}
            //ref={innerRef}
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

import React from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss"

const Checkbox: React.FC<FieldPropsType> = ({
  classNames= '',
  name,
  label = '',
  value,
  // innerRef = null,
  checked = false,
  // label,
  // rules,
  onChange,
    errors,
    errorMessage,
  // registerInput,
    width,
  ...otherProps
}) => {

  return (
    <div className={`checkbox ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
      <label htmlFor={`${name}-checkbox`} className="checkbox-label">
        <input
            {...otherProps}
          type='checkbox'
          name={name}
          id={`${name}-checkbox`}
          checked={!!value || checked}
          onChange={onChange}
          // ref={innerRef}
        />
        {label && <span>{label}</span>}
      </label>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {errors && name in errors ? (
          <p className="error">
            {(errors && errors[name]?.message) || errorMessage}
          </p>
      ) : null}
    </div>
  );
};

export default Checkbox;

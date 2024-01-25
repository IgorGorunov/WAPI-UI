import React, {forwardRef} from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss"

const Checkbox= forwardRef<HTMLInputElement, FieldPropsType>( ({
  classNames= '',
  name,
  label = '',
  value,
  isRequired = false,
  checked = false,
  // label,
  // rules,
  onChange,
    errors,
    errorMessage,
  // registerInput,
    width,
  ...otherProps
},ref) => {

  return (
    <div className={`checkbox ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
      <label htmlFor={`${name}-checkbox`} className="checkbox-label">
        <input
            {...otherProps}
          type='checkbox'
          name={name}
          id={`${name}-checkbox`}
            ref={ref}
          checked={!!value || checked}
          onChange={onChange}
          onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
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
});

export default Checkbox;

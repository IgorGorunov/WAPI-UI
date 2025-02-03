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
    extraLabel,
    isCheckboxHidden= false,
    circleColor,
    isCountry = false,
    flagBefore = false,
    countryName='',
  ...otherProps
},ref) => {


  return (
    <div className={`checkbox ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
      <label htmlFor={`${name}-checkbox`} className={`checkbox-label ${isCheckboxHidden ? 'hide-checkbox' : ''}`}>
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
        {label && (
            <span className='checkbox-label-wrapper'>
              {circleColor ? <span className='colored-circle' style={{ backgroundColor: circleColor}}></span> : null}

              <span className='checkbox-label-text' >
                {isCountry && countryName && flagBefore ? <span className={`fi fi-${countryName.toLowerCase()} flag-icon flag-first`}></span> : null}
                {label}
                {isCountry && countryName && !flagBefore ? <span className={`fi fi-${countryName.toLowerCase()} flag-icon`}></span> : null}
                {extraLabel ? <span className='checkbox-label-extra-text'>{extraLabel}</span> : null }
              </span>
            </span>
        )}
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

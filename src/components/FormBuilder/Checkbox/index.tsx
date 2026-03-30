import React, {forwardRef} from "react";
import { FieldPropsType } from "@/types/forms";
import styles from "./styles.module.scss";

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
    <div className={`${styles.checkbox || 'checkbox'} checkbox ${classNames ? styles[classNames] || classNames : ""} ${width ? "width-"+width : ""}  ${styles['vertical-center'] ? '' : ''}`}>
      <label htmlFor={`${name}-checkbox`} className={`${styles['checkbox-label'] || 'checkbox-label'} checkbox-label ${isCheckboxHidden ? `${styles['hide-checkbox'] || 'hide-checkbox'} hide-checkbox` : ''}`}>
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
            <span className={`${styles['checkbox-label-wrapper'] || 'checkbox-label-wrapper'} checkbox-label-wrapper`}>
              {circleColor ? <span className='colored-circle' style={{ backgroundColor: circleColor}}></span> : null}

              <span className={`${styles['checkbox-label-text'] || 'checkbox-label-text'} checkbox-label-text`} >
                {isCountry && countryName && flagBefore ? <span className={`fi fi-${countryName.toLowerCase()} flag-icon flag-first`}></span> : null}
                {label}
                {isCountry && countryName && !flagBefore ? <span className={`fi fi-${countryName.toLowerCase()} flag-icon`}></span> : null}
                {extraLabel ? <span className={`${styles['checkbox-label-extra-text'] || 'checkbox-label-extra-text'} checkbox-label-extra-text`}>{extraLabel}</span> : null }
              </span>
            </span>
        )}
      </label>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {/*{errors && name in errors ? (*/}
      {/*    <p className="error">*/}
      {/*      {(errors && errors[name]?.message) || errorMessage}*/}
      {/*    </p>*/}
      {/*) : null}*/}
    </div>
  );
});

export default Checkbox;

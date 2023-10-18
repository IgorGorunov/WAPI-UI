import React from "react";
import { FormFieldTypes, FieldPropsType } from "../../../types/forms";

const Switch: React.FC<FieldPropsType> = ({
  classNames,
  name,
  value,
  // label,
  // rules,
  onChange,
  // registerInput,
  // ...props
}) => {
  return (
    <div className={`c-switch ${classNames}`}>
      <label htmlFor={`${name}-${value}`}>
        <input
          type={FormFieldTypes.SWITCH}
          name={name}
          id={`${name}-${value}`}
          checked={!!value}
          onChange={onChange}
        />
        <span>test text</span>
      </label>
    </div>
  );
};

export default Switch;

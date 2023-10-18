import React from "react";
import { FieldPropsType, OptionType } from "../../../types/forms";

const Select: React.FC<FieldPropsType> = ({
  classNames,
  name,
  placeholder,
  isRequired,
  options,
  // onChange,
  value,
  registerInput,
  rules,
  ...otherProps
}) => {
  return (
    <select
      className={`${classNames} ${isRequired ? "required" : ""}`}
      name={name}
      placeholder={placeholder}
      value={value}
      {...registerInput(name, { ...rules })}
      {...otherProps}
    >
      {options?.map((item: OptionType, index: number) => (
        <option value={item.value} key={`${value}-${index}`}>
          {item.value}
        </option>
      ))}
    </select>
  );
};

export default Select;

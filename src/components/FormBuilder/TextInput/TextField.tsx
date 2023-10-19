import React from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss";

const TextField: React.FC<FieldPropsType> = ({
  name,
  label,
  type = "text",
  // onChange,
  // isRequired,
  placeholder,
  errorMessage,
  // innerRef,
  registerInput,
  rules,
  errors,
  // isFullWidth = false,
  // ...props
}) => {
  return (
    <div className="form-control">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...registerInput(name, { ...rules })}
      />
      {errors && name in errors ? (
        <p className="error">
          {(errors && errors[name]?.message) || errorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default TextField;

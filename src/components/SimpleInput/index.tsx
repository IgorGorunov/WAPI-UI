import React from "react";
import {FieldPropsType, WidthType} from "@/types/forms";
import "./styles.scss";

const TextField: React.FC<FieldPropsType> = ({
         name,
         label,
         type = "text",
         isRequired,
         placeholder,
         errorMessage,
         rules,
         errors,
         width = WidthType.w100,
         // ...props
    }) => {
    return (
        <div className="form-control">
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
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

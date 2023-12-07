import React from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss"

const Other: React.FC<FieldPropsType> = ({
        classNames= '',
        name,
        label,
        otherComponent,
        width,
        ...otherProps
    }) => {

    return (
        <div className={`other-component ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <div className="other-component__content">
                {otherComponent}
            </div>
        </div>
    );
};

export default Other;

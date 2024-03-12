import React, {forwardRef} from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss"

const Other = forwardRef<HTMLDivElement, FieldPropsType>(({
        classNames= '',
        name,
        label,
        otherComponent,
        width,
        ...otherProps
    }, ref) => {

    return (
        <div className={`other-component ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <div className="other-component__content">
                {otherComponent}
            </div>
        </div>
    );
});

export default Other;

import React from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss"

const Other: React.FC<FieldPropsType> = ({
        classNames= '',
        name,
        otherComponent,
        width,
        ...otherProps
    }) => {

    return (
        <div className={`other-component ${classNames ? classNames : ""} ${width ? "width-"+width : ""}`}>
            {otherComponent}
        </div>
    );
};

export default Other;

import React, {forwardRef} from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss"
import TutorialHintTooltip from "@/components/TutorialHintTooltip";

const Other = forwardRef<HTMLDivElement, FieldPropsType>(({
        classNames= '',
        name,
        label,
        otherComponent,
        width,
        hint = '',
        ...otherProps
    }, ref) => {

    return (
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`} position='left'>
            <div className={`other-component ${classNames ? classNames : ""} `}>
                {label && <label htmlFor={name}>{label}</label>}
                <div className="other-component__content">
                    {otherComponent}
                </div>
            </div>
        </TutorialHintTooltip>
    );
});

export default Other;

import React, {forwardRef} from "react";
import { FieldPropsType } from "@/types/forms";
import styles from "./styles.module.scss";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";

const Other = forwardRef<HTMLDivElement, FieldPropsType>(({
        classNames= '',
        name,
        label,
        otherComponent,
        width,
        hint = '',
    }, ref) => {

    return (
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`} position='left'>
            <div className={`${styles['other-component'] || 'other-component'} ${classNames ? classNames : ""} `}>
                {label && <label htmlFor={name}>{label}</label>}
                <div className={styles['other-component__content'] || 'other-component__content'}>
                    {otherComponent}
                </div>
            </div>
        </TutorialHintTooltip>
    );
});

export default Other;

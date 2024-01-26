import React, { memo } from "react";
import "./styles.scss";
import {OptionType} from "@/types/forms";
import Checkbox from "@/components/FormBuilder/Checkbox";

export type FilterOptionType = {
    option: OptionType;
    isMultiple?: boolean;
    isChecked?: boolean;
    onClick: (value: string)=>void;
}

const FilterOption: React.FC<FilterOptionType> = ({option, isChecked=false, isMultiple = false, onClick }) => {
    return (
        <div className={`filter-option ${isChecked ? "checked" : ""} ${isMultiple ? "multiple-choice" : "single-choice"}`} >
            <Checkbox name={option.value} label={option.label} value={isChecked} checked={isChecked} onChange={()=>onClick(option.value)}/>
        </div>
    );
};
export default FilterOption;

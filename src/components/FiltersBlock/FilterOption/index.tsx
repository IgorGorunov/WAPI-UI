import React from "react";
import "./styles.scss";
import {OptionType} from "@/types/forms";
import Checkbox from "@/components/FormBuilder/Checkbox";
import {FILTER_TYPE} from "@/types/utility";

export type FilterOptionType = {
    option: OptionType;
    filterType?: FILTER_TYPE;
    isChecked?: boolean;
    onClick: (value: string)=>void;
    isCountry?: boolean;
}

const FilterOption: React.FC<FilterOptionType> = ({option, isChecked=false, filterType = FILTER_TYPE.CHECKBOX, onClick, isCountry=false }) => {

    console.log()
    return (
        <div className={`filter-option ${isChecked ? "checked" : ""} ${filterType}-type`} >
            <Checkbox
                name={option.value}
                circleColor={filterType === FILTER_TYPE.COLORED_CIRCLE ? option.color : ''}
                label={`${option.label}`}
                isCountry={isCountry}
                extraLabel={`${option.amount ? "("+option.amount+")" : ''}`}
                value={isChecked}
                checked={isChecked}
                onChange={()=>onClick(option.value)}
                isCheckboxHidden={filterType !== FILTER_TYPE.CHECKBOX}
            />
        </div>
    );
};
export default FilterOption;

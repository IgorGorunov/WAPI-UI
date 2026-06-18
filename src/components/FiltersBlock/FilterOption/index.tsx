import React from "react";
import styles from "./styles.module.scss";
import {OptionType} from "@/types/forms";
import Checkbox from "@/components/FormBuilder/Checkbox";
import {FILTER_TYPE} from "@/types/utility";

export type FilterOptionType = {
    option: OptionType;
    filterType?: FILTER_TYPE;
    isChecked?: boolean;
    onClick: (value: string)=>void;
    isCountry?: boolean;
    extraName: string;
}

const FilterOption: React.FC<FilterOptionType> = ({option, extraName='', isChecked=false, filterType = FILTER_TYPE.CHECKBOX, onClick, isCountry=false }) => {
    return (
        <div className={`${styles['filter-option'] || 'filter-option'} filter-option ${isChecked ? styles.checked || 'checked' : ''} ${filterType}-type`}
        // style={{ backgroundColor: filterType === FILTER_TYPE.COLORED_TEXT && option.color ? option.color+'11' : 'inherit' }}
        >
            <Checkbox
                name={option.value+extraName.split(' ').join('_')}
                circleColor={filterType === FILTER_TYPE.COLORED_CIRCLE ? option.color : ''}
                textColor={filterType === FILTER_TYPE.COLORED_TEXT ? option.color : ''}
                underlineColor={filterType === FILTER_TYPE.UNDERLINE ? option.color : ''}
                label={`${option.label}`}
                isCountry={isCountry}
                countryName = {option.country || option.value}
                flagBefore={true}
                extraLabel={`${option.amount ? ""+option.amount+"" : ''}`}
                value={isChecked}
                checked={isChecked}
                onChange={()=>onClick(option.value)}
                isCheckboxHidden={filterType !== FILTER_TYPE.CHECKBOX && filterType !== FILTER_TYPE.COLORED_TEXT}
                classNames={'small-checkbox'}
            />
        </div>
    );
};
export default FilterOption;

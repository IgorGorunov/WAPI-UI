import React from "react";
import styles from "./styles.module.scss";
import {OptionType} from "@/types/forms";
import Icon from "@/components/Icon";

type CurrentFilterType = {
    filterTitle: string;
    filterOptions: OptionType[];
    filterState: string[];
    onClose: ()=>void;
    onClick: ()=>void;
}
const CurrentFilters: React.FC<CurrentFilterType> = ({filterTitle, filterOptions, filterState, onClick, onClose}) => {
    const valuesAsString = filterOptions && filterOptions.length ? filterState.map(filterVal => filterOptions.filter(item=>item.value===filterVal)).filter(filteredValues => filteredValues.length).map(item => item[0].label).join(', ') : '';

    return (
        <>
            {valuesAsString ?
                <div className={styles["current-filters"] || "current-filters"}>
                    <div className={styles["current-filters__wrapper"] || "current-filters__wrapper"} onClick={onClick}>
                        <span className={styles['current-filters__title'] || 'current-filters__title'}>{filterTitle}:</span>
                        <span className={styles['current-filters__values'] || 'current-filters__values'}>
                            {valuesAsString}
                        </span>
                    </div>
                    <div className={styles['current-filters__close'] || 'current-filters__close'} onClick={onClose}>
                        <Icon name='close'/>
                    </div>
                </div> : null
            }
        </>
    );
};
export default CurrentFilters;

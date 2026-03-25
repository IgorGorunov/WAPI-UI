import React from "react";
import styles from "./styles.module.scss";
import {FilterComponentType} from "@/types/filters";
import CurrentFilters from "@/components/CurrentFilters";

type FilterListPropsType = {
    filters: FilterComponentType[];
}

const FiltersChosen: React.FC<FilterListPropsType> = ({filters}) => {
    return (
        <>
            {filters && filters.length
                ? filters.map(filter => <div className={styles['current-filter-item'] || 'current-filter-item'} key={filter.filterTitle.replaceAll(' ','_')}><CurrentFilters {...filter} /></div>)
                : null
            }
        </>
    );
};
export default FiltersChosen;

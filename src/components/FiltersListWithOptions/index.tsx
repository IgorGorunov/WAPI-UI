import React from "react";
import "./styles.scss";
import {FilterComponentType} from "@/types/filters";
import FiltersBlock from "@/components/FiltersBlock";

type FilterListPropsType = {
    filters: FilterComponentType[];
}


const FilterListWithOptions: React.FC<FilterListPropsType> = ({filters}) => {
    return (
        <>
            {filters && filters.length
                ? filters.sort((a,b)=>a.filterTitle<b.filterTitle ? -1 : 1).map(filter => <div key={filter.filterTitle.replaceAll(' ','_')}><FiltersBlock {...filter} /></div>)
                : null
            }
        </>
    );
};
export default FilterListWithOptions;

import React from "react";
import "./styles.scss";
import {FilterComponentType} from "@/types/filters";
import CurrentFilters from "@/components/CurrentFilters";

type FilterListPropsType = {
    filters: FilterComponentType[];
}

const FiltersChosen: React.FC<FilterListPropsType> = ({filters}) => {
    return (
        <>
            {filters && filters.length
                ? filters.map(filter => <CurrentFilters {...filter} />)
                : null
            }
        </>
    );
};
export default FiltersChosen;

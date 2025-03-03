import React from "react";
import "./styles.scss";
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
                <div className="current-filters">
                    <div className="current-filters__wrapper" onClick={onClick}>
                        <span className='current-filters__title'>{filterTitle}:</span>
                        <span className='current-filters__values'>
                            {valuesAsString}
                        </span>
                    </div>
                    <div className='current-filters__close' onClick={onClose}>
                        <Icon name='close'/>
                    </div>
                </div> : null
            }
        </>
    );
};
export default CurrentFilters;

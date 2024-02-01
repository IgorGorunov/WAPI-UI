import React from "react";
import "./styles.scss";
import {OptionType} from "@/types/forms";
import Icon from "@/components/Icon";

type CurrentFilterType = {
    title: string;
    options: OptionType[];
    filterState: string[];
    onClose: ()=>void;
    onClick: ()=>void;
}
const CurrentFilters: React.FC<CurrentFilterType> = ({title, options, filterState, onClick, onClose}) => {
    const valuesAsString = filterState.map(filterVal => options.filter(item=>item.value===filterVal)).filter(filteredValues => filteredValues.length).map(item => item[0].label).join(', ');

    return (
        <>
            {valuesAsString ?
                <div className="current-filters">
                    <div className="current-filters__wrapper" onClick={onClick}>
                        <span className='current-filters__title'>{title}:</span>
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

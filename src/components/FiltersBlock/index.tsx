import React, {useEffect} from "react";
import LogoWAPI from "@/assets/icons/LogoWAPI.svg";
import "./styles.scss";
import {OptionType} from "@/types/forms";
import FilterOption from "@/components/FiltersBlock/FilterOption";
import Accordion from "@/components/Accordion";


export type FiltersBlockType = {
    filterTitle: string;
    filterOptions: OptionType[];
    filterState: string[];
    setFilterState: React.Dispatch<React.SetStateAction<string[]>>;
    isMultiple?: boolean;
    isOpen?: boolean;
    setIsOpen: (val: boolean)=>void;
}



const FiltersBlock: React.FC<FiltersBlockType> = ({filterTitle, filterOptions, filterState, setFilterState, isMultiple = false, isOpen=false, setIsOpen}) => {

    const handleOptionClick = (val: string) => {
        console.log('clicked val', val, getIsChecked(val, filterState))
       setFilterState((prevState: string[]) => {
           if (!getIsChecked(val, prevState)) {
               return [...prevState, val]
           } else {
               return [...prevState.filter(item => item !== val)];
           } });
    };

    const getIsChecked = (filterValue: string, filterState: string[]) => {
        //console.log('filtered value: ', filterValue, 'checked in: ', filterState)
        return filterState.indexOf(filterValue) >= 0;
    }

    useEffect(() => {
        console.log('filter state:', filterState)
    }, [filterState]);

    return (
        <div className="filter-block filter-block__wrapper">
            <Accordion title={filterTitle} isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className='filter-block__options'>
                    <ul className='filter-block__options-list'>
                        {filterOptions.map(option => (<li key={option.value} className='filter-block__options-list-item'><FilterOption option={option} isChecked={getIsChecked(option.value, filterState)} onClick={handleOptionClick} /></li>))}
                    </ul>
                </div>
            </Accordion>
        </div>
    );
};
export default FiltersBlock;

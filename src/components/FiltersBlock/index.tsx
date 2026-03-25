import React from "react";
import styles from "./styles.module.scss";
import {OptionType} from "@/types/forms";
import FilterOption from "@/components/FiltersBlock/FilterOption";
import Accordion from "@/components/Accordion";
import {FILTER_TYPE} from "@/types/utility";
import {IconType} from "@/components/Icon";


export type FiltersBlockType = {
    filterTitle: string;
    filterDescriptions?: string;
    filterOptions: OptionType[];
    filterState: string[];
    setFilterState: React.Dispatch<React.SetStateAction<string[]>>;
    filterType?: FILTER_TYPE;
    isOpen?: boolean;
    setIsOpen: (val: boolean)=>void;
    isCountry?: boolean;
    icon?: IconType;
}

const FiltersBlock: React.FC<FiltersBlockType> = ({filterTitle, filterDescriptions='', filterOptions, filterState, setFilterState, filterType=FILTER_TYPE.CHECKBOX, isOpen=false, setIsOpen, isCountry=false, icon}) => {

    const handleOptionClick = (val: string) => {
       setFilterState((prevState: string[]) => {
           if (!getIsChecked(val, prevState)) {
               return [...prevState, val]
           } else {
               return [...prevState.filter(item => item !== val)];
           }
       });
    };

    const getIsChecked = (filterValue: string, filterState: string[]) => {
        return filterState ? filterState.indexOf(filterValue) >= 0 : false;
    }


    //const filterTitleWithCheckedFilters = `${filterTitle} (${filterState ? filterState.length : 0})`;

    return (
        <div className={`${styles['filter-block'] || 'filter-block'} ${styles['filter-block__wrapper'] || 'filter-block__wrapper'}`}>
            <Accordion title={filterTitle} titleAmount={filterState ? filterState.length.toString() : '0'} titleIcon={icon} description={filterDescriptions} isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className={styles['filter-block__options'] || 'filter-block__options'}>
                    <ul className={styles['filter-block__options-list'] || 'filter-block__options-list'}>
                        {filterOptions.map(option => (<li key={option.value+'_'+filterTitle} className={styles['filter-block__options-list-item'] || 'filter-block__options-list-item'}><FilterOption option={option} filterType={filterType} isChecked={getIsChecked(option.value, filterState)} onClick={handleOptionClick} isCountry={isCountry} extraName={filterTitle}/></li>))}
                    </ul>
                </div>
            </Accordion>
        </div>
    );
};
export default FiltersBlock;

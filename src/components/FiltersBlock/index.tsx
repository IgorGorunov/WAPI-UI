import React from "react";
import styles from "./styles.module.scss";
import {OptionType} from "@/types/forms";
import FilterOption from "@/components/FiltersBlock/FilterOption";
import Accordion from "@/components/Accordion";
import {FILTER_TYPE} from "@/types/utility";
import {IconType} from "@/components/Icon";
import { Slider } from "antd";


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
    isFiltersVisible?: boolean;
}

const FiltersBlock: React.FC<FiltersBlockType> = ({filterTitle, filterDescriptions='', filterOptions, filterState, setFilterState, filterType=FILTER_TYPE.CHECKBOX, isOpen=false, setIsOpen, isCountry=false, icon, isFiltersVisible}) => {

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
            <Accordion title={filterTitle} titleAmount={filterType === FILTER_TYPE.SLIDER ? (filterState.length === 2 ? '1' : '0') : (filterState ? filterState.length.toString() : '0')} titleIcon={icon} description={filterDescriptions} isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className={styles['filter-block__options'] || 'filter-block__options'}>
                    {filterType === FILTER_TYPE.SLIDER ? (
                        <div style={{ padding: '16px 20px 4px' }}>
                            <Slider
                                range
                                marks={{
                                    0: '0',
                                    10: '10',
                                    20: '20',
                                    30: '30',
                                    40: '40',
                                    50: '50',
                                    60: '60',
                                    70: '70',
                                    80: '80',
                                    90: '90',
                                    100: '100'
                                }}
                                min={filterOptions[0] ? Number(filterOptions[0].value) : 0}
                                max={filterOptions[1] ? Number(filterOptions[1].value) : 100}
                                value={filterState.length === 2 ? [Number(filterState[0]), Number(filterState[1])] : [
                                    filterOptions[0] ? Number(filterOptions[0].value) : 0, 
                                    filterOptions[1] ? Number(filterOptions[1].value) : 100
                                ]}
                                onChange={(val: number[]) => {
                                    setFilterState([val[0].toString(), val[1].toString()]);
                                }}
                                tooltip={{ 
                                    open: isOpen && (isFiltersVisible ?? true), 
                                    formatter: (v) => `${v}%`,
                                    color: '#3D6FE0',
                                    overlayInnerStyle: { color: '#ffffff', fontSize: '10px', lineHeight: 1, fontWeight:'bold', minHeight: '0', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                                }}
                            />
                        </div>
                    ) : (
                        <ul className={styles['filter-block__options-list'] || 'filter-block__options-list'}>
                            {filterOptions.map(option => (<li key={option.value+'_'+filterTitle} className={styles['filter-block__options-list-item'] || 'filter-block__options-list-item'}><FilterOption option={option} filterType={filterType} isChecked={getIsChecked(option.value, filterState)} onClick={handleOptionClick} isCountry={isCountry} extraName={filterTitle}/></li>))}
                        </ul>
                    )}
                </div>
            </Accordion>
        </div>
    );
};
export default FiltersBlock;

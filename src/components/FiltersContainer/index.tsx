import React from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import Button from "@/components/Button/Button";

type PropsType = {
    classNames?: string;
    isFiltersVisible: boolean;
    setIsFiltersVisible: (val: boolean)=>void;
    children?: React.ReactNode | React.ReactNode[];
    onClearFilters: ()=>void;
};

const FiltersContainer: React.FC<PropsType> = ({ isFiltersVisible, setIsFiltersVisible, classNames='', children, onClearFilters}) => {
    return (
        <div  className={`doc-filters-block__overlay ${isFiltersVisible ? 'is-visible-overlay' : ''} ${classNames}`} onClick={()=>{setIsFiltersVisible(false); }} >

            <div className={`doc-filters-block ${isFiltersVisible ? 'is-visible' : ''} is-fixed`} onClick={(e)=>e.stopPropagation()}>
                <div className='filters-clear'>
                    <Button onClick={onClearFilters}>Clear all filters</Button>
                </div>
                <div className='doc-filters-block__wrapper'>
                    <div className='filters-close' onClick={()=>setIsFiltersVisible(false)}>
                        <Icon name='close' />
                    </div>
                    {children}
                    {/*<div className='filters-clear'>*/}
                    {/*    <Button onClick={onClearFilters}>Clear all filters</Button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
};

export default FiltersContainer;
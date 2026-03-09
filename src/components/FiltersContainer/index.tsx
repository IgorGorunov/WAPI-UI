import React from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import Button, { ButtonVariant } from "@/components/Button/Button";

type PropsType = {
    classNames?: string;
    isFiltersVisible: boolean;
    setIsFiltersVisible: (val: boolean) => void;
    children?: React.ReactNode | React.ReactNode[];
    onClearFilters: () => void;
    onApplyFilters?: () => void;
    hasUnappliedChanges?: boolean;
};

const FiltersContainer: React.FC<PropsType> = ({ isFiltersVisible, setIsFiltersVisible, classNames = '', children, onClearFilters, onApplyFilters, hasUnappliedChanges }) => {
    return (
        <div className={`doc-filters-block__overlay ${isFiltersVisible ? 'is-visible-overlay' : ''} ${classNames}`} onClick={() => { setIsFiltersVisible(false); }} >

            <div className={`doc-filters-block ${isFiltersVisible ? 'is-visible' : ''} is-fixed`} onClick={(e) => e.stopPropagation()}>
                {/*<div className='filters-actions'>*/}
                {/*    <Button onClick={onClearFilters}>Clear all filters</Button>*/}
                {/*    {onApplyFilters && (*/}
                {/*        <Button*/}
                {/*            onClick={() => { onApplyFilters(); setIsFiltersVisible(false); }}*/}
                {/*            variant={ButtonVariant.PRIMARY}*/}
                {/*            classNames={hasUnappliedChanges ? 'filters-apply--active' : ''}*/}
                {/*        >*/}
                {/*            Apply filters*/}
                {/*        </Button>*/}
                {/*    )}*/}
                {/*</div>*/}
                <div className='filters-close' onClick={() => setIsFiltersVisible(false)}>
                    <Icon name='close' />
                </div>
                <div className='filters-actions'>
                    <Button
                        variant={ButtonVariant.TETRIARY}
                        classNames='filters-clear'
                        icon='waste-bin'
                        onClick={onClearFilters}
                    >
                        Clear all filters
                    </Button>
                    {onApplyFilters && (
                        <Button
                            onClick={() => { onApplyFilters(); setIsFiltersVisible(false); }}
                            variant={ButtonVariant.PRIMARY}
                            icon='biggest-check'
                            classNames={hasUnappliedChanges ? 'filters-apply--active' : ''}
                        >
                            Apply filters
                        </Button>
                    )}
                </div>
                <div className='doc-filters-block__wrapper'>
                    {/*<div className='filters-close' onClick={() => setIsFiltersVisible(false)}>*/}
                    {/*    <Icon name='close' />*/}
                    {/*</div>*/}
                    <div className='doc-filters-block__wrapper-inner'>
                        {children}
                    </div>
                    {/*<div className='filters-clear'>*/}
                    {/*    <Button onClick={onClearFilters}>Clear all filters</Button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
};

export default FiltersContainer;
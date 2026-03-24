import React from "react";
import styles from "./styles.module.scss";
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
        <div className={`${styles['doc-filters-block__overlay'] || 'doc-filters-block__overlay'} ${isFiltersVisible ? styles['is-visible-overlay'] || 'is-visible-overlay' : ''} ${classNames}`} onClick={() => { setIsFiltersVisible(false); }} >

            <div className={`${styles['doc-filters-block'] || 'doc-filters-block'} ${isFiltersVisible ? styles['is-visible'] || 'is-visible' : ''} ${styles['is-fixed'] || 'is-fixed'}`} onClick={(e) => e.stopPropagation()}>
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
                <div className={styles['filters-close'] || 'filters-close'} onClick={() => setIsFiltersVisible(false)}>
                    <Icon name='close' />
                </div>
                <div className={styles['filters-actions'] || 'filters-actions'}>
                    <Button
                        variant={ButtonVariant.TETRIARY}
                        classNames={`${styles['filters-clear'] || 'filters-clear'} filters-clear`}
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
                            classNames={hasUnappliedChanges ? `${styles['filters-apply--active'] || 'filters-apply--active'} filters-apply--active` : ''}
                        >
                            Apply filters
                        </Button>
                    )}
                </div>
                <div className={styles['doc-filters-block__wrapper'] || 'doc-filters-block__wrapper'}>
                    {/*<div className='filters-close' onClick={() => setIsFiltersVisible(false)}>*/}
                    {/*    <Icon name='close' />*/}
                    {/*</div>*/}
                    <div className={styles['doc-filters-block__wrapper-inner'] || 'doc-filters-block__wrapper-inner'}>
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
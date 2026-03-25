import React from "react";
import styles from "./styles.module.scss";

type PropsType = {
    classNames?: string;
    title?: string;
    children?: React.ReactNode | React.ReactNode[];
};

const FiltersBlockWrapper: React.FC<PropsType> = ({ title, classNames='', children}) => {
    return (
        <div className={`${styles['doc-filters-wrapper'] || 'doc-filters-wrapper'} ${classNames ? classNames : ''}`}>
            {title ? <p className={styles['doc-filters-wrapper__title'] || 'doc-filters-wrapper__title'}>{title}: </p> : null}
            {children}
        </div>
    )
};

export default FiltersBlockWrapper;
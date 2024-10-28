import React from "react";
import "./styles.scss";

type PropsType = {
    classNames?: string;
    title?: string;
    children?: React.ReactNode | React.ReactNode[];
};

const FiltersBlockWrapper: React.FC<PropsType> = ({ title, classNames='', children}) => {
    return (
        <div className={`doc-filters-wrapper ${classNames ? classNames : ''}`}>
            {title ? <p className='doc-filters-wrapper__title'>{title}: </p> : null}
            {children}
        </div>
    )
};

export default FiltersBlockWrapper;
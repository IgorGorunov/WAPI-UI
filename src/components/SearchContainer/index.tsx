import React from "react";
import styles from "./styles.module.scss";

type PropsType = {
    classNames?: string;
    children?: React.ReactNode | React.ReactNode[];
};

const SearchContainer: React.FC<PropsType> = ({ classNames, children}) => {
    return (
        <div className={`${styles['search-container'] || 'search-container'} ${classNames ? classNames : ''}`}>
            {/*{children.map((child, index) => child)}*/}
            {children}
        </div>
    )
};

export default SearchContainer;

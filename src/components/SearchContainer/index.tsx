import React from "react";
import "./styles.scss";

type PropsType = {
    classNames?: string;
    children?: React.ReactNode[];
};

const SearchContainer: React.FC<PropsType> = ({ classNames, children}) => {
    return (
        <div className={`search-container ${classNames ? classNames : ''}`}>
            {/*{children.map((child, index) => child)}*/}
            {children}
        </div>
    )
};

export default SearchContainer;

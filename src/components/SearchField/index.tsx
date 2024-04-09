import React from "react";
import "./styles.scss";
import {Input} from "antd";
import Button from "@/components/Button/Button";

type SearchFieldPropsType = {
    searchTerm: string;
    handleChange: (str: string) => void;
    handleClear: () => void;
};

const SearchField: React.FC<SearchFieldPropsType> = ({ searchTerm, handleClear, handleChange}) => {
    return (
        <div className="search-field">
            <Input
                id='search-input'
                placeholder="Search..."
                value={searchTerm}
                onChange={e => handleChange(e.target.value)}
                className="search-input"
            />
            {searchTerm ? <Button className='clear-search' icon='close' onClick={handleClear}/> : null}
        </div>
    );
};

export default SearchField;

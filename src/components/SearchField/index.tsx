import React, {useEffect, useState} from "react";
import "./styles.scss";
import {Input} from "antd";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon";

type SearchFieldPropsType = {
    searchTerm: string;
    handleChange?: (str: string) => void;
    handleSearch?: (str: string) => void;
    handleClear: () => void;
    manualSearch?: boolean;
};

const SearchField: React.FC<SearchFieldPropsType> = ({ searchTerm, handleClear, handleChange, handleSearch, manualSearch=false}) => {
    const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTerm);

    useEffect(() => {
        setCurrentSearchTerm(searchTerm);
    }, [searchTerm]);

    return (
        <div className="search-field">
            <Icon name='search' className={`search-icon ${manualSearch ? "manual-search" : ""}`}/>
            <Input
                id={`search-input`}
                placeholder="Search..."
                value={currentSearchTerm}
                onChange={e => {
                    setCurrentSearchTerm(e.target.value);
                    if (e.target.value === "" && searchTerm) {
                        handleClear();
                    }
                    if (!manualSearch && handleChange) {
                        handleChange(e.target.value.trim())
                    }
                }}
                onPressEnter={() => {
                    if (manualSearch && handleSearch) {
                        handleSearch(currentSearchTerm.trim());
                    }
                }}
                className={`search-input ${manualSearch ? "manual-search" : ""}`}
            />
            {currentSearchTerm ? <div className={`search-btns ${manualSearch ? "manual-search" : ""}`}>
                <Button
                    className='clear-search'
                    icon='close'
                    onClick={e => {handleClear(); setCurrentSearchTerm('')}}
                />
                {manualSearch ?
                    <Button
                        className='apply-search'
                        onClick={e => {
                            handleSearch(currentSearchTerm);
                        }}>Search
                    </Button>
                    : null
                }
            </div> : null}
        </div>
    );
};

export default SearchField;

import React, {useEffect, useState} from "react";
import styles from "./styles.module.scss";
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
        <div className={styles['search-field'] || 'search-field'}>
            <Icon name='search' className={`${styles['icon-search'] || 'icon-search'} icon-search ${manualSearch ? `${styles['manual-search'] || 'manual-search'} manual-search` : ""}`}/>
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
                className={`${styles['search-input'] || 'search-input'} search-input ${manualSearch ? `${styles['manual-search'] || 'manual-search'} manual-search` : ""}`}
            />
            {currentSearchTerm ? <div className={`${styles['search-btns'] || 'search-btns'} search-btns ${manualSearch ? `${styles['manual-search'] || 'manual-search'} manual-search` : ""}`}>
                <Button
                    className={`${styles['clear-search'] || 'clear-search'} clear-search`}
                    icon='close'
                    onClick={e => {handleClear(); setCurrentSearchTerm('')}}
                />
                {manualSearch ?
                    <Button
                        className={`${styles['apply-search'] || 'apply-search'} apply-search`}
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

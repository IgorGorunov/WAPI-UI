import React from "react";
import "./styles.scss";
import {Input} from "antd";
import Button from "@/components/Button/Button";
import {useTranslations} from "next-intl";

type SearchFieldPropsType = {
    searchTerm: string;
    handleChange: (str: string) => void;
    handleClear: () => void;
};

const SearchField: React.FC<SearchFieldPropsType> = ({ searchTerm, handleClear, handleChange}) => {
    const t = useTranslations('common');

    return (
        <div className="search-field">
            <Input
                id='search-input'
                placeholder={`${t('search')}...`}
                value={searchTerm}
                onChange={e => handleChange(e.target.value)}
                className="search-input"
            />
            {searchTerm ? <Button className='clear-search' icon='close' onClick={handleClear}/> : null}
        </div>
    );
};

export default SearchField;

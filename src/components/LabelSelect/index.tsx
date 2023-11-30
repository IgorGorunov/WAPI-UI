import React from 'react';
import Select from 'react-select';
import './style.scss';

const CustomSelect = ({ options, value , onChange }) => {

    const selectedOption = options.find(option => option.value == value);


    return (
        <div className="label-select-container">
            <Select
                options={options}
                value={selectedOption}
                onChange={selected => onChange(selected.value)}
                className="label-select"
                classNamePrefix="label-select"
                isSearchable={false}
            />
        </div>
    );
};

export default CustomSelect;

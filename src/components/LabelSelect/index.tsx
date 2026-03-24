import React from 'react';
import Select from 'react-select';
import styles from './style.module.scss';

const CustomSelect = ({ options, value , onChange }) => {

    const selectedOption = options.find(option => option.value == value);


    return (
        <div className={`${styles['label-select-container'] || 'label-select-container'} label-select-container`}>
            <Select
                options={options}
                value={selectedOption}
                onChange={selected => onChange(selected.value)}
                className={`${styles['label-select'] || 'label-select'} label-select`}
                classNamePrefix="label-select"
                isSearchable={false}
            />
        </div>
    );
};

export default CustomSelect;

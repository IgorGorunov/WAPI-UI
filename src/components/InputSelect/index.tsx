import React from 'react';
import Select from 'react-select';
import styles from './style.module.scss';


const CustomSelect = ({ options, value, onChange, name="", errors={}, errorMessage="", label='', customFormat=false }) => {
    const selectedOption = options.find(option => option.value === value);

    const formatOptionLabel = (option) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
                style={{
                    width: '13px',
                    height: '13px',
                    borderRadius: '50%',
                    backgroundColor: option.color,
                    marginRight: '10px'
                }}
            ></span>
            {option.label}
        </div>
    );

    const customProperties = customFormat ? { formatOptionLabel: formatOptionLabel} : {};

    return (
        <div className={`${styles['input-select-container'] || 'input-select-container'} input-select-container ${styles['filter-select'] || 'filter-select'} filter-select`}>
            {label ? <label>{label}</label> : null}
            <Select
                options={options}
                value={selectedOption}
                onChange={selected => onChange(selected.value)}
                className={`${styles['input-select'] || 'input-select'} input-select`}
                classNamePrefix="input-select"
                // formatOptionLabel={formatOptionLabel}
                isSearchable={false}
                {...customProperties}
            />
            {errors && name in errors ? (
                <p className={`${styles['error'] || 'error'} error`}>
                    {(errors && errors[name]?.message) || errorMessage}
                </p>
            ) : null}
        </div>
    );
};

export default CustomSelect;

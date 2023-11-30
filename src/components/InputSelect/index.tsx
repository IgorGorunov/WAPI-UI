import React from 'react';
import Select from 'react-select';
import './style.scss';

const CustomSelect = ({ options, value, onChange, name="", errors={}, errorMessage="" }) => {
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

    return (
        <div className="input-select-container">
            <Select
                options={options}
                value={selectedOption}
                onChange={selected => onChange(selected.value)}
                className="input-select"
                classNamePrefix="input-select"
                formatOptionLabel={formatOptionLabel}
                isSearchable={false}
            />
            {errors && name in errors ? (
                <p className="error">
                    {(errors && errors[name]?.message) || errorMessage}
                </p>
            ) : null}
        </div>
    );
};

export default CustomSelect;

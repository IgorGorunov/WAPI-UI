import React from 'react';
import Select from 'react-select';
import './style.scss';

const CustomSelect = ({ options, value , onChange }) => {

    const selectedOption = options.find(option => option.value === value);

    const formatOptionLabel = (option) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {option.countryCode ? (
                <span className={`fi fi-${option.countryCode.toLowerCase()}`} style={{ marginRight: '10px' }}></span>
            ) : (
                <span
                    style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: '50%',
                        backgroundColor: option.color,
                        marginRight: '10px'
                    }}
                ></span>
            )}
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
            />
        </div>
    );
};

export default CustomSelect;

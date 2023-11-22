import React, {useCallback} from "react";
import { FieldPropsType, OptionType } from '@/types/forms';
import Select from 'react-select'
import {GetOptionValue, GetOptionLabel} from "react-select";
import "./styles.scss"

const SelectField: React.FC<FieldPropsType> = ({
    classNames,
    name,
    label='',
    placeholder = "",
    width,
    isRequired = false,
    options=[],
    onChange,
    value,
    disabled = false,
    errors,
    errorMessage,
    isSearchable= true,
    isClearable = true,
    ...otherProps
}) => {

    const handleChange = useCallback((selectedOption: OptionType) => {
        console.log("is changed: ", selectedOption);
        if (onChange) {
            if (selectedOption) {
                onChange(selectedOption.value);
            } else {
                onChange('');
            }
        }

        //return onChange(selectedOption.value);
    } ,[] )

    const getOptionValue: GetOptionValue<OptionType> = useCallback(
        option => option?.value, []
    )

    const getOptionLabel: GetOptionLabel<OptionType> = useCallback(
        option => option?.label
    ,[])

    console.log("select: ", name, errorMessage);

    return (
        <div className={`input-select__container ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''} ${isSearchable ? "searchable": ''} ${disabled ? 'is-disabled' : ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <Select
                {...otherProps}
                value={options.find((option) => option.value === value) || null}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                name={name}
                options={options}
                placeholder={placeholder}
                onChange={handleChange} // Use the handleChange function to handle the change
                isDisabled={!!disabled}
                //required={!!isRequired}

                classNamePrefix='select-field'
                instanceId={`select-${name}`}
                isClearable={isClearable}
            />
            {errorMessage && <p className="error">{errorMessage}</p>}

        </div>
    );
};

export default SelectField;

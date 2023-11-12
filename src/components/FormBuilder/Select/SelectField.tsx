import React, {FormEvent, useCallback} from "react";
import { FieldPropsType, OptionType, SelectFieldType } from '@/types/forms';
import Select from 'react-select'
import {GetOptionValue, GetOptionLabel, OnChangeValue} from "react-select";
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
    ...otherProps
}) => {

    const handleChange = useCallback((selectedOption: OptionType) => {

        if (selectedOption) {
            onChange(selectedOption.value);
        }
        //return onChange(selectedOption.value);
    } ,[] )

    const getOptionValue: GetOptionValue<OptionType> = useCallback(
        option => option?.value, []
    )

    const getOptionLabel: GetOptionLabel<OptionType> = useCallback(
        option => option?.label
    ,[])

    const selectedOption1 = options && options.length && options.find(option => option.value === value) || '';

    return (
        <div className={`input-select__container ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''} `}>
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
                required={!!isRequired}
                classNamePrefix='select-field'
                instanceId={`select-${name}`}
                // name={name}
                // ref={innerRef}
                // options={options}
                // value={selectedOption}
                // placeholder={placeholder}
                // //onChange={handleChange}
                // className="select-field"
                // required={isRequired}
                // classNamePrefix='select-field'
                // instanceId={`select-${name}`}
            />
            {errorMessage && <p className="error">{errorMessage}</p>}
            {errors && name in errors ? (
                <p className="error">
                    {(errors && errors[name]?.message) || errorMessage}
                </p>
            ) : null}
        </div>
    );
};

export default SelectField;

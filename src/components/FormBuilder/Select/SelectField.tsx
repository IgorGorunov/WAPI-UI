import React, {useCallback, useEffect} from "react";
import { FieldPropsType, OptionType } from '@/types/forms';
import Select from 'react-select'
import {GetOptionValue, GetOptionLabel} from "react-select";
import "./styles.scss"
import {toast, ToastContainer} from '@/components/Toast';

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

    const CustomValueContainer = ({ children, ...props }: any) => (
        <div className="select-field-val">
            {props.hasValue && (
                    props.getValue()[0].extraInfo ||  props.getValue()[0].label
            )}
        </div>
    );
    useEffect (()=> {
        if (errorMessage) {
            toast.warn(errorMessage, {
                position: "top-right",
                autoClose: 1000,
            });
        }
    },);

    return (
        <div className={`input-select__container ${classNames ? classNames : ""} ${width ? "width-"+width : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''} ${isSearchable ? "searchable": ''} ${disabled ? 'is-disabled' : ''}`}>
            <ToastContainer />
            {label && <label htmlFor={name}>{label}</label>}
            <Select
                {...otherProps}
                value={options.find((option) => option.value === value) || null}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                components={{ ValueContainer: CustomValueContainer }}
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

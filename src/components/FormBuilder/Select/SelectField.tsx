import React, {useCallback, forwardRef} from "react";
import { FieldPropsType, OptionType } from '@/types/forms';
import Select from 'react-select'
import "./styles.scss";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";

const SelectField = forwardRef<HTMLInputElement, FieldPropsType>(({
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
    hint='',
    ...otherProps
}, ref) => {

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

    const CustomValueContainer = ({ children, ...props }: any) => {

        return (<div className="select-field-val">
            {props.hasValue && (
                    props.getValue()[0].extraInfo ||  props.getValue()[0].label
            )}
        </div>)
    };

    const filteredOptions = options.filter((option) => option.value === value);
    const selectedOption = filteredOptions.length > 0 ? filteredOptions[0] : null;

    return (
        <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`}>
        <div className={`input-select__container ${classNames ? classNames : ""} ${isRequired ? "required" : ''} ${errorMessage ? 'has-error' : ''} ${isSearchable ? "searchable": ''} ${disabled ? 'is-disabled' : ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <Select
                {...otherProps}
                value={selectedOption}
                components={{ SingleValue: CustomValueContainer }}
                name={name}
                options={options}
                placeholder={placeholder}
                onChange={handleChange} // Use the handleChange function to handle the change
                isDisabled={!!disabled}
                //required={!!isRequired}
                classNamePrefix='select-field'
                instanceId={`select-${name}`}
                isClearable={isClearable}
                aria-autocomplete='none'
                //ref={ref}
                //inputProps={{autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off' }}
                //formatGroupLabel={ CustomValueContainer }
            />
            {errorMessage && <p className="error">{errorMessage}</p>}

        </div></TutorialHintTooltip>
    );
});

export default SelectField;

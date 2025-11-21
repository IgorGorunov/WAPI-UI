"use client";

import React, { useCallback, forwardRef, Ref } from "react";
import Select, {
    components,
    SingleValueProps,
    OptionProps,
} from "react-select";

import { FieldPropsType, OptionType } from "@/types/forms";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";

import "./styles.scss";

const SelectField = forwardRef<HTMLInputElement, FieldPropsType>(
    (
        {
            classNames,
            name,
            label = "",
            placeholder = "",
            width,
            isRequired = false,
            options = [],
            onChange,
            value,
            disabled = false,
            errors,
            errorMessage,
            isSearchable = true,
            isClearable = true,
            hint = "",
            ...otherProps
        },
        _ref: Ref<HTMLInputElement> // ref is not used by react-select directly
    ) => {
        const handleChange = useCallback(
            (selectedOption: OptionType | null) => {
                if (!onChange) return;

                if (selectedOption) {
                    onChange(selectedOption.value);
                } else {
                    onChange("");
                }
            },
            [onChange]
        );

        /**
         * Custom SingleValue that shows extraInfo if present,
         * otherwise falls back to label.
         */
        const CustomSingleValue = (props: SingleValueProps<OptionType>) => {
            const option = props.data;

            return (
                <components.SingleValue {...props}>
                    {option.extraInfo || option.label}
                </components.SingleValue>
            );
        };

        /**
         * Custom option to show amount and state-based classes.
         */
        const CustomOption = (props: OptionProps<OptionType, false>) => {
            const { data } = props;

            const extraClassNames =
                `${data.amount !== undefined && !data.amount ? " is-empty" : ""}` +
                `${data.inactive ? " is-inactive" : ""}`;

            return (
                <components.Option
                    {...props}
                    // keep react-select’s own className and add our flags
                    className={`${props.className || ""}${extraClassNames}`}
                >
                    <span>{data.label}</span>
                    {data.amount !== undefined && (
                        <span className="amount-circle">{data.amount || 0}</span>
                    )}
                </components.Option>
            );
        };

        const filterOption = (
            option: { label: string; value: string; data: OptionType },
            rawInput: string
        ) => {
            const input = rawInput.trim().toLowerCase();
            if (!input) return true;

            const label = (option.label ?? "").toLowerCase();
            const extra = (option.data.extraSearch ?? "").toLowerCase();

            return label.includes(input) || extra.includes(input);
        };

        const filteredOptions = options.filter(
            (option) => option.value === value
        );
        const selectedOption =
            filteredOptions.length > 0 ? filteredOptions[0] : null;

        return (
            <TutorialHintTooltip
                hint={hint}
                classNames={`${width ? "width-" + width : ""}`}
            >
                <div
                    className={`input-select__container ${
                        classNames ? classNames : ""
                    } ${isRequired ? "required" : ""} ${
                        errorMessage ? "has-error" : ""
                    } ${isSearchable ? "searchable" : ""} ${
                        disabled ? "is-disabled" : ""
                    }`}
                >
                    {label && <label htmlFor={name}>{label}</label>}

                    <div>
                        <Select<OptionType, false>
                            {...otherProps}
                            name={name}
                            value={selectedOption}
                            options={options}
                            placeholder={placeholder}
                            onChange={handleChange}
                            isDisabled={!!disabled}
                            isClearable={isClearable}
                            isSearchable={isSearchable}
                            filterOption={filterOption}
                            instanceId={`select-${name}`}
                            classNamePrefix="select-field"
                            aria-autocomplete="none"
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={
                                typeof document !== "undefined" ? document.body : undefined
                            }
                            menuShouldScrollIntoView={false}
                            components={{
                                SingleValue: CustomSingleValue,
                                Option: CustomOption,
                            }}
                            styles={{
                                // keep portal on top of modals
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 10000,
                                }),
                                // IMPORTANT: let height shrink/grow (works nicely in table rows)
                                control: (base) => ({
                                    ...base,
                                    minHeight: 30, // or 35 if you prefer a bit taller
                                    height: "auto",
                                    alignItems: "flex-start",
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    whiteSpace: "normal",
                                    overflow: "visible",
                                    textOverflow: "unset",
                                }),
                            }}
                        />

                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </div>
                </div>
            </TutorialHintTooltip>
        );
    }
);

SelectField.displayName = "SelectField";

export default SelectField;
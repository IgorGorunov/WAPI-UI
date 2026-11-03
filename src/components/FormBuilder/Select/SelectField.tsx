"use client";

import React, { useCallback, useState, forwardRef, Ref } from "react";
import Select, {
    components,
    SingleValueProps,
    OptionProps,
    MenuListProps,
} from "react-select";

import { FieldPropsType, OptionType } from "@/types/forms";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import styles from "./styles.module.scss";

const MENU_PAGE_SIZE = 100;

const renderHighlightedLabel = (
    label: string,
    rawSearch: string,
    isSearchable?: boolean
) => {
    if (!isSearchable || !label || !rawSearch) {
        return label;
    }

    const search = rawSearch.trim().toLowerCase();
    if (!search) {
        return label;
    }

    const labelLower = label.toLowerCase();
    let matchIndex = labelLower.indexOf(search);
    if (matchIndex === -1) {
        return label;
    }

    const searchLen = search.length;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    while (matchIndex !== -1) {
        if (matchIndex > lastIndex) {
            parts.push(label.slice(lastIndex, matchIndex));
        }
        parts.push(
            <mark key={matchIndex} className="select-field__option-highlight">
                {label.slice(matchIndex, matchIndex + searchLen)}
            </mark>
        );
        lastIndex = matchIndex + searchLen;
        matchIndex = labelLower.indexOf(search, lastIndex);
    }

    if (lastIndex < label.length) {
        parts.push(label.slice(lastIndex));
    }

    return parts;
};

/**
 * Custom SingleValue that shows extraInfo if present,
 * otherwise falls back to label.
 */
const CustomSingleValue = (props: SingleValueProps<OptionType, false>) => {
    const option = props.data;

    return (
        <components.SingleValue {...props}>
            {option.extraInfo || option.label}
        </components.SingleValue>
    );
};

/**
 * Custom option to show amount, state-based classes, and search highlight.
 */
const CustomOption = (props: OptionProps<OptionType, false>) => {
    const { data, selectProps } = props;

    const extraClassNames =
        `${data.amount !== undefined && !data.amount ? ` ${styles['is-empty'] || 'is-empty'}` : ""}` +
        `${data.inactive ? ` ${styles['is-inactive'] || 'is-inactive'}` : ""}`;

    return (
        <components.Option
            {...props}
            // keep react-select’s own className and add our flags
            className={`${props.className || ""}${extraClassNames}`}
        >
            <span>
                {renderHighlightedLabel(
                    data.label,
                    selectProps.inputValue,
                    selectProps.isSearchable
                )}
            </span>
            {data.amount !== undefined && (
                <span className={styles['amount-circle'] || "amount-circle"}>{data.amount || 0}</span>
            )}
        </components.Option>
    );
};

/**
 * Paginated MenuList so large option sets (e.g. 30k+ options) only mount
 * a small batch of DOM nodes at a time and load more on scroll.
 */
const CustomMenuList = (props: MenuListProps<OptionType, false>) => {
    const { children, innerProps, selectProps } = props;
    const currentInput = selectProps.inputValue;

    const [scrollState, setScrollState] = useState({
        inputValue: currentInput,
        count: MENU_PAGE_SIZE,
    });

    if (!Array.isArray(children) || children.length <= MENU_PAGE_SIZE) {
        return <components.MenuList {...props}>{children}</components.MenuList>;
    }

    const visibleCount =
        scrollState.inputValue === currentInput
            ? scrollState.count
            : MENU_PAGE_SIZE;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        innerProps?.onScroll?.(e);
        const el = e.currentTarget;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
            setScrollState((prev) => {
                const baseCount =
                    prev.inputValue === currentInput
                        ? prev.count
                        : MENU_PAGE_SIZE;
                if (baseCount >= children.length) return prev;
                return {
                    inputValue: currentInput,
                    count: Math.min(baseCount + MENU_PAGE_SIZE, children.length),
                };
            });
        }
    };

    return (
        <components.MenuList
            {...props}
            innerProps={{
                ...innerProps,
                onScroll: handleScroll,
            }}
        >
            {children.slice(0, visibleCount)}
        </components.MenuList>
    );
};

const SELECT_COMPONENTS = {
    SingleValue: CustomSingleValue,
    Option: CustomOption,
    MenuList: CustomMenuList,
};

const filterOption = (
    option: { label: string; value: string; data: OptionType },
    rawInput: string
) => {
    const input = rawInput.trim().toLowerCase();
    if (!input) return true;

    if ((option.label ?? "").toLowerCase().includes(input)) {
        return true;
    }

    return option.data.extraSearch
        ? option.data.extraSearch.toLowerCase().includes(input)
        : false;
};

const SelectField = forwardRef<HTMLInputElement, FieldPropsType>(
    (
        {
            classNames = '',
            name,
            label = "",
            placeholder = "",
            width,
            isRequired = false,
            options = [],
            onChange,
            value,
            disabled = false,
            isLoading = false,
            errors,
            errorMessage,
            isSearchable = true,
            isClearable = true,
            hint = "",
            fieldDescription = [],
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
                    className={`${styles['input-select__container']} input-select__container ${classNames} ${isRequired ? styles['required'] || "required" : ""
                        } ${isSearchable ? styles['searchable'] || "searchable" : ""} ${errorMessage ? styles['has-error'] || "has-error" : ""} ${disabled ? styles['is-disabled'] || "is-disabled" : ""
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
                            isLoading={isLoading}
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
                            components={SELECT_COMPONENTS}
                            // menuIsOpen={true}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 10000,
                                }),

                                control: (base) => ({
                                    ...base,
                                    minHeight: 30,
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
                        {fieldDescription?.length ? (
                            <div className={styles['field-description-wrapper']}>
                                {fieldDescription.map(item => <p className={`${styles['field-description-item']}`}>{item}</p> )}
                            </div>)
                            : null
                        }
                        {errorMessage && <p className={`${styles.error} error`}>{errorMessage}</p>}
                    </div>
                </div>
            </TutorialHintTooltip>
        );
    }
);

SelectField.displayName = "SelectField";

export default SelectField;
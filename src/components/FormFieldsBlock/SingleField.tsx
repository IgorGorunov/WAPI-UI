import React from 'react';
import {Controller} from "react-hook-form";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormBuilderType} from "@/types/forms";

type FormFieldsBlockType = {
    control: any;
    curField: FormBuilderType;
    errors: any;
    isDisabled?: boolean;
}
const Field: React.FC<FormFieldsBlockType> = ({curField, control, errors, isDisabled=false}) => {
    return (
        <>
        {curField.onChange ?  <Controller
            key={curField.key || curField.name}
            name={curField.name}
            control={control}
            render={(
                {
                    field: { ...props},
                    fieldState: {error}
                }) => (
                <FieldBuilder
                    {...curField}
                    {...props}
                    label={curField.label}
                    fieldType={curField.fieldType}
                    options={curField.options}
                    placeholder={curField.placeholder}
                    errorMessage={error?.message}
                    errors={errors}
                    isRequired={!!curField?.rules?.required || false}
                    disabled={(!!isDisabled || curField.disabled) && !curField?.notDisable}
                    classNames={curField.classNames}
                    onChange={(selectedOption) => {
                        props.onChange(selectedOption);
                        curField.onChange(selectedOption);
                    }}
                /> )}
            rules = {curField.rules}
        /> : <Controller
            key={curField.key || curField.name}
            name={curField.name}
            control={control}
            render={(
                {
                    field: { ...props},
                    fieldState: {error}
                }) => (
                <FieldBuilder
                    {...curField}
                    {...props}
                    name={curField.name}
                    label={curField.label}
                    fieldType={curField.fieldType}
                    options={curField.options}
                    placeholder={curField.placeholder}
                    errorMessage={error?.message}
                    errors={errors}
                    isRequired={!!curField?.rules?.required || false}
                    disabled={(!!isDisabled || curField.disabled) && !curField.notDisable}
                    classNames={curField.classNames}
                /> )}
            rules = {curField.rules}
        /> }

        </>
    )
}

export default Field;
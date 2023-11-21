import React from 'react';
import {Controller} from "react-hook-form";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormBuilderType} from "@/types/forms";

type FormFieldsBlockType = {
    control: any;
    fieldsArray: FormBuilderType[];
    errors: any;
    isDisabled?: boolean;
}
const FormFieldsBlock: React.FC<FormFieldsBlockType> = ({fieldsArray, control, errors, isDisabled=false}) => {
    return <>
        {fieldsArray.map((curField) => (
            //<div key={curField.name}  className={`${curField.width ? 'width-'+curField.width : ''}`}>
                curField.onChange ?
                <Controller
                    key={curField.name}
                    name={curField.name}
                    control={control}
                    render={(
                        {
                            field: { ...props},
                            fieldState: {error}
                        }) => (
                        <FieldBuilder
                            disabled={!!isDisabled}
                            {...curField}
                            {...props}
                            name={curField.name}
                            label={curField.label}
                            fieldType={curField.fieldType}
                            options={curField.options}
                            placeholder={curField.placeholder}
                            errorMessage={error?.message}
                            errors={errors}
                            isRequired={!!curField.rules || false}
                            classNames={curField.classNames}
                            onChange={(selectedOption) => {
                                props.onChange(selectedOption);
                                curField.onChange(selectedOption);
                            }}
                        /> )}
                    rules = {curField.rules}
                /> : <Controller
                        key={curField.name}
                        name={curField.name}
                        control={control}
                        render={(
                            {
                                field: { ...props},
                                fieldState: {error}
                            }) => (
                            <FieldBuilder
                                disabled={!!isDisabled}
                                {...curField}
                                {...props}
                                name={curField.name}
                                label={curField.label}
                                fieldType={curField.fieldType}
                                options={curField.options}
                                placeholder={curField.placeholder}
                                errorMessage={error?.message}
                                errors={errors}
                                isRequired={!!curField.rules || false}
                                classNames={curField.classNames}
                            /> )}
                        rules = {curField.rules}
                    />
            //</div>
        ))}</>
}

export default FormFieldsBlock;
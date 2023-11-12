import React from 'react';
import {Controller} from "react-hook-form";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FieldPropsType, FormBuilderType} from "@/types/forms";

type FormFieldsBlockType = {
    control: any;
    fieldsArray: FormBuilderType[];
    errors: any;
}
const FormFieldsBlock: React.FC<FormFieldsBlockType> = ({fieldsArray, control, errors}) => {
    return <>
        {fieldsArray.map((curField, index) => (
            //<div key={curField.name}  className={`${curField.width ? 'width-'+curField.width : ''}`}>
                <Controller
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
                            isRequired={!!curField.rules || false}
                            classNames={curField.classNames}
                        /> )}
                    rules = {curField.rules}
                />
            //</div>
        ))}</>
}

export default FormFieldsBlock;
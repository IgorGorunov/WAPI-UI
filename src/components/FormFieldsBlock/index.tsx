import React from 'react';
import {Controller} from "react-hook-form";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormBuilderType} from "@/types/forms";
import SingleField from "./SingleField";

type FormFieldsBlockType = {
    control: any;
    fieldsArray: FormBuilderType[];
    errors: any;
    isDisabled?: boolean;
}
const FormFieldsBlock: React.FC<FormFieldsBlockType> = ({fieldsArray, control, errors, isDisabled=false}) => {
    return <>
        {fieldsArray.map((curField) => {
            if (curField.isGrid) {
                return <div className={`grid-inner-row ${curField.width ? "width-"+curField.width : ""} ${curField.classNames}`}>
                    <div className='grid-row'>
                        {curField.fields.map((field )=> <SingleField curField={field} control={control} errors={errors} isDisabled={isDisabled} />)}
                    </div>
                </div>
            } else {
                return <SingleField curField={curField} control={control} errors={errors} isDisabled={isDisabled} />
            }
        })}</>
}

export default FormFieldsBlock;
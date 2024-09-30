import React from 'react';
import {FormBuilderType, FormFieldTypes} from "@/types/forms";
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
            if (!curField) return null;
            if (curField.fieldType === FormFieldTypes.GRID) {
                return <div key={curField.name} className={`grid-inner-row ${curField.width ? "width-"+curField.width : ""} ${curField.classNames}`}>
                    <div className='grid-row'>
                        {curField.fields.map((field, index )=><SingleField key={curField.name+'_'+index} curField={field} control={control} errors={errors} isDisabled={isDisabled} />)}
                    </div>
                </div>
            } else {
                return <SingleField key={curField.name} curField={curField} control={control} errors={errors} isDisabled={isDisabled} />
            }
        })}</>
}

export default FormFieldsBlock;
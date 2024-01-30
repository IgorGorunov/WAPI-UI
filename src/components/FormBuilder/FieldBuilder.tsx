import React, {forwardRef} from "react";

import {FormBuilderType, FormFieldTypes} from "@/types/forms";

import TextField from "./TextInput/TextField";
import SelectField from "./Select/SelectField";
import SingleDateInput from "./SingleDateInput";
import Checkbox from "./Checkbox";
import RadioSwitch from "./RadioSwitch";
import Other from './Other';
import ToggleSwitch from './ToggleSwitch';
import TextArea from './TextArea';

const formComponentsMap = {
  [FormFieldTypes.TEXT]: TextField,
  [FormFieldTypes.NUMBER]: TextField,
  [FormFieldTypes.DATE]: SingleDateInput,
  [FormFieldTypes.SELECT]: SelectField,
  [FormFieldTypes.CHECKBOX]: Checkbox,
  [FormFieldTypes.RADIO]: RadioSwitch,
  [FormFieldTypes.OTHER]: Other,
  [FormFieldTypes.TOGGLE]: ToggleSwitch,
  [FormFieldTypes.TEXT_AREA]: TextArea,

};

//const FieldBuilder: React.FC<FormBuilderType> = ({
const  FieldBuilder = forwardRef<HTMLInputElement | HTMLSelectElement, FormBuilderType>(
          ({fieldType,
    isDisplayed = true,
  ...otherProps
},ref) => {

  if (!isDisplayed) return null;

  const Component =
    formComponentsMap[fieldType as keyof typeof formComponentsMap];

  if (!Component) return null;

  return <Component ref={ref} type={fieldType} {...otherProps} />;
});

export default FieldBuilder;

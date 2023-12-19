import React from "react";

import {FormBuilderType, FormFieldTypes} from "@/types/forms";

import TextField from "./TextInput/TextField";
import SelectField from "./Select/SelectField";
import SingleDateInput from "./SingleDateInput";
import Checkbox from "./Checkbox";
import RadioSwitch from "./RadioSwitch";
import Other from './Other';
import ToggleSwitch from './ToggleSwitch';

const formComponentsMap = {
  [FormFieldTypes.TEXT]: TextField,
  [FormFieldTypes.NUMBER]: TextField,
  [FormFieldTypes.DATE]: SingleDateInput,
  [FormFieldTypes.SELECT]: SelectField,
  [FormFieldTypes.CHECKBOX]: Checkbox,
  [FormFieldTypes.RADIO]: RadioSwitch,
  [FormFieldTypes.OTHER]: Other,
  [FormFieldTypes.TOGGLE]: ToggleSwitch,
};

const FieldBuilder: React.FC<FormBuilderType> = ({
  fieldType,
    isDisplayed = true,
  ...otherProps
}) => {

  if (!isDisplayed) return null;

  const Component =
    formComponentsMap[fieldType as keyof typeof formComponentsMap];

  if (!Component) return null;

  return <Component type={fieldType} {...otherProps} />;
};

export default FieldBuilder;

import React from "react";

import { FormFieldTypes, FormBuilderType } from "@/types/forms";

import TextField from "./TextInput/TextField";
import SelectField from "./Select/SelectField";
//import SelectField from "../S";
import Checkbox from "./Checkbox";

const formComponentsMap = {
  [FormFieldTypes.TEXT]: TextField,
  [FormFieldTypes.NUMBER]: TextField,
  [FormFieldTypes.SELECT]: SelectField,
  [FormFieldTypes.CHECKBOX]: Checkbox,
};

const FieldBuilder: React.FC<FormBuilderType> = ({
  fieldType,
  ...otherProps
}) => {
  const Component =
    formComponentsMap[fieldType as keyof typeof formComponentsMap];

  if (!Component) return null;

  return <Component type={fieldType} {...otherProps} />;
};

export default FieldBuilder;

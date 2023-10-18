import React from "react";

import { FormFieldTypes, FormBuilderType } from "../../types/forms";

import TextField from "./TextInput/TextField";
import SelectField from "./Select/SelectField";
import Switch from "./Switch/Switch";

const formComponentsMap = {
  [FormFieldTypes.TEXT]: TextField,
  [FormFieldTypes.SELECT]: SelectField,
  [FormFieldTypes.SWITCH]: Switch,
};

const FieldBuilder: React.FC<FormBuilderType> = ({
  fieldType,
  ...otherProps
}) => {
  const Component =
    formComponentsMap[fieldType as keyof typeof formComponentsMap];

  if (!Component) return null;

  return <Component {...otherProps} />;
};

export default FieldBuilder;

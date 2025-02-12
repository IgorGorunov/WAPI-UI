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
import RadioButton from "./RadioButton";
import PhoneNumber from "./PhoneNumber";

const formComponentsMap = {
  [FormFieldTypes.TEXT]: TextField,
  [FormFieldTypes.NUMBER]: TextField,
  [FormFieldTypes.DATE]: SingleDateInput,
  [FormFieldTypes.DATE_TIME]: SingleDateInput,
  [FormFieldTypes.SELECT]: SelectField,
  [FormFieldTypes.CHECKBOX]: Checkbox,
  [FormFieldTypes.RADIO]: RadioSwitch,
  [FormFieldTypes.OTHER]: Other,
  [FormFieldTypes.TOGGLE]: ToggleSwitch,
  [FormFieldTypes.TEXT_AREA]: TextArea,
  [FormFieldTypes.RADIO_BUTTON]: RadioButton,
  [FormFieldTypes.PHONE_NUMBER]: PhoneNumber,
};


const FieldBuilder = forwardRef<any, FormBuilderType>(
    ({ fieldType, isDisplayed = true, type, ...otherProps }, ref) => {
      if (!isDisplayed) return null;

      const Component = formComponentsMap[fieldType as keyof typeof formComponentsMap];

      if (!Component) return null;

      return (
          <Component
              ref={ref as any}  // Using `any` to bypass strict typing
              {...otherProps}
              type={fieldType===FormFieldTypes.NUMBER ? 'number' : type}
          />
      );
    }
);


export default FieldBuilder;
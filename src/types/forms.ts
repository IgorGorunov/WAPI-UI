import {ChangeEvent } from 'react'

type RefType=any;

export const enum FormFieldTypes {
  NUMBER = 'number',
  SELECT = 'select',
  TEXT = 'text',
  DATE = 'date',
  CHECKBOX = 'checkbox',
  RADIO = 'radio-switch',
  OTHER = 'other',
  TOGGLE = 'toggle-switch',
  GRID = 'grid',
  TEXT_AREA = 'text-area',
  RADIO_BUTTON = 'radio-button',
}

export type TextFieldType = string

export type OptionType = {
  value: string
  label: string
  extraInfo?: string;
  amount?: number;
  color?: string;
}

export const enum WidthType {
  w100 = "100",
  w75 = '75',
  w50 = "50",
  w33 = '33',
  w67 = '67',
  w25 = '25',
  w17 = '17',
  autoGrow = 'auto-grow',
  autoNoGrow = 'auto-no-grow',
}

export type FieldPropsType = {
  classNames?: string
  name: string
  label?: string
  type?: string
  placeholder?: string
  errorMessage?: string | undefined
  isSearchable?: boolean
  isFullWidth?: boolean
  width?: WidthType
  isRequired?: boolean
  rows?: number | undefined
  count?: number | undefined
  maxLength?: number | undefined
  disabled?: boolean
  // size?: SizeTypes.large | SizeTypes.medium | SizeTypes.small;
  innerRef?: RefType
  value?: string | number | boolean | Date;
  checked?: boolean;
  onChange?: (event: ChangeEvent | ChangeEvent<HTMLInputElement> | string | OptionType) => void
  inputValue?: string
  registerInput?: any
  rules?: any
  // onInputChange?: (inputValue: string, meta: InputActionMeta) => void;
  options?: OptionType[]
  errors?: any;
  isClearable?: boolean;
  needToasts?: boolean;
  otherComponent?: any;
  isDisplayed?: boolean;
  autoComplete?: string;
  ref?: any;
  hideTextOnMobile?: boolean;
  extraLabel?: string;
  isCheckboxHidden?: boolean;
  circleColor?: string;
  isCountry?: boolean;
}

export type FormBuilderType = FieldPropsType & {
  fieldType: FormFieldTypes;
  fields?: FormBuilderType[];
}

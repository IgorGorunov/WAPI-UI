import React, { ChangeEvent } from 'react'

type Ref = React.Ref<HTMLInputElement>

export const enum FormFieldTypes {
  NUMBER = 'number',
  SELECT = 'select',
  TEXT = 'text',
  SWITCH = 'checkbox',
}

export type TextFieldType = string | number

export type OptionType = {
  value?: string
  id?: string | number
}

export type FieldPropsType = {
  classNames?: string
  name: string
  label: string
  type?: string
  placeholder?: string
  errorMessage?: string | undefined
  isSearchable?: boolean
  isFullWidth?: boolean
  isRequired?: boolean
  rows?: number | undefined
  count?: number | undefined
  maxLength?: number | undefined
  disabled?: boolean
  // size?: SizeTypes.large | SizeTypes.medium | SizeTypes.small;
  innerRef?: Ref
  value?: TextFieldType
  onChange?: (event: ChangeEvent | TextFieldType) => void
  nputValue?: string
  registerInput?: any
  rules?: any
  // onInputChange?: (inputValue: string, meta: InputActionMeta) => void;
  options?: OptionType[]
  errors?: any
}

export type FormBuilderType = FieldPropsType & {
  fieldType: FormFieldTypes
}

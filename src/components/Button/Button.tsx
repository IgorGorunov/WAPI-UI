import React, { ComponentProps } from "react";
import { Icon, IconType } from "../Icon";
import "./styles.scss";

export const enum ButtonSize {
  EXTRA_SMALL= "x-sm",
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
  ONLY_ICON = 'icon-button',
}

export const enum ButtonForm {
  BR0 = "br0",
  BR2 = "br2",
  BR30 = "br30",
}

export const enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  FILTER = 'filter',
}

export type ButtonType = ComponentProps<"button"> & {
  children?: React.ReactNode;
  classNames?: string;
  icon?: IconType;
  iconOnTheRight?: boolean;
  form?: ButtonForm;
  size?: ButtonSize;
  variant?: ButtonVariant;
  isFullWidth?: boolean;
  isVisible?: boolean;
};

const Button: React.FC<ButtonType> = (props) => {
  const {
    type,
    icon,
    iconOnTheRight,
    form = ButtonForm.BR30,
    size = ButtonSize.MEDIUM,
    isFullWidth = false,
    variant= ButtonVariant.PRIMARY,
    isVisible = true,
    children,
    classNames,
    ...otherProps
  } = props;
  const sizeClassName = `btn-size-${size}`;
  const formClassName = `btn-form-${form}`;

  return (
    <button
      type={type || "button"}
      className={`btn ${classNames} ${sizeClassName} ${formClassName} ${isFullWidth ? "full-width" : ""} ${variant} ${isVisible ? 'fade-in' : 'fade-out'}`}
      {...otherProps}
    >
      {icon && !iconOnTheRight ? (
        <span className="icon icon-left">
          <Icon name={icon} />
        </span>
      ) : null}
      {children}
      {icon && iconOnTheRight ? (
        <span className={`icon icon-right`}>
          <Icon name={icon} />
        </span>
      ) : null}
    </button>
  );
};

export default Button;

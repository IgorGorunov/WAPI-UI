import React, { type ComponentProps } from "react";
import { Icon, type IconType } from "../Icon";
import styles from "./styles.module.scss";

export const enum ButtonSize {
  EXTRA_SMALL = "x-sm",
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
  //tertiary, quaternary, quinary, senary, septenary, octonary, nonary, and denary
  TETRIARY = 'tertiary',
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
    variant = ButtonVariant.PRIMARY,
    isVisible = true,
    children,
    classNames,
    ...otherProps
  } = props;
  const sizeClassName = styles[`btn-size-${size}`] || `btn-size-${size}`;
  const formClassName = styles[`btn-form-${form}`] || `btn-form-${form}`;

  return (
    <button
      type={type || "button"}
      className={`${styles.btn} btn ${styles[classNames] || ''} ${classNames || ""} ${sizeClassName} ${formClassName} ${isFullWidth ? styles['full-width'] || "full-width" : ""} ${styles[variant] || variant} ${isVisible ? styles['fade-in'] || 'fade-in' : styles['fade-out'] || 'fade-out'}`}
      {...otherProps}
    >
      {icon && !iconOnTheRight ? (
        <span className={`${styles.icon || ''} icon ${styles['icon-left'] || "icon-left"}`}>
          <Icon name={icon} />
        </span>
      ) : null}
      {children}
      {icon && iconOnTheRight ? (
        <span className={`${styles.icon || ''} icon ${styles['icon-right'] || "icon-right"}`}>
          <Icon name={icon} />
        </span>
      ) : null}
    </button>
  );
};

export default Button;

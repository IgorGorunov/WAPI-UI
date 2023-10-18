import React, { ComponentProps } from "react";
import { Icon, IconType } from "../Icon";
import classes from "./Button.module.scss";

export const enum ButtonSize {
  SMALL = "sm",
  MEDUIM = "md",
  LARGE = "lg",
}

export const enum ButtonForm {
  BR0 = "br0",
  BR2 = "br2",
  BR30 = "br30",
}

export type ButtonType = ComponentProps<"button"> & {
  children?: React.ReactNode;
  classNames?: string;
  icon?: IconType;
  iconOnTheRight?: boolean;
  form?: ButtonForm;
  size?: ButtonSize;
};

const Button: React.FC<ButtonType> = (props) => {
  const {
    type,
    icon,
    iconOnTheRight,
    form = ButtonForm.BR30,
    size = ButtonSize.MEDUIM,
    children,
    ...otherProps
  } = props;
  const sizeClassName = `btn-size-${size}`;
  const formClassName = `btn-form-${form}`;

  return (
    <button
      type={type || "button"}
      className={`${classes.btn} ${classes[sizeClassName]} ${classes[formClassName]}`}
      {...otherProps}
    >
      {icon && !iconOnTheRight ? (
        <span className={classes["icon-left"]}>
          <Icon name={icon} />
        </span>
      ) : null}
      {children}
      {icon && iconOnTheRight ? (
        <span className={`${classes.icon} ${classes["icon-right"]} `}>
          <Icon name={icon} />
        </span>
      ) : null}
    </button>
  );
};

export default Button;

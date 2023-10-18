import React from "react";
import classes from "./Container.module.scss";

type Props = {
  children?: React.ReactNode;
};

const Container: React.FC<Props> = ({ children }) => {
  return <div className={classes.container}>{children}</div>;
};

export default Container;

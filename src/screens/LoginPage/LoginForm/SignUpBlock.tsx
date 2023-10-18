import React from "react";
import Button from "../../../components/Button/Button";

import classes from "./SignUpBlock.module.scss";

const SignUpBlock: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  };

  return (
    <div className={`card ${classes.container}`}>
      <h2 className={classes["signup-title"]}>
        Are you looking for enrollment?
      </h2>
      <Button disabled onClick={handleClick}>
        Sign up
      </Button>
    </div>
  );
};

export default SignUpBlock;

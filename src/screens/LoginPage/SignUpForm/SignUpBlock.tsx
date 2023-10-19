import React from "react";
import Button from "../../../components/Button/Button";

import "./styles.scss";

const SignUpBlock: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  };

  return (
    <div className={`card signup-container`}>
      <h2 className="signup-title">
        Are you looking for enrollment?
      </h2>
      <Button disabled onClick={handleClick}>
        Sign up
      </Button>
    </div>
  );
};

export default SignUpBlock;

import React from "react";
import Button from "../../../components/Button/Button";

import "./styles.scss";
import Router from "next/router";
import {Routes} from "@/types/routes";

const SignUpBlock: React.FC = () => {
  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    await Router.push(Routes.SignUp);
  };

  return (
    <div className={`card signup-container`}>
      <h2 className="signup-title">
        Are you looking for enrollment?
      </h2>
      <Button onClick={handleClick}>
        Sign up
      </Button>
    </div>
  );
};

export default SignUpBlock;

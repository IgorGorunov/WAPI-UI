import React from "react";
import Button from "../../../components/Button/Button";
import styles from "./styles.module.scss";

// import "./styles.scss";
import Router from "next/router";
import { Routes } from "@/types/routes";

type SignUpPropsType = {
  utmQuery?: any;
}

const SignUpBlock: React.FC<SignUpPropsType> = ({ utmQuery }) => {

  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await Router.push({ pathname: Routes.SignUp, query: utmQuery || {} });
  };

  return (
    <div className={`card ${styles['signup-container']}`}>
      <h2 className={styles['signup-title']}>
        Are you looking for enrollment?
      </h2>
      <Button onClick={handleClick}>
        Sign up
      </Button>
    </div>
  );
};

export default SignUpBlock;

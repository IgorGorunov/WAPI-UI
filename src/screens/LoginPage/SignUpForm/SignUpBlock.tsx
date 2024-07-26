import React from "react";
import Button from "../../../components/Button/Button";

import "./styles.scss";
import Router from "next/router";
import {Routes} from "@/types/routes";
import {useTranslations} from "next-intl";

const SignUpBlock: React.FC = () => {
    const t = useTranslations('Login');
  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    await Router.push(Routes.SignUp);
  };

  return (
    <div className={`card signup-container`}>
      <h2 className="signup-title">
          {t('notRegisteredText')}
      </h2>
      <Button onClick={handleClick}>
          {t('signUp')}
      </Button>
    </div>
  );
};

export default SignUpBlock;

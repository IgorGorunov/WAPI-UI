import React from "react";
import Layout from "@/components/Layout/Layout";
import BackgroundLogo from "./BackgroundLogo";
import LoginForm from "./LoginForm/LoginForm";
import SignUpBlock from "./LoginForm/SignUpBlock";
import classes from "./LoginPage.module.scss";

const LoginPage = () => {
  return (
    <Layout hasFooter>
      <BackgroundLogo />
      <div className={classes.container}>
        <div className={classes["text-wrapper"]}>
          <h1>SIGN IN</h1>
          <h3>Welcome back</h3>
        </div>

        <LoginForm />
        <SignUpBlock />
      </div>
    </Layout>
  );
};

export default LoginPage;

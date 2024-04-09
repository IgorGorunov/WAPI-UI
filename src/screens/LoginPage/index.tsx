import React, {useEffect} from "react";
import Layout from "@/components/Layout/Layout";
import LoginForm from "./LoginForm/LoginForm";
import SignUpBlock from "./SignUpForm/SignUpBlock";
import "./styles.scss";
import Head from "next/head";
import useAuth from "@/context/authContext";

const LoginPage = () => {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, []);

    return (
        <Layout hasFooter>
            <Head>
                <title>Login</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>

            <div className="login-page__container">
                <div className="login-page__text-wrapper">
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

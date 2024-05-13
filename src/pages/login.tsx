import Head from "next/head";
import LoginPage from "@/screens/LoginPage";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="login" content="login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png"/>
      </Head>
      <LoginPage />
    </>
  );
}

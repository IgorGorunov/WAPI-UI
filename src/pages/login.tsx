import Head from "next/head";
import LoginPage from "@/screens/LoginPage";

export default function Login() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="dashboard" content="dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginPage />
    </>
  );
}

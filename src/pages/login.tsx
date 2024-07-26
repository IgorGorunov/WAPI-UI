import Head from "next/head";
import LoginPage from "@/screens/LoginPage";
import {GetStaticPropsContext} from "next";

export default function Login({locale}) {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="login" content="login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png"/>
      </Head>
        <p>Locale: {locale}</p>
      <LoginPage />
    </>
  );
}

export async function getStaticProps({locale}: GetStaticPropsContext) {
    return {
        props: {
            messages: (await import(`../../messages/${locale}.json`)).default
        }
    };
}

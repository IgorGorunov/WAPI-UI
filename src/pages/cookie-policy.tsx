import Head from "next/head";
import CookiePolicyPage from "@/screens/CookiePolicyPage";
import {GetStaticPropsContext} from "next";

export default function Login() {
    return (
        <>
            <Head>
                <title>Cookie policy</title>
                <meta name="cookie-policy" content="cookie policy" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <CookiePolicyPage />
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
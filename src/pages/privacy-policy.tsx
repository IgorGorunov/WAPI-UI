import Head from "next/head";
import PrivacyPolicyPage from "@/screens/PrivacyPolicyPage";
import {GetStaticPropsContext} from "next";

export default function Login() {
    return (
        <>
            <Head>
                <title>Privacy policy</title>
                <meta name="privacy-policy" content="privacy policy" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <PrivacyPolicyPage />
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
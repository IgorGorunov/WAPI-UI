import Head from "next/head";
import ConfirmEmailPage from "@/screens/ConfirmEmailPage";
import {GetStaticPropsContext} from "next";

export default function ConfirmEmail() {
    return (
        <>
            <Head>
                <title>Confirm email</title>
                <meta name="email-confirm" content="email-confirm" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <ConfirmEmailPage />
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
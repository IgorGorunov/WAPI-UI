import Head from "next/head";
import GetStartedPage from "@/screens/GetStartedPage";
import {GetStaticPropsContext} from "next";

export default function GetStarted() {
    return (
        <>
            <Head>
                <title>Get started with WAPI</title>
                <meta name="get-started" content="get-started" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <GetStartedPage />
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
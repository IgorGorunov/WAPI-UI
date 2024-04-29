import Head from "next/head";
import GetStartedPage from "@/screens/GetStartedPage";

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
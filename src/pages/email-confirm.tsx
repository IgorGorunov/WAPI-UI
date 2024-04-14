import Head from "next/head";
import ConfirmEmailPage from "@/screens/ConfirmEmailPage";

export default function ConfirmEmail() {
    return (
        <>
            <Head>
                <title>Confirm email</title>
                <meta name="login" content="login" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <ConfirmEmailPage />
        </>
    );
}
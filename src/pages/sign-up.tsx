import Head from "next/head";
import SignUpPage from "@/screens/SignUpPage";

export default function SignUp() {
    return (
        <>
            <Head>
                <title>Sign up</title>
                <meta name="login" content="login" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <SignUpPage />
        </>
    );
}

import React from "react";
import AuthChecker from "@/components/AuthChecker";
import ProfilePage from "@/screens/ProfilePage";
import {GetStaticPropsContext} from "next";

export default function Orders() {

    return (
        <AuthChecker isUser={true}>
            <ProfilePage />
        </AuthChecker>
    );
}

export async function getStaticProps({locale}: GetStaticPropsContext) {
    return {
        props: {
            messages: (await import(`../../../messages/${locale}.json`)).default
        }
    };
}
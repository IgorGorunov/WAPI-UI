import React from "react";
import TicketsPage from "@/screens/TicketsPage";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function Tickets() {

    return (
        <AuthChecker isUser={true} pageName="Tickets">
            <TicketsPage />
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
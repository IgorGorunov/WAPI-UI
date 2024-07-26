import React from "react";
import InvoicesPage from "@/screens/InvoicesPage";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function Invoices() {
    return (
        <AuthChecker isUser={true} pageName="Finances/Invoices">
            <InvoicesPage />
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
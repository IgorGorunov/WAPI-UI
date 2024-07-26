import React from "react";
import CodReportsPage from "@/screens/CodReportsPage";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function CodReports() {
    return (
        <AuthChecker isUser={true} pageName="Finances/CODReports">
            <CodReportsPage />
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
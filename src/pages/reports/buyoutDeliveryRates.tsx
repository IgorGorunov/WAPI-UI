import React from "react";
import ReportPage from '@/screens/ReportPage'
import {REPORT_TYPES} from "@/types/reports";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Reports/DeliveryRate">
            <ReportPage reportType={REPORT_TYPES.DELIVERY_RATES} />
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
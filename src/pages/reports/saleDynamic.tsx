import React from "react";
import ReportPage from '@/screens/ReportPage'
import {REPORT_TYPES} from "@/types/reports";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {

    return (
        <AuthChecker isUser={true} pageName="Reports/SaleDynamic">
            <ReportPage reportType={REPORT_TYPES.SALE_DYNAMIC} />
        </AuthChecker>
    );
}
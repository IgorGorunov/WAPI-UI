import React from "react";
import ReportPage from '@/screens/ReportPage'
import {REPORT_TYPES} from "@/types/reports";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Reports/CodCheck">
            <ReportPage reportType={REPORT_TYPES.COD_REPORT} />
        </AuthChecker>
    );
}
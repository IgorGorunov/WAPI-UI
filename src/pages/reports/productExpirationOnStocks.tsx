import React from "react";
import ReportPage from '@/screens/ReportPage'
import {REPORT_TYPES} from "@/types/reports";
import AuthChecker from "@/components/AuthChecker";

export default function Report() {
    return (
        <AuthChecker isUser={true} pageName="Reports/ProductExpirationOnStocks">
            <ReportPage reportType={REPORT_TYPES.PRODUCT_EXPIRATION} />
        </AuthChecker>
    );
}
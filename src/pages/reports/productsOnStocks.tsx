import React from "react";
import ReportPage from '@/screens/ReportPage'
import {REPORT_TYPES} from "@/types/reports";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Reports/ProductsOnStocks">
            <ReportPage reportType={REPORT_TYPES.PRODUCTS_ON_STOCKS} />
        </AuthChecker>
    );
}
import React from "react";
import ReportsListPage from "@/screens/ReportsListPage";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Reports">
            <ReportsListPage />
        </AuthChecker>
    );
}
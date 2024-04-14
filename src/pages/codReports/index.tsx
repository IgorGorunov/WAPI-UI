import React from "react";
import CodReportsPage from "@/screens/CodReportsPage";
import AuthChecker from "@/components/AuthChecker";

export default function CodReports() {
    return (
        <AuthChecker isUser={true}>
            <CodReportsPage />
        </AuthChecker>
    );
}
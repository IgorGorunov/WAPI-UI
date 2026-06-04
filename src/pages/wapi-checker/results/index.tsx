import React from "react";

import AuthChecker from "@/components/AuthChecker";
import AntiFraudPage from "@/screens/AntiFraudResultsPage";

export default function AntiFraud() {
    console.log('111');
    return (
        <AuthChecker isUser={true}>
            <AntiFraudPage />
        </AuthChecker>
    );
}
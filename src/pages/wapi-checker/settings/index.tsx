import React from "react";

import AuthChecker from "@/components/AuthChecker";
import AntiFraudPage from "@/screens/AntiFraudSettingsPage";

export default function AntiFraud() {
    return (
        <AuthChecker isUser={true}>
            <AntiFraudPage />
        </AuthChecker>
    );
}
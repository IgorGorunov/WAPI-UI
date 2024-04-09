import React from "react";
import InvoicesPage from "@/screens/InvoicesPage";
import AuthChecker from "@/components/AuthChecker";

export default function Invoices() {
    return (
        <AuthChecker isUser={true}>
            <InvoicesPage />
        </AuthChecker>
    );
}
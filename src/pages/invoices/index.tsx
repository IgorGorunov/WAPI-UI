import React from "react";
import InvoicesPage from "@/screens/InvoicesPage";
import AuthChecker from "@/components/AuthChecker";

export default function Invoices() {
    return (
        <AuthChecker isUser={true} pageName="Finances/Invoices">
            <InvoicesPage />
        </AuthChecker>
    );
}
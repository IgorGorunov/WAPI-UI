import React from "react";
import TicketsPage from "@/screens/TicketsPage";
import AuthChecker from "@/components/AuthChecker";

export default function Tickets() {

    return (
        <AuthChecker isUser={true}>
            <TicketsPage />
        </AuthChecker>
    );
}
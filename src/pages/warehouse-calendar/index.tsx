import React from "react";
import WarehouseCalendarPage from "@/screens/WarehouseCalendarPage";
import AuthChecker from "@/components/AuthChecker";

export default function Tickets() {

    return (
        <AuthChecker isUser={true} pageName="Tickets">
            <WarehouseCalendarPage />
        </AuthChecker>
    );
}
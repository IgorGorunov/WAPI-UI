import React from "react";
import OrdersPage from "@/screens/OrdersPage";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {

    return (
        <AuthChecker isUser={true} pageName="Orders/Fullfillment">
            <OrdersPage />
        </AuthChecker>
    );
}
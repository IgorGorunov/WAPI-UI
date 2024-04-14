import React from "react";
import ProductsPage from "@/screens/ProductsPage";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {
    return (
        <AuthChecker isUser={true}>
            <ProductsPage />
        </AuthChecker>
    );
}
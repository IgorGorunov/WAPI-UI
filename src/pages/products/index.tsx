import React from "react";
import ProductsPage from "@/screens/ProductsPage_Old";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Products/ProductsList">
            <ProductsPage />
        </AuthChecker>
    );
}
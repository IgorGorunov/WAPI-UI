import React from "react";
import ProductsStockPage from "@/screens/ProductsStockPage";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Products/ProductsStock">
            <ProductsStockPage />
        </AuthChecker>
    );
}
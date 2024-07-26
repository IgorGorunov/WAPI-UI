import React from "react";
import ProductsStockPage from "@/screens/ProductsStockPage";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Products/ProductsStock">
            <ProductsStockPage />
        </AuthChecker>
    );
}

export async function getStaticProps({locale}: GetStaticPropsContext) {
    return {
        props: {
            messages: (await import(`../../../messages/${locale}.json`)).default
        }
    };
}
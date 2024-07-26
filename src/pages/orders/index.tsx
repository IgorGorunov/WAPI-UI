import React from "react";
import OrdersPage from "@/screens/OrdersPage";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function Orders() {

    return (
        <AuthChecker isUser={true} pageName="Orders/Fullfillment">
            <OrdersPage />
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
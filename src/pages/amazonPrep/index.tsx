import React from "react";
import AmazonPrepPage from "@/screens/AmazonPrepPage";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Orders/AmazonPrep">
            <AmazonPrepPage />
        </AuthChecker>
    );
}
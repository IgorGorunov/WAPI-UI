import React from "react";
import AmazonPrepPage from "@/screens/AmazonPrepPage_Old";
import AuthChecker from "@/components/AuthChecker";

export default function Orders() {
    return (
        <AuthChecker isUser={true} pageName="Orders/AmazonPrep">
            <AmazonPrepPage />
        </AuthChecker>
    );
}
import React from "react";
import AuthChecker from "@/components/AuthChecker";
import ProfilePage from "@/screens/ProfilePage";

export default function Orders() {

    return (
        <AuthChecker isUser={true}>
            <ProfilePage />
        </AuthChecker>
    );
}
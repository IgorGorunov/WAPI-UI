import React from "react";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";
import DeliveryReportsPage from "@/screens/DeliveryReportsPage";

export default function Orders() {
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');

    if (!token && savedToken) setToken(savedToken);

    return (
        <DeliveryReportsPage />
    );
}
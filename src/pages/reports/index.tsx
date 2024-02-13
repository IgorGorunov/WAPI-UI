import React from "react";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";
import ReportsListPage from "@/screens/ReportsListPage";

export default function Orders() {
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');

    if (!token && savedToken) setToken(savedToken);

    return (
        <ReportsListPage />
    );
}
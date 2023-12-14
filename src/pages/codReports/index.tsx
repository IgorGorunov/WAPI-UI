import React from "react";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";
import CodReportsPage from "@/screens/CodReportsPage";

export default function Orders() {
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');

    if (!token && savedToken) setToken(savedToken);

    return (
        <CodReportsPage />
    );
}
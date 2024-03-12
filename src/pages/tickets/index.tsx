import React from "react";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";
import TicketsPage from "@/screens/TicketsPage";

export default function Tickets() {
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');

    if (!token && savedToken) setToken(savedToken);

    return (
        <TicketsPage />
    );
}
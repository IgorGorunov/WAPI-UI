import React from "react";
import Head from "next/head";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";
import OrdersPage from "@/screens/OrdersPage";

export default function Orders() {
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');

    if (!token && savedToken) setToken(savedToken);

    return (
        <OrdersPage />
    );
}
import React from "react";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";
import ReportPage from '@/screens/ReportPage'
import {REPORT_TYPES} from "@/types/reports";

export default function Orders() {
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');

    if (!token && savedToken) setToken(savedToken);

    return (
        <ReportPage reportType={REPORT_TYPES.SALE_DYNAMIC} />
    );
}
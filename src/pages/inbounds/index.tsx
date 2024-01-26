import React from "react";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";
import StockMovementsPage from "@/screens/StockMovementsPage";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";

export default function Inbounds() {
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');

    if (!token && savedToken) setToken(savedToken);

    return (
        <StockMovementsPage docType={STOCK_MOVEMENT_DOC_TYPE.INBOUNDS}/>
    );
}
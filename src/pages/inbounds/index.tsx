import React from "react";
import StockMovementsPage from "@/screens/StockMovementsPage";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import AuthChecker from "@/components/AuthChecker";

export default function Inbounds() {
    return (
        <AuthChecker isUser={true} pageName="StockManagment/Inbounds">
            <StockMovementsPage docType={STOCK_MOVEMENT_DOC_TYPE.INBOUNDS}/>
        </AuthChecker>
    );
}
import React from "react";
import StockMovementsPage from "@/screens/StockMovementsPage";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import AuthChecker from "@/components/AuthChecker";

export default function Outbounds() {
    return (
        <AuthChecker isUser={true}>
            <StockMovementsPage docType={STOCK_MOVEMENT_DOC_TYPE.OUTBOUND}/>
        </AuthChecker>
    );
}
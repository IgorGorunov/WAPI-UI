import React from "react";
import StockMovementsPage from "@/screens/StockMovementsPage";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import AuthChecker from "@/components/AuthChecker";

export default function StockMovements() {

    return (
        <AuthChecker isUser={true} pageName="StockManagment/StockMovements">
            <StockMovementsPage docType={STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT}/>
        </AuthChecker>
    );
}
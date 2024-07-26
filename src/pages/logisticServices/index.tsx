import React from "react";
import StockMovementsPage from "@/screens/StockMovementsPage";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function StockMovements() {

    return (
        <AuthChecker isUser={true} pageName="StockManagment/LogisticServices">
            <StockMovementsPage docType={STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE}/>
        </AuthChecker>
    );
}

export async function getStaticProps({locale}: GetStaticPropsContext) {
    return {
        props: {
            messages: (await import(`../../../messages/${locale}.json`)).default
        }
    };
}
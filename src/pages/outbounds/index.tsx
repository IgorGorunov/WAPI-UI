import React from "react";
import StockMovementsPage from "@/screens/StockMovementsPage";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function Outbounds() {
    return (
        <AuthChecker isUser={true} pageName="StockManagment/Outbounds">
            <StockMovementsPage docType={STOCK_MOVEMENT_DOC_TYPE.OUTBOUND}/>
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
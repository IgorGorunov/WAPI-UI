import React, {useCallback} from 'react';
import { STOCK_MOVEMENT_DOC_TYPE } from "@/types/stockMovements";
import { NOTIFICATION_OBJECT_TYPES } from "@/types/notifications";
import dynamic from "next/dynamic";
import {AccessActions} from "@/types/auth";
import useAuth from "@/context/authContext";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus from "@/components/ModalStatus";

const ProductForm = dynamic(() => import("@/screens/ProductsPage/components/ProductForm"), { ssr: false });
const OrderForm = dynamic(() => import("@/screens/OrdersPage/components/OrderForm"), { ssr: false });
const AmazonPrepForm = dynamic(() => import("@/screens/AmazonPrepPage/components/AmazonPrepForm"), { ssr: false });
const TicketForm = dynamic(() => import("@/screens/TicketsPage/components/Ticket"), { ssr: false });
const StockMovementForm = dynamic(() => import("@/screens/StockMovementsPage/components/StockMovementForm"), { ssr: false });

type SingleDocPropsType = {
    type: NOTIFICATION_OBJECT_TYPES | undefined;
    uuid?: string;
    onClose: () => void;
    onSuccessClose?: () => void;
    subjectType?: string | null;
    subjectUuid?: string | null;
    subject?: string;
    seller?: string;
}

const SingleDocument: React.FC<SingleDocPropsType> = ({ type, uuid, onClose, subjectType = null, subjectUuid = null, subject = '', seller }) => {
    const {isActionIsAccessible, isNavItemAccessible} = useAuth();

    const canSee = useCallback((objectType, navItem) => {
        const navAccessible = isNavItemAccessible(navItem);
        return navAccessible && (isActionIsAccessible(objectType, AccessActions.View) || isActionIsAccessible(objectType, AccessActions.ViewObject));
    },[isActionIsAccessible]);

    const setErrorMessage = () => {
        return <ModalStatus statusModalType={STATUS_MODAL_TYPES.ERROR} title="Warning" subtitle={`You have limited access to this action`} onClose={onClose} />;
    }

    switch (type) {
        case NOTIFICATION_OBJECT_TYPES.Product:
            if (canSee(NOTIFICATION_OBJECT_TYPES.Product, 'Products/ProductsList')) {
                return <ProductForm uuid={uuid} onClose={onClose} onCloseSuccess={onClose} />
            }
            return setErrorMessage();
        case NOTIFICATION_OBJECT_TYPES.Fullfilment:
            if (canSee(NOTIFICATION_OBJECT_TYPES.Fullfilment, 'Orders/Fullfillment')) {
                return <OrderForm orderUuid={uuid} closeOrderModal={onClose} closeOrderModalOnSuccess={onClose} />
            }
            return setErrorMessage();
        case NOTIFICATION_OBJECT_TYPES.AmazonPrep:
            if (canSee(NOTIFICATION_OBJECT_TYPES.AmazonPrep, "Orders/AmazonPrep")) {
                return <AmazonPrepForm docUuid={uuid} onCloseModal={onClose} onCloseModalWithSuccess={onClose} />
            }
            return setErrorMessage();
        case NOTIFICATION_OBJECT_TYPES.StockMovement:
            if (canSee(NOTIFICATION_OBJECT_TYPES.StockMovement, "StockManagment/StockMovements")) {
                return <StockMovementForm docUuid={uuid} docType={STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT} closeModalOnSuccess={onClose} closeDocModal={onClose} />
            }
            return setErrorMessage();
        case NOTIFICATION_OBJECT_TYPES.Inbound:
            if (canSee(NOTIFICATION_OBJECT_TYPES.Inbound, "StockManagment/Inbounds")) {
                return <StockMovementForm docUuid={uuid} docType={STOCK_MOVEMENT_DOC_TYPE.INBOUNDS} closeModalOnSuccess={onClose} closeDocModal={onClose} />
            }
            return setErrorMessage();
        case NOTIFICATION_OBJECT_TYPES.Outbound:
            if (canSee(NOTIFICATION_OBJECT_TYPES.Outbound, "StockManagment/Outbounds")) {
                return <StockMovementForm docUuid={uuid} docType={STOCK_MOVEMENT_DOC_TYPE.OUTBOUND} closeModalOnSuccess={onClose} closeDocModal={onClose} />
            }
            return setErrorMessage();
        case NOTIFICATION_OBJECT_TYPES.LogisticService:
            if (canSee(NOTIFICATION_OBJECT_TYPES.LogisticService, "StockManagment/LogisticServices")) {
                return <StockMovementForm docUuid={uuid} docType={STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE} closeModalOnSuccess={onClose} closeDocModal={onClose} />
            }
            return setErrorMessage();
        case NOTIFICATION_OBJECT_TYPES.Ticket:
            if (canSee(NOTIFICATION_OBJECT_TYPES.Ticket, "Tickets")) {
                return <TicketForm ticketUuid={uuid} subjectUuid={subjectUuid} subjectType={subjectType} subject={subject} onClose={onClose} seller={seller} />
            }
            return setErrorMessage();
        //             return <ModalStatus onClose={onClose} statusModalType={STATUS_MODAL_TYPES.MESSAGE} title="Warning" subtitle={`Tickets are temporary unavailable!
        // We are working on resolving this issue! It will be resolved soon.`} />
        default:
            return null;
    }

}

export default SingleDocument
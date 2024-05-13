import React from 'react';
import ProductForm from "@/screens/ProductsPage/components/ProductForm";
import OrderForm from "@/screens/OrdersPage/components/OrderForm";
import AmazonPrepForm from "@/screens/AmazonPrepPage/components/AmazonPrepForm";
import TicketForm from "@/screens/TicketsPage/components/Ticket";
import StockMovementForm from "@/screens/StockMovementsPage/components/StockMovementForm";
import {STOCK_MOVEMENT_DOC_TYPE} from "@/types/stockMovements";
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus from "@/components/ModalStatus";

type SingleDocPropsType = {
    type: NOTIFICATION_OBJECT_TYPES;
    uuid?: string;
    onClose: ()=>void;
    onSuccessClose?: ()=>void;
    subjectType?: string|null;
    subjectUuid?: string|null;
    subject?: string;
    
}

const SingleDocument: React.FC<SingleDocPropsType> = ({type, uuid, onClose, subjectType=null, subjectUuid=null, subject=''}) => {
    switch (type) {
        case NOTIFICATION_OBJECT_TYPES.Product :
            return <ProductForm uuid={uuid} onClose={onClose} onCloseSuccess={onClose} />
        case NOTIFICATION_OBJECT_TYPES.Fullfilment :
            return <OrderForm orderUuid={uuid} closeOrderModal={onClose} closeOrderModalOnSuccess={onClose} />
        case NOTIFICATION_OBJECT_TYPES.AmazonPrep :
            return <AmazonPrepForm docUuid={uuid} onCloseModal={onClose} onCloseModalWithSuccess={onClose} />
        case NOTIFICATION_OBJECT_TYPES.StockMovement :
            return <StockMovementForm docUuid={uuid} docType={STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT} closeModalOnSuccess={onClose} closeDocModal={onClose} />
        case NOTIFICATION_OBJECT_TYPES.Inbound :
            return <StockMovementForm docUuid={uuid} docType={STOCK_MOVEMENT_DOC_TYPE.INBOUNDS} closeModalOnSuccess={onClose} closeDocModal={onClose} />
        case NOTIFICATION_OBJECT_TYPES.Outbound :
            return <StockMovementForm docUuid={uuid} docType={STOCK_MOVEMENT_DOC_TYPE.OUTBOUND} closeModalOnSuccess={onClose} closeDocModal={onClose} />
        case NOTIFICATION_OBJECT_TYPES.LogisticService :
            return <StockMovementForm docUuid={uuid} docType={STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE} closeModalOnSuccess={onClose} closeDocModal={onClose} />
        case NOTIFICATION_OBJECT_TYPES.Ticket :
            //return <TicketForm ticketUuid={uuid} subjectUuid={subjectUuid} subjectType={subjectType} subject={subject} onClose={onClose} />
            return <ModalStatus onClose={onClose} statusModalType={STATUS_MODAL_TYPES.MESSAGE} title="Warning" subtitle={`Tickets are temporary unavailable! 
We are working on resolving this issue! It will be resolved soon.`} />
        default:
            return null;
    }
}

export default SingleDocument
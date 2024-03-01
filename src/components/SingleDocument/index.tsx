import React from 'react';
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";
import ProductForm from "@/screens/ProductsPage/components/ProductForm";
import OrderForm from "@/screens/OrdersPage/components/OrderForm";
import AmazonPrepForm from "@/screens/AmazonPrepPage/components/AmazonPrepForm";

type SingleDocPropsType = {
    type: NOTIFICATION_OBJECT_TYPES;
    uuid: string;
    onClose: ()=>void;
}

const SingleDocument: React.FC<SingleDocPropsType> = ({type, uuid, onClose}) => {

    switch (type) {
        case NOTIFICATION_OBJECT_TYPES.Product :
            return <ProductForm uuid={uuid} onClose={onClose} onCloseSuccess={onClose} />
        case NOTIFICATION_OBJECT_TYPES.Fullfilment :
            return <OrderForm orderUuid={uuid} closeOrderModal={onClose} closeOrderModalOnSuccess={onClose} />
        case NOTIFICATION_OBJECT_TYPES.AmazonPrep :
            return <AmazonPrepForm docUuid={uuid} onCloseModal={onClose} onCloseModalWithSuccess={onClose} />
        // case NOTIFICATION_OBJECT_TYPES.Product :
        //     return <ProductForm uuid={uuid} onClose={onClose} onCloseSuccess={onClose} />
        default:
            return null;
    }
}

export default SingleDocument
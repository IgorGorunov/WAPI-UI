import React, { useCallback, useEffect, useState} from 'react';
import {
    OrderParamsType,
    SingleOrderType
} from "@/types/orders";
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth from "@/context/authContext";
import {getOrderData, getOrderParameters} from '@/services/orders';
import {ApiResponseType} from '@/types/api';
import {ToastContainer} from '@/components/Toast';
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import OrderFormComponent from "@/screens/OrdersPage/components/OrderForm/OrderFormComponent";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";

type OrderFormType = {
    orderUuid?: string;
    closeOrderModal: ()=>void;
    closeOrderModalOnSuccess: ()=>void;
}

const OrderForm: React.FC<OrderFormType> = ({orderUuid, closeOrderModal, closeOrderModalOnSuccess}) => {

    const [isLoading, setIsLoading] = useState(false);

    const { token } = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [orderData, setOrderData] = useState<SingleOrderType|null>(null);
    const [orderParameters, setOrderParameters] = useState<OrderParamsType|null>(null);

    const fetchSingleOrder = async (uuid: string) => {
        try {
            setIsLoading(true);

            //temporarily removed, to check if the problem is here
            // //verify token
            // const responseVerification = await verifyToken(token);
            // if (!verifyUser(responseVerification, currentDate) ){
            //     await Router.push(Routes.Login);
            // }

            const res: ApiResponseType = await getOrderData(
                {token, uuid}
            );

            if (res && "data" in res) {
                setOrderData(res.data);
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrderParams = useCallback(async() => {
        try {
            const resp: ApiResponseType = await getOrderParameters(
                {token: token}
            );

            if (resp && "data" in resp) {
                setOrderParameters(resp.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },[token]);

    useEffect(() => {
        fetchOrderParams();
        if (orderUuid) {
            fetchSingleOrder(orderUuid);
        }
    }, []);

    console.log('order data: ', orderData)

    const onCloseWithSuccess = () => {
        closeOrderModalOnSuccess();
        if (orderUuid) {
            setDocNotificationsAsRead(orderUuid);
        }
    }
    const onClose = () => {
        closeOrderModal();
        if (orderUuid) {
            setDocNotificationsAsRead(orderUuid);
        }
    }

    return <div className='order-info'>
        {(isLoading || !orderParameters) && <Loader />}
        <ToastContainer />
        {orderParameters && (orderUuid && orderData || !orderUuid) ?
            <Modal title={`Order`} onClose={onClose} >
                <OrderFormComponent
                    orderData={orderData}
                    orderParameters={orderParameters}
                    orderUuid={orderUuid}
                    closeOrderModal={onCloseWithSuccess}
                    refetchDoc={()=>{fetchSingleOrder(orderUuid);}}/>
            </Modal>
        : null}
    </div>
}

export default OrderForm;
import React, {useCallback, useEffect, useState} from 'react';
import {OrderParamsType, SingleOrderType} from "@/types/orders";
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {getOrderData, getOrderParameters} from '@/services/orders';
import {ApiResponseType} from '@/types/api';
import {ToastContainer} from '@/components/Toast';
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import OrderFormComponent from "@/screens/OrdersPage/components/OrderForm/OrderFormComponent";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {sendUserBrowserInfo} from "@/services/userInfo";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import useTenant from "@/context/tenantContext";

type OrderFormType = {
    orderUuid?: string;
    closeOrderModal: ()=>void;
    closeOrderModalOnSuccess: ()=>void;
}

const OrderForm: React.FC<OrderFormType> = ({orderUuid, closeOrderModal, closeOrderModalOnSuccess}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { tenantData: { alias }} = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [orderData, setOrderData] = useState<SingleOrderType|null>(null);
    const [orderParameters, setOrderParameters] = useState<OrderParamsType|null>(null);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const fetchSingleOrder = async (uuid: string) => {
        try {
            setIsLoading(true);
            const requestData = {token, alias, uuid};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetOrderData',AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject)) {
                setOrderData(null);

                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal})
                setShowStatusModal(true);

                return null;
            }

            const res: ApiResponseType = await getOrderData(superUser && ui ? {...requestData, ui} : requestData);

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
            setIsLoading(true);
            const requestData = {token, alias};

            // try {
            //     sendUserBrowserInfo({...getBrowserInfo('GetOrderParameters'), body: superUser && ui ? {...requestData, ui} : requestData})
            // } catch {}

            const resp: ApiResponseType = await getOrderParameters(superUser && ui ? {...requestData, ui} : requestData);

            if (resp && "data" in resp) {
                setOrderParameters(resp.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token]);

    useEffect(() => {
        fetchOrderParams();
        if (orderUuid) {
            fetchSingleOrder(orderUuid);
        }
    }, []);

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
        {(isLoading || !(orderUuid && orderData || !orderUuid) || !orderParameters) && <Loader />}
        <ToastContainer />
        {orderParameters && (orderUuid && orderData || !orderUuid) ?
            <Modal title={`Order`} onClose={onClose} classNames='document-modal'>
                <OrderFormComponent
                    orderData={orderData}
                    orderParameters={orderParameters}
                    orderUuid={orderUuid}
                    closeOrderModal={onCloseWithSuccess}
                    refetchDoc={()=>{fetchSingleOrder(orderUuid);}}/>
            </Modal>
        : null}
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
    </div>
}

export default OrderForm;
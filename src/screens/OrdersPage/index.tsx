import React, {useState, useEffect, useCallback} from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import OrderList from "./components/OrderList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import {getOrders} from "@/services/orders";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {OrderType} from "@/types/orders";
import {exportFileXLS} from "@/utils/files";
import Modal from "@/components/Modal";
import OrderForm from "./components/OrderForm";
import ImportFilesBlock from "@/components/ImportFilesBlock";
import Loader from "@/components/Loader";
import {ImportFilesType} from "@/types/importFiles";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";

type ApiResponse = {
    data: any;
};

const OrdersPage = () => {
    const Router = useRouter();
    const { token, setToken, currentDate } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);
    //if (!token) Router.push(Routes.Login);

    useEffect(() => {
        if (!token) Router.push(Routes.Login);
    }, [token]);

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditOrder(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/orders');
        }
    }, [Router.query]);

    const today = currentDate;
    const firstDay = getLastFewDays(today, 10);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})

    const [ordersData, setOrdersData,] = useState<any | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>(ordersData);
    const [isLoading, setIsLoading] = useState(true);

    //import files modal
    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }

    //single order data
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderUuid, setOrderUuid] = useState('');
    const [isOrderNew, setIsOrderNew] = useState(true);

    const {setDocNotificationsAsRead} = useMarkNotificationAsRead()

    const onOrderModalClose = () => {
        setShowOrderModal(false);
        if (orderUuid) {
            setDocNotificationsAsRead(orderUuid);
        }
    }

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            //verify token
            await verifyToken(token);
            // if (!verifyUser(responseVerification, currentDate) ){
            //     await Router.push(Routes.Login);
            // }

            const res: ApiResponse = await getOrders(
                {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}
            );

            if (res && "data" in res) {
                setOrdersData(res.data.map(item=>({...item, key: item.uuid})));
                setIsLoading(false);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    }, [token,curPeriod]);

    useEffect(() => {
        fetchData();
    }, [token, curPeriod]);

    const handleEditOrder = (uuid: string) => {
        setIsOrderNew(false);
        setOrderUuid(uuid);
        // setSingleOrder(null);
        // fetchOrderParams();
        // fetchSingleOrder(uuid);

        setOrdersData(prevState => {
            if (prevState && prevState.length) {
                const el = prevState.filter(item => item.uuid === uuid);

                if (el.length) {
                    return [...prevState.filter(item => item.uuid !== uuid), {...el[0], notifications: false}].sort((a,b)=>a.wapiTrackingNumber<b.wapiTrackingNumber ? 1 : -1)
                }
            }
            return [...prevState];
        });

        setShowOrderModal(true);
    }

    const handleAddOrder= (
    ) => {
        setIsOrderNew(true);
        setOrderUuid(null);
        // fetchOrderParams();
        // setSingleOrder(null);
        setShowOrderModal(true);
    }
    const handleImportXLS = () => {
        setShowImportModal(true)
    }

    const handleExportXLS = () => {
        const filteredData = filteredOrders.map(item => ({
            wapiTrackingNumber: item.wapiTrackingNumber,
            status: item.status,
            statusAdditionalInfo: item.statusAdditionalInfo,
            date: item.date,
            codAmount: item.codAmount,
            codCurrency: item.codCurrency,
            clientOrderID: item.clientOrderID,
            productsByString: item.productsByString,
            warehouse: item.warehouse,
            courierService: item.courierService,
            trackingNumber: item.trackingNumber,
            receiverCountry: item.receiverCountry,
            receiverCity: item.receiverCity,
            receiverZip: item.receiverZip,
            receiverAddress: item.receiverAddress,
            receiverFullName: item.receiverFullName,
            receiverEMail: item.receiverEMail,
            receiverPhone: item.receiverPhone,
            lastUpdateDate: item.lastUpdateDate.split("T").join(" "),
        }));
        exportFileXLS(filteredData, "Orders");
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="page-component orders-page__container">
                {isLoading && (<Loader />)}
                <Header pageTitle='Fulfillment' toRight >
                    <Button icon="add" iconOnTheRight onClick={handleAddOrder}>Add order</Button>
                    <Button icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>

                {ordersData && <OrderList orders={ordersData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredOrders={setFilteredOrders} handleEditOrder={handleEditOrder} />}
            </div>
            {showOrderModal && (orderUuid || isOrderNew) &&
                // <Modal title={`Order`} onClose={onOrderModalClose} >
                    <OrderForm orderUuid={orderUuid} closeOrderModal={onOrderModalClose} closeOrderModalOnSuccess={()=>{onOrderModalClose(); fetchData();}}/>
                // </Modal>
            }
            {showImportModal &&
                <Modal title={`Import xls`} onClose={onImportModalClose} >
                    <ImportFilesBlock file='OrderTemplate.xlsx' importFilesType={ImportFilesType.ORDERS} closeModal={()=>setShowImportModal(false)}/>
                </Modal>
            }
        </Layout>
    )
}

export default OrdersPage;
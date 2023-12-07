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
import {getOrders, getOrderData, getOrderParameters} from "@/services/orders";
import Skeleton from "@/components/Skeleton/Skeleton";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getFirstDayOfMonth} from "@/utils/date";
import {OrderParamsType, OrderType, SingleOrderType} from "@/types/orders";
import {exportFileXLS} from "@/utils/files";
import Modal from "@/components/Modal";
import OrderForm from "./components/OrderForm";
import ImportFilesBlock from "@/components/ImportFilesBlock";

type ApiResponse = {
    data: any;
};

const OrdersPage = () => {
    const today = new Date();
    const firstDay = getFirstDayOfMonth(today);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})
    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

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
    const [singleOrder, setSingleOrder] = useState<SingleOrderType|null>(null);
    const [orderParameters, setOrderParameters] = useState<OrderParamsType|null>(null);
    const [isOrderNew, setIsOrderNew] = useState(true);

    const onOrderModalClose = () => {
        setShowOrderModal(false);
    }
    const fetchSingleOrder = async (uuid: string) => {
        type ApiResponse = {
            data: any;
        };

        try {
            setIsLoading(true);

            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await getOrderData(
                {token, uuid}
            );

            if (res && "data" in res) {
                setSingleOrder(res.data);
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
            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const resp: ApiResponse = await getOrderParameters(
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

    // useEffect(() => {
    //     fetchOrderParams();
    // }, [token]);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await getOrders(
                {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}
            );

            if (res && "data" in res) {
                setOrdersData(res.data);
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
        setSingleOrder(null);
        fetchOrderParams();
        fetchSingleOrder(uuid);

        setShowOrderModal(true);
    }

    const handleAddOrder= (
    ) => {
        setIsOrderNew(true);
        fetchOrderParams();
        setSingleOrder(null);
        setShowOrderModal(true);
    }
    const handleImportXLS = () => {
        setShowImportModal(true)
    }

    const handleExportXLS = () => {
        const filteredData = filteredOrders.map(item => ({
            wapiTrackingNumber: item.wapiTrackingNumber,
            status: item.status,
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
        }));
        exportFileXLS(filteredData, "Orders");
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="orders-page__container">
                {isLoading && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        zIndex: 1000
                    }}>
                        <Skeleton type="round" width="500px" height="300px" />
                    </div>
                )}
                <Header pageTitle='Fulfillment' toRight >
                    <Button icon="add" iconOnTheRight onClick={handleAddOrder}>Add order</Button>
                    <Button icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export xls</Button>
                </Header>

                {ordersData && <OrderList orders={ordersData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredOrders={setFilteredOrders} handleEditOrder={handleEditOrder} />}
            </div>
            {showOrderModal && orderParameters && (singleOrder || isOrderNew) &&
                <Modal title={`Order`} onClose={onOrderModalClose} >
                    <OrderForm orderParameters={orderParameters} orderData={singleOrder} closeOrderModal={()=>{setShowOrderModal(false);fetchData();}}/>
                </Modal>
            }
            {showImportModal &&
                <Modal title={`Import xls`} onClose={onImportModalClose} >
                    <ImportFilesBlock file='OrderTemplate.xlsx' isProducts={false} closeModal={()=>setShowImportModal(false)}/>
                </Modal>
            }
        </Layout>
    )
}

export default OrdersPage;
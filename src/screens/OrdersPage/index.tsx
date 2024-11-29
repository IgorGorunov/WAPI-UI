import React, {useState, useEffect, useCallback} from "react";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {useRouter} from "next/router";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import OrderList from "./components/OrderList";
import "./styles.scss";
import {getOrders} from "@/services/orders";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateTimeToStringWithDotWithoutSeconds, formatDateToString, getLastFewDays} from "@/utils/date";
import {OrderType} from "@/types/orders";
import {exportFileXLS} from "@/utils/files";
import Modal from "@/components/Modal";
import OrderForm from "./components/OrderForm";
import ImportFilesBlock from "@/components/ImportFilesBlock";
import Loader from "@/components/Loader";
import {ImportFilesType} from "@/types/importFiles";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {tourGuideStepsOrders, tourGuideStepsOrdersNoDocs} from "./ordersTourGuideSteps.constants";
import {ApiResponseType} from "@/types/api";
import {sendUserBrowserInfo} from "@/services/userInfo";

const OrdersPage = () => {
    const Router = useRouter();
    const { token, currentDate, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditOrder(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/orders');
        }
    }, [Router.query]);

    const today = currentDate;
    const firstDay = getLastFewDays(today, 5);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})

    const [ordersData, setOrdersData,] = useState<any | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>(ordersData);
    const [isLoading, setIsLoading] = useState(true);

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Orders)) {
            if (!isLoading && ordersData) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(ordersData?.length ? tourGuideStepsOrders : tourGuideStepsOrdersNoDocs);
    }, [ordersData]);

    //import files modal
    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }

    //single order data
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderUuid, setOrderUuid] = useState('');
    const [isOrderNew, setIsOrderNew] = useState(true);

    const onOrderModalClose = () => {
        setShowOrderModal(false);
    }

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setOrdersData([]);
            const requestData = {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetOrdersList', AccessObjectTypes["Orders/Fullfillment"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ListView)) {
                setOrdersData([]);
                return null;
            }

            const res: ApiResponseType = await getOrders(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setOrdersData(res.data.map(item=>({...item, key: item.uuid})));
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token,curPeriod, ui]);

    useEffect(() => {
        fetchData();
    }, [token, curPeriod, ui]);

    const handleEditOrder = (uuid: string) => {
        setIsOrderNew(false);
        setOrderUuid(uuid);
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('ViewEditOrder', AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject), body: {uuid: uuid}});
            } catch {}
            return null;
        } else {
            setOrdersData(prevState => {
                if (prevState && prevState.length) {
                    const el = prevState.filter(item => item.uuid === uuid);

                    if (el.length) {
                        return [...prevState.filter(item => item.uuid !== uuid), {
                            ...el[0],
                            notifications: false
                        }].sort((a, b) => a.wapiTrackingNumber < b.wapiTrackingNumber ? 1 : -1)
                    }
                    return [...prevState];
                }
                return [];
            });

            setShowOrderModal(true);
        }
    }

    const handleAddOrder= () => {
        setIsOrderNew(true);
        setOrderUuid(null);
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateOrder', AccessObjectTypes["Orders/Fullfillment"], AccessActions.CreateObject), body: {}});
            } catch {}
            return null;
        } else {
            setShowOrderModal(true);
        }
    }
    const handleImportXLS = () => {
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ExportList)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('BulkOrdersCreate', AccessObjectTypes["Orders/Fullfillment"], AccessActions.BulkCreate), body: {}});
            } catch {}
            return null;
        } else {
            setShowImportModal(true)
        }
    }

    const handleExportXLS = () => {
        try {
            sendUserBrowserInfo({...getBrowserInfo('ExportFulfilmentList', AccessObjectTypes["Orders/Fullfillment"], AccessActions.ExportList), body: {startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}});
        } catch {}

        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ExportList)) {
            return null;
        }

        const filteredData = filteredOrders.map(item => ({
            wapiTrackingNumber: item.wapiTrackingNumber,
            status: item.status,
            statusAdditionalInfo: item.statusAdditionalInfo,
            date: formatDateTimeToStringWithDotWithoutSeconds(item.date),
            codAmount: item.codAmount,
            codCurrency: item.codCurrency,
            clientOrderID: item.clientOrderID,
            productsByString: item.productsByString,
            warehouse: item.warehouse,
            courierService: item.courierService,
            trackingNumber: item.trackingNumber,
            receiverCountry: superUser ? '*' : item.receiverCountry,
            receiverCity: superUser ? '*' : item.receiverCity,
            receiverZip: superUser ? '*' : item.receiverZip,
            receiverAddress: superUser ? '*' : item.receiverAddress,
            receiverFullName: superUser ? '*' : item.receiverFullName,
            receiverEMail: superUser ? '*' : item.receiverEMail,
            receiverPhone: superUser ? '*' : item.receiverPhone,
            lastUpdateDate: item.lastUpdateDate.split("T").join(" "),
            lastTroubleStatus: `${item.troubleStatuses.length ? item.troubleStatuses[item.troubleStatuses.length-1].period.split("T").join(" ")+'  '+(item.troubleStatuses[item.troubleStatuses.length-1].troubleStatus) : ""}`,
            // "Logistic comment": `${item.logisticComment ? (item.logisticComment+(item.warehouseAdditionalInfo ? '; '+item.warehouseAdditionalInfo : '')) : item.warehouseAdditionalInfo ? item.warehouseAdditionalInfo : ''}`,
            "Logistic comment": `${item.logisticComment}`,
        }));
        exportFileXLS(filteredData, "Orders");
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="page-component orders-page__container">
                {isLoading && (<Loader />)}
                <Header pageTitle='Fulfillment' toRight needTutorialBtn >
                    <Button classNames='add-order' icon="add" iconOnTheRight onClick={handleAddOrder}>Add order</Button>
                    <Button classNames='import-orders' icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button classNames='export-orders' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>

                {ordersData && <OrderList orders={ordersData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredOrders={setFilteredOrders} handleEditOrder={handleEditOrder} handleRefresh={()=>fetchData()}/>}
            </div>
            {showOrderModal && (orderUuid || isOrderNew) &&
                <OrderForm orderUuid={orderUuid} closeOrderModal={onOrderModalClose} closeOrderModalOnSuccess={()=>{onOrderModalClose(); fetchData(); }}/>
            }
            {showImportModal &&
                <Modal title={`Import xls`} onClose={onImportModalClose} >
                    <ImportFilesBlock file='OrderTemplate.xlsx' importFilesType={ImportFilesType.ORDERS} closeModal={()=>setShowImportModal(false)}/>
                </Modal>
            }
            {ordersData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Orders} /> : null}
        </Layout>
    )
}

export default OrdersPage;
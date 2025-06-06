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
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import {OrdersTenantDataType} from "@/lib/tenants";


const OrdersPage = () => {
    const Router = useRouter();
    const { tenantData: { alias, orderTitles }} = useTenant();
    const { token, currentDate, superUser, ui, getBrowserInfo, isActionIsAccessible, getForbiddenTabs } = useAuth();

    const [current, setCurrent] = React.useState(1);

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditOrder(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/orders');
        }
    }, [Router.query]);

    const [curPeriod, setCurrentPeriod] = useState<DateRangeType|null>(null);

    useEffect(() => {
        // const ordersPeriodFromCookie = Cookies.get('orders-period');
        // if (ordersPeriodFromCookie) {
        //     const period = JSON.parse(ordersPeriodFromCookie);
        //     if (period && period?.startDate && period.endDate) {
        //         setCurrentPeriod({startDate: new Date(period.startDate), endDate: new Date(period.endDate)});
        //         return;
        //     }
        // }
        const today = currentDate;
        const firstDay = getLastFewDays(today, 5);
        setCurrentPeriod({startDate: firstDay, endDate: today});
    }, []);

    const setCurrentPeriodFn= (period: DateRangeType) => {
        setCurrentPeriod(period);
        //const exp = new Date(new Date().getTime() + 15 * 60 * 1000);
        // Cookies.set('orders-period', JSON.stringify(period), {expires: 1/24});
    }

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

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const fetchData = useCallback(async () => {
        if (!curPeriod) return;
        try {
            setIsLoading(true);
            setOrdersData([]);
            const requestData = {token: token, alias, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetOrdersList', AccessObjectTypes["Orders/Fullfillment"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ListView)) {
                setOrdersData([]);

                return null;
            }

            const res: ApiResponseType = await getOrders(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setOrdersData(res.data.map(item=>({...item, key: item.uuid})).sort((a:OrderType,b:OrderType)=>a.date>b.date ? -1 : 1));
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
        setCurrent(1);

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

            setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal})
            setShowStatusModal(true);
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
            [orderTitles.trackingNumberTitle]: item.wapiTrackingNumber,
            'Status': item.status,
            "Status additional info": item.statusAdditionalInfo,
            "Date": formatDateTimeToStringWithDotWithoutSeconds(item.date),
            "COD amount": item.codAmount,
            "COD currency": item.codCurrency,
            "Client order ID": item.clientOrderID,
            "Products": item.productsByString,
            "Warehouse": item.warehouse,
            "Courier service": item.courierService,
            "Tracking number": item.trackingNumber,
            "Receiver Country": superUser ? '*' : item.receiverCountry,
            "Receiver City": superUser ? '*' : item.receiverCity,
            "Receiver ZIP": superUser ? '*' : item.receiverZip,
            "Receiver Address": superUser ? '*' : item.receiverAddress,
            "Receiver Full Name": superUser ? '*' : item.receiverFullName,
            "Receiver E-mail": superUser ? '*' : item.receiverEMail,
            "Receiver Phone": superUser ? '*' : item.receiverPhone,
            "Last update date": item.lastUpdateDate.split("T").join(" "),
            "Last trouble Status": `${item.troubleStatuses.length ? item.troubleStatuses[item.troubleStatuses.length-1].period.split("T").join(" ")+'  '+(item.troubleStatuses[item.troubleStatuses.length-1].troubleStatus) : ""}`,
            // "Logistic comment": `${item.logisticComment ? (item.logisticComment+(item.warehouseAdditionalInfo ? '; '+item.warehouseAdditionalInfo : '')) : item.warehouseAdditionalInfo ? item.warehouseAdditionalInfo : ''}`,
            "Logistic comment": `${item.logisticComment}`,
            "Tracking link": item.trackingNumber ? item.trackingLink : '',
        }));
        exportFileXLS(filteredData, "Orders");
    }

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Orders (fulfillments)' description='Our orders page' />
            <div className="page-component orders-page__container">
                {isLoading && (<Loader />)}
                <Header pageTitle='Fulfillment' toRight needTutorialBtn >
                    <Button classNames='add-order' icon="add" iconOnTheRight onClick={handleAddOrder}>Add order</Button>
                    <Button classNames='import-orders' icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button classNames='export-orders' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>

                {ordersData && <OrderList orders={ordersData}
                                          currentRange={curPeriod}
                                          setCurrentRange={setCurrentPeriodFn}
                                          setFilteredOrders={setFilteredOrders}
                                          handleEditOrder={handleEditOrder}
                                          handleRefresh={()=>fetchData()}
                                          current={current}
                                          setCurrent={setCurrent}
                                          forbiddenTabs={getForbiddenTabs(AccessObjectTypes["Orders/Fullfillment"])}
                />}
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
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </Layout>
    )
}

export default OrdersPage;
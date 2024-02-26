import React, {useState, useEffect, useCallback} from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import AmazonPrepList from "./components/AmazonPrepList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import {getAmazonPrep, getSingleAmazonPrepData, getAmazonPrepParameters} from "@/services/amazonePrep";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {
    AmazonPrepOrderParamsType,
    AmazonPrepOrderType,
    SingleAmazonPrepOrderType
} from "@/types/amazonPrep";
import {exportFileXLS} from "@/utils/files";
import Modal from "@/components/Modal";
import AmazonPrepForm from "./components/AmazonPrepForm";
import {ApiResponseType} from "@/types/api";
import Loader from "@/components/Loader";
import {verifyUser} from "@/utils/userData";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";

const AmazonPrepPage = () => {
    const {token, setToken, currentDate} = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const today = currentDate;
    const firstDay = getLastFewDays(today, 30);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})
    const Router = useRouter();

    const [amazonPrepOrdersData, setAmazonPrepOrdersData,] = useState<any | null>(null);
    const [filteredAmazonPrepOrders, setFilteredAmazonPrepOrders] = useState<AmazonPrepOrderType[]>(amazonPrepOrdersData);
    const [isLoading, setIsLoading] = useState(true);

    //single order data
    const [showAmazonPrepOrderModal, setShowAmazonPrepOrderModal] = useState(false);
    const [singleAmazonPrepOrder, setSingleAmazonPrepOrder] = useState<SingleAmazonPrepOrderType|null>(null);
    const [amazonPrepOrderParameters, setAmazonPrepOrderParameters] = useState<AmazonPrepOrderParamsType|null>(null);
    const [isAmazonPrepNew, setIsAmazonPrepNew] = useState(true);
    const [amazonPrepUuid, setAmazonPrepUuid] = useState<string|null>(null);

    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();
    const onAmazonPrepOrderModalClose = () => {
        setShowAmazonPrepOrderModal(false);
        if (singleAmazonPrepOrder && singleAmazonPrepOrder.uuid) {
            setDocNotificationsAsRead(singleAmazonPrepOrder.uuid);
        }
    }
    const fetchSingleAmazonPrepOrder = useCallback(async (uuid: string) => {
        try {
            setIsLoading(true);

            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await getSingleAmazonPrepData(
                {token, uuid}
            );

            if (res && "data" in res) {
                setSingleAmazonPrepOrder(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token]);

    const fetchAmazonPrepOrderParams = useCallback(async() => {
        try {
            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const responseParams: ApiResponseType = await getAmazonPrepParameters(
                {token: token}
            );

            if (responseParams?.data ) {
                setAmazonPrepOrderParameters(responseParams.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },[token]);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await getAmazonPrep(
                {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}
            );

            if (res && "data" in res) {
                setAmazonPrepOrdersData(res.data);
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

    useEffect(() => {
        if (showAmazonPrepOrderModal && amazonPrepUuid) {
            fetchSingleAmazonPrepOrder(amazonPrepUuid);
        }
    }, [amazonPrepOrderParameters]);

    useEffect(() => {
        if (showAmazonPrepOrderModal) {
            fetchAmazonPrepOrderParams();
        }
    }, [showAmazonPrepOrderModal]);

    const handleEditAmazonPrepOrder = async (uuid: string) => {

        //setAmazonPrepOrderParameters(null);
        setIsAmazonPrepNew(false);
        setSingleAmazonPrepOrder(null);
        setAmazonPrepUuid(uuid);
        // fetchAmazonPrepOrderParams();
        // fetchSingleAmazonPrepOrder(uuid);
        setAmazonPrepOrdersData(prevState => {
            if (prevState && prevState.length) {
                const el = prevState.filter(item => item.uuid === uuid);
                if (el.length) {
                    return [...prevState.filter(item => item.uuid !== uuid), {...el[0], notifications: false}].sort((a,b)=>a.wapiTrackingNumber<b.wapiTrackingNumber ? 1 : -1)
                }
            }
            return [...prevState];
        });

        setShowAmazonPrepOrderModal(true);

    }

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditAmazonPrepOrder(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/amazonPrep');
        }
    }, [Router.query]);

    const handleAddAmazonPrepOrder= (
    ) => {
        setIsAmazonPrepNew(true);
        setSingleAmazonPrepOrder(null);
        //fetchAmazonPrepOrderParams();
        setShowAmazonPrepOrderModal(true);
    }

    const handleExportXLS = () => {
        const filteredData = filteredAmazonPrepOrders.map(item => ({
            wapiTrackingNumber: item.wapiTrackingNumber,
            status: item.status,
            date: item.date,
            clientOrderID: item.clientOrderID,
            warehouse: item.warehouse,
            courierService: item.courierService,
            trackingNumber: item.trackingNumber,
            receiverCountry: item.receiverCountry,
        }));
        exportFileXLS(filteredData, "Orders");
    }


    return (
        <Layout hasHeader hasFooter>
            <div className="amazon-prep-page__container">
                {isLoading && <Loader />}
                <Header pageTitle='Amazon Prep' toRight >
                    <Button icon="add" iconOnTheRight onClick={handleAddAmazonPrepOrder}>Add order</Button>
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>

                {amazonPrepOrdersData && <AmazonPrepList amazonPrepOrders={amazonPrepOrdersData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredAmazonPrepOrders={setFilteredAmazonPrepOrders} handleEditAmazonPrepOrder={handleEditAmazonPrepOrder} />}
            </div>
            {showAmazonPrepOrderModal && amazonPrepOrderParameters && (singleAmazonPrepOrder || isAmazonPrepNew) &&
                <Modal title={`Amazon prep`} onClose={onAmazonPrepOrderModalClose} >
                    <AmazonPrepForm  amazonPrepOrderData={singleAmazonPrepOrder} amazonPrepOrderParameters={amazonPrepOrderParameters} closeAmazonPrepOrderModal={()=>{setShowAmazonPrepOrderModal(false);fetchData();}}/>
                </Modal>
            }
            {/*{showImportModal &&*/}
            {/*    <Modal title={`Import xls`} onClose={onImportModalClose} >*/}
            {/*        <ImportFilesBlock file='OrderTemplate.xlsx' isProducts={false} closeModal={()=>setShowImportModal(false)}/>*/}
            {/*    </Modal>*/}
            {/*}*/}
        </Layout>
    )
}

export default AmazonPrepPage;
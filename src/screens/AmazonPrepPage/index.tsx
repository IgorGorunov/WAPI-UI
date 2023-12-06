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
import Skeleton from "@/components/Skeleton/Skeleton";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getFirstDayOfMonth} from "@/utils/date";
import {AmazonPrepOrderParamsType, AmazonPrepOrderType, SingleAmazonPrepOrderType} from "@/types/amazonPrep";
import {exportFileXLS} from "@/utils/files";
import Modal from "@/components/Modal";
import AmazonPrepForm from "./components/AmazonPrepForm";
import ImportFilesBlock from "@/components/ImportFilesBlock";
import {ApiResponseType} from "@/types/api";

const AmazonPrepPage = () => {
    const today = new Date();
    const firstDay = getFirstDayOfMonth(today);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})
    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [amazonPrepOrdersData, setAmazonPrepOrdersData,] = useState<any | null>(null);
    const [filteredAmazonPrepOrders, setFilteredAmazonPrepOrders] = useState<AmazonPrepOrderType[]>(amazonPrepOrdersData);
    const [isLoading, setIsLoading] = useState(true);

    //import files modal
    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }

    //single order data
    const [showAmazonPrepOrderModal, setShowAmazonPrepOrderModal] = useState(false);
    const [singleAmazonPrepOrder, setSingleAmazonPrepOrder] = useState<SingleAmazonPrepOrderType|null>(null);
    const [amazonPrepOrderParameters, setAmazonPrepOrderParameters] = useState<AmazonPrepOrderParamsType|null>(null);
    const [isAmazonPrepNew, setIsAmazonPrepNew] = useState(true);

    const onAmazonPrepOrderModalClose = () => {
        setShowAmazonPrepOrderModal(false);
    }
    const fetchSingleAmazonPrepOrder = async (uuid: string) => {
        try {
            setIsLoading(true);

            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await getSingleAmazonPrepData(
                {token, uuid}
            );

            if (res && "data" in res) {
                setSingleAmazonPrepOrder(res.data);
                console.log('single amazon prep data: ', res.data);
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAmazonPrepOrderParams = useCallback(async() => {
        try {
            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const resp: ApiResponseType = await getAmazonPrepParameters(
                {token: token}
            );

            if (resp && "data" in resp) {
                setAmazonPrepOrderParameters(resp.data);

                console.log('prep data: ', resp.data);
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

    const handleEditAmazonPrepOrder = (uuid: string) => {
        console.log('uuid:', uuid);
        setIsAmazonPrepNew(false);
        setSingleAmazonPrepOrder(null);
        fetchAmazonPrepOrderParams();
        fetchSingleAmazonPrepOrder(uuid);

        setShowAmazonPrepOrderModal(true);
    }

    const handleAddAmazonPrepOrder= (
    ) => {
        setIsAmazonPrepNew(true);
        fetchAmazonPrepOrderParams();
        setSingleAmazonPrepOrder(null);
        setShowAmazonPrepOrderModal(true);
    }
    const handleImportXLS = () => {
        setShowImportModal(true)
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

    console.log('amazon data:', amazonPrepOrdersData);

    return (
        <Layout hasHeader hasFooter>
            <div className="amazon-prep-page__container">
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
                <Header pageTitle='Amazon Prep' toRight >
                    <Button icon="add" iconOnTheRight onClick={handleAddAmazonPrepOrder}>Add order</Button>
                    <Button icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export xls</Button>
                </Header>

                {amazonPrepOrdersData && <AmazonPrepList amazonPrepOrders={amazonPrepOrdersData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredAmazonPrepOrders={setFilteredAmazonPrepOrders} handleEditAmazonPrepOrder={handleEditAmazonPrepOrder} />}
            </div>
            {showAmazonPrepOrderModal && amazonPrepOrderParameters && (singleAmazonPrepOrder || isAmazonPrepNew) &&
                <Modal title={`Order`} onClose={onAmazonPrepOrderModalClose} >
                    <AmazonPrepForm amazonPrepOrderParameters={amazonPrepOrderParameters} amazonPrepOrderData={singleAmazonPrepOrder} closeAmazonPrepOrderModal={()=>{setShowAmazonPrepOrderModal(false);fetchData();}}/>
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

export default AmazonPrepPage;
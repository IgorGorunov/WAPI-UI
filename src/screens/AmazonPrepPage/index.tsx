import React, {useCallback, useEffect, useState} from "react";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {useRouter} from "next/router";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import AmazonPrepList from "./components/AmazonPrepList";
import "./styles.scss";
import {getAmazonPrep} from "@/services/amazonePrep";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {AmazonPrepOrderType} from "@/types/amazonPrep";
import {exportFileXLS} from "@/utils/files";
import AmazonPrepForm from "./components/AmazonPrepForm";
import {ApiResponseType} from "@/types/api";
import Loader from "@/components/Loader";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {tourGuideStepsAmazonPrep, tourGuideStepsAmazonPrepNoDocs} from "./amazomPrepTourGuideSteps.constants";
import {sendUserBrowserInfo} from "@/services/userInfo";

const AmazonPrepPage = () => {
    const {token, currentDate, superUser, ui, getBrowserInfo, isActionIsAccessible} = useAuth();

    const today = currentDate;
    const firstDay = getLastFewDays(today, 30);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})
    const Router = useRouter();

    const [amazonPrepOrdersData, setAmazonPrepOrdersData,] = useState<any | null>(null);
    const [filteredAmazonPrepOrders, setFilteredAmazonPrepOrders] = useState<AmazonPrepOrderType[]>(amazonPrepOrdersData);
    const [isLoading, setIsLoading] = useState(true);

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.AmazonPreps)) {
            if (!isLoading && amazonPrepOrdersData) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(amazonPrepOrdersData?.length ? tourGuideStepsAmazonPrep : tourGuideStepsAmazonPrepNoDocs);
    }, [amazonPrepOrdersData]);

    //single order data
    const [showAmazonPrepOrderModal, setShowAmazonPrepOrderModal] = useState(false);
    const [isAmazonPrepNew, setIsAmazonPrepNew] = useState(true);
    const [amazonPrepUuid, setAmazonPrepUuid] = useState<string|null>(null);

    const onAmazonPrepOrderModalClose = () => {
        setShowAmazonPrepOrderModal(false);
    }
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setAmazonPrepOrdersData([]);
            const requestData = {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetAmazonPrepsList', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ListView)) {
                const res: ApiResponseType = await getAmazonPrep(superUser && ui ? {...requestData, ui} : requestData);

                if (res && "data" in res) {
                    setAmazonPrepOrdersData(res.data.sort((a,b) => a.date > b.date ? -1 : 1));
                } else {
                    console.error("API did not return expected data");
                }
            } else {
                setAmazonPrepOrdersData([]);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }

    }, [token,curPeriod]);

    useEffect(() => {
        fetchData();
    }, [token, curPeriod]);

    const handleEditAmazonPrepOrder = async (uuid: string) => {
        setIsAmazonPrepNew(false);
        setAmazonPrepUuid(uuid);

        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ViewObject) ) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateAmazonPrep', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ViewObject), body: {}});
            } catch {}
        } else {
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
        setAmazonPrepUuid(null);
        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateAmazonPrep', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.CreateObject), body: {}});
            } catch {}
        } else {
            setShowAmazonPrepOrderModal(true);
        }
    }

    const handleExportXLS = () => {
        try {
            sendUserBrowserInfo({...getBrowserInfo('ExportAmazonPrepList', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ExportList), body: {startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}});
        } catch {}

        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ExportList)) {
            return null;
        }
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
                <Header pageTitle='Amazon prep' toRight needTutorialBtn >
                    <Button classNames='add-order' icon="add" iconOnTheRight onClick={handleAddAmazonPrepOrder}>Add order</Button>
                    <Button classNames='export-orders' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>
                {amazonPrepOrdersData && <AmazonPrepList amazonPrepOrders={amazonPrepOrdersData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredAmazonPrepOrders={setFilteredAmazonPrepOrders} handleEditAmazonPrepOrder={handleEditAmazonPrepOrder} />}
            </div>
            {showAmazonPrepOrderModal && (amazonPrepUuid || isAmazonPrepNew) &&
                <AmazonPrepForm  docUuid={amazonPrepUuid} onCloseModal={onAmazonPrepOrderModalClose} onCloseModalWithSuccess={()=>{setShowAmazonPrepOrderModal(false);fetchData();}}/>
            }
            {amazonPrepOrdersData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.AmazonPreps} /> : null}
        </Layout>
    )
}

export default AmazonPrepPage;
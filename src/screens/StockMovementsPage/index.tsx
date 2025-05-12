import React, {useCallback, useEffect, useState} from "react";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import "./styles.scss";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {exportFileXLS} from "@/utils/files";
import {getInbounds} from "@/services/stockMovements";
import {STOCK_MOVEMENT_DOC_TYPE, STOCK_MOVEMENT_ROUTES, StockMovementType} from "@/types/stockMovements";
import Loader from "@/components/Loader";
import StockMovementList from "@/screens/StockMovementsPage/components/StockMovementList";
import StockMovementForm from "@/screens/StockMovementsPage/components/StockMovementForm";
import {ApiResponseType} from "@/types/api";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {
    tourGuideStepsStockMovements,
    tourGuideStepsStockMovementsNoDocs
} from "@/screens/StockMovementsPage/stockMovementsTourGuideSteps.constants";
import {sendUserBrowserInfo} from "@/services/userInfo";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import Head from "next/head";

type StockMovementPageType = {
    docType: STOCK_MOVEMENT_DOC_TYPE;
}

const getProductsByString = (item: StockMovementType) => {
    return  item.products.map(product => product.product).join('; ')
}

const docNamesPlural = {
    [STOCK_MOVEMENT_DOC_TYPE.INBOUNDS]: 'Inbounds',
    [STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT]: 'Stock movements',
    [STOCK_MOVEMENT_DOC_TYPE.OUTBOUND]: 'Outbounds',
    [STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE]: 'Logistic services',
}

export const docNamesSingle = {
    [STOCK_MOVEMENT_DOC_TYPE.INBOUNDS]: 'Inbound',
    [STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT]: 'Stock movement',
    [STOCK_MOVEMENT_DOC_TYPE.OUTBOUND]: 'Outbound',
    [STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE]: 'Logistic service',
}

export const getAccessActionObject = (docType: STOCK_MOVEMENT_DOC_TYPE) => {
    switch (docType) {
        case STOCK_MOVEMENT_DOC_TYPE.INBOUNDS:
            return AccessObjectTypes["StockManagment/Inbounds"];
        case STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT:
            return AccessObjectTypes["StockManagment/StockMovements"];
        case STOCK_MOVEMENT_DOC_TYPE.OUTBOUND:
            return AccessObjectTypes["StockManagment/Outbounds"];
        case STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE:
            return AccessObjectTypes["StockManagment/LogisticServices"];
       default: null;
    }
}

const StockMovementsPage:React.FC<StockMovementPageType> = ({docType}) => {

    const Router = useRouter();
    const { token, currentDate, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    useEffect(() => {
        if (!token) Router.push(Routes.Login);
    }, [token]);

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditStockMovement(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace(STOCK_MOVEMENT_ROUTES[docType]);
        }

    }, [Router.query]);

    const today = currentDate;
    const firstDay = getLastFewDays(today, 30);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})

    const [stockMovementData, setStockMovementData] = useState<any | null>(null);
    const [filteredDocs, setFilteredDocs] = useState<StockMovementType[]>(stockMovementData);
    const [isLoading, setIsLoading] = useState(true);

    //single document data
    const [showStockMovementModal, setShowStockMovementModal] = useState(false);
    const [isDocNew, setIsDocNew] = useState(true);
    const [docUuid, setDocUuid] = useState<string|null>(null);

    const onShowStockMovementModalClose = () => {
        setShowStockMovementModal(false);
    }

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setStockMovementData([]);
            const requestData = {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate), documentType: docType};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetStockMovementList/'+docType, getAccessActionObject(docType), AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.ListView)) {
                setStockMovementData([]);
                return;
            }
            const res: ApiResponseType = await getInbounds(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setStockMovementData(res.data.map(item=>({...item, key: item.uuid})).sort((a,b) => a.incomingDate > b.incomingDate ? -1 : 1));
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token, curPeriod]);

    useEffect(() => {
        fetchData();
    }, [token, curPeriod]);

    const handleEditStockMovement = (uuid: string) => {
        setIsDocNew(false);
        setDocUuid(uuid)

        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.ViewObject)) {
            try {
                sendUserBrowserInfo({
                    ...getBrowserInfo('ViewEditDoc/' + docType, getAccessActionObject(docType), AccessActions.ViewObject),
                    body: {uuid: uuid}
                });
            } catch {
            }
            setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal})
            setShowStatusModal(true);
            return null;
        } else {
            setShowStockMovementModal(true);
        }

    }

    const handleAddOrder = () => {
        setIsDocNew(true);
        setDocUuid(null);

        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateDoc/'+docType, getAccessActionObject(docType), AccessActions.CreateObject), body: {}});
            } catch {}
            return null;
        } else {
            setShowStockMovementModal(true);
        }
    }

    const handleExportXLS = () => {
        try {
            sendUserBrowserInfo({...getBrowserInfo('ExportStockMovementsList/'+docType, getAccessActionObject(docType), AccessActions.ExportList), body: {startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}});
        } catch {}

        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.ExportList)) {
            return null;
        }

        const filteredData = filteredDocs.map(item => ({
            number: item.number,
            incomingDate: item.incomingDate,
            incomingNumber: item.incomingNumber,
            status: item.status,
            ETA: item.estimatedTimeArrives,
            sender: item.sender,
            senderCountry: item.senderCountry,
            receiver: item.receiver,
            receiverCountry: item.receiverCountry,
            products: item.productsByString || getProductsByString(item),
            services: '€ ' + item.servicesAmount,
            // packages: item.packages,
            // palletAmount: item.palletAmount,
            // volume: item.volume,
            // weightGross: item.weightGross,
            // weightNet: item.weightNet,
        }));
        exportFileXLS(filteredData, docNamesPlural[docType]);
    }

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages[docType])) {
            if (!isLoading && stockMovementData) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading, docType]);

    useEffect(() => {
        setSteps(stockMovementData?.length ? tourGuideStepsStockMovements(docNamesSingle[docType].toLowerCase()) : tourGuideStepsStockMovementsNoDocs(docNamesSingle[docType].toLowerCase()))
    }, [stockMovementData]);


    return (
        <Layout hasHeader hasFooter>
            <Head>
                <title>{docNamesPlural[docType]}</title>
                <meta name="orders" content="orders" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div className="stock-movement-page__container">
                {isLoading && <Loader />}
                <Header pageTitle={docNamesPlural[docType]} toRight needTutorialBtn >
                    <Button classNames='add-doc' icon="add" iconOnTheRight onClick={handleAddOrder}>Add</Button>
                    <Button classNames='export-docs' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>

                {stockMovementData && <StockMovementList docType={docType} docs={stockMovementData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredDocs={setFilteredDocs} handleEditDoc={handleEditStockMovement} />}
            </div>
            {showStockMovementModal && (isDocNew && !docUuid || !isDocNew && docUuid) &&
                <StockMovementForm docType={docType} docUuid={docUuid} closeDocModal={onShowStockMovementModalClose} closeModalOnSuccess={()=>{setShowStockMovementModal(false);fetchData();}} />
            }
            {stockMovementData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages[docType]} /> : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </Layout>
    )
}

export default StockMovementsPage;
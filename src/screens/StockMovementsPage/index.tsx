import React, {useCallback, useEffect, useState} from "react";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import "./styles.scss";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {exportFileXLS} from "@/utils/files";
import { getInbounds} from "@/services/inbounds";
import {
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementType
} from "@/types/stockMovements";
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

type StockMovementPageType = {
    docType: STOCK_MOVEMENT_DOC_TYPE;
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

const StockMovementsPage:React.FC<StockMovementPageType> = ({docType}) => {

    const Router = useRouter();
    const { token, currentDate } = useAuth();

    useEffect(() => {
        if (!token) Router.push(Routes.Login);
    }, [token]);

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

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            const res: ApiResponseType = await getInbounds(
                {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate), documentType: docType}
            );

            if (res && "data" in res) {
                setStockMovementData(res.data.map(item=>({...item, key: item.uuid})));
                setIsLoading(false);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    }, [token, curPeriod]);

    useEffect(() => {
        fetchData();
    }, [token, curPeriod]);

    const handleEditStockMovement = (uuid: string) => {
        setIsDocNew(false);
        setDocUuid(uuid)
        setShowStockMovementModal(true);
    }

    const handleAddOrder= (
    ) => {
        setIsDocNew(true);
        setDocUuid(null);
        // fetchInboundParams();
        // setSingleStockMovement(null);
        setShowStockMovementModal(true);
    }

    const handleExportXLS = () => {
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
            products: item.productsByString,
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
        </Layout>
    )
}

export default StockMovementsPage;
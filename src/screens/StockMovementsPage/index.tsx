import React, {useCallback, useEffect, useState} from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {exportFileXLS} from "@/utils/files";
import Modal from "@/components/Modal";
import {getInboundData, getInboundParameters, getInbounds} from "@/services/inbounds";
import {
    SingleStockMovementType,
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementParamsType,
    StockMovementType
} from "@/types/stockMovements";
import Loader from "@/components/Loader";
import StockMovementList from "@/screens/StockMovementsPage/components/StockMovementList";
import StockMovementForm from "@/screens/StockMovementsPage/components/StockMovementForm";

type ApiResponse = {
    data: any;
};

type StockMovementPageType = {
    docType: STOCK_MOVEMENT_DOC_TYPE;
}

const docNamesPlural = {
    [STOCK_MOVEMENT_DOC_TYPE.INBOUNDS]: 'Inbounds',
    [STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT]: 'Stock movements',
    [STOCK_MOVEMENT_DOC_TYPE.OUTBOUND]: 'Outbounds',
}
const docNamesSingle = {
    [STOCK_MOVEMENT_DOC_TYPE.INBOUNDS]: 'Inbound',
    [STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT]: 'Stock movement',
    [STOCK_MOVEMENT_DOC_TYPE.OUTBOUND]: 'Outbound',
}

const StockMovementsPage:React.FC<StockMovementPageType> = ({docType}) => {

    const Router = useRouter();
    const { token, setToken, currentDate } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

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
    const [singleStockMovement, setSingleStockMovement] = useState<SingleStockMovementType|null>(null);
    const [docParameters, setDocParameters] = useState<StockMovementParamsType|null>(null);
    const [isDocNew, setIsDocNew] = useState(true);

    const onShowStockMovementModalClose = () => {
        setShowStockMovementModal(false);
    }
    const fetchSingleStockMovement = async (uuid: string) => {
        type ApiResponse = {
            data: any;
        };

        try {
            setIsLoading(true);
            console.log('click')

            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await getInboundData(docType,
                {token, uuid}
            );

            if (res && "data" in res) {
                console.log("inbound:", res.data)
                setSingleStockMovement(res.data);
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInboundParams = useCallback(async() => {
        try {
            if (!await verifyToken(token)) {
                await Router.push(Routes.Login);
            }

            const resp: ApiResponse = await getInboundParameters(docType,
                {token: token}
            );

            if (resp && "data" in resp) {
                setDocParameters(resp.data);
                console.log('inbound params:', resp.data)
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

            const res: ApiResponse = await getInbounds(docType,
                {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}
            );

            if (res && "data" in res) {
                console.log("data:", res.data)
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
        setSingleStockMovement(null);
        fetchInboundParams();
        fetchSingleStockMovement(uuid);

        setShowStockMovementModal(true);
    }

    const handleAddOrder= (
    ) => {
        setIsDocNew(true);
        fetchInboundParams();
        setSingleStockMovement(null);
        setShowStockMovementModal(true);
    }

    const handleExportXLS = () => {
        const filteredData = filteredDocs.map(item => ({
            incomingDate: item.incomingDate,
            incomingNumber: item.incomingNumber,
            status: item.status,
            ETA: item.estimatedTimeArrives,
            sender: item.sender,
            senderCountry: item.senderCountry,
            receiver: item.receiver,
            receiverCountry: item.receiverCountry,
            products: item.productsByString,
            packages: item.packages,
            palletAmount: item.palletAmount,
            volume: item.volume,
            weightGross: item.weightGross,
            weightNet: item.weightNet,
        }));
        exportFileXLS(filteredData, docNamesPlural[docType]);
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="orders-page__container">
                {isLoading && <Loader />}
                <Header pageTitle={docNamesPlural[docType]} toRight >
                    <Button icon="add" iconOnTheRight onClick={handleAddOrder}>Add</Button>
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>

                {stockMovementData && <StockMovementList docType={docType} docs={stockMovementData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredDocs={setFilteredDocs} handleEditDoc={handleEditStockMovement} />}
            </div>
            {showStockMovementModal && docParameters && (singleStockMovement|| isDocNew) &&
                <Modal title={docNamesSingle[docType]} onClose={onShowStockMovementModalClose} >
                    <StockMovementForm docType={docType} docParameters={docParameters} docData={singleStockMovement} closeDocModal={()=>{setShowStockMovementModal(false);fetchData();}}/>
                </Modal>
            }
        </Layout>
    )
}

export default StockMovementsPage;
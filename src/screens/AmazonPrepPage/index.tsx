import React, {useState, useEffect, useCallback} from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
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
    const [isAmazonPrepNew, setIsAmazonPrepNew] = useState(true);
    const [amazonPrepUuid, setAmazonPrepUuid] = useState<string|null>(null);

    //const {setDocNotificationsAsRead} = useMarkNotificationAsRead();
    const onAmazonPrepOrderModalClose = () => {
        setShowAmazonPrepOrderModal(false);
        // if (amazonPrepUuid) {
        //     setDocNotificationsAsRead(amazonPrepUuid);
        // }
    }
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

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

    const handleEditAmazonPrepOrder = async (uuid: string) => {

        //setAmazonPrepOrderParameters(null);
        setIsAmazonPrepNew(false);
        //setSingleAmazonPrepOrder(null);
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
        //setSingleAmazonPrepOrder(null);
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
            {showAmazonPrepOrderModal && (amazonPrepUuid || isAmazonPrepNew) &&
                // <Modal title={`Amazon prep`} onClose={onAmazonPrepOrderModalClose} >
                    <AmazonPrepForm  docUuid={amazonPrepUuid} onCloseModal={onAmazonPrepOrderModalClose} onCloseModalWithSuccess={()=>{setShowAmazonPrepOrderModal(false);fetchData();}}/>
                // </Modal>
            }
        </Layout>
    )
}

export default AmazonPrepPage;
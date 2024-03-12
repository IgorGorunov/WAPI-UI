import React, {useState, useEffect, useCallback} from "react";
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
import {ApiResponseType} from "@/types/api";
import Loader from "@/components/Loader";
import {verifyUser} from "@/utils/userData";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {getTickets} from "@/services/tickets";
import TicketList from "@/screens/TicketsPage/components/TicketList";
import Modal from "@/components/Modal";
import Ticket from "./components/Ticket";
import {TicketType} from "@/types/tickets";


const TicketsPage = () => {
    const {token, setToken, currentDate} = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const today = currentDate;
    const firstDay = getLastFewDays(today, 30);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})
    const Router = useRouter();

    const [ticketsData, setTicketsData] = useState<TicketType[] | null>(null);
    // const [ticketParams, setTicketParams] = useState<TicketParamsType | null>(null);
    // const [singleTicketData, setSingleTicketData] = useState<SingleTicketType | null>(null);
    const [singleTicketUuid, setSingleTicketUuid] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isTicketNew, setIsTicketNew] = useState(true);


    //modal
    const [showTicketModal, setShowTicketModal] = useState(false);
    const handleTicketModalClose = () => {
        setShowTicketModal(false);
        if (singleTicketUuid) {
            setDocNotificationsAsRead(singleTicketUuid);
        }
        fetchTickets();
    }

    //
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const fetchTickets = useCallback(async () => {
        try {
            setIsLoading(true);

            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await getTickets(
                {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}
            );
            if (res && res.data ) {
                setTicketsData(res.data);
            }

        } catch (error) {
            console.error("Error fetching data:", error);

        } finally {
            setIsLoading(false);
        }
    }, [token,curPeriod]);


    useEffect(() => {
        fetchTickets();
    }, [token, curPeriod]);

    const handleEditTicket = async (uuid: string) => {
        setIsTicketNew(false);
        setSingleTicketUuid(uuid)
        // setTicketParams(null);
        // setSingleTicketData(null);
        // fetchTicketParams();
        // fetchSingleTicket(uuid);

        // setAmazonPrepOrdersData(prevState => {
        //     if (prevState && prevState.length) {
        //         const el = prevState.filter(item => item.uuid === uuid);
        //         if (el.length) {
        //             return [...prevState.filter(item => item.uuid !== uuid), {...el[0], notifications: false}].sort((a,b)=>a.wapiTrackingNumber<b.wapiTrackingNumber ? 1 : -1)
        //         }
        //     }
        //     return [...prevState];
        // });
        //
        setShowTicketModal(true);

    }

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditTicket(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/tickets');
        }
    }, [Router.query]);

    const handleCreateTicket = (
    ) => {
        setIsTicketNew(true);
        setSingleTicketUuid(null);
        // setSingleAmazonPrepOrder(null);
        //fetchTicketParams();
        setShowTicketModal(true);
    }

    console.log('tickets:', ticketsData)


    return (
        <Layout hasHeader hasFooter>
            <div className="page-component tickets-page tickets-page__container">
                {isLoading && <Loader />}
                <Header pageTitle='Tickets' toRight >
                    <Button icon="add" iconOnTheRight onClick={handleCreateTicket}>Create ticket</Button>
                </Header>

                {ticketsData && <TicketList tickets={ticketsData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod}  handleEditTicket={handleEditTicket} />}
            </div>
            {showTicketModal && (singleTicketUuid || isTicketNew) &&
                <Modal title={`Ticket`} onClose={handleTicketModalClose} >
                    <Ticket ticketUuid={singleTicketUuid} onClose={handleTicketModalClose}/>
                </Modal>
            }
        </Layout>
    )
}

export default TicketsPage;
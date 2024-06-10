import React, {useState, useEffect, useCallback} from "react";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import "./styles.scss";
import Button from "@/components/Button/Button";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {ApiResponseType} from "@/types/api";
import Loader from "@/components/Loader";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {getTickets} from "@/services/tickets";
import TicketList from "@/screens/TicketsPage/components/TicketList";
import Modal from "@/components/Modal";
import Ticket from "./components/Ticket";
import {TicketType} from "@/types/tickets";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {
    tourGuideStepsTickets,
    tourGuideStepsTicketsNoDocs
} from "./ticketsTourGuideSteps.constants";


const TicketsPage = () => {
    const {token, currentDate, superUser, ui} = useAuth();

    const today = currentDate;
    const firstDay = getLastFewDays(today, 30);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})
    const Router = useRouter();

    const [ticketsData, setTicketsData] = useState<TicketType[] | null>(null);
    const [singleTicketUuid, setSingleTicketUuid] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isTicketNew, setIsTicketNew] = useState(true);

//
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    //modal
    const [showTicketModal, setShowTicketModal] = useState(false);
    const handleTicketModalClose = () => {
        setShowTicketModal(false);

        if (singleTicketUuid) {
            setDocNotificationsAsRead(singleTicketUuid);
        }
        fetchTickets(singleTicketUuid);
    }

    const fetchTickets = useCallback(async (ticketUuid='') => {
        try {
            setIsLoading(true);
            setTicketsData([]);
            const requestData = {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)};
            const res: ApiResponseType = await getTickets(superUser && ui ? {...requestData, ui} : requestData);
            if (res && res.data ) {
                let tickets = res.data;
                if (ticketUuid) {
                    const el = res.data.filter(item => item.uuid === ticketUuid);

                    if (el.length) {
                        tickets = [...res.data.filter(item => item.uuid !== ticketUuid), {...el[0], newMessages: false}].sort((a,b)=>a.number<b.number ? 1 : -1)
                    }
                }

                setTicketsData(tickets.sort((a,b)=>a.number<b.number ? 1 : -1));
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

        // setTicketsData(prevState => {
        //     if (prevState && prevState.length) {
        //         const el = prevState.filter(item => item.uuid === uuid);
        //
        //         if (el.length) {
        //             console.log('new state: ', [...prevState.filter(item => item.uuid !== uuid), {...el[0], newMessages: false}].sort((a,b)=>a.number<b.number ? 1 : -1))
        //             return [...prevState.filter(item => item.uuid !== uuid), {...el[0], newMessages: false}].sort((a,b)=>a.number<b.number ? 1 : -1)
        //         }
        //     }
        //     return [...prevState];
        // });

        setShowTicketModal(true);

    }

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditTicket(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/tickets');
        }
    }, [Router.query]);

    // useEffect(() => {
    //     fetchTickets();
    // }, [notifications]);

    const handleCreateTicket = (
    ) => {
        setIsTicketNew(true);
        setSingleTicketUuid(null);
        setShowTicketModal(true);
    }

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Tickets)) {
            if (!isLoading && ticketsData) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(ticketsData?.length ? tourGuideStepsTickets : tourGuideStepsTicketsNoDocs);
    }, [ticketsData]);


    return (
        <Layout hasHeader hasFooter>
            <div className="page-component tickets-page tickets-page__container">
                {isLoading && <Loader />}
                <Header pageTitle='Tickets' toRight needTutorialBtn >
                    <Button classNames='add-ticket' icon="add" iconOnTheRight onClick={handleCreateTicket}>Create ticket</Button>
                </Header>

                {ticketsData && <TicketList tickets={ticketsData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod}  handleEditTicket={handleEditTicket} />}
            </div>
            {showTicketModal && (singleTicketUuid || isTicketNew) &&
                <Modal title={`Ticket`} onClose={handleTicketModalClose} >
                    <Ticket ticketUuid={singleTicketUuid} onClose={handleTicketModalClose}/>
                </Modal>
            }
            {ticketsData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Tickets} /> : null}
        </Layout>
    )
}

export default TicketsPage;
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
            const requestData = {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)};
            const res: ApiResponseType = await getTickets(superUser && ui ? {...requestData, ui} : requestData);
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
//                 <ModalStatus onClose={handleTicketModalClose} statusModalType={STATUS_MODAL_TYPES.MESSAGE} title="Warning" subtitle={`Tickets are temporary unavailable!
// We are working on resolving this issue! It will be resolved soon.`} />
            }
            {ticketsData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Tickets} /> : null}
        </Layout>
    )
}

export default TicketsPage;
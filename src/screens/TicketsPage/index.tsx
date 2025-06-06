import React, {useState, useEffect, useCallback} from "react";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
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
import {sendUserBrowserInfo} from "@/services/userInfo";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";


const TicketsPage = () => {
    const { tenantData: { alias }} = useTenant();
    const {token, currentDate, superUser, ui, getBrowserInfo, isActionIsAccessible} = useAuth();

    const today = currentDate;
    const firstDay = getLastFewDays(today, 30);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType >({startDate: firstDay, endDate: today})

    //const [isQueryChecked, setIsQueryChecked] = useState(false);
    const Router = useRouter();
    const query = Router.query;

    useEffect(() => {
        const { uuid } = query;

        if (uuid) {
            handleEditTicket(Array.isArray(uuid) ? uuid[0] : uuid);
            //Router.replace('/tickets');
            delete query.uuid;
            Router.replace({pathname: '/tickets', query: {...query}}, undefined, {shallow: true});
        }

    }, [query]);


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

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const fetchTickets = useCallback(async (ticketUuid='') => {
        try {
            setIsLoading(true);
            setTicketsData([]);
            const requestData = {token, alias, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetTicketList', AccessObjectTypes.Tickets, AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.ListView)) {
                setTicketsData([]);
                return null;
            }

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

        if (!isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.ViewObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('ViewEditTicket', AccessObjectTypes.Tickets, AccessActions.ViewObject), body: {uuid: uuid}});
            } catch {}

            setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal})
            setShowStatusModal(true);
        } else {
            setShowTicketModal(true);
        }
    }


    const handleCreateTicket = (
    ) => {
        setIsTicketNew(true);
        setSingleTicketUuid(null);

        console.log('cc')
        if (!isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateTicket', AccessObjectTypes.Tickets, AccessActions.CreateObject), body: {}});
            } catch {}
        } else {
            setShowTicketModal(true);
        }
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
            <SeoHead title='Tickets' description={`Our tickets page`} />
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
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </Layout>
    )
}

export default TicketsPage;
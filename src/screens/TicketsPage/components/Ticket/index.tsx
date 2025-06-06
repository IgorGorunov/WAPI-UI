import React, {useCallback, useEffect, useState} from "react";
import "./styles.scss";
import {ApiResponseType} from "@/types/api";
import {getSingleTicket, getTicketParams} from "@/services/tickets";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {SingleTicketType, TicketParamsType} from "@/types/tickets";
import Loader from "@/components/Loader";
import {ToastContainer} from "@/components/Toast";
import Modal from "@/components/Modal";
import TicketComponent from "@/screens/TicketsPage/components/Ticket/TicketComponent";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {sendUserBrowserInfo} from "@/services/userInfo";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import useTenant from "@/context/tenantContext";

type TicketPropsType = {
    ticketUuid?: string;
    subjectType?: string | null;
    subjectUuid?: string | null;
    subject?: string;
    onClose: ()=>void;
};

const Ticket: React.FC<TicketPropsType> = ({ticketUuid=null, subjectType=null, subjectUuid=null, subject='', onClose}) => {
    const { tenantData: { alias }} = useTenant();
    const {token, superUser, ui, getBrowserInfo, isActionIsAccessible} = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [docUuid, setDocUuid] = useState<string|null>(ticketUuid);

    const [isTicketNew, setIsTicketNew] = useState(!ticketUuid);

    useEffect(() => {
        setIsTicketNew(!docUuid);
    }, [docUuid]);

    const [isLoading, setIsLoading] = useState(false);
    const [ticketParams, setTicketParams] = useState<TicketParamsType | null>(null);
    const [singleTicketData, setSingleTicketData] = useState<SingleTicketType | null>(null);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const fetchSingleTicket = useCallback(async (uuid: string) => {
        try {
            setIsLoading(true);
            const requestData = {token, alias, uuid};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetTicketData', AccessObjectTypes.Tickets, AccessActions.ViewObject), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.ViewObject)) {
                setSingleTicketData(null);
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal})
                setShowStatusModal(true);
                return null;
            }

            const res: ApiResponseType = await getSingleTicket(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setSingleTicketData(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token, docUuid]);

    const fetchTicketParams = useCallback(async () => {
        try {
            setIsLoading(true);
            const requestData = {token, alias};
            // try {
            //     sendUserBrowserInfo({...getBrowserInfo('GetTicketParameters'), body: superUser && ui ? {...requestData, ui} : requestData})
            // } catch {}
            if (!ticketUuid && !isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.CreateObject) ) {
                try {
                    sendUserBrowserInfo({...getBrowserInfo('CreateTicket', AccessObjectTypes.Tickets, AccessActions.CreateObject), body: superUser && ui ? {...requestData, ui} : requestData})
                } catch {}
                setTicketParams(null);
                return null;
            }
            const res: ApiResponseType = await getTicketParams(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setTicketParams(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token]);


    useEffect(() => {
        if (docUuid) {
            fetchSingleTicket(docUuid);
        }

        fetchTicketParams();
    }, [docUuid, token, ticketUuid]);

    const onCloseModal = () => {
        onClose();

        if (ticketUuid) {
            setDocNotificationsAsRead(ticketUuid);
        }
    }


    return (
        <div className={`ticket ticket-wrapper  ${isTicketNew ? 'new-ticket' : 'existing-ticket'}`} >
            {isLoading && <Loader/>}
            <ToastContainer/>
            {ticketParams && (ticketUuid && singleTicketData || !ticketUuid) ?
                <Modal title={`Ticket`} onClose={onCloseModal} classNames='document-modal'>
                    <TicketComponent setDocUuid={setDocUuid} ticketParams={ticketParams} singleTicketData={singleTicketData} subjectType={subjectType} subjectUuid={subjectUuid} subject={subject} ticketUuid={docUuid}  reFetchTicket={()=>{fetchSingleTicket(ticketUuid)}} onClose={onCloseModal}/>
                </Modal>
                : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
};

export default Ticket;

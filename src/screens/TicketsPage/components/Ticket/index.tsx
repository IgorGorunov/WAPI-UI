import React, {useCallback, useEffect, useState} from "react";
import "./styles.scss";
import {ApiResponseType} from "@/types/api";
import {getSingleTicket, getTicketParams} from "@/services/tickets";
import useAuth from "@/context/authContext";
import {SingleTicketType, TicketParamsType} from "@/types/tickets";
import Loader from "@/components/Loader";
import {ToastContainer} from "@/components/Toast";
import Modal from "@/components/Modal";
import TicketComponent from "@/screens/TicketsPage/components/Ticket/TicketComponent";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";

type TicketPropsType = {
    ticketUuid?: string;
    subjectType?: string | null;
    subjectUuid?: string | null;
    subject?: string;
    onClose: ()=>void;
};

const Ticket: React.FC<TicketPropsType> = ({ticketUuid=null, subjectType=null, subjectUuid=null, subject='', onClose}) => {

    const {token} = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [docUuid, setDocUuid] = useState<string|null>(ticketUuid);

    const [isTicketNew, setIsTicketNew] = useState(!ticketUuid);

    useEffect(() => {
        setIsTicketNew(!docUuid);
    }, [docUuid]);

    const [isLoading, setIsLoading] = useState(false);
    const [ticketParams, setTicketParams] = useState<TicketParamsType | null>(null);
    const [singleTicketData, setSingleTicketData] = useState<SingleTicketType | null>(null);

    const fetchSingleTicket = useCallback(async (uuid: string) => {
        try {
            setIsLoading(true);

            const res: ApiResponseType = await getSingleTicket(
                {token, uuid}
            );

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

            const res: ApiResponseType = await getTicketParams(
                {token}
            );

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
                <Modal title={`Ticket`} onClose={onCloseModal} >
                    <TicketComponent setDocUuid={setDocUuid} ticketParams={ticketParams} singleTicketData={singleTicketData} subjectType={subjectType} subjectUuid={subjectUuid} subject={subject} ticketUuid={docUuid}  reFetchTicket={()=>{fetchSingleTicket(ticketUuid)}} onClose={onCloseModal}/>
                </Modal>
                : null}

        </div>
    );
};

export default Ticket;

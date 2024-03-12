import React, {useState} from "react";
import "./styles.scss";
import {
    formatDateStringToDisplayString,
    formatDateTimeToStringWithDot,
    formatDateTimeToStringWithDotWithoutSeconds
} from "@/utils/date";
import {TICKET_OBJECT_TYPES, TicketType} from "@/types/tickets";
import SingleDocument from "@/components/SingleDocument";
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";

type PropsType = {
    ticket?: TicketType;
};

const TicketInfo: React.FC<PropsType> = ({ ticket }) => {
    const [displayDocModal, setDisplayDocModal] = useState(false);

    const handleClose = () => {
        setDisplayDocModal(false);
    }
    return (
        <div className="ticket-info-item">
            <p>Date: <span>{formatDateTimeToStringWithDotWithoutSeconds(ticket.date)}</span></p>
            <p>Ticket #: <span className='is-link' onClick={() => setDisplayDocModal(true)}>{ticket.number}</span></p>
            <p>Status: <span>{ticket.status}</span></p>
            <p>Topic: <span>{ticket.topic}</span></p>
            <p>Description: <span>{ticket.description}</span></p>
            {ticket.result ? <p>Result: <span>{ticket.result}</span></p> : null}
            {displayDocModal && ticket.subjectType && ticket.subjectUuid ? (
                <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} uuid={ticket.uuid} onClose={handleClose} />
            ) : null}
        </div>
    );
};

export default TicketInfo;

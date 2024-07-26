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
import {useTranslations} from "next-intl";

type PropsType = {
    ticket?: TicketType;
};

const TicketInfo: React.FC<PropsType> = ({ ticket }) => {
    const t = useTranslations('documentTickets')

    const [displayDocModal, setDisplayDocModal] = useState(false);

    const handleClose = () => {
        setDisplayDocModal(false);
    }
    return (
        <div className="ticket-info-item">
            <p><span className='header-col'>{t('date')}: </span><span>{formatDateTimeToStringWithDotWithoutSeconds(ticket.date)}</span></p>
            <p><span className='header-col'>{t('ticket')} #: </span><span className='is-link' onClick={() => setDisplayDocModal(true)}>{ticket.number}</span></p>
            <p><span className='header-col'>{t('status')}: </span><span>{ticket.status}</span></p>
            <p><span className='header-col'>{t('topic')}: </span><span>{ticket.topic}</span></p>
            <p><span className='header-col'>{t('description')}: </span><span>{ticket.description}</span></p>
            {ticket.result ? <p><span className='header-col'>{t('result')}: </span><span>{ticket.result}</span></p> : null}
            {displayDocModal && ticket.subjectType && ticket.subjectUuid ? (
                <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} uuid={ticket.uuid} onClose={handleClose} />
            ) : null}
        </div>
    );
};

export default TicketInfo;

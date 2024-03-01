import React, {useState} from "react";
import "./styles.scss";
import {formatDateTimeToStringWithDot} from "@/utils/date";
import {SingleTicketType} from "@/types/tickets";
import SingleDocument from "@/components/SingleDocument";
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";

type TicketInfoPropsType = {
    ticketData: SingleTicketType;
};

const TicketInfoBlock: React.FC<TicketInfoPropsType> = ({ticketData }) => {

    const [displayDocModal, setDisplayDocModal] = useState(false);

    const handleClose = () => {
        setDisplayDocModal(false);
    }

    return (
        <div className="ticket-info-block">
            <div className='grid-row'>
                <p className='width-17 ticket-info--title'>Ticket number:</p>
                <div className='width-33 ticket-info--info'>{ticketData.number}</div>
                <p className='width-17 ticket-info--title'>Created:</p>
                <div className='width-33 ticket-info--info'>{formatDateTimeToStringWithDot(ticketData.date)}</div>
                <p className='width-17 ticket-info--title'>Topic:</p>
                <div className={`width-83 ticket-info--info`}>{ticketData.topic}</div>
                <p className='width-17 ticket-info--title'>Subject:</p>
                <div className={`width-83 ticket-info--info ${ticketData.subjectUuid ? 'is-link' : ''}`} onClick={()=>setDisplayDocModal(true)}>{ticketData.subject}</div>
                <p className='width-17 ticket-info--title'>Description:</p>
                <div className='width-83 ticket-info--info'>{ticketData.description}</div>
            </div>

            {displayDocModal && ticketData.subjectType && ticketData.subjectUuid ? (
                <SingleDocument type={NOTIFICATION_OBJECT_TYPES[ticketData.subjectType]} uuid={ticketData.subjectUuid} onClose={handleClose} />
            ) : null}
        </div>
    );
};

export default TicketInfoBlock;

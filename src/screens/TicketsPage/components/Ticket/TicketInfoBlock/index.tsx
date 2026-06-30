import React, {useState} from "react";
import styles from "./styles.module.scss";
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
        <div className={styles["ticket-info-block"]}>
            <div className='grid-row'>
                <p className={`width-17 ${styles['ticket-info--title']} ${styles['ticket-info--title__width-17']}`}>Ticket number:</p>
                <div className={`width-50 ${styles['ticket-info--info']} ${styles['ticket-info--info__width-50']}`}>{ticketData.number}</div>
                <p className={`width-17 ${styles['ticket-info--title']} ${styles['ticket-info--title__width-17']}`}>Last update:</p>
                <div className={`width-17 ${styles['ticket-info--info']} ${styles['ticket-info--info__width-17']}`}>{formatDateTimeToStringWithDot(ticketData.date)}</div>
            </div>
            <div className='grid-row'>
                <p className={`width-17 ${styles['ticket-info--title']} ${styles['ticket-info--title__width-17']}`}>Topic:</p>
                <div className={`width-50 ${styles['ticket-info--info']} ${styles['ticket-info--info__width-50']}`}>{ticketData.topic}</div>
                <p className={`width-17 ${styles['ticket-info--title']} ${styles['ticket-info--title__width-17']}`}>Status:</p>
                <div className={`width-17 ${styles['ticket-info--info']} ${styles['ticket-info--info__width-17']}`}>{ticketData.status}</div>
            </div>
            <div className='grid-row'>
                <p className={`width-17 ${styles['ticket-info--title']} ${styles['ticket-info--title__width-17']}`}>Title:</p>
                <div className={`width-83 ${styles['ticket-info--info']} ${styles['ticket-info--info__width-83']} ${ticketData.subjectUuid ? styles['ticket-info--info__is-link'] : ''}`}
                     onClick={() => setDisplayDocModal(true)}>
                    {ticketData.subject.trim()}
                </div>
            </div>
            <div className='grid-row'>
                <p className={`width-17 ${styles['ticket-info--title']} ${styles['ticket-info--title__width-17']}`}>Description:</p>
                <div className={`width-83 ${styles['ticket-info--info']} ${styles['ticket-info--info__width-83']}`}>{ticketData.description}</div>
            </div>
            <div className='grid-row'>
                {ticketData.result ? <div>
                    <p className={`width-17 ${styles['ticket-info--title']} ${styles['ticket-info--title__width-17']}`}>Result:</p>
                    <div className={`width-83 ${styles['ticket-info--info']} ${styles['ticket-info--info__width-83']}`}>{ticketData.result}</div>
                </div> : null}
            </div>

            {displayDocModal && ticketData.subjectUuid ? (
                <SingleDocument type={NOTIFICATION_OBJECT_TYPES[ticketData.subjectType]} uuid={ticketData.subjectUuid} onClose={handleClose} />
            ) : null}
        </div>
    );
};

export default TicketInfoBlock;

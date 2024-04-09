import React, {useCallback} from "react";
import "./styles.scss";
import {formatDateStringToDisplayString, formatDateTimeToStringWithDot} from "@/utils/date";
import {ticketStatusColors, TicketType} from "@/types/tickets";
import Accordion from "@/components/Accordion";
import TicketInfo from "./TicketInfo";



type DocTicketsPropsType = {
    tickets: TicketType[];
};

const DocumentTickets: React.FC<DocTicketsPropsType> = ({ tickets }) => {

    const getUnderlineColor = useCallback((statusText: string) => {
        return ticketStatusColors[statusText] || 'black';
    }, []);

    return (
        <div className="doc-tickets">

                {tickets.map(item => (<div key={item.uuid + item.status} className='doc-tickets-wrapper'>
                    <Accordion title={`Ticket #${item.number} from ${formatDateStringToDisplayString(item.date)}. Status: ${item.status}`}>
                        <TicketInfo ticket={item}/>
                    </Accordion>
                </div>))}

            {/*<div className="doc-tickets__header">*/}
            {/*    <div className='date-column'>Period</div>*/}
            {/*    <div className='column number-column'>Number</div>*/}
            {/*    <div className='column status-column'>Status</div>*/}
            {/*    <div className='column topic-column'>Topic</div>*/}
            {/*    <div className='column description-column'>Description</div>*/}
            {/*</div>*/}
            {/*<ul className="doc-tickets__list">*/}
            {/*{tickets && tickets.length ?*/}
            {/*    tickets.map((ticket: TicketType, index: number) => (*/}
            {/*        <li*/}
            {/*            key={ticket.uuid}*/}
            {/*            className={`doc-tickets__list-item ${*/}
            {/*                index % 2 === 1 ? "highlight" : " "*/}
            {/*            }`}*/}
            {/*        >*/}
            {/*            <div className='date-column'>{formatDateTimeToStringWithDot(ticket.date)}</div>*/}
            {/*            <div className='column number-column'>{ticket.number}</div>*/}
            {/*            <div className='column status-column'>*/}
            {/*                <span style={{*/}
            {/*                    // borderBottom: `2px solid ${getUnderlineColor(ticket.status)}`,*/}
            {/*                    // display: 'inline-block',*/}
            {/*                }}>*/}
            {/*                    {ticket.status}*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*            <div className='column topic-column'>{ticket.topic}</div>*/}
            {/*            <div className='column description-column'>{ticket.description}</div>*/}
            {/*        </li>*/}
            {/*    )) : null}*/}
            {/*</ul>*/}
        </div>
    );
};

export default DocumentTickets;

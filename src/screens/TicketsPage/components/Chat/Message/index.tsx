import React from "react";
import "./styles.scss";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";
import {ChatMessageType} from "@/types/tickets";

type MessagePropsType = {
    message: ChatMessageType;
}

const Message: React.FC<MessagePropsType> = ({message}) => {


    return (
        <div className="single-message-block">
            <div className={`single-message ${message.author === 'UI' ? 'UI-User' : 'User-UI'}`}>
                <div className={`single-message__user-name`}>{message.author === 'UI' ? 'You' : message.author}</div>
                <div className={`single-message__text`}>{message.message}</div>
                <div className={`single-message__period`}>{formatDateTimeToStringWithDotWithoutSeconds(message.date)}</div>
                {/*<div className='single-message__checkmarks'>*/}
                {/*    {message.status !== NOTIFICATION_STATUSES.NEW &&*/}
                {/*        <span className='second-checkmark'><Icon name={'big-check'}/></span>*/}
                {/*    }*/}
                {/*    <span className='first-checkmark'><Icon name={'big-check'}/></span>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Message;

import React from "react";
import "./styles.scss";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";
import {ChatMessageType} from "@/types/tickets";
import MessageFile from "./MessageFile";

type MessagePropsType = {
    message: ChatMessageType;
}

// Regular expression to match emojis
const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;

// Function to wrap emojis in <span> elements
const wrapEmojisInSpan = (text) => {
    const parts = [];
    let match;
    let lastIndex = 0;

    while ((match = emojiRegex.exec(text)) !== null) {
        const emoji = match[0];
        const index = match.index;

        // Push the text before the emoji
        if (index !== lastIndex) {
            parts.push(text.substring(lastIndex, index));
        }

        // Wrap the emoji in a <span> element
        parts.push(<span key={index}>{emoji}</span>);

        lastIndex = index + emoji.length;
    }

    // Push the remaining text after the last emoji
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts;
};

const Message: React.FC<MessagePropsType> = ({message}) => {


    return (
        <div className="single-message-block">
            <div className={`single-message ${message.author === 'UI' ? 'UI-User' : 'User-UI'}`}>
                <div className={`single-message__user-name`}>{message.author === 'UI' ? 'You' : message.author}</div>
                <div className={`single-message__text `}>{wrapEmojisInSpan(message.message).map((item, index) => (
                        <React.Fragment key={index}>{item}</React.Fragment>
                    ))}
                </div>
                {message && message.attachedFiles && message.attachedFiles.length ? (
                    <ul className='single-message__files'>
                    {message.attachedFiles.map( file => <li key={file.id} className='single-message__file-wrapper'><MessageFile attachedFile={file} /></li>)}
                    </ul>
                    ) : null
                }

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

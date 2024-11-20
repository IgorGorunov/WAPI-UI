import React, {useCallback, useEffect, useRef, useState} from "react";
import "./styles.scss";
import Message from "./Message";
import SendMessageBlock from "@/screens/TicketsPage/components/Chat/SendMessageBlock";
import useAuth from "@/context/authContext";
import {ApiResponseType} from "@/types/api";
import {getTicketMessages} from "@/services/tickets";
import Loader from "@/components/Loader";
import {ChatMessageType} from "@/types/tickets";

type ChatPropsType = {
    objectUuid: string;
    canEdit?: boolean;
};

const ChatBlock: React.FC<ChatPropsType> = ({objectUuid, canEdit=true }) => {

    const {token, superUser, ui} = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [sendHeight, setSendHeight] = useState(0);

    const sendTicketBlockRef = useRef(null)

    useEffect(() => {
        setSendHeight(sendTicketBlockRef.current.clientHeight);
    })

    useEffect(() => {
        const scrollToBottom = () => {
            if (sendTicketBlockRef.current) {
                setSendHeight(sendTicketBlockRef.current.scrollHeight);
            }
        };

        setTimeout( scrollToBottom, 200);

    },[chatMessages, showEmojiPicker]);

    useEffect(() => {
        if (!chatMessages.length) {
            handleSendMessage();
        }
    }, []);

    const containerRef = useRef(null);

    useEffect(() => {
        const scrollToBottom = () => {
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        };

        setTimeout( scrollToBottom, 200);
    },[chatMessages, showEmojiPicker]);



    const bottomRef = useRef(null);


    const handleSendMessage = useCallback(async() => {
        //fetch messages
        try {
            setIsLoading(true);
            const requestData = {
                token: token,
                uuid: objectUuid,
            };

            // try {
            //     sendUserBrowserInfo({...getBrowserInfo('GetMessagesByObject'), body: superUser && ui ? {...requestData, ui} : requestData})
            // } catch {}

            const res: ApiResponseType = await getTicketMessages(superUser && ui ? {...requestData, ui} : requestData);
            if (res.status === 200) {
                setChatMessages(res.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);

        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if ( window && window.innerWidth) {
            setIsMobile(window.innerWidth < 600);
        }
    });

    return (
        <>
            {isLoading && <Loader />}
            <div className='chat-block__message-history' >
                <ul className='chat-block__messages' ref={containerRef} style={{maxHeight:`calc(100vh - ${isMobile ? '200' : '300'}px - ${sendHeight}px)`, overflow: 'hidden scroll'}}>
                    {chatMessages && chatMessages.length ?
                        chatMessages.sort((a, b) => a.date > b.date ? 1 : -1)
                            .map(message => <li key={Math.random()}><Message message={message}/></li>)
                        : null
                    }
                    <div ref={bottomRef}></div>
                </ul>
            </div>
            <div className='chat-block__send' ref={sendTicketBlockRef}>
                <SendMessageBlock objectUuid={objectUuid} onSendMessage={handleSendMessage} canEdit={canEdit} showEmojiPicker={showEmojiPicker} setShowEmojiPicker={setShowEmojiPicker}/>
            </div>
        </>
    );
};

export default ChatBlock;

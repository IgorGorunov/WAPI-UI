import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import "./styles.scss";
import {verifyToken} from "@/services/auth";
import {verifyUser} from "@/utils/userData";
import {Routes} from "@/types/routes";
import {ApiResponseType} from "@/types/api";
import {createTicket, getSingleTicket, getTicketParams} from "@/services/tickets";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {SingleTicketType, TicketParamsType} from "@/types/tickets";
import Loader from "@/components/Loader";
import {ToastContainer} from "@/components/Toast";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import {useForm} from "react-hook-form";
import Button, {ButtonVariant} from "@/components/Button/Button";
import DropZone from "@/components/Dropzone";
import {TabFields, TabTitles} from "./TicketTabs";
import {useTabsState} from "@/hooks/useTabsState";
import {CreateTicketFields} from "@/screens/TicketsPage/components/Ticket/TicketFormFields";
import {AttachedFilesType} from "@/types/utility";
import TicketInfoBlock from "@/screens/TicketsPage/components/Ticket/TicketInfoBlock";
import ChatBlock from "@/screens/TicketsPage/components/Chat";

type TicketPropsType = {
    ticketUuid?: string;
    onClose: ()=>void;
};

const Ticket: React.FC<TicketPropsType> = ({ticketUuid=null, onClose}) => {
    const {token, setToken, currentDate} = useAuth();
    const Router = useRouter();

    const [docUuid, setDocUuid] = useState<string|null>(ticketUuid);
    const [infoHeight, setInfoHeight] = useState(0)
    const ticketInfoBlockRef = useRef(null)

    useEffect(() => {
        setInfoHeight(ticketInfoBlockRef.current.clientHeight)
    })

    const [isTicketNew, setIsTicketNew] = useState(!ticketUuid);

    useEffect(() => {
        setIsTicketNew(!docUuid);
    }, [docUuid]);

    console.log('it is a ticket: ', ticketUuid)

    const [isLoading, setIsLoading] = useState(false);
    const [ticketParams, setTicketParams] = useState<TicketParamsType | null>(null);
    const [singleTicketData, setSingleTicketData] = useState<SingleTicketType | null>(null);
    const [isDisabled, setIsDisabled] = useState(!isTicketNew && !singleTicketData?.canEdit);
    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(singleTicketData?.attachedFiles || []);

    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    const fetchSingleTicket = useCallback(async (uuid: string) => {
        try {
            setIsLoading(true);

            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

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
    },[token]);

    const fetchTicketParams = useCallback(async () => {
        try {
            setIsLoading(true);

            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

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
    }, [docUuid, token]);


    //form
    const {control, handleSubmit, formState: { errors }} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            topic: singleTicketData?.topic || '',
            uuid: singleTicketData?.uuid || '',
            subject: singleTicketData?.subject || '',
            subjectUuid: singleTicketData?.subjectUuid || null,
            subjectType: singleTicketData?.subjectType || null,
            description: singleTicketData?.description || '',
            number: singleTicketData?.number || '',
            date: singleTicketData?.date || '',
            status: singleTicketData?.status || 'New',
            supportManager: singleTicketData?.supportManager || '',
            result: singleTicketData?.result || '',
        }
    });

    const topicOptions = useMemo(()=>{
        return ticketParams && ticketParams.topics && ticketParams.topics.length ? ticketParams.topics.map(item => ({label: item, value: item})) : [];
    },[ticketParams]);

    const createTicketFields = useMemo(() => CreateTicketFields(topicOptions), [topicOptions]);

    //tabs
    const tabTitleArray =  TabTitles(!ticketUuid);
    const {tabTitles, updateTabTitles, clearTabTitles} = useTabsState(tabTitleArray, TabFields);

    const handleCancel = () => {
        onClose();
    }

    const onSubmitForm = async (data) => {
        console.log('Submit', data)
        clearTabTitles();
        setIsLoading(true);
        data.attachedFiles= selectedFiles;

        try {
            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await createTicket(
                {
                    token: token,
                    ticket: data
                }
            );

            if (res && "status" in res) {
                if (res?.status === 200 && res?.data) {
                    //success
                    console.log(res.data);
                }
            } else {

            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const onError = (props: any) => {
        const fieldNames = Object.keys(props);
        updateTabTitles(fieldNames);
    };

    return (
        <div className={`ticket ticket-wrapper  ${isTicketNew ? 'new-ticket' : 'existing-ticket'}`} >
            {isLoading && <Loader/>}
            <ToastContainer/>
            <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
                <Tabs id='ticket-tabs' tabTitles={tabTitles} classNames='inside-modal' needMinHeight={false}>
                    <div key='main-tab' className='main-tab'>
                        <div className='card ticket--info' ref={ticketInfoBlockRef}>
                            {isTicketNew ? (
                                <div className='ticket--info-form'>
                                    <div className='grid-row'>
                                        <FormFieldsBlock control={control} fieldsArray={createTicketFields}
                                                         errors={errors}/>
                                    </div>
                                </div>
                            ) : (
                                <div className='ticket--info-info'>
                                    {singleTicketData ? <TicketInfoBlock ticketData={singleTicketData}/> : null}
                                </div>
                            )}
                        </div>

                        <div className="card ticket--files">
                            <h3 className='ticket__block-title'>
                                <Icon name='files'/>
                                Files
                            </h3>
                            <div className='dropzoneBlock'>
                                <DropZone readOnly={!!isDisabled} files={selectedFiles}
                                          onFilesChange={handleFilesChange}/>
                            </div>
                        </div>


                    </div>

                    {singleTicketData ?
                        <div key='messages-tab' className='files-tab'>
                           <div className={`card ticket--messages`}>
                                <ChatBlock objectUuid={singleTicketData?.uuid}/>
                           </div>
                        </div>
                        : null
                    }
                </Tabs>

                {isTicketNew && <div className='ticket--info-form-btns'>
                    <Button type="submit" variant={ButtonVariant.PRIMARY}>Create ticket</Button>
                    <Button type="button" variant={ButtonVariant.SECONDARY} onClick={handleCancel}>Cancel</Button>
                </div>}
            </form>

        </div>
    );
};

export default Ticket;

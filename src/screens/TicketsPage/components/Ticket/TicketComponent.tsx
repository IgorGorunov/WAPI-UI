import React, {useEffect, useMemo, useRef, useState} from "react";
import "./styles.scss";
import {ApiResponseType} from "@/types/api";
import {createTicket, reopenTicket} from "@/services/tickets";
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
    subjectType?: string | null;
    subjectUuid?: string | null;
    ticketUuid?: string;
    ticketParams: TicketParamsType;
    singleTicketData?: SingleTicketType;
    onClose: ()=>void;
    setDocUuid: (uuid: string)=>void;
    subject?: string;
    reFetchTicket: ()=>void;
};

const TicketComponent: React.FC<TicketPropsType> = ({subjectType=null, subjectUuid=null, ticketUuid=null, ticketParams, singleTicketData, setDocUuid, subject='', onClose, reFetchTicket}) => {

    const {token, currentDate} = useAuth();
    const Router = useRouter();

    //const [docUuid, setDocUuid] = useState<string|null>(ticketUuid);
    const [infoHeight, setInfoHeight] = useState(0)
    const ticketInfoBlockRef = useRef(null);

    useEffect(() => {
        setInfoHeight(ticketInfoBlockRef.current.clientHeight)
    })

    const [isTicketNew, setIsTicketNew] = useState(!ticketUuid);

    useEffect(() => {
        setIsTicketNew(!ticketUuid);
    }, [ticketUuid, singleTicketData]);

    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(!isTicketNew && !singleTicketData?.canEdit);
    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(singleTicketData?.attachedFiles || []);

    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    //form
    const {control, handleSubmit, formState: { errors }} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            topic: singleTicketData?.topic || '',
            uuid: singleTicketData?.uuid || '',
            subject: singleTicketData?.subject || subject || '',
            subjectUuid: subjectUuid || singleTicketData?.subjectUuid || null,
            subjectType: subjectType || singleTicketData?.subjectType || null,
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

    const createTicketFields = useMemo(() => CreateTicketFields(topicOptions, subjectUuid), [topicOptions, subjectUuid]);

    //tabs
    const tabTitleArray =  TabTitles(!ticketUuid && !singleTicketData);

    const {tabTitles, updateTabTitles, clearTabTitles, resetTabTables} = useTabsState(tabTitleArray, TabFields);

    useEffect(() => {
        resetTabTables(tabTitleArray);
    }, [ticketUuid,singleTicketData]);

    const handleCancel = () => {
        onClose();
    }

    const handleReopenTicket = async () => {
        try {
            const res: ApiResponseType = await reopenTicket(
                {
                    token: token,
                    uuid: ticketUuid,
                }
            );

            if (res?.status === 200) {
                //success
                reFetchTicket();
            } else {

            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const [curTab, setCurTab] = useState(singleTicketData ? 1 : 0);
    useEffect(() => {
        setCurTab(singleTicketData ? 1 : 0);
    }, [singleTicketData]);

    const onSubmitForm = async (data) => {
        clearTabTitles();
        setIsLoading(true);
        data.attachedFiles= selectedFiles;

        try {
            const res: ApiResponseType = await createTicket(
                {
                    token: token,
                    ticket: data
                }
            );

            if (res && "status" in res) {
                if (res?.status === 200 && res?.data) {
                    //success
                    setDocUuid(res.data);
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
        <div className={`ticket ticket-wrapper  ${isTicketNew ? 'new-ticket' : 'existing-ticket'} `} >
            {isLoading && <Loader/>}
            <ToastContainer/>
            <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
                <Tabs id='ticket-tabs' tabTitles={tabTitles} classNames='inside-modal' needMinHeight={false} curTab={curTab}>

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
                                <DropZone readOnly={isDisabled} files={selectedFiles}
                                          onFilesChange={handleFilesChange} docUuid={singleTicketData?.uuid} showSend={true} />
                            </div>
                        </div>
                    </div>
                    {singleTicketData ?
                        <div key='messages-tab' className='files-tab'>
                            <div className={`card ticket--messages`}>
                                <ChatBlock objectUuid={singleTicketData?.uuid} canEdit={singleTicketData?.canEdit}/>
                            </div>
                        </div>
                        : null
                    }
                </Tabs>

                {isTicketNew && <div className='ticket--info-form-btns'>
                    <Button type="submit" variant={ButtonVariant.PRIMARY}>Create ticket</Button>
                    <Button type="button" variant={ButtonVariant.SECONDARY} onClick={handleCancel}>Cancel</Button>
                </div>}
                {singleTicketData && singleTicketData.status==='Resolved' ? <div className='ticket--info-form-btns'>
                    <Button type="button" variant={ButtonVariant.PRIMARY} onClick={handleReopenTicket}>Reopen ticket</Button>
                </div> : null}
            </form>

        </div>
);
};

export default TicketComponent;

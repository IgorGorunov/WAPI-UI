import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import "./styles.scss";
import {ApiResponseType} from "@/types/api";
import {createTicket, reopenTicket} from "@/services/tickets";
import useAuth from "@/context/authContext";
import {SingleTicketType, TICKET_OBJECT_TYPES, TicketParamsType} from "@/types/tickets";
import Loader from "@/components/Loader";
import {ToastContainer} from "@/components/Toast";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import {Controller, useForm} from "react-hook-form";
import Button, {ButtonVariant} from "@/components/Button/Button";
import DropZone from "@/components/Dropzone";
import {TabFields, TabTitles} from "./TicketTabs";
import {useTabsState} from "@/hooks/useTabsState";
import {CreateTicketFields} from "@/screens/TicketsPage/components/Ticket/TicketFormFields";
import {AttachedFilesType, STATUS_MODAL_TYPES} from "@/types/utility";
import TicketInfoBlock from "@/screens/TicketsPage/components/Ticket/TicketInfoBlock";
import ChatBlock from "@/screens/TicketsPage/components/Chat";
import CardWithHelpIcon from "@/components/CardWithHelpIcon";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import {TicketHints} from "@/screens/TicketsPage/ticketHints.constants";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {sendUserBrowserInfo} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormFieldTypes, WidthType} from "@/types/forms";

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
    seller?: string;
};

const TicketComponent: React.FC<TicketPropsType> = ({subjectType=null, subjectUuid=null, ticketUuid=null, ticketParams, singleTicketData, setDocUuid, subject='', onClose, reFetchTicket, seller}) => {
    const { tenantData: { alias }} = useTenant();
    const {token, superUser, ui, getBrowserInfo, needSeller, sellersList, sellersListActive} = useAuth();

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

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

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
            seller: singleTicketData?.seller || seller || '',
        }
    });

    const topicOptions = useMemo(()=>{
        if (!ticketParams || !ticketParams?.topicsVisibleParam) return [];

        let visibleTopics = [...ticketParams?.topicsVisibleParam.filter(item=>item.CommonSection)];
        if (subjectType) {
            switch (subjectType) {
                case TICKET_OBJECT_TYPES.AmazonPrep :
                    visibleTopics = visibleTopics.filter(item=>item.AP);
                    break;
                case TICKET_OBJECT_TYPES.Fullfilment :
                    visibleTopics = visibleTopics.filter(item=>item.FF);
                    break;
                case TICKET_OBJECT_TYPES.StockMovement :
                    visibleTopics = visibleTopics.filter(item=>item.Movements);
                    break;
                case TICKET_OBJECT_TYPES.Inbound :
                    visibleTopics = visibleTopics.filter(item=>item.Movements);
                    break;
                case TICKET_OBJECT_TYPES.Outbound :
                    visibleTopics = visibleTopics.filter(item=>item.Movements);
                    break;
                case TICKET_OBJECT_TYPES.LogisticService :
                    visibleTopics = visibleTopics.filter(item=>item.Movements);
                    break;
                case TICKET_OBJECT_TYPES.Product :
                    visibleTopics = visibleTopics.filter(item=>item.Products);
                    break;
            }
        }
        return visibleTopics.length ? visibleTopics.map(item => ({label: item.topic, value: item.topic})) : [];
    },[ticketParams, subjectType]);

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
            const requestData = {
                token,
                alias,
                uuid: ticketUuid,
            };
            try {
                sendUserBrowserInfo({...getBrowserInfo('ReopenTicket'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await reopenTicket(superUser && ui ? {...requestData, ui} : requestData);

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
            const requestData = {
                token,
                alias,
                ticket: data
            };

            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateTicket'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await createTicket(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200 && res?.data) {
                //success
                setDocUuid(res.data);
            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Ticket is not created!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
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
                        <div className='' ref={ticketInfoBlockRef}>
                            <>
                                {needSeller() ? (
                                <div className='form-wrapper--seller card'>
                                    <div className='grid-row'>
                                        <Controller
                                            key='seller'
                                            name='seller'
                                            control={control}
                                            render={(
                                                {
                                                    field: {...props},
                                                    fieldState: {error}
                                                }) => (
                                                <FieldBuilder
                                                    // disabled={!!isDisabled}
                                                    {...props}
                                                    name='seller'
                                                    label='Seller *: '
                                                    fieldType={FormFieldTypes.SELECT}
                                                    options={(isDisabled || !!singleTicketData?.seller || !!seller) ? sellersList : sellersListActive}
                                                    placeholder={''}
                                                    errorMessage={error?.message}
                                                    errors={errors}
                                                    disabled={isDisabled || !!singleTicketData?.seller || !!seller}
                                                    width={WidthType.w50}
                                                    classNames={'seller-filter'}
                                                    isClearable={false}
                                                />
                                            )}
                                            rules = {{required: "Required field"}}
                                        />
                                    </div>
                                </div>
                                ) : null}
                            {isTicketNew ?
                                <CardWithHelpIcon classNames='card ticket--info ticket--info-card' >
                                    <div className='ticket--info-form'>

                                        <div className='grid-row'>
                                            <FormFieldsBlock control={control} fieldsArray={createTicketFields}
                                                             errors={errors}/>
                                        </div>
                                    </div>
                                </CardWithHelpIcon>
                            :   <div className='card ticket--info mb-md' ref={ticketInfoBlockRef}>
                                    <div className='ticket--info-info'>
                                        {singleTicketData ? <TicketInfoBlock ticketData={singleTicketData}/> : null}
                                    </div>
                                </div>
                            }</>
                        </div>
                        {isTicketNew ? <div> <CardWithHelpIcon classNames="card ticket--files">
                            <TutorialHintTooltip hint={TicketHints['files'] || ''} position='left' >
                                <h3 className='ticket__block-title title-small'>
                                    <Icon name='files'/>
                                    Files
                                </h3>
                            </TutorialHintTooltip>
                            <div className='dropzoneBlock'>
                                <DropZone readOnly={isDisabled}
                                          files={selectedFiles}
                                          onFilesChange={handleFilesChange}
                                          docUuid={singleTicketData?.uuid}
                                          showSend={true}
                                          allowOnlyFormats={['png', 'jpg', 'jpeg', 'pdf', 'xlsx']}
                                />
                            </div>
                        </CardWithHelpIcon></div> : null}
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
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
);
};

export default TicketComponent;

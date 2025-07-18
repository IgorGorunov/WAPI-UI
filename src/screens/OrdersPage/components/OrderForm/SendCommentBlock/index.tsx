import React, {useCallback, useEffect, useMemo, useState} from "react";
import "./styles.scss";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {Controller, useForm} from "react-hook-form";
import {OrderCommentType, SingleOrderType} from "@/types/orders";
import {createOptions} from "@/utils/selectOptions";
import {SEND_COMMENT_TYPES, SendCommentTypesArray, STATUS_MODAL_TYPES} from "@/types/utility";
import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Button, {ButtonVariant} from "@/components/Button/Button";
import {sendOrderComment} from '@/services/orders';
import {ApiResponseType} from '@/types/api';
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {DateFields, MainFields, ReceiverFields} from "./CommentFields";
import {addWorkingDays, formatDateToString} from "@/utils/date";
import Loader from "@/components/Loader";
import {sendUserBrowserInfo} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";

type SendCommentPropsType = {
    orderData: SingleOrderType;
    countryOptions: OptionType[];
    closeSendCommentModal: ()=>void;
    onSuccess: ()=>void;
};

const SendComment: React.FC<SendCommentPropsType> = ({ orderData, countryOptions, closeSendCommentModal, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { tenantData: { alias }} = useTenant();
    const {token, superUser, ui, getBrowserInfo} = useAuth();

    const availableOptions = orderData.commentCourierServiceFunctionsList.split(';');

    const sendCommentTypeOptions = useMemo(()=> createOptions(SendCommentTypesArray.filter(item=> availableOptions.includes(item))), []);

    //TEMPORARILY !!!
    let commentDate = addWorkingDays((orderData?.nextAvailableDayAfterDays || 0)+1, '14:00'); //14:00 added temporarily. Need data from backend

    const {control, handleSubmit, formState: { errors }, watch} = useForm<OrderCommentType>({
        mode: 'onSubmit',
        defaultValues: {
            order: {
                uuid: orderData?.uuid || '',
            },

            // clientOrderID: orderData?.clientOrderID || '',
            action: sendCommentTypeOptions[0].value as SEND_COMMENT_TYPES,
            comment: '',
            receiver: {
                address: orderData?.receiverAddress || '',
                city: orderData?.receiverCity || '',
                country: orderData?.receiverCountry || '',
                county: orderData?.receiverCounty || '',
                email: orderData?.receiverEMail || '',
                fullName: orderData?.receiverFullName || '',
                phone: orderData?.receiverPhone || '',
                zip: orderData?.receiverZip || '',
            },
            deliveryDate :{
                date: commentDate?.toISOString() ,
                hourFrom: '',
                hourTo: '',
            }
        }
    });

    const curAction = watch('action');

    useEffect (()=>{
        //console.log('action', curAction)
    },[curAction])

    const receiverFields = useMemo(()=>ReceiverFields({countries: countryOptions}),[countryOptions])
    const mainFields = useMemo(()=>MainFields(),[])
    const dateFields = useMemo(()=>DateFields(orderData?.nextAvailableDayAfterDays || 0),[orderData])


    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        closeSendCommentModal();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])


    const onSubmitForm = async (data: OrderCommentType) => {
        setIsLoading(true);

        const sendData: OrderCommentType = {
            order: data.order,
            action: data.action,
            comment: data.comment,
        };

        if (data.action === SEND_COMMENT_TYPES.REDELIVERY_ANOTHER_ADDRESS) {
            sendData.receiver = data.receiver;
        }

        if (data.action === SEND_COMMENT_TYPES.REDELIVERY_SAME_ADDRESS || data.action === SEND_COMMENT_TYPES.REDELIVERY_ANOTHER_ADDRESS) {
            sendData.deliveryDate = {...data.deliveryDate, date: formatDateToString(new Date(data.deliveryDate.date))};
        }

        try {
            const requestData = {
                token: token,
                alias,
                comment: sendData
            };

            try {
                sendUserBrowserInfo({...getBrowserInfo('SendCommentToCourierService', AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await sendOrderComment(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Comment is sent successfully!`, onClose: closeSuccessModal})
                onSuccess();
                setShowStatusModal(true);

            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Something went wrong! Please, try later. `, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="send-comment">
            {isLoading && <Loader />}
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className='grid-row'>
                    <Controller
                        key='action'
                        name='action'
                        control={control}
                        render={(
                            {
                                field: { ...props},
                                fieldState: {error}
                            }) => (
                            <FieldBuilder
                                disabled={false}
                                {...props}
                                name='action'
                                label='Type of comment'
                                fieldType={FormFieldTypes.SELECT}
                                options={sendCommentTypeOptions}
                                placeholder='Select'
                                errorMessage={error?.message}
                                errors={errors}
                                width={WidthType.w100}
                            /> )}
                    />
                </div>
                {curAction===SEND_COMMENT_TYPES.REDELIVERY_ANOTHER_ADDRESS && <div className='grid-row'>
                    <FormFieldsBlock control={control} fieldsArray={receiverFields} errors={errors} isDisabled={false}/>
                </div>}
                <div className='grid-row'>
                    <FormFieldsBlock control={control} fieldsArray={mainFields} errors={errors} isDisabled={false}/>
                </div>
                {(curAction===SEND_COMMENT_TYPES.REDELIVERY_SAME_ADDRESS || curAction === SEND_COMMENT_TYPES.REDELIVERY_ANOTHER_ADDRESS) && <div className='grid-row'>
                    <FormFieldsBlock control={control} fieldsArray={dateFields} errors={errors} isDisabled={false}/>
                </div>}
                <div className='form-submit-btn'>
                    <Button type="submit"  variant={ButtonVariant.PRIMARY}>Send</Button>
                </div>
            </form>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    )
};

export default SendComment;

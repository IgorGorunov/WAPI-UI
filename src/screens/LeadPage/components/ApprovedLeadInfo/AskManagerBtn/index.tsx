import React, {useCallback, useState} from "react";
import "./styles.scss";
import Button, {ButtonVariant} from "@/components/Button/Button";
import Modal from "@/components/Modal";
import useAuth from "@/context/authContext";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {FormFieldTypes, WidthType} from "@/types/forms";
import {SubmitHandler, useForm} from "react-hook-form";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import {sendQuestion} from "@/services/leads";
import {ApiResponseType} from "@/types/api";
import {STATUS_MODAL_TYPES} from "@/types/utility";

type AskManagerFormDataType = {
    questionText: string;
}

export const askManagerFields  = [
    {
        fieldType: FormFieldTypes.TEXT_AREA,
        type: "text",
        name: 'questionText',
        label: "Have a question?  Please, write it here:",
        width: WidthType.w100,
        classNames: "",
    },
];

const AskManagerBtn = () => {
    const {token} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [showAskManagerModal, setShowAskManagerModal] = React.useState(false);
    const [showStatusModal, setShowStatusModal] = React.useState(false);

    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        setShowAskManagerModal(false)
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const handleAskManagerClick = () => {
        setShowAskManagerModal(true);
    }


    const AskManagerForm = () => {
        const {
            control,
            handleSubmit,
            watch,
            formState: { errors },
        } = useForm<AskManagerFormDataType>();

        const questionText = watch('questionText');

        const onSubmit: SubmitHandler<AskManagerFormDataType> = async(data: AskManagerFormDataType) => {
            console.log("Submitted value:", data);
            try {
                setIsLoading(true);
                const res: ApiResponseType = await sendQuestion({token, questionText: data.questionText});
                if (res.status === 200) {
                    //success
                    setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Your question was successfully send! Our manager will contact you soon.`, text: ['We will reach out for any necessary additional information.'], onClose: closeSuccessModal, disableAutoClose: true})
                    setShowStatusModal(true);
                } else if (res.status !== 500) {
                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Something went wrong...`, text: [`Please, try again a bit later`], onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            } catch(err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }

        };

        return (
            <div className={'ask-manager__wrapper'}>
                <form onSubmit={handleSubmit(onSubmit)} className="small-form">
                    <FormFieldsBlock control={control} fieldsArray={askManagerFields} errors={errors} />

                    <div className="ask-manager__btn-wrapper">
                        <Button type="submit" variant={ButtonVariant.PRIMARY} disabled={isLoading || !questionText}>
                            Send
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <>
            <div className='next-button__container'>
                <Button onClick={handleAskManagerClick}>Need help?</Button>
            </div>
            {showAskManagerModal ? (
                <Modal title={'Need help?'} onClose={() => setShowAskManagerModal(false)}>
                    <AskManagerForm />
                </Modal>
            ) : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}

        </>
    );
};

export default AskManagerBtn;
import React, {useCallback, useState} from "react";
import {FormFieldTypes, WidthType} from "@/types/forms";
import useAuth from "@/context/authContext";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Button from "@/components/Button/Button";

import "./styles.scss";
import {ApiResponseType} from "@/types/api";
import {sendNote} from "@/services/notes";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";

type NotePropsType = {
    uuid: string;
    onCloseOnSuccess?: ()=>void;
}
const Note: React.FC<NotePropsType> = ({uuid, onCloseOnSuccess}) => {

    const { token } = useAuth();
    const [noteText, setNoteText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})

    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const handleSubmit = async () => {

        try {
            setIsLoading(true);
            const res: ApiResponseType = await sendNote({token, uuid: uuid, note: noteText });
            console.log('note res', res)

            if (res?.status === 200) {
                //success
                // setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Note is successfully created!`, onClose: onCloseOnSuccess})
                // setShowStatusModal(true);
                onCloseOnSuccess();

            } else  {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Something went wrong!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`create-note`}>
            <div className='grid-row'>
                <FieldBuilder
                    name='note'
                    label='Note'
                    fieldType={FormFieldTypes.TEXT_AREA}
                    isRequired={true}
                    value={noteText}
                    width={WidthType.w100}
                    rows={6}
                    onChange={(val: string)=>setNoteText(val)}
                />
            </div>
            <div className="note-submit">
                <Button
                    type="button"
                    disabled={isLoading || !noteText}
                    onClick={handleSubmit}
                >
                   Create note
                </Button>
            </div>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
);
};

export default Note;

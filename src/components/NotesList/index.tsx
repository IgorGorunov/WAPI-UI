import React, {useState} from "react";
import "./styles.scss";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";
import {NoteType} from "@/types/notes";
import Button, { ButtonVariant} from "@/components/Button/Button";
import Modal from "@/components/Modal";
import Note from "@/components/NotesList/Note";
import {useTranslations} from "next-intl";
type NotesListPropsType = {
    object?: string;
    notes?: NoteType[];
    refetch?: ()=>void;
}

const NotesList: React.FC<NotesListPropsType> = ({object, notes, refetch}) => {
    const t = useTranslations('Fulfillment.orderTabsInfo.notes');

    const [showCreateNoteModal, setCreateNoteModal] = useState(false);

    const handleCreateNewNote = () => {
        setCreateNoteModal(true);
    }

    const onModalCloseOnSuccess = () => {
        setCreateNoteModal(false);
        if (refetch) refetch();
    }

    const onModalClose = () => {
        setCreateNoteModal(false);
    }

    return (
        <div className="user-notes">
            <div className='user-notes__create-btn form-table--btns'>
                <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight onClick={handleCreateNewNote} >{t('createNewNote')}</Button>
            </div>
            {notes && notes.length ?
                <>
                    <div className="user-notes__list-header">
                        <div className='date-column'>{t('period')}</div>
                        <div className='column user-column'>{t('user')}</div>
                        <div className='column comment-column'>{t('note')}</div>
                    </div>
                    <ul className="user-notes__list">
                        {notes.sort((a,b)=>a.period<b.period ? 1 : -1).map((note: NoteType, index)=> (
                                <li
                                    key={note.period + "_" + index}
                                    className={`user-notes__list-item ${
                                        index % 2 === 1 ? "highlight" : " "
                                    }`}
                                >
                                    <div className='date-column'>{formatDateTimeToStringWithDotWithoutSeconds(note.period)}</div>
                                    <div className='column user-column'>{note.user}</div>
                                    <div className='column comment-column'>{note.note}</div>
                                </li>
                            ))}
                    </ul></>
                : <p className='user-notes__empty'>{t('noNotesYet')}</p>
            }

            {showCreateNoteModal ? <Modal title={t('createNote')} onClose={onModalClose} >
                <Note uuid={object} onCloseOnSuccess={onModalCloseOnSuccess}/>
            </Modal> : null}
        </div>
    );
};
export default NotesList;

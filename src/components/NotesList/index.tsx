import React, {useState} from "react";
import "./styles.scss";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";
import {NoteType} from "@/types/notes";
import Button, { ButtonVariant} from "@/components/Button/Button";
import Modal from "@/components/Modal";
import Note from "@/components/NotesList/Note";
type NotesListPropsType = {
    object?: string;
    notes?: NoteType[];
    refetch?: ()=>void;
}

const NotesList: React.FC<NotesListPropsType> = ({object, notes, refetch}) => {

    const [showCreateNoteModal, setCreateNoteModal] = useState(false);

    const handleCreateNewNote = () => {
        setCreateNoteModal(true);
    }

    const onModalCloseOnSuccess = () => {
        setCreateNoteModal(false);
        if (refetch) refetch();
        console.log('111')
    }

    const onModalClose = () => {
        setCreateNoteModal(false);
    }

    return (
        <div className="user-notes">
            <div className='user-notes__create-btn form-table--btns'>
                <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight onClick={handleCreateNewNote} >Create new note</Button>
            </div>
            {notes && notes.length ?
                // <ul className='user-notes-list'>
                //     {notes.map((note: NoteType, index) => <Accordion key={`${note.period}_${index}`} title={`Note from ${formatDateTimeToStringWithDotWithoutSeconds(note.period)}.   User ${note.user}`} ><p className='user-notes__note'>{note.note}</p></Accordion>)}
                // </ul>
                <>
                    <div className="user-notes__list-header">
                        <div className='date-column'>Period</div>
                        <div className='column user-column'>User</div>
                        <div className='column comment-column'>Note</div>

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
                : <p className='user-notes__empty'>You don't have any notes yet.</p>
            }

            {showCreateNoteModal ? <Modal title={`Create note`} onClose={onModalClose} >
                <Note uuid={object} onCloseOnSuccess={onModalCloseOnSuccess}/>
            </Modal> : null}
        </div>
    );
};
export default NotesList;

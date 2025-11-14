import React, {useEffect, useRef, useState} from "react";
import "./styles.scss";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {sendTicketMessage} from "@/services/tickets";
import {ApiResponseType} from "@/types/api";
import Loader from "@/components/Loader";
import Icon from "@/components/Icon";
import ModalPreview from "@/components/ModalPreview";
import {arrayBufferToBase64, readFileAsArrayBuffer} from "@/utils/files";
import {CHAT_FILE_TYPES} from "@/types/tickets";
//import EmojiPicker from './EmojiPicker';
import ModalStatus from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import {sendUserBrowserInfo} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";

type SendMessagePropsType = {
    objectUuid: string;
    onSendMessage: ()=>void;
    showEmojiPicker: boolean;
    setShowEmojiPicker: (val:boolean)=>void;
    canEdit?: boolean;
}



type ChatFileType = {
    file: File;
    fileType: CHAT_FILE_TYPES;
    imgSrc?: string;
    name?: string;
}

const SendMessageBlock: React.FC<SendMessagePropsType> = ({objectUuid, onSendMessage, canEdit}) => {
    const { tenantData: { alias }} = useTenant();
    const {token, superUser, ui, getBrowserInfo, isActionIsAccessible} = useAuth();

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(false)
    const [userInput, setUserInput] = useState('');
    const [files, setFiles] = useState<ChatFileType[]>(null);
    const [selectedFile, setSelectedFile] = useState<ChatFileType|null>(null);

    const AllowedFileExtensions = ['txt', 'xls', 'xlsx', 'doc', 'docx'];
    const isFileAllowed = (fileName: string) => {
        const fileNameArray = fileName.split('.');
        if (fileNameArray.length > 1) {
            return AllowedFileExtensions.includes(fileNameArray[fileNameArray.length-1].toLowerCase());
        }

        return false;
    }

    const [showFileTypeError, setShowFileTypeError] = useState(false);
    const handleCloseErrorModal = () => { setShowFileTypeError(false)};

    useEffect(() => {
        setFiles([]);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> | string) => {
        if (typeof e === 'string' || e instanceof String) {
            setUserInput(e as string);
        }
        else if (e && (e?.target?.value || e?.target?.value==='')) {
            setUserInput(e.target.value);
        }
    };

    const sendMessage = async(e) => {
        e.preventDefault();

        if (!isActionIsAccessible(AccessObjectTypes.Tickets, AccessActions.EditObject)) {
            return null;
        }

        //attached files
        const attachedFiles = await Promise.all(
            files && files.length ? files.map(async (file, index) => {
                const arrayBuffer = await readFileAsArrayBuffer(file.file);
                const base64String = arrayBufferToBase64(arrayBuffer);

                if (file.file.name.split('.').pop().toLowerCase() === 'csv') {
                    return null;
                }

                return {
                    id: file.file.name,
                    name: file.file.name.toLowerCase() === 'image.png' ? `Screenshot_${index}.png` : file.file.name,
                    type: file.file.type,
                    data: base64String,
                };
            }) : []
        );

        try {
            const requestData = {
                token,
                alias,
                message: userInput,
                objectUuid,
                attachedFiles,
            };

            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateMessageForObject'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await sendTicketMessage(superUser && ui ? {...requestData, ui} : requestData);
            if (res.status === 200) {
                onSendMessage();
                setFiles(null);
            }
        } catch (error) {
            console.error("Error fetching data:", error);

        } finally {
            setIsLoading(false);
        }

        setUserInput('');
    }

    // const handleFiles = () => {
    //
    // }

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        console.log("event: ",e);
        e.preventDefault();
        const items = e?.clipboardData?.items;
        if (!items || !canEdit) return;

        const newFiles: ChatFileType[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (!file) continue;
                e.preventDefault();
                //newFiles.push(file);
                if (file.type.startsWith('image')) {
                    const imageUrl = URL.createObjectURL(file);
                    newFiles.push({file: file, fileType: CHAT_FILE_TYPES.IMAGE, imgSrc: imageUrl} as ChatFileType)
                } else if ((file.type === 'application/pdf')) {
                    const pdfUrl = URL.createObjectURL(file);
                    newFiles.push({file: file, fileType: CHAT_FILE_TYPES.PDF, imgSrc: pdfUrl} as ChatFileType)
                } else {
                    if (!isFileAllowed(file.name)) { setShowFileTypeError(true); continue;}
                    newFiles.push({file: file, fileType: CHAT_FILE_TYPES.OTHER} as ChatFileType)
                }
            }
        }

        setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!canEdit) return;

        const droppedFiles = Array.from(e.dataTransfer.files);
        const newFiles: ChatFileType[] = [];

        for (let i = 0; i < droppedFiles.length; i++) {
            const file = droppedFiles[i];

            if (file.type.startsWith('image')) {
                const imageUrl = URL.createObjectURL(file);
                newFiles.push({file: file, fileType: CHAT_FILE_TYPES.IMAGE, imgSrc: imageUrl} as ChatFileType)
            } else if ((file.type === 'application/pdf')) {
                const pdfUrl = URL.createObjectURL(file);
                newFiles.push({file: file, fileType: CHAT_FILE_TYPES.PDF, imgSrc: pdfUrl} as ChatFileType)
            } else {
                if (!isFileAllowed(file.name)) { setShowFileTypeError(true); continue;}
                newFiles.push({file: file, fileType: CHAT_FILE_TYPES.OTHER} as ChatFileType)
            }
        }

        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleFileClick = (index: number) => {
        setSelectedFile(files[index]);
    };

    const handleCloseModal = () => {
        setSelectedFile(null);
    };

    // const onAddEmoji = (emoji: string) => {
    //     const cursorPos = inputRef.current.selectionStart;
    //     const textBeforeCursor = userInput.substring(0, cursorPos);
    //     const textAfterCursor = userInput.substring(cursorPos);
    //     setUserInput(textBeforeCursor + emoji + textAfterCursor);
    //     inputRef.current.focus();
    //     inputRef.current.selectionStart = cursorPos + emoji.length;
    // }

    //const [showEmojiPicket, setShowEmojiPicker] = useState(false);

    return (
        <div className="send-message-block" ref={dropRef} onDrop={handleDrop}>
            {isLoading && <Loader/>}
            <div className='send-message-block__text-block'>
                <textarea
                    className={`send-message__input`}
                    name={'chat-message-input'}
                    rows={3}
                    value={userInput}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    onDragOver={(e) => e.preventDefault()}
                    ref={inputRef}
                    disabled={!canEdit}
                />
                <button type='button' className={`send-message__btn`} disabled={!canEdit || !userInput && (!files || !files.length)} onClick={sendMessage}><Icon
                    name={'send'}/>
                </button>
                {/*<button type='button' className={'emoji-btn'} onClick={()=>setShowEmojiPicker(!showEmojiPicker)}>*/}
                {/*    <Icon name='emoji' />*/}
                {/*</button>*/}
            </div>
            {/*{showEmojiPicker ? <EmojiPicker onEmojiClick={onAddEmoji} />: null}*/}
            <div className={`send-message__file-preview`} onDrop={handleDrop}
                 onDragOver={(e) => e.preventDefault()}>
                {files && files.length ? files.map((file, index) => (
                    <div key={index} className="file-container">
                        {file.fileType === CHAT_FILE_TYPES.IMAGE ?
                            <div className="send-message__file-preview-image" onClick={() => handleFileClick(index)}>
                                <img className={`send-message__file-preview-image__img`} src={file.imgSrc}
                                     alt={`Pasted Screenshot ${index + 1}`}
                                />
                            </div>
                            :
                            <div className={`send-message__file-preview-file ${file.fileType === CHAT_FILE_TYPES.PDF ? 'pdf' : ''}`} onClick={() => handleFileClick(index)}>
                                <Icon name='files'/>
                                <div>{file.file.name}</div>
                                {/*<div>{file.file.type}</div>*/}
                            </div>
                        }
                        <button className='file-container__remove-file'
                                onClick={() => removeFile(index)}><Icon name='waste-bin'/></button>
                    </div>
                )) : null}

            </div>
            {selectedFile && (
                <ModalPreview onClose={handleCloseModal}>
                    {selectedFile.fileType === CHAT_FILE_TYPES.IMAGE ?
                        <img src={selectedFile.imgSrc} alt="Selected Image"/> :

                        selectedFile.fileType === CHAT_FILE_TYPES.PDF ?

                        <iframe
                            src={selectedFile.imgSrc}
                            title="Selected PDF"
                            style={{width: '100%', height: '100%'}}
                        />
                            :null
                    }
                </ModalPreview>

            )}
            {showFileTypeError && <ModalStatus statusModalType={STATUS_MODAL_TYPES.ERROR} title={'Error'} subtitle='File of this type is not allowed. You can add only images, PDF, .txt, .docx, .xlsx files.' onClose={handleCloseErrorModal} />}
        </div>
    );
};

export default SendMessageBlock

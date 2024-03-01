import React, {useEffect, useRef, useState} from "react";
import "./styles.scss";
import useAuth from "@/context/authContext";
import TextArea from "@/components/FormBuilder/TextArea";
import {sendTicketMessage} from "@/services/tickets";
import {verifyToken} from "@/services/auth";
import {verifyUser} from "@/utils/userData";
import {Routes} from "@/types/routes";
import {ApiResponseType} from "@/types/api";
import {useRouter} from "next/router";
import Loader from "@/components/Loader";
import Icon from "@/components/Icon";
import ModalPreview from "@/components/ModalPreview";

type SendMessagePropsType = {
    objectUuid: string;
    onSendMessage: ()=>void;
}

const enum CHAT_FILE_TYPES {
    PDF = 'application/pdf',
    IMAGE = 'image',
    OTHER = 'other',
}

type ChatFileType = {
    file: File;
    fileType: CHAT_FILE_TYPES;
    imgSrc?: string;
    name?: string;
}

const SendMessageBlock: React.FC<SendMessagePropsType> = ({objectUuid, onSendMessage}) => {
    const {token, currentDate} = useAuth();
    const Router = useRouter();

    const inputRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(false)
    const [userInput, setUserInput] = useState('');
    const [files, setFiles] = useState<ChatFileType[]>(null);
    const [selectedFile, setSelectedFile] = useState<ChatFileType|null>(null);

    useEffect(() => {
        setFiles([]);
    }, []);

    useEffect(() => {
        //setSendHeight(sendTicketBlockRef.current.clientHeight);
        console.log('test - test', inputRef.current.clientHeight);
    }, [files]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> | string) => {
        if (typeof e === 'string' || e instanceof String) {
            setUserInput(e as string);
        }
        else if (e && e?.target?.value) {
            setUserInput(e.target.value);
        }
    };

    const readFileAsArrayBuffer = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const arrayBufferToBase64 = (arrayBuffer) => {
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const sendMessage = async(e) => {
        console.log('send message:', userInput);
        e.preventDefault();

        //attached files
        const attachedFiles = await Promise.all(
            files ? files.map(async (file, index) => {
                const arrayBuffer = await readFileAsArrayBuffer(file.file);
                const base64String = arrayBufferToBase64(arrayBuffer);

                if (file.file.name.split('.').pop().toLowerCase() === 'csv') {
                    return null;
                }

                return {
                    id: file.file.name,
                    name: file.file.name.toLowerCase() === 'image.png' ? `Screenshot ${index}` : file.file.name,
                    type: file.file.type.split('/')[0],
                    data: base64String,
                };
            }) : []
        );

        try {
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponseType = await sendTicketMessage(
                {
                    token: token,
                    message: userInput,
                    objectUuid: objectUuid,
                    attachedFiles: attachedFiles,
                }
            );
            if (res.status === 200) {
                onSendMessage();
            }
        } catch (error) {
            console.error("Error fetching data:", error);

        } finally {
            setIsLoading(false);
        }

        setUserInput('');
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;

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
                    console.log('image: ', file);
                    newFiles.push({file: file, fileType: CHAT_FILE_TYPES.IMAGE, imgSrc: imageUrl} as ChatFileType)
                } else if ((file.type === 'application/pdf')) {
                    const pdfUrl = URL.createObjectURL(file);
                    console.log('pdf preview',  pdfUrl);
                    newFiles.push({file: file, fileType: CHAT_FILE_TYPES.PDF, imgSrc: pdfUrl} as ChatFileType)
                } else {
                    newFiles.push({file: file, fileType: CHAT_FILE_TYPES.OTHER} as ChatFileType)
                }
            }
        }

        setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const newFiles: ChatFileType[] = [];

        for (let i = 0; i < droppedFiles.length; i++) {
            const file = droppedFiles[i];
            if (file.type.startsWith('image')) {
                const imageUrl = URL.createObjectURL(file);
                console.log('image: ', file);
                newFiles.push({file: file, fileType: CHAT_FILE_TYPES.IMAGE, imgSrc: imageUrl} as ChatFileType)
            } else if ((file.type === 'application/pdf')) {
                const pdfUrl = URL.createObjectURL(file);
                console.log('pdf preview',  pdfUrl);
                newFiles.push({file: file, fileType: CHAT_FILE_TYPES.PDF, imgSrc: pdfUrl} as ChatFileType)
            } else {
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

    return (
        <div className="send-message-block" ref={inputRef}>
            {isLoading && <Loader/>}
            <div className='send-message-block__text-block'>
                <TextArea
                    classNames={`send-message__input`}
                    name={'chat-message-input'}
                    textAriaHeight={3}
                    value={userInput}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                />
                <button className={`send-message__btn`} disabled={!userInput && (!files || !files.length)} onClick={sendMessage}><Icon
                    name={'send'}/>
                </button>
            </div>
            <div className={`send-message__file-preview`} onDrop={handleDrop}
                 onDragOver={(e) => e.preventDefault()}>
                {files ? files.map((file, index) => (
                    <div key={index} className="file-container">
                        {file.fileType === CHAT_FILE_TYPES.IMAGE ?
                            <div className="send-message__file-preview-image" onClick={() => handleFileClick(index)}>
                                <img className={`send-message__file-preview-image__img`} src={file.imgSrc}
                                     alt={`Pasted Screenshot ${index + 1}`}
                                />
                            </div>
                            :
                            <div className="send-message__file-preview-file" onClick={() => handleFileClick(index)}>
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

        </div>
    );
};

export default SendMessageBlock

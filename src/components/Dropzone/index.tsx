import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileDisplay from '@/components/FileDisplay';
import './styles.scss';
import Icon from '@/components/Icon'
import Loader from "@/components/Loader";
import {arrayBufferToBase64, readFileAsArrayBuffer} from "@/utils/files";
import Button from "@/components/Button/Button";
import {sendDocumentFiles} from "@/services/files";
import {verifyToken} from "@/services/auth";
import {verifyUser} from "@/utils/userData";
import {ApiResponseType} from "@/types/api";
import {AttachedFilesType, STATUS_MODAL_TYPES} from "@/types/utility";
import useAuth from "@/context/authContext";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";

const DropZone = ({ files, onFilesChange , readOnly = false, hint='', banCSV=false, docUuid = '', showSend=false}) => {
    const { token, currentDate } = useAuth();

    const [isDragging, setIsDragging] = useState(false);
    const inputId = `file-input__${Date.now().toString()}`;

    const [addedFiles, setAddedFiles] = useState<AttachedFilesType[]>([]);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    // const closeSuccessModal = useCallback((isImport=false)=>{
    //     setShowStatusModal(false);
    //     !isImport && closeDocModal();
    // }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (readOnly && !docUuid) {
            return;
        }
        setIsDragging(true);

        const updatedFiles = await Promise.all(
            acceptedFiles.map(async (file) => {
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const base64String = arrayBufferToBase64(arrayBuffer);

                if (banCSV && file.name.split('.').pop().toLowerCase() === 'csv') {
                    return null;
                }

                return {
                    id: file.name,
                    name: file.name,
                    type: file.type.split('/')[0],
                    data: base64String,
                };
            })
        );

        setIsDragging(false);

        setAddedFiles( prevState => [...prevState, ...updatedFiles.filter(file => file)])

        onFilesChange((prevFiles) => [...prevFiles, ...updatedFiles.filter(file => file)]);
    }, [readOnly]);

    const onPaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {

        if (readOnly && !docUuid) {
            return;
        }
        setIsDragging(true);

        const items = e.clipboardData?.items;
        if (!items) return;

        const newFiles= [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (!file) continue;
                if (banCSV && file.name.split('.').pop().toLowerCase() === 'csv') {
                    continue;
                }
                e.preventDefault();
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const base64String = arrayBufferToBase64(arrayBuffer);
                newFiles.push({
                    id: file.name,
                    name: file.name.toLowerCase() === 'image.png' ? `Screenshot_${files.length + i}.png` : file.name,
                    type: file.type,
                    data: base64String,
                })
            }
        }
        setIsDragging(false);

        setAddedFiles( prevState => [...prevState, ...newFiles.filter(file => file)])

        onFilesChange((prevFiles) => [...prevFiles, ...newFiles.filter(file => file)]);
    }, [readOnly, files]);

    const onFileDelete = (event: React.MouseEvent<HTMLButtonElement>, file: any, index: number) => {
        event.preventDefault();
        if (readOnly && !docUuid) {
            return;
        }


        const removedFiles = addedFiles.filter(item => item===file);

        console.log('removed ', file, removedFiles)

        if (removedFiles.length) {
            setAddedFiles(prevState => [...prevState.filter(item => item!==file)]);

            const updatedFiles = files.filter((_, i) => i !== index);
            onFilesChange(updatedFiles);

        } else if (!readOnly) {
            const updatedFiles = files.filter((_, i) => i !== index);
            onFilesChange(updatedFiles);
        }

        // const updatedFiles = files.filter((_, i) => i !== index);
        // onFilesChange(updatedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    const handleDivClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const openFileDialog = (event) => {
        event.preventDefault();
        if (readOnly && !docUuid) {
            return;
        }
        document.getElementById(inputId)?.click();
    };

    const handleSendDocFile = async() => {
        if (docUuid && readOnly && addedFiles.length) {
            sendDocumentFiles

            try {
                setIsDragging(true);
                //verify token
                const responseVerification = await verifyToken(token);
               verifyUser(responseVerification, currentDate)

                const res: ApiResponseType = await sendDocumentFiles(
                    {
                        token,
                        uuid: docUuid,
                        attachedFiles: addedFiles,
                    }
                );

                if (res?.status === 200) {
                   //success
                    setAddedFiles([]);
                    setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Files are successfully send`, onClose: ()=>setShowStatusModal(false)})
                    setShowStatusModal(true);
                } else if (res && 'response' in res ) {

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsDragging(false);
            }
        }
    }



    useEffect(() => {
    }, [files, onFilesChange]);

    return (
        <>
            <div onClick={handleDivClick} onPaste={onPaste} className={`dropzone-container ${readOnly ? 'read-only' : ''}`}>
                {isDragging && <Loader />}
                <div
                    {...getRootProps()}
                    onClick={handleDivClick}
                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                >
                    <input {...getInputProps()} id={inputId} />
                    {files && files.length == 0 &&  (<div className="circle"  onClick={openFileDialog} >
                        <Icon name='upload'/>
                    </div>)}
                    <div onClick={openFileDialog} className='dropzone-title'>
                        <p>Drop or paste files here</p>
                        {hint ? <p className='hint'>{hint}</p> : null}
                    </div>
                    {files && files.length > 0 && (
                        <FileDisplay files={files} onFileDelete={onFileDelete} addedFiles={addedFiles}/>
                    )}
                </div>
            </div>
            {(readOnly || showSend) && docUuid && addedFiles.length ?
                <div className='dropzone__btns'><Button onClick={handleSendDocFile}>Send files</Button></div>
            : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </>
    );
};

export default React.memo(DropZone);

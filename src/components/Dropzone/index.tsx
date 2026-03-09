import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileDisplay from '@/components/FileDisplay';
import './styles.scss';
import Icon from '@/components/Icon'
import Loader from "@/components/Loader";
import { arrayBufferToBase64, readFileAsArrayBuffer } from "@/utils/files";
import Button from "@/components/Button/Button";
import { sendDocumentFiles } from "@/services/files";
import { AttachedFilesType, STATUS_MODAL_TYPES } from "@/types/utility";
import useAuth from "@/context/authContext";
import ModalStatus, { ModalStatusType } from "@/components/ModalStatus";
import { toast, ToastContainer } from "@/components/Toast";
import useTenant from "@/context/tenantContext";

interface DropZoneProps {
    files: AttachedFilesType[];
    onFilesChange: (files: AttachedFilesType[]) => void;
    readOnly?: boolean;
    hint?: string;
    banCSV?: boolean;
    docUuid?: string;
    showSend?: boolean;
    allowOnlyFormats?: string[];
    listType?: boolean;
    title?: string;
    onFileMoved?: (fileId: string) => void;
    needSendBtn?: boolean;
}

const DropZone = ({ files, onFilesChange, readOnly = false, hint = '', banCSV = false, docUuid = '', showSend = false, allowOnlyFormats = [] as string[], listType, title, onFileMoved, needSendBtn = true }: DropZoneProps) => {
    const { token, superUser, ui } = useAuth();
    const { tenantData: { alias } } = useTenant();

    const [isDragging, setIsDragging] = useState(false);
    const inputId = `file-input__${Date.now().toString()}`;

    const [addedFiles, setAddedFiles] = useState<AttachedFilesType[]>([]);

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    // const closeSuccessModal = useCallback((isImport=false)=>{
    //     setShowStatusModal(false);
    //     !isImport && closeDocModal();
    // }, []);

    const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any, event: any) => {
        if (readOnly && !docUuid) {
            return;
        }

        if (acceptedFiles.length === 0) return;

        setIsDragging(true);

        const updatedFiles = await Promise.all(
            acceptedFiles.map(async (file) => {
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const base64String = arrayBufferToBase64(arrayBuffer);

                const fileExtension = file.name.split('.').pop().toLowerCase();

                if (banCSV && fileExtension === 'csv' || allowOnlyFormats.length && !allowOnlyFormats.includes(fileExtension)) {
                    toast.warn(`${fileExtension.toUpperCase()} files aren't allowed!`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    return null;
                }

                return {
                    id: file.name,
                    name: file.name,
                    type: file.type.split('/')[0],
                    data: base64String,
                    isNew: true,
                };
            })
        );

        setIsDragging(false);

        setAddedFiles(prevState => [...prevState, ...updatedFiles.filter(file => file)])

        onFilesChange([...files, ...updatedFiles.filter((file: AttachedFilesType | null) => file)] as AttachedFilesType[]);
    }, [readOnly, files, onFilesChange, banCSV, allowOnlyFormats]);

    const onPaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
        if (readOnly && !docUuid) {
            return;
        }
        setIsDragging(true);

        const items = e.clipboardData?.items;
        if (!items) return;

        const newFiles = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (!file) continue;
                const fileExtension = file.name.split('.').pop().toLowerCase();
                if (banCSV && fileExtension === 'csv' || allowOnlyFormats.length && !allowOnlyFormats.includes(fileExtension)) {
                    toast.warn(`${fileExtension.toUpperCase()} files aren't allowed!`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
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
                    isNew: true,
                })
            }
        }
        setIsDragging(false);

        setAddedFiles(prevState => [...prevState, ...newFiles.filter(file => file)])

        onFilesChange([...files, ...newFiles.filter(file => file)]);
    }, [readOnly, files, onFilesChange, banCSV, allowOnlyFormats]);

    const onFileDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, file: AttachedFilesType, index: number) => {
        event.preventDefault();
        if (readOnly && !docUuid && !file.isNew) {
            return;
        }

        const removedFiles = addedFiles.filter(item => item.id === file.id);

        if (removedFiles.length) {
            setAddedFiles(prevState => prevState.filter(item => item.id !== file.id));

            const updatedFiles = files.filter((_, i) => i !== index);
            onFilesChange(updatedFiles);

        } else if (!readOnly || file.isNew) {
            const updatedFiles = files.filter((_, i) => i !== index);
            onFilesChange(updatedFiles);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });



    const handleNativeDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const fileId = (window as any).__WAPI_DRAGGED_FILE_ID || event.dataTransfer?.getData('wapi/file-id');
        // if (fileId && onFileMoved && !readOnly) {
        if (fileId && onFileMoved) {
            event.preventDefault();
            event.stopPropagation();
            onFileMoved(fileId);
            (window as any).__WAPI_DRAGGED_FILE_ID = null;
        }
    };

    const handleNativeDragOverEnter = (event: React.DragEvent<HTMLDivElement>) => {
        if ((window as any).__WAPI_DRAGGED_FILE_ID) {
            event.preventDefault();
            event.stopPropagation();
        }
    };



    const openFileDialog = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (readOnly && !docUuid) {
            return;
        }
        document.getElementById(inputId)?.click();
    };

    const handleSendDocFile = async () => {
        if (docUuid && (readOnly || showSend) && addedFiles.length) {
            //sendDocumentFiles

            try {
                setIsDragging(true);
                const requestData = {
                    token,
                    alias,
                    uuid: docUuid,
                    attachedFiles: addedFiles,
                }
                const res = await sendDocumentFiles(superUser && ui ? { ...requestData, ui } : requestData);

                if (res?.status === 200) {
                    //success
                    setAddedFiles([]);
                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Files are successfully send`, onClose: () => setShowStatusModal(false) })
                    setShowStatusModal(true);
                } else if (res && 'response' in res) {

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsDragging(false);
            }
        }
    }


    useEffect(() => {
        setAddedFiles(prev => prev.filter(addedFile => files.some(f => f.id === addedFile.id)));
    }, [files, onFilesChange]);

    return (
        <div className={`dropzone-wrapper${listType ? ' is-list' : ''}`}>
            <ToastContainer />
            <div
                onClick={openFileDialog}
                onPaste={onPaste}
                className={`dropzone-container ${readOnly ? 'read-only' : ''} ${readOnly && !docUuid ? 'is-disabled' : ''} ${listType ? 'is-list' : ''}`}
                onDropCapture={handleNativeDrop}
                onDragOverCapture={handleNativeDragOverEnter}
                onDragEnterCapture={handleNativeDragOverEnter}
            >
                {isDragging && <Loader />}
                <div
                    {...getRootProps()}
                    onClick={openFileDialog}
                    className={`dropzone ${isDragActive ? 'active' : ''} ${listType ? 'is-list' : ''}`}
                >
                    <input {...getInputProps()} id={inputId} disabled={readOnly && !docUuid} />
                    {files && files.length == 0 && (<div className="circle" onClick={openFileDialog}>
                        <Icon name='upload' />
                    </div>)}
                    <div onClick={openFileDialog} className={`dropzone-title ${listType ? 'is-list' : ''}`}>
                        {title ? <p className="extra-title">{title}</p> : null}
                        {/*{title ? <p>{title}</p> : <p>Drop or paste files here</p>}*/}
                        <p>Drop or paste files here</p>
                        {hint ? <p className='hint'>{hint}</p> : null}
                    </div>
                    {files && files.length > 0 && (
                        <FileDisplay files={files} onFileDelete={onFileDelete} addedFiles={addedFiles} listType={listType} />
                    )}
                </div>
            </div>
            {needSendBtn && (readOnly || showSend) && docUuid && addedFiles.length ?
                <div className='dropzone__btns'><Button onClick={handleSendDocFile}>Send files</Button></div>
                : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </div>
    );
};

export default React.memo(DropZone);

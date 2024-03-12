import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileDisplay from '@/components/FileDisplay';
import './styles.scss';
import Icon from '@/components/Icon'
import Loader from "@/components/Loader";
import {arrayBufferToBase64, readFileAsArrayBuffer} from "@/utils/files";
import {CHAT_FILE_TYPES} from "@/types/tickets";

const DropZone = ({ files, onFilesChange , readOnly = false, hint='', banCSV=false}) => {
    //const [selectedFilesInner, setSelectedFilesInner] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const inputId = `file-input__${Date.now().toString()}`;
    // useEffect(() => {
    //     if (files) {
    //         setSelectedFilesInner(files);
    //     }
    // }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (readOnly) {
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

        onFilesChange((prevFiles) => [...prevFiles, ...updatedFiles.filter(file => file)]);
    }, [readOnly]);

    const onPaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {

        if (readOnly) {
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

        onFilesChange((prevFiles) => [...prevFiles, ...newFiles.filter(file => file)]);
    }, [readOnly, files]);

    const onFileDelete = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        event.preventDefault();
        if (readOnly) {
            return;
        }

        const updatedFiles = files.filter((_, i) => i !== index);
        onFilesChange(updatedFiles);
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
        if (readOnly) {
            return;
        }
        document.getElementById(inputId)?.click();
    };

    // const readFileAsArrayBuffer = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = () => resolve(reader.result);
    //         reader.onerror = reject;
    //         reader.readAsArrayBuffer(file);
    //     });
    // };
    //
    // const arrayBufferToBase64 = (arrayBuffer) => {
    //     const bytes = new Uint8Array(arrayBuffer);
    //     let binary = '';
    //     for (let i = 0; i < bytes.length; i++) {
    //         binary += String.fromCharCode(bytes[i]);
    //     }
    //     return btoa(binary);
    // };

    useEffect(() => {
    }, [files, onFilesChange]);

    return (
        <div onClick={handleDivClick} onPaste={onPaste} className="dropzone-container">
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
                    <FileDisplay files={files} onFileDelete={onFileDelete} />
                )}
            </div>
        </div>
    );
};

export default React.memo(DropZone);

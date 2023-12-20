import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileDisplay from '@/components/FileDisplay';
import './styles.scss';
import Icon from '@/components/Icon'
import Skeleton from "@/components/Skeleton/Skeleton";

const DropZone = ({ files, onFilesChange , readOnly = false}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (files) {
            setSelectedFiles(files);
        }
    }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (readOnly) {
            return;
        }
        setIsDragging(true);
        const updatedFiles = await Promise.all(
            acceptedFiles.map(async (file) => {
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const base64String = arrayBufferToBase64(arrayBuffer);

                return {
                    id: file.name,
                    name: file.name,
                    type: file.type.split('/')[0],
                    data: base64String,
                };
            })
        );

        setIsDragging(false);

        setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    }, [readOnly]);

    const onFileDelete = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        event.preventDefault();
        if (readOnly) {
            return;
        }

        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
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
        document.getElementById('file-input')?.click();
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

    useEffect(() => {
        if (onFilesChange) {
            onFilesChange(selectedFiles);
        }
    }, [selectedFiles, onFilesChange]);

    return (
        <div onClick={handleDivClick} className="dropzone-container">
            {isDragging && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    zIndex: 1000,
                }}>
                    <Skeleton type="files-uploading" width="500px" height="300px" />
                </div>
            )}
            <div
                {...getRootProps()}
                onClick={handleDivClick}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
                <input {...getInputProps()} id="file-input" />
                {selectedFiles.length == 0 &&  (<div className="circle"  onClick={openFileDialog} >
                    <Icon name='upload'/>
                </div>)}
                <p onClick={openFileDialog}>Drop files here</p>
                {selectedFiles.length > 0 && (
                    <FileDisplay files={selectedFiles} onFileDelete={onFileDelete} />
                )}
            </div>
        </div>
    );
};

export default React.memo(DropZone);

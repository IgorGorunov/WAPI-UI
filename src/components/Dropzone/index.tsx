import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileDisplay from '@/components/FileDisplay';
import './styles.scss';

const DropZone: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        const updatedFiles = acceptedFiles.map((file) => ({
            id: file.name,
            name: file.name,
            type: file.type.split('/')[0],
        }));
        setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    }, []);

    const onFileDelete = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        event.preventDefault();

        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleDivClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const openFileDialog = () => {
        document.getElementById('file-input')?.click();
    };

    return (
        <div
            {...getRootProps()}
            onClick={handleDivClick}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
            <input {...getInputProps()} id="file-input" />
            <p>Drop file here or</p>
            <button type="button" onClick={openFileDialog} className="open-file-button">
                Select file
            </button>
            {selectedFiles.length > 0 && (
                <FileDisplay files={selectedFiles} onFileDelete={onFileDelete} />
            )}
        </div>
    );
};

export default DropZone;

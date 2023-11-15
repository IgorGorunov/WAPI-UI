import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileDisplay from '@/components/FileDisplay';
import './styles.scss';

const DropZone = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        const updatedFiles = acceptedFiles.map((file) => ({
            name: file.name,
            type: file.type.split('/')[0], // Вид файла (например, image, audio, video, pdf)
        }));
        setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <p>
                Drop files here or click to select
            </p>
            {selectedFiles.length > 0 && <FileDisplay files={selectedFiles} />}
        </div>
    );
};

export default DropZone;

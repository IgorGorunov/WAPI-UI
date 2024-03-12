import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileImage, faFileAudio, faFileVideo, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import Icon from '@/components/Icon';
import {base64ToBlob} from "@/utils/files";

const FileDisplay = ({ files, onFileDelete }) => {
    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'image':
                return faFileImage;
            case 'audio':
                return faFileAudio;
            case 'video':
                return faFileVideo;
            case 'pdf':
                return faFilePdf;
            default:
                return faFile;
        }
    };

    const ShowFile = (file) => {

    };

    const handleDownload = (file) => {
        const blob = base64ToBlob(file.data, file.type);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="file-display">
            {files.filter(file => file).map((file, index) => (
                <div key={index} className="file-item__wrapper">
                    <div key={index} className="file-item">
                        <FontAwesomeIcon icon={getFileIcon(file.type)} className="file-icon" />
                        <div className="file-details">
                            <span onClick={() => ShowFile(file)}>{file.name}</span>
                        </div>
                        <div className='file-actions'>
                            <div className='file-actions-btn download-file-button' onClick={() => handleDownload(file)}>
                                <Icon name='download-file' />
                            </div>
                            <div className='file-actions-btn delete-button' onClick={() => onFileDelete(event, index)}>
                                <Icon name="delete"/>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileDisplay;

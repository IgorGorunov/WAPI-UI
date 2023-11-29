import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileImage, faFileAudio, faFileVideo, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import Icon from '@/components/Icon';

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

    return (
        <div className="file-display">
            {files.map((file, index) => (
                <div key={index} className="file-item">
                    <FontAwesomeIcon icon={getFileIcon(file.type)} className="file-icon" />
                    <div className="file-details">
                        <span onClick={() => ShowFile(file)}>{file.name}</span>
                    </div>
                    <div className='delete-button' onClick={() => onFileDelete(event, index)}>
                        <Icon name="delete"/>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileDisplay;

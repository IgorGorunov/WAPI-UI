import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileImage, faFileAudio, faFileVideo, faFilePdf, faTimes } from '@fortawesome/free-solid-svg-icons';
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

    return (
        <div className="file-display">
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <FontAwesomeIcon icon={getFileIcon(file.type)} className="file-icon" />
                        <span>{file.name}</span>
                        <button className='delete-button' onClick={() => onFileDelete(event, index)}>
                            <Icon name="close"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileDisplay;
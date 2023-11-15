
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileImage, faFileAudio, faFileVideo, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const FileDisplay = ({ files }) => {
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
        <div>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <FontAwesomeIcon icon={getFileIcon(file.type)} />
                        <span>{file.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileDisplay;

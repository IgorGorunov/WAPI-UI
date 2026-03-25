import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileImage, faFileAudio, faFileVideo, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.scss';
import Icon from '@/components/Icon';
import { base64ToBlob } from "@/utils/files";
import { AttachedFilesType } from "@/types/utility";

const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return faFileImage;

    switch (fileType) {
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

interface FileDisplayProps {
    files: AttachedFilesType[];
    onFileDelete: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, file: AttachedFilesType, index: number) => void;
    addedFiles: AttachedFilesType[];
    listType?: boolean
}
const FileDisplay = ({ files, onFileDelete, addedFiles, listType }: FileDisplayProps) => {
    const ShowFile = (file: AttachedFilesType) => {

    };

    const handleDownload = (file: AttachedFilesType) => {
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

    const fileIsAdded = (file: AttachedFilesType) => {

        const foundFiles = addedFiles.filter(item => item.id === file.id);
        return !!foundFiles.length;
    }

    return (
        <div className={`${styles['file-display'] || 'file-display'} ${listType ? styles['is-list'] || 'is-list' : ''}`}>
            {files.filter(file => file).map((file, index) => (
                <div
                    key={index}
                    className={styles['file-item__wrapper'] || 'file-item__wrapper'}
                    draggable={true}
                    onClick={(e) => e.stopPropagation()}
                    onDragStart={(e) => {
                        (window as any).__WAPI_DRAGGED_FILE_ID = file.id;
                        e.dataTransfer.setData('wapi/file-id', file.id);
                        e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnd={() => {
                        (window as any).__WAPI_DRAGGED_FILE_ID = null;
                    }}
                >
                    <div key={index} className={`${styles['file-item'] || 'file-item'} ${fileIsAdded(file) || file.isNew ? styles['is-new'] || 'is-new' : styles['is-exist'] || 'is-exist'}`}>
                        <FontAwesomeIcon icon={getFileIcon(file.type)} className={styles['file-icon'] || 'file-icon'} />
                        <div className={styles['file-details'] || 'file-details'}>
                            <span onClick={(e) => { e.stopPropagation(); ShowFile(file); }}>{file.name}</span>
                        </div>
                        <div className={styles['file-actions'] || 'file-actions'}>
                            <div className={`${styles['file-actions-btn'] || 'file-actions-btn'} ${styles['download-file-button'] || 'download-file-button'}`} onClick={(e) => { e.stopPropagation(); handleDownload(file); }}>
                                <Icon name='download-file' />
                            </div>
                            <div className={`${styles['file-actions-btn'] || 'file-actions-btn'} ${styles['delete-button'] || 'delete-button'}`} onClick={(event) => { event.stopPropagation(); onFileDelete(event, file, index); }}>
                                <Icon name="delete" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileDisplay;

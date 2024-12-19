import React, {memo} from 'react';
import {DownloadableFileType} from "@/types/sanity/fragmentTypes";
import Icon from "@/components/Icon";
import './styles.scss';


const DownloadableFile: React.FC<DownloadableFileType> = ({_id, fileLabel, fileUrl, fileMimeType}) => {

    // if (fileMimeType && (fileMimeType.toLowerCase().includes('image') || fileMimeType.toLowerCase().includes('/pdf'))) {
    //     console.log('can preview');
    // }

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileLabel; // Sets the label as the filename
        link.click();
    };
    const handlePreview = () => {
        window.open(fileUrl, "_blank");
    };

    return (
        <div className={`download-file`}>
            <button className='download-file__action-btn' onClick={handleDownload}>
                <Icon name='download-file'/>
            </button>
            <button className='download-file__action-btn' onClick={handlePreview}>
                <Icon name='preview'/>
            </button>
            <span className='download-file__name'>{fileLabel}</span>
        </div>
    )
}

export default memo(DownloadableFile);
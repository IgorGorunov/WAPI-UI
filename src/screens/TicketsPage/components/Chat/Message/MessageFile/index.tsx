import React, {useRef, useState} from "react";
import "./styles.scss";
import {CHAT_FILE_TYPES} from "@/types/tickets";
import {AttachedFilesType} from "@/types/utility";
import Icon from "@/components/Icon";
import {base64ToBlob} from "@/utils/files";

type MessageFilePropsType = {
    attachedFile: AttachedFilesType;
}

const MessageFile: React.FC<MessageFilePropsType> = ({attachedFile}) => {
    const {data, type, name, id} = attachedFile;
    const [preview, setPreview] = useState<string | null>(null);


    let fileType = CHAT_FILE_TYPES.OTHER;
    if (type.toLowerCase().includes('pdf') || name.toLowerCase().includes('pdf')) {
        fileType = CHAT_FILE_TYPES.PDF;
    } else if (type.toLowerCase().includes('image') || name.toLowerCase().includes('screenshot')) {
        fileType = CHAT_FILE_TYPES.IMAGE;
    }

    const handleDownload = () => {
        const blob = base64ToBlob(data, type);
        const fileName = name;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([blob], {type: type}));
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleOpen = () => {

        const tempType = fileType === CHAT_FILE_TYPES.PDF ? "application/pdf" : type;

        const byteCharacters = atob(data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: tempType });

        // Open Blob object in new tab
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, '_blank');
        if (newTab) {
            newTab.document.title = name;
        } else {
            alert('Please allow pop-ups for this site to open the file.');
        }
    }


    return (
        <div className="attached-file-block">
            {fileType === CHAT_FILE_TYPES.IMAGE ? <div className='attached-file-block__file-wrapper'><img
                    src={`data:${type};base64,${data}`} alt={name}/></div>
                    : fileType === CHAT_FILE_TYPES.PDF ?
                    <div className='attached-file-block__file-wrapper'>
                        <embed src={`data:application/pdf;base64,${data}`} type="application/pdf" width="100%"
                               height="auto"/>
                        <div className='pdf-file'><Icon name='file'/><span
                            className='attached-file-block__file-name'>{name}</span></div>
                    </div>
                    : <div className='attached-file-block__file'><Icon name='file'/><span
                        className='attached-file-block__file-name'>{name}</span></div>}

            <div className='download-file' onClick={handleDownload}><Icon name='download-file'/></div>
            {fileType !== CHAT_FILE_TYPES.OTHER && <div className='preview-file' onClick={handleOpen}><Icon name={'preview'}/></div>}
        </div>
    );
};

export default MessageFile;

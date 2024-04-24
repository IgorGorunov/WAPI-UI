import React, {useState} from "react";

import "./styles.scss";
import {HierarchyNodeType} from "@/screens/ProfilePage/components/ApiProtocols";
import Icon from "@/components/Icon";
import {getApiProtocol} from "@/services/profile";
import {base64ToBlob} from "@/utils/files";

type FilePropsType = {
    file: HierarchyNodeType;
}

const SingleFile: React.FC<FilePropsType> = ({file}) => {
    const [fileData, setFileData] = useState<any|null>(null);

    const fileDownLoad = (file) => {
        const blob = base64ToBlob(file.data, file.type);
        const fileName = file.name;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([blob], {type: file.type}));
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const fileOpen = (file) => {
        const byteCharacters = atob(file.data);
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
        const blob = new Blob(byteArrays, { type: file.type });

        // Open Blob object in new tab
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, '_blank');
        if (newTab) {
            newTab.document.title = file.name;
        } else {
            alert('Please allow pop-ups for this site to open the file.');
        }
    }

    const handleDownload = async() => {
        if (fileData) {
            fileDownLoad(fileData);
        } else {
            const res = await getApiProtocol({uuid: file?.uuid});
            if (res.status === 200 && res.data.length) {
                const fileInfo = res.data[0];
                setFileData(fileInfo);
                fileDownLoad(fileInfo);
            }
        }
    }

    const handlePreview = async() => {
        if (fileData) {
            fileOpen(fileData);
        } else {
            const res = await getApiProtocol({uuid: file?.uuid});
            if (res.status === 200 && res.data.length) {
                const fileInfo = res.data[0];
                setFileData(fileInfo);
                fileOpen(fileInfo);
            }
        }
    }

    return (
        <div className='protocol-file'>
            <button className='protocol-file__action-btn' onClick={handleDownload}><Icon name='download-file'/></button>
            <button className='protocol-file__action-btn' onClick={handlePreview}><Icon name='preview'/></button>
            <p className='protocol-file__name'>{file.name}</p>
        </div>

    );
};

export default SingleFile;
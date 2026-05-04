import React, {useState} from "react";

import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import {getUserContractFile, getUserPriceFile} from "@/services/profile";
import {base64ToBlob} from "@/utils/files";
import {UserContractType, UserPriceType} from "@/types/profile";
import {formatDateStringToDisplayString} from "@/utils/date";
import useAuth from "@/context/authContext";
import {ContractPriceBlockType} from "@/screens/ProfilePage/components/UserContractsAndPrices/PriceContractBlock";
import {sendUserBrowserInfo} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import Loader from "@/components/Loader";

type FilePropsType = {
    file: UserContractType | UserPriceType;
    type: ContractPriceBlockType;
}

const SingleFile: React.FC<FilePropsType> = ({file, type}) => {
    const { tenantData: { alias }} = useTenant();
    const {token, ui, superUser, getBrowserInfo} = useAuth();
    const [fileData, setFileData] = useState<any|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getFile = async(uuid: string, type: ContractPriceBlockType) => {
        const requestData = superUser ? {uuid, token, alias, ui} : {uuid, token, alias };

        try {
            sendUserBrowserInfo({...getBrowserInfo(type===ContractPriceBlockType.PRICE ? 'GetClientPrice' : 'GetFileByUUID'), body: superUser && ui ? {...requestData, ui} : requestData})
        } catch {}

        return type===ContractPriceBlockType.PRICE ? await getUserPriceFile(requestData) : getUserContractFile(requestData);
    }

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
        try {
            setLoading(true);
            if (fileData) {
                fileDownLoad(fileData);
            } else {
                const res = await getFile(file?.uuid, type);
                if (res.status === 200 && res.data.length) {
                    const fileInfo = res.data[0];
                    setFileData(fileInfo);
                    fileDownLoad(fileInfo);
                }
            }
        } finally {
            setLoading(false);
        }
    }

    const handlePreview = async() => {
        try {
            setLoading(true);

            if (fileData) {
                fileOpen(fileData);
            } else {
                const res = await getFile(file?.uuid, type);
                if (res.status === 200 && res.data.length) {
                    const fileInfo = res.data[0];
                    setFileData(fileInfo);
                    fileOpen(fileInfo);
                }
            }
        } finally {
            setLoading(false);
        }
    }

    //const curDate =

    return (
        <div className={`${styles['contract-price-file']} ${file.endDate}`}>
            {loading ? <Loader/> : null}
            <div className={styles['contract-price-file__left-block']}>
                <button className={styles['contract-price-file__action-btn']} onClick={handleDownload}><Icon name='download-file'/></button>
                <button className={styles['contract-price-file__action-btn']} onClick={handlePreview}><Icon name='preview'/></button>
                <p className={styles['contract-price-file__name']}>{file.name}</p>
            </div>
            <div className={styles['contract-price-file__right-block']}>
                <p className={styles['contract-price-file__date']}>{file.startDate ? formatDateStringToDisplayString(file.startDate) : ''}</p>
                <p className={styles['contract-price-file__date']}>{file.endDate ? formatDateStringToDisplayString(file.endDate) : ''}</p>
            </div>
        </div>

    );
};

export default SingleFile;
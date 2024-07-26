import React, {useCallback, useMemo, useState} from "react";
import {sendOrderFiles} from '@/services/orders';
import {sendProductFiles} from "@/services/products";
import Button from '@/components/Button/Button'
import "./styles.scss";
import DropZone from "@/components/Dropzone";
import {AttachedFilesType} from "@/types/products";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {ApiResponseType} from "@/types/api";
import useAuth from "@/context/authContext";
import Loader from "@/components/Loader";
import {sendInboundFiles} from "@/services/stockMovements";
import {ImportFilesType} from "@/types/importFiles";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import {useTranslations} from "next-intl";

const getFileData = (importType: ImportFilesType, t) => {
   switch (importType) {
       case ImportFilesType.ORDERS:
           return {
               downloadFileName: 'Orders mass upload file.xlsx',
               sendFileFunction: sendOrderFiles,
               title: t('ordersTitle'),
           }
       case ImportFilesType.PRODUCTS:
           return {
               downloadFileName: 'Master data.xlsx',
               sendFileFunction: sendProductFiles,
               title: `${t('productsTitle1')}
               ${t('productsTitle2')}`,
           }
       case ImportFilesType.STOCK_MOVEMENTS_PRODUCTS:
           return {
               downloadFileName: 'Products import.xlsx',
               sendFileFunction: sendInboundFiles,
               title: t('stockMovementsTitle'),
           }

       default:
           return {
               downloadFileName: 'Orders mass upload file.xlsx',
               sendFileFunction: sendOrderFiles,
               title: t('ordersTitle'),
           }
   }
}

type ImportFilesBlockType = {
    file: string;
    importFilesType: ImportFilesType;
    closeModal: ()=>void;
    setResponseData?: (res: ApiResponseType)=>void;
}
const ImportFilesBlock:React.FC<ImportFilesBlockType> = ({file, importFilesType = ImportFilesType.ORDERS, closeModal, setResponseData}) => {
    const t = useTranslations('importFilesBlock');
    const tBtns = useTranslations('common.buttons');
    const tMessages = useTranslations('messages')
    const { token, superUser, ui } = useAuth();
    const [selectedFilesImport, setSelectedFilesImport] = useState<AttachedFilesType[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const handleFilesChange = (files) => {
        setSelectedFilesImport(files);
    };

    const fileData = useMemo(()=>getFileData(importFilesType, t),[]);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        closeModal();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const downloadFile = async () => {
        const res = await fetch(`/${file}`); // Adjust the path accordingly
        const blob = await res.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = fileData.downloadFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const sendFunc = fileData.sendFileFunction;
    const sendFiles = async () => {

        if (selectedFilesImport.length) {
            setIsLoading(true);
            try {
                const requstData = {
                    token: token,
                    files: selectedFilesImport
                };
                const res: ApiResponseType = await sendFunc(superUser && ui ? {...requstData, ui} : requstData);

                if (setResponseData) {
                    setResponseData(res);
                    return;
                }

                if (res && "status" in res) {
                    if (res?.status === 200) {
                        //success
                        setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: tMessages('successMessages.success'), subtitle: tMessages("successMessages.successfulFileUpload"), onClose: closeSuccessModal})
                        setShowStatusModal(true);
                    }
                } else if (res && 'response' in res ) {
                    const errResponse = res.response;

                    if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                        const errorMessages = errResponse?.data.errorMessage;

                        setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: tMessages("errorMessages.error"), subtitle: tMessages('errorMessages.pleaseFixErrors'), text: errorMessages, onClose: closeErrorModal})
                        setShowStatusModal(true);
                    }
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setModalStatusInfo({ title: tMessages("errorMessages.error"), subtitle: tMessages('errorMessages.pleaseFixErrors'), text: [tMessages('errorMessages.noFilesToUpload')], onClose: closeErrorModal})
            setShowStatusModal(true);
        }
    }

    return (
        <div className='import-files'>
            {isLoading && <Loader />}
            <p className='import-files__title'>
                {fileData.title}
            </p>
            <Button icon='download-file' iconOnTheRight onClick={downloadFile}>{tBtns('downloadSample')}</Button>
            <DropZone readOnly={false} files={selectedFilesImport} onFilesChange={handleFilesChange} />
            <Button  onClick={sendFiles}>{tBtns('send')}</Button>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
}

export default  ImportFilesBlock;
import React, {useState, useCallback, useMemo} from "react";
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
import {sendInboundFiles} from "@/services/inbounds";
import {ImportFilesType} from "@/types/importFiles";

const getFileData = (importType: ImportFilesType) => {
   switch (importType) {
       case ImportFilesType.ORDERS:
           return {
               downloadFileName: 'Orders mass upload file.xlsx',
               sendFileFunction: sendOrderFiles,
               title: 'To upload the orders in bulk it is necessary to download the master data draft file, fill it with data and then upload back to system',
           }
       case ImportFilesType.PRODUCTS:
           return {
               downloadFileName: 'Master data.xlsx',
               sendFileFunction: sendProductFiles,
               title: 'To upload the products in bulk it is necessary to download the master data draft file, fill it with data and then upload back to system',
           }
       case ImportFilesType.STOCK_MOVEMENTS_PRODUCTS:
           return {
               downloadFileName: 'Products import.xlsx',
               sendFileFunction: sendInboundFiles,
               title: 'To upload products in the document it is necessary to download the master data draft file, fill it with data and then upload back to system',
           }

       default:
           return {
               downloadFileName: 'Orders mass upload file.xlsx',
               sendFileFunction: sendOrderFiles,
               title: 'To upload the orders in bulk it is necessary to download the master data draft file, fill it with data and then upload back to system',
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
    const { token } = useAuth();
    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    const fileData = useMemo(()=>getFileData(importFilesType),[]);

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
        setIsLoading(true);
        if (selectedFiles.length) {
            try {
                const res: ApiResponseType = await sendFunc(
                    {
                        token: token,
                        files: selectedFiles
                    }
                );

                if (setResponseData) {
                    setResponseData(res);
                    return;
                }

                if (res && "status" in res) {
                    if (res?.status === 200) {
                        //success
                        setModalStatusInfo({isSuccess: true, title: "Success", subtitle: `Files are sent successfully!`, onClose: closeSuccessModal})
                        setShowStatusModal(true);
                    }
                } else if (res && 'response' in res ) {
                    const errResponse = res.response;

                    if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                        const errorMessages = errResponse?.data.errorMessage;

                        setModalStatusInfo({ title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal})
                        setShowStatusModal(true);
                    }
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setModalStatusInfo({ title: "Error", subtitle: `Please, fix errors!`, text: ["I haven't uploaded any files to send"], onClose: closeErrorModal})
            setShowStatusModal(true);
        }
    }

    return (
        <div className='import-files'>
            {isLoading && <Loader />}
            <p className='import-files__title'>
                {fileData.title}
            </p>
            <Button icon='download-file' iconOnTheRight onClick={downloadFile}>Download sample</Button>
            <DropZone readOnly={false} files={selectedFiles} onFilesChange={handleFilesChange} />
            <Button  onClick={sendFiles}>Send</Button>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
}

export default  ImportFilesBlock;
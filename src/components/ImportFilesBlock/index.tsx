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
import {ImportFilesType, ImportTemplateNamesSanity} from "@/types/importFiles";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import {sendUserBrowserInfo} from "@/services/userInfo";
import {getImportTemplate} from "@/sanity/sanity-utils";
import {toast, ToastContainer} from "@/components/Toast";
import useTenant from "@/context/tenantContext";

const getFileData = (importType: ImportFilesType) => {
   switch (importType) {
       case ImportFilesType.ORDERS:
           return {
               action: 'BulkOrdersCreate',
               downloadFileName: 'Orders mass upload file.xlsx',
               templateName: ImportTemplateNamesSanity.ORDERS,
               sendFileFunction: sendOrderFiles,
               title: 'To upload the orders in bulk it is necessary to download the master data draft file, fill it with data and then upload back to system',
           }
       case ImportFilesType.PRODUCTS:
           return {
               action: 'BulkProductsCreate',
               downloadFileName: 'Master data.xlsx',
               templateName: ImportTemplateNamesSanity.PRODUCTS,
               sendFileFunction: sendProductFiles,
               title: `To upload the products in bulk it is necessary to download the master data draft file, fill it with data and then upload back to system.
               After uploading a document, you need to send draft products for approve (open a product and click "Send")`,
           }
       case ImportFilesType.STOCK_MOVEMENTS_PRODUCTS:
           return {
               action: 'FillStockMovementFromFile',
               downloadFileName: 'Products import.xlsx',
               templateName: ImportTemplateNamesSanity.STOCK_MOVEMENTS_PRODUCTS,
               sendFileFunction: sendInboundFiles,
               title: 'To upload products in the document it is necessary to download the master data draft file, fill it with data and then upload back to system',
           }

       default:
           return {
               action: 'BulkOrdersCreate',
               downloadFileName: 'Orders mass upload file.xlsx',
               templateName: ImportTemplateNamesSanity.ORDERS,
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
    const { tenantData: { alias }} = useTenant();
    const { token, superUser, ui, getBrowserInfo } = useAuth();
    const [selectedFilesImport, setSelectedFilesImport] = useState<AttachedFilesType[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const handleFilesChange = (files) => {
        setSelectedFilesImport(files);
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
        //const res = await fetch(`/${file}`);
        const res = await getImportTemplate(fileData.templateName as string);
        if (res && res.fileUrl) {
            const url = res.fileUrl;
            const a = document.createElement('a');
            a.href = url;
            a.download = fileData.downloadFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            toast.warn(`Couldn't download the file. Please, try a bit later or contact our IT support.`, {
                position: "top-right",
                autoClose: 5000,
            });
        }
        // const blob = await res.blob();
        // const url = window.URL.createObjectURL(new Blob([blob]));
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = fileData.downloadFileName;
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
    };

    const sendFunc = fileData.sendFileFunction;
    const sendFiles = async () => {

        if (selectedFilesImport.length) {
            setIsLoading(true);
            try {
                const requestData = {
                    token,
                    alias,
                    files: selectedFilesImport
                };

                try {
                    sendUserBrowserInfo({...getBrowserInfo(fileData.action), body: superUser && ui ? {...requestData, ui} : requestData})
                } catch {}


                const res: ApiResponseType = await sendFunc(superUser && ui ? {...requestData, ui} : requestData);

                if (setResponseData) {
                    setResponseData(res);
                    return;
                }

                if (res && "status" in res && res?.status === 200) {
                    //success
                    setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Files are sent successfully!`, onClose: closeSuccessModal})
                    setShowStatusModal(true);

                } else if (res && 'response' in res ) {
                    const errResponse = res.response;

                    if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                        const errorMessages = errResponse?.data.errorMessage;

                        setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal})
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
            <ToastContainer />
            <p className='import-files__title'>
                {fileData.title}
            </p>
            <Button icon='download-file' iconOnTheRight onClick={downloadFile}>Download sample</Button>
            <DropZone readOnly={false} files={selectedFilesImport} onFilesChange={handleFilesChange} />
            <Button  onClick={sendFiles}>Send</Button>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
}

export default  ImportFilesBlock;
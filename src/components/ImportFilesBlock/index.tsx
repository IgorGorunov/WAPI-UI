import React, {useState, useCallback} from "react";
import {sendOrderFiles} from '@/services/orders';
import {sendProductFiles} from "@/services/products";
import Button from '@/components/Button/Button'
import "./styles.scss";
import DropZone from "@/components/Dropzone";
import {AttachedFilesType} from "@/types/products";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {ApiResponseType} from "@/types/api";
import useAuth from "@/context/authContext";
import Skeleton from "@/components/Skeleton/Skeleton";

type ImportFilesBlockType = {
    file: string;
    isProducts: boolean;
    closeModal: ()=>void;
}
const ImportFilesBlock:React.FC<ImportFilesBlockType> = ({file, isProducts=false, closeModal}) => {
    const { token } = useAuth();
    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

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
        a.download = 'example.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const sendFunc = isProducts ? sendProductFiles : sendOrderFiles;
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

                        setModalStatusInfo({ title: "Error", subtitle: `Please, fix these errors!`, text: errorMessages, onClose: closeErrorModal})
                        setShowStatusModal(true);
                    }
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setModalStatusInfo({ title: "Error", subtitle: `Please, fix these errors!`, text: ["I haven't uploaded any files to send"], onClose: closeErrorModal})
            setShowStatusModal(true);
        }
    }

    return (
        <div className='import-files'>
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    zIndex: 1000
                }}>
                    <Skeleton type="round" width="500px" height="300px" />
                </div>
            )}
            <p className='import-files__title'>To upload the {isProducts ? 'products' : 'orders'} in bulk it is necessary to download the master data draft file, fill it with data and then upload back to system</p>
            <Button icon='download-file' iconOnTheRight onClick={downloadFile}>Download sample</Button>
            <DropZone readOnly={false} files={selectedFiles} onFilesChange={handleFilesChange} />
            <Button  onClick={sendFiles}>Send</Button>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
}

export default  ImportFilesBlock;
import React, {useCallback, useEffect, useState} from 'react';
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth, {AccessActions} from "@/context/authContext";
import Loader from "@/components/Loader";
import {ToastContainer} from '@/components/Toast';
import {SingleStockMovementType, STOCK_MOVEMENT_DOC_TYPE, StockMovementParamsType} from "@/types/stockMovements";
import {getInboundData, getInboundParameters} from "@/services/stockMovements";
import {ApiResponseType} from "@/types/api";
import Modal from "@/components/Modal";
import StockMovementFormComponent
    from "@/screens/StockMovementsPage/components/StockMovementForm/StockMovementFormComponent";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {docNamesSingle, getAccessActionObject} from "@/screens/StockMovementsPage";
import {sendUserBrowserInfo} from "@/services/userInfo";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";

type StockMovementFormType = {
    docType: STOCK_MOVEMENT_DOC_TYPE,
    docUuid?: string;
    closeDocModal: ()=>void;
    closeModalOnSuccess: ()=>void;
}

const StockMovementForm: React.FC<StockMovementFormType> = ({docType, docUuid=null, closeDocModal, closeModalOnSuccess}) => {

    const [isLoading, setIsLoading] = useState(false);
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [docData, setDocData] = useState<SingleStockMovementType|null>(null);
    const [docParameters, setDocParameters] = useState<StockMovementParamsType|null>(null);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const fetchSingleStockMovement = async (uuid: string) => {
        type ApiResponse = {
            data: any;
        };

        try {
            setIsLoading(true);
            const requestData = {token, uuid, documentType: docType};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetStockMovementData/'+docType, getAccessActionObject(docType), AccessActions.ViewObject), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.ViewObject)) {
                setDocData(null);
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal})
                setShowStatusModal(true);
                return null;
            }
            const res: ApiResponse = await getInboundData(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setDocData(res.data);
            } else {
                console.error("API did not return expected data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStockMovementParams = useCallback(async() => {
        try {
            setIsLoading(true);
            const requestData = {token: token, documentType: docType};

            // try {
            //     sendUserBrowserInfo({...getBrowserInfo('GetStockMovementParameters'), body: superUser && ui ? {...requestData, ui} : requestData})
            // } catch {}

            const resp: ApiResponseType = await getInboundParameters(superUser && ui ? {...requestData, ui} : requestData);

            if (resp && "data" in resp) {
                setDocParameters(resp.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },[token]);

    useEffect(() => {
        fetchStockMovementParams();

        if (docUuid) {
            fetchSingleStockMovement(docUuid);
        }
    }, []);


    const onClose = () => {
        closeDocModal();
        //clear notifications
        if (docUuid) {
            setDocNotificationsAsRead(docUuid);
        }
    }

    const onCloseOnSuccess = () => {
        closeModalOnSuccess();
        //clear Notifications
        if (docUuid) {
            setDocNotificationsAsRead(docUuid);
        }
    }

    return (
        <div>
            {docParameters && (docUuid && docData || !docUuid ? (
                <div className={`stock-movement is-${docType}`}>
                    {isLoading && <Loader />}
                    <ToastContainer />
                    {docParameters && (docUuid && docData || !docUuid) ? (
                        <Modal title={docNamesSingle[docType]} onClose={onClose} classNames='document-modal'>
                            <StockMovementFormComponent
                                docType={docType}
                                docParameters={docParameters}
                                docData={docData}
                                closeDocModal={onCloseOnSuccess}
                                refetchDoc={()=>fetchSingleStockMovement(docUuid)}
                            />
                        </Modal>
                    ) : null}
                </div>
                )
            : null)}
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
}

export default StockMovementForm;
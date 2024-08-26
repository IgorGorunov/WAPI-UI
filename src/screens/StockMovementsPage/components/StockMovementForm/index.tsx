import React, {useCallback, useEffect, useState} from 'react';
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth from "@/context/authContext";
import Loader from "@/components/Loader";
import {ToastContainer} from '@/components/Toast';
import {
    SingleStockMovementType,
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementParamsType
} from "@/types/stockMovements";
import {getInboundData, getInboundParameters} from "@/services/stockMovements";
import {ApiResponseType} from "@/types/api";
import Modal from "@/components/Modal";
import StockMovementFormComponent
    from "@/screens/StockMovementsPage/components/StockMovementForm/StockMovementFormComponent";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {docNamesSingle} from "@/screens/StockMovementsPage";

type StockMovementFormType = {
    docType: STOCK_MOVEMENT_DOC_TYPE,
    docUuid?: string;
    closeDocModal: ()=>void;
    closeModalOnSuccess: ()=>void;
}

const StockMovementForm: React.FC<StockMovementFormType> = ({docType, docUuid=null, closeDocModal, closeModalOnSuccess}) => {

    const [isLoading, setIsLoading] = useState(false);
    const { token, superUser, ui } = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();


    const [docData, setDocData] = useState<SingleStockMovementType|null>(null);
    const [docParameters, setDocParameters] = useState<StockMovementParamsType|null>(null);

    const fetchSingleStockMovement = async (uuid: string) => {
        type ApiResponse = {
            data: any;
        };

        try {
            setIsLoading(true);
            const requstData = {token, uuid, documentType: docType};
            const res: ApiResponse = await getInboundData(superUser && ui ? {...requstData, ui} : requstData);

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

    return <div className={`stock-movement is-${docType}`}>
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
}

export default StockMovementForm;
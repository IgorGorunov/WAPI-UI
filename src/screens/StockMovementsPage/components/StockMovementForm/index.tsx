import React, {useCallback, useEffect, useState} from 'react';
import "./styles.scss";
import '@/styles/forms.scss';
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import Loader from "@/components/Loader";
import {ToastContainer} from '@/components/Toast';
import {
    SingleStockMovementType,
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementParamsType
} from "@/types/stockMovements";
import {verifyToken} from "@/services/auth";
import {getInboundData, getInboundParameters} from "@/services/inbounds";
import {ApiResponseType} from "@/types/api";
import Modal from "@/components/Modal";
import StockMovementFormComponent
    from "@/screens/StockMovementsPage/components/StockMovementForm/StockMovementFormComponent";

type StockMovementFormType = {
    docType: STOCK_MOVEMENT_DOC_TYPE,
    docUuid?: string;
    closeDocModal: ()=>void;
    closeModalOnSuccess: ()=>void;
}

const docNamesSingle = {
    [STOCK_MOVEMENT_DOC_TYPE.INBOUNDS]: 'Inbound',
    [STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT]: 'Stock movement',
    [STOCK_MOVEMENT_DOC_TYPE.OUTBOUND]: 'Outbound',
}

const StockMovementForm: React.FC<StockMovementFormType> = ({docType, docUuid=null, closeDocModal, closeModalOnSuccess}) => {

    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();


    const [docData, setDocData] = useState<SingleStockMovementType|null>(null);
    const [docParameters, setDocParameters] = useState<StockMovementParamsType|null>(null);

    const fetchSingleStockMovement = async (uuid: string) => {
        type ApiResponse = {
            data: any;
        };

        try {
            setIsLoading(true);

           await verifyToken(token);

            const res: ApiResponse = await getInboundData(docType,
                {token, uuid}
            );

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
            await verifyToken(token);

            const resp: ApiResponseType = await getInboundParameters(docType,
                {token: token}
            );

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
    }

    const onCloseOnSeccess = () => {
        closeModalOnSuccess();
        //clear Notifications
    }

    return <div className={`stock-movement is-${docType}`}>
        {isLoading && <Loader />}
        <ToastContainer />
        {docParameters && (docUuid && docData || !docUuid) ? (
            <Modal title={docNamesSingle[docType]} onClose={onClose} >
                <StockMovementFormComponent docType={docType} docParameters={docParameters} docData={docData} closeDocModal={onCloseOnSeccess}/>
            </Modal>
        ) : null}
    </div>
}

export default StockMovementForm;
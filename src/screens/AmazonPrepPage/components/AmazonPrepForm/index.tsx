import React, {useCallback, useEffect, useState} from 'react';
import {
    AmazonPrepOrderParamsType,
    SingleAmazonPrepOrderType,
} from "@/types/amazonPrep";
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth from "@/context/authContext";
import {getAmazonPrepParameters, getSingleAmazonPrepData} from '@/services/amazonePrep';
import {ApiResponseType} from '@/types/api';
import {ToastContainer} from '@/components/Toast';
import Loader from "@/components/Loader";
import AmazonPrepFormComponent from "./AmazonPrepFormComponent";
import Modal from "@/components/Modal";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";

type AmazonPrepFormType = {
    docUuid?: string | null;
    onCloseModal: ()=>void;
    onCloseModalWithSuccess: ()=>void;
}


const AmazonPrepForm: React.FC<AmazonPrepFormType> = ({docUuid, onCloseModal, onCloseModalWithSuccess}) => {
    const { token, superUser, ui } = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [isLoading, setIsLoading] = useState(false);

    const [amazonPrepOrderData, setAmazonPrepOrderData] = useState<SingleAmazonPrepOrderType|null>(null);
    const [amazonPrepOrderParameters, setAmazonPrepOrderParameters] = useState<AmazonPrepOrderParamsType|null>(null);


    const fetchSingleAmazonPrepOrder = useCallback(async (uuid: string) => {
        try {
            setIsLoading(true);

            const requestData = {token, uuid};

            const res: ApiResponseType = await getSingleAmazonPrepData(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setAmazonPrepOrderData(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token]);

    const fetchAmazonPrepOrderParams = useCallback(async() => {
        try {
            const requestData = {token};
            const responseParams: ApiResponseType = await getAmazonPrepParameters(superUser && ui ? {...requestData, ui} : requestData);

            if (responseParams?.data ) {
                setAmazonPrepOrderParameters(responseParams.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },[token]);

    useEffect(() => {
        fetchAmazonPrepOrderParams();

        if (docUuid) {
            fetchSingleAmazonPrepOrder(docUuid);
        }
    }, []);

    const onCloseWithSuccess = () => {
        onCloseModalWithSuccess();
        if (docUuid) {
            setDocNotificationsAsRead(docUuid);
        }
    }
    const onClose = () => {
        onCloseModal();
        if (docUuid) {
            setDocNotificationsAsRead(docUuid);
        }
    }

    return <div className='amazon-prep-info'>
        {(isLoading || !amazonPrepOrderParameters) && <Loader />}
        <ToastContainer />
        {amazonPrepOrderParameters && (docUuid && amazonPrepOrderData || !docUuid) ?
            <Modal title={`B2B`} onClose={onClose} classNames='document-modal'>
                <AmazonPrepFormComponent
                    amazonPrepOrderData={amazonPrepOrderData}
                    amazonPrepOrderParameters={amazonPrepOrderParameters}
                    docUuid={docUuid}
                    closeAmazonPrepOrderModal={onCloseWithSuccess}
                    refetchDoc={()=>{fetchSingleAmazonPrepOrder(docUuid)}}
                />
            </Modal>
        :null}
    </div>
}

export default AmazonPrepForm;
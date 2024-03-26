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
    const { token } = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [isLoading, setIsLoading] = useState(false);

    const [amazonPrepOrderData, setAmazonPrepOrderData] = useState<SingleAmazonPrepOrderType|null>(null);
    const [amazonPrepOrderParameters, setAmazonPrepOrderParameters] = useState<AmazonPrepOrderParamsType|null>(null);


    const fetchSingleAmazonPrepOrder = useCallback(async (uuid: string) => {
        try {
            setIsLoading(true);

            const res: ApiResponseType = await getSingleAmazonPrepData(
                {token, uuid}
            );

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
            const responseParams: ApiResponseType = await getAmazonPrepParameters(
                {token: token}
            );

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
            <Modal title={`Amazon prep`} onClose={onClose} >
                <AmazonPrepFormComponent
                    amazonPrepOrderData={amazonPrepOrderData}
                    amazonPrepOrderParameters={amazonPrepOrderParameters}
                    docUuid={docUuid}
                    closeAmazonPrepOrderModal={onCloseWithSuccess}
                    refetchDoc={()=>{fetchSingleAmazonPrepOrder(docUuid); console.log('1111')}}
                />
            </Modal>
        :null}
    </div>
}

export default AmazonPrepForm;
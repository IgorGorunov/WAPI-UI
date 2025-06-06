import React, {useCallback, useEffect, useState} from 'react';
import {
    AmazonPrepOrderParamsType,
    SingleAmazonPrepOrderType,
} from "@/types/amazonPrep";
import "./styles.scss";
import '@/styles/forms.scss';
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {getAmazonPrepParameters, getSingleAmazonPrepData} from '@/services/amazonePrep';
import {ApiResponseType} from '@/types/api';
import {ToastContainer} from '@/components/Toast';
import Loader from "@/components/Loader";
import AmazonPrepFormComponent from "./AmazonPrepFormComponent";
import Modal from "@/components/Modal";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {sendUserBrowserInfo} from "@/services/userInfo";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import useTenant from "@/context/tenantContext";

type AmazonPrepFormType = {
    docUuid?: string | null;
    onCloseModal: ()=>void;
    onCloseModalWithSuccess: ()=>void;
}


const AmazonPrepForm: React.FC<AmazonPrepFormType> = ({docUuid, onCloseModal, onCloseModalWithSuccess}) => {
    const { tenantData: { alias }} = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();
    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [isLoading, setIsLoading] = useState(false);

    const [amazonPrepOrderData, setAmazonPrepOrderData] = useState<SingleAmazonPrepOrderType|null>(null);
    const [amazonPrepOrderParameters, setAmazonPrepOrderParameters] = useState<AmazonPrepOrderParamsType|null>(null);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const fetchSingleAmazonPrepOrder = useCallback(async (uuid: string) => {
        try {
            setIsLoading(true);

            const requestData = {token, uuid, alias};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetAmazonPrepData', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ViewObject), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ViewObject)) {
                setAmazonPrepOrderData(null);
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal})
                setShowStatusModal(true);
                return null;
            }

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
            const requestData = {token, alias};

            // try {
            //     sendUserBrowserInfo({...getBrowserInfo('GetAmazonPrepParameters'), body: superUser && ui ? {...requestData, ui} : requestData})
            // } catch {}

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
            <Modal title={`Amazon prep`} onClose={onClose} classNames='document-modal'>
                <AmazonPrepFormComponent
                    amazonPrepOrderData={amazonPrepOrderData}
                    amazonPrepOrderParameters={amazonPrepOrderParameters}
                    docUuid={docUuid}
                    closeAmazonPrepOrderModal={onCloseWithSuccess}
                    refetchDoc={()=>{fetchSingleAmazonPrepOrder(docUuid)}}
                />
            </Modal>
        :null}
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
    </div>
}

export default AmazonPrepForm;
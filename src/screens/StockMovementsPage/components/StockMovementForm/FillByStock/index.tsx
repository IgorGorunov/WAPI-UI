import React, {useCallback, useMemo, useState} from "react";
import "./styles.scss";
import useAuth from "@/context/authContext";
import {Controller, useForm} from "react-hook-form";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {ApiResponseType} from "@/types/api";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import Loader from "@/components/Loader";
import {ToastContainer} from "@/components/Toast";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormFieldTypes} from "@/types/forms";
import Button, {ButtonVariant} from "@/components/Button/Button";
import {fillInboundByStock} from "@/services/stockMovements";
import {sendUserBrowserInfo} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";

type PropsType = {
    qualityList: string[];
    onClose: ()=>void;
    setResponseData: (res: ApiResponseType)=>void;
    warehouse: string;
};

const FillByStock: React.FC<PropsType> = ({ qualityList, onClose, setResponseData, warehouse }) => {
    const { tenantData: { alias }} = useTenant();
    const {token, ui, superUser, getBrowserInfo} = useAuth();
    const [isLoading, setIsLoading] = useState(false);


    //form
    const defaultFormValues = useMemo(()=>({
        quality:
            qualityList && qualityList.length
                ? qualityList.map((item, index: number) => (
                    {
                        key: `${item}`,
                        quality: item,
                        enable: false,
                    }))
                : [],
    }),[qualityList]);

    const {control, handleSubmit, formState: { errors, isDirty }} = useForm({
        mode: 'onSubmit',
        defaultValues: defaultFormValues,
    });


    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    // const closeSuccessModal = useCallback(()=>{
    //     setShowStatusModal(false);
    //     onClose();
    // }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const onSubmitForm = async(data) => {

        setIsLoading(true);
        try {
            const requestData = {
                token,
                alias,
                warehouse,
                quality: data.quality.filter(item => item.enable).map(item=>item.quality),
            };

            try {
                sendUserBrowserInfo({...getBrowserInfo('FillStockMovementAllStock'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await fillInboundByStock(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setResponseData(res);
                onClose();

            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;
                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            } else {
                setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Something went wrong! Please, try again later.`, onClose: closeErrorModal})
                setShowStatusModal(true);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={`fill-by-stock`}>
            {(isLoading) && <Loader />}
            <ToastContainer />
            {qualityList ?
                <>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div>
                            {qualityList.map((item, index) => (
                                <div key={`key-${item}`} className='quality-item'>
                                    <Controller
                                        key={`key-${item}`}
                                        name={`quality.${index}.enable`}
                                        control={control}
                                        render={(
                                            {
                                                field: { ...props},
                                                fieldState: {error}
                                            }) => (
                                            <FieldBuilder
                                                disabled={false}
                                                {...props}
                                                name={`quality.${index}.enable`}
                                                label={item}
                                                fieldType={FormFieldTypes.TOGGLE}
                                                errorMessage={error?.message}
                                                errors={errors}
                                            />
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='form-submit-btn'>
                            {/*<Button type='button' variant={ButtonVariant.SECONDARY} disabled={!isDirty} onClick={()=>reset()}>Cancel</Button>*/}
                            <Button type='submit' variant={ButtonVariant.PRIMARY} disabled={!isDirty}>Fill</Button>
                        </div>
                    </form>
                    {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
                </>
                : null
            }
        </div>
    );
};

export default FillByStock;
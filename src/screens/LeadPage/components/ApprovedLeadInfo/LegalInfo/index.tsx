import React, {useCallback, useState} from "react";
import "./styles.scss";
import Button from "@/components/Button/Button";
import {useForm} from "react-hook-form";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import {bankInfoFields, companyInfoFields, otherInfoFields} from "./legalInfoFields";
import {ApiResponseType} from "@/types/api";
import {sendLegalInfo} from "@/services/leads";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import useAuth from "@/context/authContext";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {LegalInfoFormType, UserStatusType} from "@/types/leads";
import Loader from "@/components/Loader";
import {E164Number} from "libphonenumber-js";

type LegalInfoPropsType = {
    legalData: any | null;
}

const LegalInfo:React.FC<LegalInfoPropsType> = ({legalData}) => {
    const {token, userStatus, setUserStatus} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [isDisabled, setIsDisabled] = useState(userStatus === UserStatusType.NoLegalNoPrices || userStatus === UserStatusType.NoLegalPrices);


    const handleContractDownload = async () => {
        const res = await fetch(`/Contract2024.docx`); // Adjust the path accordingly
        const blob = await res.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ContractDraft.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    //form
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm(
        {
            mode: 'onSubmit',
            defaultValues: {
                companyName: legalData?.companyName || '',
                regNo: legalData?.regNo ||'',
                registrationCountry: legalData?.registrationCountry || '',
                legalAddress: legalData?.legalAddress || '',
                vatNo: legalData?.vatNo || '',
                bank: legalData?.bank || '',
                accountNo: legalData?.accountNo || '',
                bankAddress: legalData?.bankAddress || '',
                swiftCode: legalData?.swiftCode || '',
                representedBy: legalData?.representedBy || '',
                actingOnTheBasisOf: legalData?.actingOnTheBasisOf || '',
                phoneNumber: legalData?.phoneNumber as E164Number || 0,
                contractEmail: legalData?.contractEmail || '',
            }
        }
    );


    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        setUserStatus(userStatus === UserStatusType.LegalPrices ? UserStatusType.NoLegalPrices : UserStatusType.NoLegalNoPrices);
        setIsDisabled(true);
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const onSubmitForm = async (data: LegalInfoFormType) => {
        setIsLoading(true);

        try {
            const res: ApiResponseType = await sendLegalInfo(
                {
                    token: token,
                    legalData: data
                }
            );

            if (res && "status" in res) {
                if (res?.status === 200) {
                    //success
                    setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Thank you for submitting information to fill the contract! `, text: ['We will reach out for any necessary additional information.'], onClose: closeSuccessModal, disableAutoClose: true})
                    setShowStatusModal(true);
                    setIsDisabled(true);
                }
            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;
                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Something went wrong...`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const noLegal = userStatus === UserStatusType.NoLegalPrices || userStatus === UserStatusType.NoLegalNoPrices;

    return (
        <div className={`card legal-info`}>
            {isLoading && <Loader />}
            <div className='legal-info__contract-download'>
                <Button icon='download-file' iconOnTheRight onClick={handleContractDownload}>Contract sample</Button>
            </div>
            <div className='legal-info__form-wrapper'>
                <form onSubmit={handleSubmit(onSubmitForm)} autoComplete="off">
                    <div className='grid-row'>
                        <FormFieldsBlock control={control} fieldsArray={companyInfoFields} errors={errors} isDisabled={noLegal || isDisabled}/>
                    </div>
                    <br/><br/>
                    <div className='grid-row'>
                        <FormFieldsBlock control={control} fieldsArray={bankInfoFields} errors={errors} isDisabled={noLegal || isDisabled} />
                    </div>
                    <br/><br/>
                    <div className='grid-row'>
                        <FormFieldsBlock control={control} fieldsArray={otherInfoFields} errors={errors} isDisabled={noLegal || isDisabled} />
                    </div>
                    <div className='legal-info__form-btns'>
                        <Button type='submit' disabled={isDisabled}>Submit contract</Button>
                    </div>
                </form>
            </div>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
};

export default LegalInfo;
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
import LeadTutorialStep from "@/screens/LeadPage/components/LeadTutorialStep";
import leadTutorialInfo from "@/screens/LeadPage/components/ApprovedLeadInfo/leadTutorialUrlsAndTexts";
import {getImportTemplate} from "@/sanity/sanity-utils";
import {toast} from "@/components/Toast";
import {ImportTemplateNamesSanity} from "@/types/importFiles";

type LegalInfoPropsType = {
    legalData: any | null;
}

const LegalInfo:React.FC<LegalInfoPropsType> = ({legalData}) => {
    const {token, userStatus, setUserStatus} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [isDisabled, setIsDisabled] = useState(userStatus === UserStatusType.NoLegalNoPrices || userStatus === UserStatusType.NoLegalPrices);


    const handleContractDownload = async () => {
        const res = await getImportTemplate(ImportTemplateNamesSanity.CONTRACT as string);
        if (res && res.fileUrl) {
            const url = res.fileUrl;
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ContractDraft.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            toast.warn(`Couldn't download the file. Please, try a bit later or contact our IT support.`, {
                position: "top-right",
                autoClose: 5000,
            });
        }
        // const res = await fetch(`/Contract2024.docx`); // Adjust the path accordingly
        // const blob = await res.blob();
        // const url = window.URL.createObjectURL(new Blob([blob]));
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'ContractDraft.docx';
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
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

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Thank you for submitting information to fill the contract! `, text: ['We will reach out for any necessary additional information.'], onClose: closeSuccessModal, disableAutoClose: true})
                setShowStatusModal(true);
                setIsDisabled(true);

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
        <>
            <LeadTutorialStep stepData={leadTutorialInfo.step5} />
            <LeadTutorialStep stepData={leadTutorialInfo.step6} />
            {legalData ? <div className={`card legal-info`}>
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
            </div> : null}
            <ul className='lead-contract-faq__list'>
                <li className='lead-contract-faq__list-item'>
                    <p className='lead-contract-faq__list-item__question'>What to do if I don't have a company and VAT yet?</p>
                    <p className='lead-contract-faq__list-item__answer'>You can register a company and get a VAT number first, then start an onboarding process with WAPI. If you need help we can share with you a proven partner for registration, please contact with manager.</p>
                </li>
                <li className='lead-contract-faq__list-item'>
                    <p className='lead-contract-faq__list-item__question'>What if I have VAT in UK or outside EU and I want to operate in EU?</p>
                    <p className='lead-contract-faq__list-item__answer'>To operate in the EU you must have a company and VAT in the EU.</p>
                </li>
                <li className='lead-contract-faq__list-item'>
                    <p className='lead-contract-faq__list-item__question'>Do I have to register a company and get VAT in each country?</p>
                    <p className='lead-contract-faq__list-item__answer'>No, if you plan to operate in the EU - one country within the EU and one VAT is sufficient.</p>
                </li>
                <li className='lead-contract-faq__list-item'>
                    <p className='lead-contract-faq__list-item__question'>If I have a company in EU but no VAT, can we work?</p>
                    <p className='lead-contract-faq__list-item__answer'>For further work with the product, it is recommended to get VAT, at the same time for work with «WAPI» fulfillment it is enough to have a registered company and willingness to pay taxes. Please contact a manager to get the full information about your individual situation.</p>
                </li>
            </ul>
        </>

    );
};

export default LegalInfo;
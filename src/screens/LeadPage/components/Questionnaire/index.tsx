import React, {useCallback, useEffect, useState} from "react";
import "./styles.scss";
import {QuestionnaireFormType, QuestionnaireParamsType, UserStatusType} from "@/types/leads";
import {useForm} from "react-hook-form";
import {COUNTRIES} from "@/types/countries";
import {
    CodField,
    CompanyNameField,
    CompanyWebpageField,
    DimensionsField,
    PackagingField,
    SalesVolumePerMonthField,
    SkusField,
    WeightField
} from "./questionnaireFiels";
import SingleField from "@/components/FormFieldsBlock/SingleField";
import Checkbox from "@/components/FormBuilder/Checkbox";
import Button from "@/components/Button/Button";
import {ApiResponseType} from "@/types/api";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import {sendQuestionnaire} from "@/services/leads";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import useAuth from "@/context/authContext";
import Loader from "@/components/Loader";
import Router from "next/router";
import {Routes} from "@/types/routes";

type QuestionnairePropsType = {
    questionnaireParams: QuestionnaireParamsType;
    //setStatus: (status: UserStatusType)=>void;
};

const Questionnaire: React.FC<QuestionnairePropsType> = ({questionnaireParams}) => {
    const { token, setUserStatus, logout } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    //countries
    const countryOptions = questionnaireParams ? COUNTRIES.filter(item=> questionnaireParams.targetCountries.includes(item.value.toUpperCase())).map(item => ({label: item.label, value: item.value.toUpperCase()})) : [];

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitErrors, setSubmitErrors] = useState([]);

    //form
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm(
        {
            mode: 'onSubmit',
            defaultValues: {
                companyName: '',
                companyWebpage: '',
                productTypes: [],
                marketplaces: [],
                salesVolumePerMonth: '',
                targetCountries: [],
                skus: '',
                dimensionsOfLargestProduct: '',
                weightOfHeaviestProduct: '',
                additionalPackagingForLastMileDelivery: false,
                needsCOD: false,
            }
        }
    );

    const checkedProductTypes = watch('productTypes');
    const checkedMarketplaces = watch('marketplaces');
    const checkedCountries = watch('targetCountries');

    const updateCheckedValues = (checkedProperty: any, formField: any, value: string, checked: boolean) => {
        if (checked) {
            //addValue
            setValue(formField, [...checkedProperty.filter(item => item !== value), value])
        } else {
            //remove val
            setValue(formField, [...checkedProperty.filter(item => item !== value)]);
        }
    }

    useEffect(() => {
        if (isSubmitted) {
            checkValidity();
        }
    }, [checkedProductTypes, checkedMarketplaces,checkedCountries]);


    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(async ()=>{
        setShowStatusModal(false);
        logout();
        await Router.push(Routes.Login);
        //closeOrderModal();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const checkValidity = () => {

        const curSubmitErrors = [];
        let isNotValid = false;
        if (checkedProductTypes.length === 0) {
            isNotValid = true;
            curSubmitErrors.push('Please, choose at least one product type!');
        }

        if (checkedCountries.length === 0) {
            isNotValid = true;
            curSubmitErrors.push('Please, choose at least one target country!');
        }

        setSubmitErrors(curSubmitErrors);

        return isNotValid
    }

    const onSubmitForm = async (data: QuestionnaireFormType) => {
        setIsSubmitted(true);
        if (checkValidity()) {
            return;
        }

        setIsLoading(true);

        try {

            const res: ApiResponseType = await sendQuestionnaire(
                {
                    token: token,
                    leadData: data
                }
            );

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Thank you for sharing your responses.`, text: ['We will reach out for any necessary additional information.'], onClose: closeSuccessModal, disableAutoClose: true})
                setShowStatusModal(true);
                setUserStatus(UserStatusType.Waiting);

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

    const onError = () => {
        setIsSubmitted(true);
        checkValidity();
    }

    return (
        <>
            <p className='lead-page__warning-text'>
                To access the UI system, please fill out the form with information about your business
            </p>
            <div className={`card lead-questionnaire`}>
                {isLoading && <Loader />}
                {/*<div className={`title-h3`}>Client information</div>*/}
                <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
                    <input autoComplete="false" name="hidden" type="text" style={{display: 'none'}}/>
                    <div className={`lead-questionnaire__questions`}>
                        <div className={`grid-row`}>
                            <SingleField key={CompanyNameField.name} curField={CompanyNameField} control={control}
                                         errors={errors}/>
                            <SingleField key={CompanyWebpageField.name} curField={CompanyWebpageField} control={control}
                                         errors={errors}/>

                            <ul className={`lead-questionnaire__product-types-list lead-questionnaire-list`}>
                                <p className={`lead-questionnaire-list-title`}>
                                    Product categories *
                                </p>
                                {questionnaireParams ? questionnaireParams.productTypes.map((item, index) => (
                                    <li key={item + '_' + index}
                                        className='lead-questionnaire-list-item width-33'>
                                        <Checkbox
                                            name={item}
                                            label={item}
                                            checked={checkedProductTypes.includes(item)}
                                            onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                                                updateCheckedValues(checkedProductTypes, 'productTypes', item, val.target.checked)
                                            }}
                                        />
                                    </li>
                                )) : null}
                            </ul>
                            <ul className={`lead-questionnaire-list grid-row`}>
                                <p className={`lead-questionnaire-list-title`}>
                                    Choose your marketplaces (if any)
                                </p>
                                {questionnaireParams ? questionnaireParams.marketplaces.map((item, index) => (
                                    <li key={item + '_' + index}
                                        className='lead-questionnaire-list-item width-33'>
                                        <Checkbox
                                            name={item}
                                            label={item}
                                            checked={checkedMarketplaces.includes(item)}
                                            onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                                                updateCheckedValues(checkedMarketplaces, 'marketplaces', item, val.target.checked)
                                            }}
                                        />
                                    </li>
                                )) : null}
                            </ul>
                            <ul className={`lead-questionnaire-list grid-row`}>
                                <p className={`lead-questionnaire-list-title`}>
                                    Target countries *
                                </p>
                                {countryOptions.map((item, index) => (
                                    <li key={item.value + '_' + index}
                                        className='lead-questionnaire-list-item width-33'>
                                        <Checkbox
                                            name={item.value}
                                            label={item.label}
                                            checked={checkedCountries.includes(item.value)}
                                            isCountry={true}
                                            flagBefore={true}
                                            onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                                                updateCheckedValues(checkedCountries, 'targetCountries', item.value, val.target.checked)
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                            <SingleField key={SalesVolumePerMonthField.name} curField={SalesVolumePerMonthField}
                                         control={control} errors={errors}/>
                            <SingleField key={SkusField.name} curField={SkusField} control={control} errors={errors}/>
                            <SingleField key={DimensionsField.name} curField={DimensionsField} control={control}
                                         errors={errors}/>
                            <SingleField key={WeightField.name} curField={WeightField} control={control} errors={errors}/>
                            <SingleField key={PackagingField.name} curField={PackagingField} control={control}
                                         errors={errors}/>
                            <SingleField key={CodField.name} curField={CodField} control={control} errors={errors}/>


                        </div>
                        {isSubmitted && submitErrors.length ?
                            <div className={`lead-questionnaire__errors`}>
                                {submitErrors.map(error => <p key={error} className={'submit-error'}>{error}</p>)}
                            </div> : null
                        }
                        <div className={`lead-questionnaire__btns`}>
                            <Button type='submit'>Submit for review</Button>
                        </div>
                    </div>
                </form>
                {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
            </div>
        </>
    );
};

export default Questionnaire;

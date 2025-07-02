import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import "./styles.scss";
import {QuestionnaireFormType, QuestionnaireParamsType, UserStatusType} from "@/types/leads";
import {useFieldArray, useForm} from "react-hook-form";
import {COUNTRIES} from "@/types/countries";
import {
    CodField,
    CompanyNameField,
    CompanyWebpageField,
    DimensionsField,
    PackagingField,
    ProductTypeDescriptions_NameField,
    ProductTypeDescriptions_LinkField,
    ProductTypeDescriptionsFields2,
    SalesVolumePerMonthField,
    SkusField,
    WeightField, CompanyVatFields
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
import {FormFieldTypes, WidthType} from "@/types/forms";
import Icon from "@/components/Icon";
import ProductImagesWithPreview from "@/screens/LeadPage/components/Questionnaire/ProductImagesWithPreview";
import axios from "axios";
import {AttachedFilesType} from "@/types/utility";
import useTenant from "@/context/tenantContext";

type ProductTypeDescriptionType = {
    productTypeName: string;
    productLink: string;
    productPhoto: AttachedFilesType[],
    hazmat: boolean;
    hasSerialNumbers: boolean;
    batches: boolean;
    cbdProduct: boolean;
    food: boolean;
    alcohol: boolean;
    cigarettes: boolean;
    fragile: boolean;
    glass: boolean;
    flammable: boolean;
    liquid: boolean;
};

const emptyProductTypeDescription = {
    productTypeName: '',
    productLink: '',
    productPhoto: [] as AttachedFilesType[],
    hazmat: false,
    hasSerialNumbers: false,
    batches: false,
    cbdProduct: false,
    food: false,
    alcohol: false,
    cigarettes: false,
    fragile: false,
    glass: false,
    flammable: false,
    liquid: false,
} as ProductTypeDescriptionType;

type QuestionnairePropsType = {
    questionnaireParams: QuestionnaireParamsType;
    //setStatus: (status: UserStatusType)=>void;
};

const Questionnaire: React.FC<QuestionnairePropsType> = ({questionnaireParams}) => {
    const { tenantData: { alias }} = useTenant();
    const { token, setUserStatus, logout } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    //countries
    const countryOptions = questionnaireParams ? COUNTRIES.filter(item=> questionnaireParams.targetCountries.includes(item.value.toUpperCase())).map(item => ({label: item.label, value: item.value.toUpperCase()})) : [];

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitErrors, setSubmitErrors] = useState([]);
    const [vatErrorText, setVarErrorText] = useState("");

    //form
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        watch,
        setError,
    } = useForm(
        {
            mode: 'onSubmit',
            defaultValues: {
                companyName: '',
                companyWebpage: '',
                vatNo: '',
                companyWorksWithoutVAT: false,
                productTypes: [],
                marketplaces: [],
                salesVolumePerMonth: 0,
                targetCountries: [],
                skus: 0,
                dimensionsOfLargestProduct: '',
                weightOfHeaviestProduct: 0,
                additionalPackagingForLastMileDelivery: false,
                needsCOD: false,
                productTypeDescriptions: [{...emptyProductTypeDescription}] as ProductTypeDescriptionType[],
            }
        }
    );

    const productTypeDescriptions = watch('productTypeDescriptions');
    const { append: addProduct, remove: removeProduct } = useFieldArray({ control, name: 'productTypeDescriptions' });

    const checkedProductTypes = watch('productTypes');
    const checkedMarketplaces = watch('marketplaces');
    const checkedCountries = watch('targetCountries');
    const companyWorksWithoutVAT = watch('companyWorksWithoutVAT');
    const vatNumber = watch('vatNo');

    const updateCheckedValues = (checkedProperty: any, formField: any, value: string, checked: boolean) => {
        if (checked) {
            //addValue
            setValue(formField, [...checkedProperty.filter(item => item !== value), value])
        } else {
            //remove val
            setValue(formField, [...checkedProperty.filter(item => item !== value)]);
        }
    }

    const handleRemoveProduct = (index) => {
        removeProduct(index);
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
    }, []);

    //check VAT validity
    const checkVAT = async(vat: string) => {
        if (!vat || vat.length < 6) {
            return {status: 'invalid'};
        }

        const countryCode = vat.slice(0,2);
        const vatNumber = vat.slice(2);

        const res = await axios.post("/api/validate-vat", {countryCode: countryCode.toString().toUpperCase(), vatNumber });

        if (res.status===200 && res.data) {
            if (res.data.valid) return {status: 'valid'};
            if (res.data.source && !res.data.source.includes('Error')) return {status: 'invalid'};
        }

        return {status: 'error'};
    }

    // const productTypeDescriptionFields1 = useMemo(()=>ProductTypeDescriptionsFields1(),[]);
    const changeProductPhotos = (index: number, files: AttachedFilesType[]) => {
        setValue(`productTypeDescriptions.${index}.productPhoto`, files);
    }

    const checkVatNumber = (val: ChangeEvent) => {
        const isChecked = 'checked' in val.target ?  val.target.checked as boolean : false;
        setValue('companyWorksWithoutVAT', isChecked);
    }

    const companyVatFields = useMemo(()=>CompanyVatFields({companyWorksWithoutVAT, errorText: vatErrorText, checkVatNumber}), [companyWorksWithoutVAT, vatErrorText, checkVatNumber]);

    const checkValidity = async() => {

        const curSubmitErrors = [];
        let isNotValid = false;

        const curVat = getValues('vatNo');
        if (curVat && !companyWorksWithoutVAT) {
            const checkResult = await checkVAT(curVat);

            if (checkResult) {
                if (checkResult.status === 'invalid') {
                    setError("vatNo", {type: "manual", message: "Please, enter valid VAT"});
                }
            }
        }

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
        const hasErrors = await checkValidity();
        if (hasErrors) {
            return;
        }

        if (data.companyWorksWithoutVAT) {
            data.vatNo = '';
        }

        setIsLoading(true);

        try {

            const res: ApiResponseType = await sendQuestionnaire({ token, alias, leadData: data });

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

                            {companyVatFields.map((field, index) => (
                                <SingleField
                                    key={field.name + '_' + index}
                                    curField={{
                                        ...field,
                                    }}
                                    control={control}
                                    errors={errors}
                                />
                            ))}
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
                        <div className='product-type-descriptions'>
                            {/*<p className="product-type-descriptions__title">*/}
                            {/*    Please, describe types of the products you sell.*/}
                            {/*</p>*/}
                            <p className="product-type-descriptions__title">
                                Please, specify each TYPE of the products you sell
                            </p>
                            <p className="product-type-descriptions__sub-title-description">
                                For example, if you sell shampoos, you don't need to specify each SKU, you just need to specify one example
                            </p>
                            <ul className='product-type-descriptions__list'>
                                {productTypeDescriptions.map((item, index) => (
                                    <li className='product-type-descriptions__list-item'
                                        key={`productTypeDescription.${index}.productTypeName-item`}>
                                        <div className={`grid-row`}>
                                            <SingleField
                                                key={`productTypeDescriptions.${index}.productTypeName`}
                                                curField={{
                                                    ...ProductTypeDescriptions_NameField,
                                                    name: `productTypeDescriptions.${index}.productTypeName`
                                                }}
                                                control={control}
                                                errors={errors}
                                            />
                                            <SingleField
                                                key={`productTypeDescriptions.${index}.productLink`}
                                                curField={{
                                                    ...ProductTypeDescriptions_LinkField,
                                                    name: `productTypeDescriptions.${index}.productLink`,
                                                    rules: {
                                                        required: productTypeDescriptions[index].productPhoto.length
                                                            ? false
                                                            : 'Please, fill link to the product page or add photo of the product/product type'
                                                    }
                                                }}
                                                control={control}
                                                errors={errors}
                                            />

                                            <SingleField
                                                key={`productTypeDescriptions.${index}.productPhoto`}
                                                control={control}
                                                curField={{
                                                    name: `productTypeDescriptions.${index}.productPhoto`,
                                                    fieldType: FormFieldTypes.OTHER,
                                                    label: 'Please, add photo of the product type',
                                                    otherComponent: <ProductImagesWithPreview
                                                        productPhotos={productTypeDescriptions[index].productPhoto || []}
                                                        onChange={(files: AttachedFilesType[]) => changeProductPhotos(index, files)}
                                                    />,
                                                    width: WidthType.w100,
                                                    classNames: 'photo-lead',
                                                }}
                                                errors={errors}/>
                                            {ProductTypeDescriptionsFields2.map(field => (
                                                <SingleField
                                                    key={field.name + '_' + index}
                                                    curField={{
                                                        ...field,
                                                        name: `productTypeDescriptions.${index}.${field.name}`,
                                                    }}
                                                    control={control}
                                                    errors={errors}
                                                />
                                            ))}
                                        </div>
                                        {productTypeDescriptions.length > 1 ? (
                                            <button className="product-type-descriptions__list-item-remove-btn"
                                                    type='button' onClick={() => handleRemoveProduct(index)}>
                                                <Icon name="waste-bin"/>
                                            </button>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                            <div className="product-type-descriptions__add-product-btn-wrapper">
                                <Button onClick={() => addProduct({...emptyProductTypeDescription})} icon={'add'}>Add
                                    another product / product type</Button>
                            </div>
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

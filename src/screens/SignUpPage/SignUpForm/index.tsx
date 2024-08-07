import React, {useCallback, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Routes} from "@/types/routes";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Button from "@/components/Button/Button";
import "./styles.scss";
import {signUpFormFields} from "./SingUpFormFields";
import Link from "next/link";
import "react-phone-number-input/style.css";
import {ApiResponseType} from "@/types/api";
import {signUp} from "@/services/signUp";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import Router, {useRouter} from "next/router";

type SignUpFormPropsType = {
    utm?: any;
}
const SignUpForm: React.FC<SignUpFormPropsType> = ({utm}) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [utmQuery, setUtmQuery] = useState<any>({});

    //getting uuid from query
    useEffect(() => {
        const query = router.query;
        const utmQuery = {};
        const keys = Object.keys(query).filter(key => key!=='oneTimeToken');
        keys.map(key => {
            utmQuery[key.replace('amp;','')]=query[key];
        })

        setUtmQuery(utmQuery);
    }, [router.query]);

    const {
        control,
        handleSubmit,
        watch,
        reset,
    } = useForm({ mode: "onSubmit" });

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        reset();
        Router.push(Routes.Login);
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const handleFormSubmit = async (data: any) => {
        const lead = {lead: data, utm: utm || utmQuery};

        try {
            setIsLoading(true);
            setError(null);
            const res: ApiResponseType = await signUp(lead);

            if (res?.status === 200) {
                //success modal
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Congratulations! Sign-up complete!
                The confirmation email is on its way to the email you provided.`, onClose: closeSuccessModal, disableAutoClose:true })
                setShowStatusModal(true);
            } else if (res?.response) {
                //error modal
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            } else {
                //something went wrong
                setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", text: ['Something went wrong. Please, try again a bit later.'], onClose: closeErrorModal})
                setShowStatusModal(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const checkbox = watch('personalData');

    return (
        <div className={`card sign-up-form`}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                {signUpFormFields.map((curField: any ) => (
                    <div key={curField.name} className='grid-row'>
                        <Controller
                            name={curField.name}
                            control={control}
                            render={({field: { ...props}, fieldState: {error}}) => (
                                <FieldBuilder
                                    {...curField}
                                    {...props}
                                    type={curField.type}
                                    name={curField.name}
                                    label={curField.label}
                                    fieldType={curField.fieldType}
                                    placeholder={curField.placeholder}
                                    errorMessage={error?.message}
                                    isRequired={!!curField.rules?.required || false}
                                /> )}
                            rules = {curField.rules}
                        />
                    </div>

                ))}

                {error && <p className="sign-up-error">{error}</p>}
                <div className="sign-up-submit-block">

                    <Button
                        type="submit"
                        icon={"arrow-right"}
                        iconOnTheRight={true}
                        disabled={isLoading || !checkbox}
                    >
                        Register
                    </Button>
                </div>

            </form>
            <div className={`sign-up--login`}>
                Already have an account? <Link href={Routes.Login} className={`sign-up--login-link`}>Login</Link>
            </div>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
};

export default SignUpForm;

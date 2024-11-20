import React, {useCallback, useState} from "react";

import "./styles.scss";
import Button from "@/components/Button/Button";
import {Controller, useForm} from "react-hook-form";
import Loader from "@/components/Loader";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {changePassword} from "@/services/profile";
import useAuth from "@/context/authContext";
import {ApiResponseType} from "@/types/api";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import {FormBuilderType, FormFieldTypes, WidthType} from "@/types/forms";
import {sendUserBrowserInfo} from "@/services/userInfo";

type ChangePasswordPropsType = {
    onClose: ()=>void;
}

const ChangePassword: React.FC<ChangePasswordPropsType> = ({onClose}) => {
    const {token, superUser, ui, getBrowserInfo} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        onClose();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const {
        control,
        handleSubmit,
        watch,
    } = useForm({ mode: "onSubmit" });

    const newPassword = watch('newPassword');
    const confirmPassword = watch('confirmPassword');

    const changePasswordFormFields: FormBuilderType[] = [
        {
            fieldType: FormFieldTypes.TEXT,
            type: "password",
            name: "currentPassword",
            label: "Current password",
            placeholder: "********",
            rules: {
                required:  "Please, enter valid password!",
                minLength: {
                    value: 3,
                    message: "Password has to be at least 3 symbols!"
                },
            },
            errorMessage: "Please, enter valid password!",
            width: WidthType.w100,
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "password",
            name: "newPassword",
            label: "New password",
            placeholder: "********",
            rules: {
                required:  "Please, enter valid password!",
                minLength: {
                    value: 3,
                    message: "Password has to be at least 3 symbols!"
                },
            },
            errorMessage: "Please, enter valid password!",
            width: WidthType.w100,
            needToasts: false,
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "password",
            name: "confirmPassword",
            label: "Confirm new password",
            placeholder: "********",
            rules: {
                required:  "Please, enter valid password!",
                minLength: {
                    value: 3,
                    message: "Password has to be at least 3 symbols!"
                },
                validate: (value) => value === newPassword || 'Passwords do not match',
            },
            errorMessage: "Please, enter valid password!",
            width: WidthType.w100,
            needToasts: false,
        },
    ];

    const handleFormSubmit = async (data: any) => {
        try {
            setIsLoading(true);
            const requestData = {token, currentPassword: data.currentPassword, newPassword: data.newPassword};

            try {
                sendUserBrowserInfo({...getBrowserInfo('ChangePassword'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponseType = await changePassword(superUser && ui ? {...requestData, ui} : requestData);

            if (res?.status === 200) {
                //display success modal
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Password is changed successfully!`, onClose: closeSuccessModal})
                setShowStatusModal(true);

            } else  if (res && 'response' in res ) {
                //show error modal
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`change-password`}>
            {isLoading && <Loader />}
            <form className='change-password-form' onSubmit={handleSubmit(handleFormSubmit)}>
                {changePasswordFormFields.map((curField: any ) => (

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
                <div className="change-password-submit-block">
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        Submit
                    </Button>
                </div>
            </form>
            {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        </div>
    );
};

export default ChangePassword;

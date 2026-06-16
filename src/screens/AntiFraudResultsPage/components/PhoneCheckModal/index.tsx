import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button, { ButtonVariant } from "@/components/Button/Button";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import { FormFieldTypes } from "@/types/forms";
import { getAntiFraudResultByPhoneNumber } from "@/services/antiFraud";
import useAuth from "@/context/authContext";
import useTenant from "@/context/tenantContext";
import {AntiFraudResultObject} from "../../types";
import styles from "./styles.module.scss";
import {sendUserBrowserInfo} from "@/services/userInfo";
import {AccessActions, AccessObjectTypes} from "@/types/auth";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";

type PhoneCheckModalProps = {
    onClose: () => void;
    onSuccess: (data: AntiFraudResultObject, phone: string) => void;
};

const PhoneCheckModal: React.FC<PhoneCheckModalProps> = ({ onClose, onSuccess }) => {
    const { tenantData: { alias } } = useTenant();
    const { token, ui, getBrowserInfo } = useAuth();
    
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    // const closeSuccessModal = useCallback(() => {
    //     setShowStatusModal(false);
    //     closeOrderModal();
    // }, []);
    // const closeErrorModal = useCallback(() => {
    //     setShowStatusModal(false);
    // }, [])

    const handleCheck = async () => {
        if (!phoneNumber || phoneNumber.length < 7) {
            setError("Please enter a valid phone number.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            sendUserBrowserInfo({ ...getBrowserInfo('CheckMobile', AccessObjectTypes["AntiFraud/PhoneChecker"], AccessActions.View), body: {token, ui, alias} });
        } catch { }

        try {
            const parsedPhone = parsePhoneNumberFromString(phoneNumber);
            const country = parsedPhone?.country;

            const res = await getAntiFraudResultByPhoneNumber({
                token,
                alias,
                ui,
                phoneNumber,
                country
            });

            if (res?.data) {
                const parsed: AntiFraudResultObject =
                    typeof res.data === "string"
                        ? JSON.parse(res.data)
                        : res.data;
                
                onSuccess(parsed, phoneNumber);
            } else if (res.response?.data?.errorMessage)  {
                const errorMessages = res.response?.data?.errorMessage;

                setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", text: errorMessages, onClose: ()=>setShowStatusModal(false) })
                setShowStatusModal(true);
            }
        } catch (err) {
            console.error("Failed to fetch AntiFraud result by phone number:", err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal title="Check Phone Number" onClose={onClose}>
            <>
                <div className={`card ${styles["phone-check-modal"]}`}>
                    <FieldBuilder
                        fieldType={FormFieldTypes.PHONE_NUMBER}
                        name="phoneNumber"
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={(val: string) => {
                            setPhoneNumber(val);
                            setError(null);
                        }}
                        onKeyDownFn={handleCheck}
                        placeholder="Enter phone number"
                    />

                    {error && <div className={styles["error-message"]}>{error}</div>}

                    <div className={styles["actions"]}>
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={handleCheck}
                            disabled={isLoading}
                        >
                            {isLoading ? "Checking..." : "Check"}
                        </Button>
                    </div>
                </div>
                {showStatusModal && <ModalStatus {...modalStatusInfo} />}
            </>
        </Modal>
    );
};

export default PhoneCheckModal;

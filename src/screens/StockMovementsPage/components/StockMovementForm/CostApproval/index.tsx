import React, {useCallback, useState} from "react";
import {STOCK_MOVEMENT_DOC_TYPE, StockMovementDeliveryCostApprovalType} from "@/types/stockMovements";
import styles from "./styles.module.scss";
import {formatDateStringToDisplayString} from "@/utils/date";
import Button, {ButtonVariant} from "@/components/Button/Button";
import {ProcessApproval, updateInboundData} from "@/services/stockMovements";
import {getAccessActionObject} from "@/screens/StockMovementsPage";
import {sendUserBrowserInfo} from "@/services/userInfo";
import {AccessActions} from "@/types/auth";
import useAuth from "@/context/authContext";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import useTenant from "@/context/tenantContext";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import Modal from "@/components/Modal";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormFieldTypes} from "@/types/forms";

type PropsType = {
    docName: string;
    uuid: string;
    docType: STOCK_MOVEMENT_DOC_TYPE;
    costApproval?: StockMovementDeliveryCostApprovalType[];
    refetchDoc?: () => void;
};

const CostApproval: React.FC<PropsType> = ({ costApproval, docName, uuid, docType, refetchDoc }) => {
    const { token, superUser, ui, getBrowserInfo } = useAuth();
    const { tenantData: { alias, orderTitles } } = useTenant();

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const closeErrorModal = useCallback(() => {
        setShowStatusModal(false);
    }, []);
    const closeSuccessModal = useCallback(() => {
        setShowStatusModal(false);
        if (refetchDoc) {
            refetchDoc();
        }
    }, [refetchDoc]);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: closeErrorModal })

    //reject modal
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState<string>("Need a cheaper rate");
    const [rejectComment, setRejectComment] = useState<string>("");
    const [rejectPrice, setRejectPrice] = useState<string>("");
    const [rejectETD, setRejectETD] = useState<string>("");
    const [rejectError, setRejectError] = useState<string>("");

    const closeRejectModal = useCallback(() => {
        setShowRejectModal(false);
        setRejectReason("Need a cheaper rate");
        setRejectComment("");
        setRejectPrice("");
        setRejectETD("");
        setRejectError("");
    }, []);
    const history = costApproval.filter(item => item.Status !== "Awaiting cost approval");

    const needApproval = costApproval.filter(item => item.Status === "Awaiting cost approval");

    const handleApprove = async(item: StockMovementDeliveryCostApprovalType) => {
        console.log('approve');
        try {
            sendUserBrowserInfo({ ...getBrowserInfo('ApproveDeliveryCost', getAccessActionObject(docType), AccessActions.EditObject), body: { uuid: uuid || '' } });
        } catch { }


        try {
            const requestData = {
                token,
                alias,
                uuid: uuid,
                status: "Approved",
                requestedPrice: item.CustomerPrice,
            };

            const res = await ProcessApproval(superUser && ui ? { ...requestData, ui } : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Thank you! Cost is approved!`, onClose: closeSuccessModal })
                setShowStatusModal(true);

            } else if (res && 'response' in res) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse && 'errorMessage' in errResponse.data) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal })
                    setShowStatusModal(true);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleReject = async(data) => {
        console.log('reject');

        try {
            sendUserBrowserInfo({ ...getBrowserInfo('ApproveDeliveryCost', getAccessActionObject(docType), AccessActions.EditObject), body: { uuid: uuid || '' } });
        } catch { }


        try {
            const requestData = {
                token,
                alias,
                uuid: uuid,
                status: "Rejected",
                ...data,
            };

            console.log('requestData', requestData);

            const res = await ProcessApproval(superUser && ui ? { ...requestData, ui } : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Thank you! Cost is rejected!`, onClose: closeSuccessModal })
                setShowStatusModal(true);

            } else if (res && 'response' in res) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse && 'errorMessage' in errResponse.data) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal })
                    setShowStatusModal(true);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <div className={styles["stock-movement-cost-approval"]}>
            {
                needApproval.length ? (
                    <div className={styles["stock-movement-cost-approval__approval-block-wrapper"]}>
                        {needApproval.map((item: StockMovementDeliveryCostApprovalType, index: number) => (
                            <div className={styles["stock-movement-cost-approval__approval-block"]}>
                                <p className={styles["stock-movement-cost-approval__approval-block-title"]}>Please approve the cost of the delivery!</p>

                                <p>
                                    <span className={styles['approval-block__title']}>Document: </span>
                                    <span className={styles['approval-block__value']}>{docName}</span>
                                </p>
                                <p>
                                    <span className={styles['approval-block__title']}>Price: </span>
                                    <span className={styles['approval-block__value']}>€ {item.CustomerPrice}</span>
                                </p>
                                <p>
                                    <span className={styles['approval-block__title']}>ETD: </span>
                                    <span className={styles['approval-block__value']}>{item.ETD ? formatDateStringToDisplayString(item.ETD) : ''}</span>
                                </p>
                                {item.Comment ? (
                                    <p>
                                        <span className={styles['approval-block__title']}>Comment: </span>
                                        <span className={styles['approval-block__value']}>{item.Comment}</span>
                                    </p>
                                ): null}

                                <div className={styles['approval-block__buttons-wrapper']}>
                                    <Button type={"button"} variant={ButtonVariant.PRIMARY} onClick={()=>handleApprove(item)}>Approve</Button>
                                    <Button type={"button"} variant={ButtonVariant.TETRIARY} classNames={styles['reject-button']} onClick={()=>setShowRejectModal(true)}>Reject</Button>
                                </div>
                            </div>))
                        }
                    </div>
                ) : null
            }

            {history.length ? (
                <div className={styles["stock-movement-cost-approval__history"]}>
                    <p className={`title-h4 ${styles["stock-movement-cost-approval__history-title"]}`}>History of cost approvals</p>
                    <div className={styles["stock-movement-cost-approval__history-header"]}>
                        <div className={`${styles['column']} ${styles['eta-column']}`}>ETA</div>
                        <div className={`${styles['column']} ${styles['etd-column']}`}>ETD</div>
                        <div className={`${styles['column']} ${styles['cost-column']}`}>Delivery cost (euro)</div>
                        <div className={`${styles['column']} ${styles['status-column']}`}>Status</div>
                        <div className={`${styles['column']} ${styles['comment-column']}`}>Comment</div>
                    </div>
                    <ul className={styles["stock-movement-cost-approval__history-list"]}>
                        {history &&
                            history.map((item: StockMovementDeliveryCostApprovalType, index: number) => (
                                <li
                                    key={item.ETA+ "_" + item.ETD + "_" + item.Comment + "_" + item.CustomerPrice + "_" + index}
                                    className={`${styles["stock-movement-cost-approval__history-list-item"]} ${
                                        index % 2 === 1 ? styles["highlight"] : " "
                                    }`}
                                >
                                    <div className={`${styles['column']} ${styles['eta-column']}`}>{item.ETA ? formatDateStringToDisplayString(item.ETA) : ""}</div>
                                    <div className={`${styles['column']} ${styles['etd-column']}`}>{item.ETD ? formatDateStringToDisplayString(item.ETD) : ''}</div>
                                    <div className={`${styles['column']} ${styles['cost-column']}`}>{item.CustomerPrice}</div>
                                    <div className={`${styles['column']} ${styles['status-column']}`}>{item.Status}</div>
                                    <div className={`${styles['column']} ${styles['comment-column']}`}>{item.Comment}</div>
                                </li>
                            ))}
                    </ul>
                </div>) : null
            }

            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
            {showRejectModal &&
                <Modal title={`Reason for rejection`} onClose={ closeRejectModal } >
                    <div className={`card ${styles['reject-modal-wrapper']}`}>
                        <FieldBuilder
                            name="rejectReason"
                            fieldType={FormFieldTypes.SELECT}
                            label="Reason *"
                            value={rejectReason}
                            onChange={(val: string) => setRejectReason(val)}
                            options={[
                                { label: "Need a cheaper rate", value: "Need a cheaper rate" },
                                { label: "Need faster delivery", value: "Need faster delivery" },
                                { label: "Other", value: "Other" }
                            ]}
                            isRequired={true}
                        />

                        <FieldBuilder
                            name="rejectComment"
                            fieldType={FormFieldTypes.TEXT_AREA}
                            label={`Comment ${rejectReason === 'Other' ? '*' : ''}`}
                            value={rejectComment}
                            onChange={(val: string) => setRejectComment(val)}
                            isRequired={rejectReason === 'Other'}
                        />

                        <FieldBuilder
                            name="rejectPrice"
                            fieldType={FormFieldTypes.NUMBER}
                            label="Desired price"
                            value={rejectPrice}
                            onChange={(val: string) => setRejectPrice(val)}
                        />

                        <FieldBuilder
                            name="rejectETD"
                            fieldType={FormFieldTypes.DATE}
                            label="Desired delivery date"
                            value={rejectETD}
                            onChange={(val: string) => setRejectETD(val)}
                        />

                        {rejectError && <p className="error" style={{color: 'var(--color-red, red)', marginTop: '10px'}}>{rejectError}</p>}

                        <div className={styles['reject-modal-actions']}>
                            <Button type="button" variant={ButtonVariant.PRIMARY} onClick={() => {
                                if (rejectReason === 'Other' && !rejectComment.trim()) {
                                    setRejectError("Comment is required for 'Other' reason");
                                    return;
                                }
                                setRejectError("");
                                handleReject({
                                    rejectionReason: rejectReason,
                                    comment: rejectComment,
                                    requestedPrice: rejectPrice,
                                    requestedDeliveryDate: rejectETD
                                });
                                closeRejectModal();
                            }}>Submit</Button>
                        </div>
                    </div>
                </Modal>
            }

        </div>
    );
};

export default CostApproval;

import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from "./styles.module.scss";
// import '@/styles/forms.scss';
import useAuth from "@/context/authContext";
import {AccessActions} from "@/types/auth";
import useHintsTracking from "@/context/hintsContext";
import type {Control} from "react-hook-form";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import Tabs from '@/components/Tabs';
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {COUNTRIES} from "@/types/countries";
import {createOptions} from "@/utils/selectOptions";
import {CargoFields, DetailsFields, GeneralFields} from "./StockMovementFormFields";
import {TabFields, TabTitles} from "./StockMovementFormTabs";
import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import Icon from "@/components/Icon";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import StatusHistory from "./StatusHistory";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {message, Table, Tooltip} from "antd";
import DropZone from "@/components/Dropzone";
import Services from "./Services";
import {useTabsState} from "@/hooks/useTabsState";
import Loader from "@/components/Loader";
import {toast, ToastContainer} from '@/components/Toast';
import {
    SingleStockMovementFormType,
    SingleStockMovementType,
    STOCK_MOVEMENT_DOC_SUBJECT,
    STOCK_MOVEMENT_DOC_TYPE,
    StockMovementParamsType
} from "@/types/stockMovements";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {cancelStockMovement, fillInboundByStock, sendInboundData, updateInboundData} from "@/services/stockMovements";
import {SingleOrderProductFormType} from "@/types/orders";
import Modal from "@/components/Modal";
import ImportFilesBlock from "@/components/ImportFilesBlock";
import {ImportFilesType} from "@/types/importFiles";
import ProductsTotal from "@/screens/StockMovementsPage/components/StockMovementForm/ProductsTotal";
import {AttachedFilesType, STATUS_MODAL_TYPES} from "@/types/utility";
import ProductSelection, {SelectedProductType} from "@/components/ProductSelection";
import DocumentTickets from "@/components/DocumentTickets";
import SingleDocument from "@/components/SingleDocument";
import {NOTIFICATION_OBJECT_TYPES, NOTIFICATION_STATUSES, NotificationType} from "@/types/notifications";
import {TICKET_OBJECT_TYPES} from "@/types/tickets";
import {formatDateStringToDisplayString} from "@/utils/date";
import CardWithHelpIcon from "@/components/CardWithHelpIcon";
import {StockMovementsHints} from "@/screens/StockMovementsPage/stockMovementsHints.constants";
import {ProductHints} from "@/screens/ProductsPage/productsHints.constants";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import {docNamesSingle, getAccessActionObject} from "@/screens/StockMovementsPage";
import {CommonHints} from "@/constants/commonHints";
import useNotifications from "@/context/notificationContext";
import ConfirmModal from "@/components/ModalConfirm";
import {sendUserBrowserInfo} from "@/services/userInfo";
import HintsModal from "@/screens/StockMovementsPage/components/StockMovementForm/HintsModal";
import useTenant from "@/context/tenantContext";
import {isTabAllowed} from "@/utils/tabs";
import CostApproval from "@/screens/StockMovementsPage/components/StockMovementForm/CostApproval";


type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';


type StockMovementFormType = {
    docType: STOCK_MOVEMENT_DOC_TYPE,
    docData?: SingleStockMovementType;
    docParameters?: StockMovementParamsType;
    closeDocModal: () => void;
    refetchDoc: () => void;
    forbiddenTabs: string[] | null;
}

export enum DELIVERY_METHODS {
    CONTAINER = 'Container',
    FULL_TRACK = 'Full track',
    PLL = 'PLL',
    CARTONS = 'Cartons'
}

//const deliveryTypesDefault = [CONTAINER,'FullTrack', 'PLL', 'Cartons'];
const deliveryMethodOptions = [
    { value: DELIVERY_METHODS.CONTAINER, label: 'Container' },
    { value: DELIVERY_METHODS.FULL_TRACK, label: 'Full track' },
    { value: DELIVERY_METHODS.PLL, label: 'PLL' },
    { value: DELIVERY_METHODS.CARTONS, label: 'Cartons' }
];



const EU_COUNTRY_CODES = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

const isRegDocCategory = (category?: string): boolean => {
    if (!category) return false;
    const cat = category.trim().toLowerCase();
    return (
        cat === 'cosmetics' ||
        cat.includes('nutra') ||
        cat.includes('supplement')
    );
};

const getDocCountryCode = (doc: any, fallbackCountry?: string): string => {
    let countryVal = '';
    if (typeof doc?.country === 'string') {
        countryVal = doc.country.trim();
    } else if (doc?.country && typeof doc.country === 'object') {
        if (doc.country.id && typeof doc.country.id === 'string' && doc.country.id.trim().length === 2) {
            return doc.country.id.trim().toUpperCase();
        }
        countryVal = (doc.country.country || doc.country.id || '').trim();
    }

    const upper = countryVal.toUpperCase();
    if (
        upper === 'MULTI (EU)' ||
        upper === 'MULTI(EU)' ||
        upper === 'MULTI' ||
        upper === 'EU'
    ) {
        return 'EU';
    }

    if (countryVal) {
        const found = COUNTRIES.find(
            (c) => c.value.toUpperCase() === upper || c.label.toUpperCase() === upper
        );
        if (found) {
            return found.value.toUpperCase();
        }
        if (countryVal.length === 2) {
            return upper;
        }
    }

    if (fallbackCountry) {
        const fallbackUpper = fallbackCountry.trim().toUpperCase();
        if (
            fallbackUpper === 'MULTI (EU)' ||
            fallbackUpper === 'MULTI(EU)' ||
            fallbackUpper === 'MULTI' ||
            fallbackUpper === 'EU'
        ) {
            return 'EU';
        }
        const found = COUNTRIES.find(
            (c) => c.value.toUpperCase() === fallbackUpper || c.label.toUpperCase() === fallbackUpper
        );
        if (found) {
            return found.value.toUpperCase();
        }
        if (fallbackCountry.length === 2) {
            return fallbackUpper;
        }
    }

    return '';
};

const getDocCountryLabel = (doc: any, countryCode: string, fallbackCountryLabel?: string): string => {
    if (countryCode === 'EU') {
        return 'Multi (EU)';
    }
    const found = COUNTRIES.find((c) => c.value.toUpperCase() === countryCode || c.label.toUpperCase() === countryCode);
    if (found) {
        return found.label;
    }
    if (typeof doc?.country === 'string' && doc.country.trim()) {
        const raw = doc.country.trim();
        const foundRaw = COUNTRIES.find((c) => c.label.toUpperCase() === raw.toUpperCase() || c.value.toUpperCase() === raw.toUpperCase());
        if (foundRaw) return foundRaw.label;
        return raw;
    }
    if (doc?.country && typeof doc.country === 'object' && doc.country.country) {
        return doc.country.country;
    }
    return fallbackCountryLabel || countryCode;
};

const resolveDocType = (doc: any, category?: string): string => {
    if (doc?.documentType && typeof doc.documentType === 'string' && doc.documentType.trim()) {
        return doc.documentType.trim();
    }
    if (doc?.type && typeof doc.type === 'string' && doc.type.trim()) {
        return doc.type.trim();
    }
    const cat = (category || '').trim().toLowerCase();
    if (cat === 'cosmetics') {
        return 'CPNP';
    }
    return 'Proof of notification';
};

const resolveDocFileName = (doc: any): string => {
    if (typeof doc?.name === 'string' && doc.name.trim()) return doc.name.trim();
    if (typeof doc?.fileName === 'string' && doc.fileName.trim()) return doc.fileName.trim();
    if (typeof doc?.file === 'string' && doc.file.trim()) return doc.file.trim();
    return '';
};

const resolveDocDueDate = (doc: any): string => {
    if (!doc?.dueDate || typeof doc.dueDate !== 'string') return '';
    return formatDateStringToDisplayString(doc.dueDate);
};

const getProductDocumentInfo = (
    productUuid: string | undefined,
    receiverCountry: string | undefined,
    docParameters?: StockMovementParamsType
) => {
    if (!productUuid) {
        return {
            requiresCertificate: false,
            hasCertificate: false,
            isApproved: false,
            status: '',
            countryCode: '',
            countryName: '',
            documentType: '',
            fileName: '',
            dueDate: '',
            displayText: '',
        };
    }

    const paramProduct = docParameters?.products?.find(
        (p) => p.uuid === productUuid || p.name === productUuid || p.sku === productUuid
    );
    if (!paramProduct) {
        return {
            requiresCertificate: false,
            hasCertificate: false,
            isApproved: false,
            status: '',
            countryCode: '',
            countryName: '',
            documentType: '',
            fileName: '',
            dueDate: '',
            displayText: '',
        };
    }

    const category = paramProduct.category || paramProduct.productType || '';
    const requiresCertificate = isRegDocCategory(category);

    // If user has not selected the receiverCountry, we leave column empty
    if (!receiverCountry || !receiverCountry.trim()) {
        return {
            requiresCertificate,
            hasCertificate: false,
            isApproved: false,
            status: '',
            countryCode: '',
            countryName: '',
            receiverCountryCode: '',
            documentType: '',
            fileName: '',
            dueDate: '',
            displayText: '',
        };
    }

    const userCountry = receiverCountry.trim().toUpperCase();
    const userCountryObj = COUNTRIES.find(
        (c) => c.value.toUpperCase() === userCountry || c.label.toUpperCase() === userCountry
    );
    const userCountryCode = userCountryObj?.value.toUpperCase() || userCountry;
    const userCountryLabel = userCountryObj?.label.toUpperCase();
    const isUserCountryEu = EU_COUNTRY_CODES.includes(userCountryCode) || userCountryCode === 'EU';

    // If category is different from Cosmetics or Nutra/Supplements, display 'Not required'
    if (!requiresCertificate) {
        return {
            requiresCertificate: false,
            hasCertificate: false,
            isApproved: false,
            status: 'Not required',
            countryCode: '',
            countryName: '',
            receiverCountryCode: userCountryCode,
            documentType: '',
            fileName: '',
            dueDate: '',
            displayText: 'Not required',
        };
    }

    const docs = paramProduct.documents || [];
    if (!docs.length) {
        return {
            requiresCertificate: true,
            hasCertificate: false,
            isApproved: false,
            status: 'No',
            countryCode: '',
            countryName: '',
            receiverCountryCode: userCountryCode,
            documentType: '',
            fileName: '',
            dueDate: '',
            displayText: 'No',
        };
    }

    // Direct match by country code, label, or id
    const directMatch = docs.find((doc) => {
        const docCountry = (typeof doc.country === 'string' ? doc.country : doc.country?.country || '').trim().toUpperCase();
        const docCountryId = (typeof doc.country === 'object' && doc.country?.id ? doc.country.id : '').trim().toUpperCase();
        if (docCountryId && (docCountryId === userCountry || docCountryId === userCountryCode)) return true;
        if (docCountry && (docCountry === userCountry || docCountry === userCountryCode)) return true;
        if (userCountryLabel && docCountry === userCountryLabel) return true;
        return false;
    });

    if (directMatch) {
        const status = directMatch.approvalStatus || (directMatch as any).status || 'Approved';
        const countryCode = getDocCountryCode(directMatch, userCountryCode);
        const countryName = getDocCountryLabel(directMatch, countryCode, userCountryObj?.label || receiverCountry);
        const documentType = resolveDocType(directMatch, category);
        const fileName = resolveDocFileName(directMatch);
        const dueDate = resolveDocDueDate(directMatch);
        const isApproved = status.trim().toLowerCase() === 'approved';
        return {
            requiresCertificate: true,
            hasCertificate: true,
            isApproved,
            status,
            countryCode,
            countryName,
            receiverCountryCode: userCountryCode,
            documentType,
            fileName,
            dueDate,
            displayText: countryCode ? `${status}` : status,
        };
    }

    // Check Multi (EU) match if receiver is an EU country
    if (isUserCountryEu) {
        const euMatch = docs.find((doc) => {
            const docCountry = (typeof doc.country === 'string' ? doc.country : doc.country?.country || '').trim().toUpperCase();
            return (
                docCountry === 'MULTI (EU)' ||
                docCountry === 'MULTI(EU)' ||
                docCountry === 'MULTI' ||
                docCountry === 'EU'
            );
        });
        if (euMatch) {
            const status = euMatch.approvalStatus || (euMatch as any).status || 'Approved';
            const countryCode = getDocCountryCode(euMatch, 'EU');
            const countryName = getDocCountryLabel(euMatch, countryCode, 'Multi (EU)');
            const documentType = resolveDocType(euMatch, category);
            const fileName = resolveDocFileName(euMatch);
            const dueDate = resolveDocDueDate(euMatch);
            const isApproved = status.trim().toLowerCase() === 'approved';
            return {
                requiresCertificate: true,
                hasCertificate: true,
                isApproved,
                status,
                countryCode,
                countryName,
                receiverCountryCode: userCountryCode,
                documentType,
                fileName,
                dueDate,
                displayText: countryCode ? `${status}` : status,
            };
        }
    }

    return {
        requiresCertificate: true,
        hasCertificate: false,
        isApproved: false,
        status: 'No',
        countryCode: '',
        countryName: '',
        receiverCountryCode: userCountryCode,
        documentType: '',
        fileName: '',
        dueDate: '',
        displayText: 'No',
    };
};

const getProductDocumentStatus = (
    productUuid: string | undefined,
    receiverCountry: string | undefined,
    docParameters?: StockMovementParamsType
): string => {
    return getProductDocumentInfo(productUuid, receiverCountry, docParameters).displayText;
};

const renderCertificateStatus = (
    productUuid: string | undefined,
    receiverCountry: string | undefined,
    docParameters?: StockMovementParamsType
) => {
    const info = getProductDocumentInfo(productUuid, receiverCountry, docParameters);
    const text = info.displayText;

    if (!text) return null;

    if (text === 'Not required') {
        return (
            <Tooltip
                title="This product type doesn't require any CPNP / Proof of notification"
                placement="top"
            >
                <div style={{ minWidth: '130px', whiteSpace: 'nowrap', cursor: 'default' }}>
                    <span className={styles['cert-status--plain']}>{text}</span>
                </div>
            </Tooltip>
        );
    }

    if (text === 'No') {
        const countryCode = info.receiverCountryCode ? ` (${info.receiverCountryCode})` : '';
        const hintText = `No CPNP / Proof of notification were provided for this product for selected Country of receiver${countryCode}`;

        return (
            <Tooltip
                title={hintText}
                placement="top"
            >
                <div style={{ minWidth: '130px', whiteSpace: 'nowrap', cursor: 'default' }}>
                    <span className={styles['cert-status--no']}>{text}</span>
                </div>
            </Tooltip>
        );
    }

    const rawStatus = (info.status || '').trim().toLowerCase().replace(/[_-]/g, ' ');

    let iconName: 'clock' | 'biggest-check' | 'close' | null = null;
    let statusClass = '';

    if (rawStatus === 'approved') {
        iconName = 'biggest-check';
        statusClass = styles['cert-status--approved'];
    } else if (rawStatus === 'pending') {
        iconName = 'clock';
        statusClass = styles['cert-status--pending'];
    } else if (rawStatus === 'in progress' || rawStatus === 'inprogress') {
        iconName = 'clock';
        statusClass = styles['cert-status--in-progress'];
    } else if (rawStatus === 'declined' || rawStatus === 'rejected') {
        iconName = 'close';
        statusClass = styles['cert-status--declined'];
    }

    const tooltipContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', lineHeight: '1.4', padding: '2px 0' }}>
            <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Document type: </span>
                <span>{info.documentType}</span>
            </div>
            {info.fileName ? (
                <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>File name: </span>
                    <span>{info.fileName}</span>
                </div>
            ) : null}
            <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Country: </span>
                <span>{info.countryName}</span>
            </div>
            {info.dueDate ? (
                <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Due date: </span>
                    <span>{info.dueDate}</span>
                </div>
            ) : null}
            <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status: </span>
                <span>{info.status || text}</span>
            </div>
        </div>
    );

    const statusLabel = info.status || text;

    const cellNode = !iconName ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '130px', whiteSpace: 'nowrap', cursor: 'default' }}>
            <span className={styles['cert-status--plain']}>{statusLabel}</span>
            {info.countryCode ? (
                <span className={styles['cert-status-country']}>({info.countryCode})</span>
            ) : null}
        </div>
    ) : (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '150px', whiteSpace: 'nowrap', cursor: 'default' }}>
            <span className={`${styles['cert-status-badge']} ${statusClass}`}>
                <span className={styles['cert-status-circle']}>
                    <Icon name={iconName} />
                </span>
                <span>{statusLabel}</span>
            </span>
            {info.countryCode ? (
                <span className={styles['cert-status-country']}>({info.countryCode})</span>
            ) : null}
        </div>
    );

    return (
        <Tooltip title={tooltipContent} placement="top">
            {cellNode}
        </Tooltip>
    );
};

const StockMovementFormComponent: React.FC<StockMovementFormType> = ({ docType, docData, docParameters, closeDocModal, refetchDoc, forbiddenTabs }) => {
    const { tenantData: { alias, orderTitles } } = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList, sellersListActive } = useAuth();
    const { notifications } = useNotifications();

    const [isDisabled, setIsDisabled] = useState(!!docData?.uuid);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [isJustETA, setIsJustETA] = useState(false);

    const isOutboundOrStockMovement = docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT;

    //
    const { visitedStockMovements, setStockMovementsAsVisited, addInboundsNumber, cancelHintsNumber, addCancelHintsNumber } = useHintsTracking();

    const [showHintQuestion, setShowHintQuestion] = useState(false);
    const handleCancelHints = () => {
        setShowHintQuestion(false);
        addCancelHintsNumber();

    }
    const [showAllHints, setShowAllHints] = useState(false);
    const productsCardRef = useRef<HTMLDivElement | null>(null);
    const [isProductsTutorialMode, setIsProductsTutorialMode] = useState<boolean>(false);

    useEffect(() => {
        const cardEl =
            productsCardRef.current?.closest('.card-with-help-icon') ||
            productsCardRef.current?.closest('.stock-movement--products') ||
            productsCardRef.current?.closest('.card');
        if (!cardEl) return;

        const updateMode = () => {
            setIsProductsTutorialMode(cardEl.classList.contains('tutorial-mode'));
        };

        updateMode();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateMode();
                }
            }
        });

        observer.observe(cardEl, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        if (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS && !visitedStockMovements && cancelHintsNumber < 2) {
            setShowHintQuestion(true);
        }
    }, []);
    const showHints = () => {
        setShowHintQuestion(false);
        setShowAllHints(true);
    }

    const deliveryTypeOptions: OptionType[] = useMemo(() => [
        { value: 'Standart', label: orderTitles.stockMovStandardDeliveryTitle },
        { value: 'Express', label: orderTitles.stockMovExpressDeliveryTitle },
        { value: 'Customer Carrier', label: 'Customer Carrier' }
    ], [orderTitles]);

    //product selection
    const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    const closeSuccessModal = useCallback((isImport = false) => {
        setShowStatusModal(false);
        !isImport && closeDocModal();
    }, []);
    const closeErrorModal = useCallback(() => {
        setShowStatusModal(false);
    }, [])

    const [showConfirmModalFillByStock, setShowConfirmModalFillByStock] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCertConfirmModal, setShowCertConfirmModal] = useState(false);
    const [pendingSubmitData, setPendingSubmitData] = useState<any>(null);

    const handleConfirmSendAnyway = async () => {
        setShowCertConfirmModal(false);
        if (pendingSubmitData) {
            const dataToSend = pendingSubmitData;
            setPendingSubmitData(null);
            await executeSend(dataToSend);
        }
    };

    const handleCancelSendAnyway = () => {
        setShowCertConfirmModal(false);
        setPendingSubmitData(null);
        setIsLoading(false);
    };

    const handleConfirmCancelDoc = async () => {
        setShowConfirmModal(false);
        await handleCancelOrder();
    }

    const handleCancelOrder = async () => {
        try {
            const requestData = { token, alias, uuid: docData?.uuid };

            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CancelStockMovement/' + docType), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }

            const res = await cancelStockMovement(superUser && ui ? { ...requestData, ui } : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Document is successfully canceled!`, onClose: closeSuccessModal })
                setShowStatusModal(true);
            } else if (res && 'response' in res) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse && 'errorMessage' in errResponse.data) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Document can not be canceled!`, text: errorMessages, onClose: closeErrorModal })
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    //tickets
    const [showTicketForm, setShowTicketForm] = useState(false);
    const handleCreateTicket = () => {
        setShowTicketForm(true)
    }

    //tab titles
    const tabTitleArray = useMemo(() => TabTitles(!!docData?.uuid, !!(docData?.tickets && docData?.tickets.length), !!(docData?.PrecalculatedDeliveryCost && docData.PrecalculatedDeliveryCost.length), forbiddenTabs), [docData, forbiddenTabs]);
    const { tabTitles, updateTabTitles, clearTabTitles, resetTabTables } = useTabsState(tabTitleArray, TabFields);


    //form
    const { control, handleSubmit, setError, trigger, formState: { errors }, getValues, setValue, watch, clearErrors } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            //date: docData?.date || currentDate.toISOString(),
            number: docData?.number || '',
            incomingDate: docData?.incomingDate || '',
            incomingNumber: docData?.incomingNumber || '',
            deliveryType: docData?.deliveryType || '',
            deliveryMethod: docData?.deliveryMethod || '',
            container20Amount: docData?.container20Amount || 0,
            container40Amount: docData?.container40Amount || 0,
            palletsAmount: docData?.palletsAmount || 0,
            cartonsAmount: docData?.cartonsAmount || 0,
            volume: docData?.volume,
            weightTotalGross: docData?.weightTotalGross,
            weightTotalNet: docData?.weightTotalNet,
            labelingNeeds: docData?.labelingNeeds || false,
            mixedCarton: docData?.mixedCarton || false,
            sender: docData?.sender || (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || docType === STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE ? 'Customer' : ''),
            senderCountry: docData?.senderCountry || '',
            receiver: docData?.receiver || (docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType === STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE ? 'Customer' : ''),
            receiverCountry: docData?.receiverCountry || '',
            estimatedTimeArrives: docData?.estimatedTimeArrives || '0001-01-01T00:00:00',
            uuid: docData?.uuid || '',
            courierServiceTrackingNumber: docData?.courierServiceTrackingNumber || '',
            comment: docData?.comment || '',
            status: docData?.status || '',
            statusAdditionalInfo: docData?.statusAdditionalInfo || '',
            seller: docData?.seller || '',
            senderZIP: docData?.senderZIP || '',
            receiverZIP: docData?.receiverZIP || '',
            allCollect: docData?.allCollect || false,

            products:
                docData && docData?.products && docData.products.length
                    ? docData.products.map((product, index: number) => (
                        {
                            key: product.product.uuid || `product-${Date.now().toString()}_${index}`,
                            selected: false,
                            product: product.product.uuid || '',
                            quantityPlan: product.quantityPlan || '',
                            quantity: product.quantity || '',
                            unitOfMeasure: product.unitOfMeasure || '',
                            quality: product.quality || '',
                        }))
                    : [],

            shippingUnits:
                docData && docData?.shippingUnits && docData.shippingUnits.length
                    ? docData.shippingUnits.map((unit, index: number) => (
                        {
                            key: `shipping-unit_${unit.unitName}_${Date.now().toString()}_${index}` || `product-${Date.now().toString()}_${index}`,
                            selected: false,
                            unitName: unit.unitName || '',
                            unitHeight: unit.unitHeight || '',
                            unitLength: unit.unitLength || '',
                            unitWidth: unit.unitWidth || '',
                            unitWeight: unit.unitWeight || '',
                            unitQuantity: unit.unitQuantity || '',
                        }))
                    : [],
        }
    });


    const { append: appendProduct, remove: removeProduct } = useFieldArray({ control, name: 'products' });
    const products = watch('products');
    //const currencyOptions = useMemo(()=>{return docParameters && docParameters?.currencies.length ? createOptions(docParameters?.currencies) : []},[]);

    //shipping units
    const { append: appendShippingUnit, remove: removeShippingUnit } = useFieldArray({ control, name: 'shippingUnits' });
    const shippingUnits = watch('shippingUnits');
    const sender = watch('sender');
    const receiver = watch('receiver');
    const receiverCountry = watch('receiverCountry');
    const selectedSeller = watch('seller');

    const isInboundOrStockMovement = docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT;

    // Ensure the component subscribes to errors for all fields mapped to tabs 
    // by triggering the react-hook-form proxy getter during render.
    TabFields.forEach(f => {
        const _ = errors[f.fieldName as keyof typeof errors];
    });

    const [importType, setImportType] = useState('');

    //countries
    const allCountries = COUNTRIES.map(item => ({ label: item.label, value: item.value.toUpperCase() }));

    //sender
    const senderOptions = useMemo(() => {
        if (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || !docParameters.sender || needSeller() && !selectedSeller) return [];
        if (needSeller()) {
            const senderWarehouses = docParameters.sender.filter(item => item.seller === selectedSeller).map(item => item.warehouse)
            return Array.from(new Set(senderWarehouses)).map(item => ({ label: item, value: item }));
        } else {
            const senderWarehouses = docParameters.sender.map(item => item.warehouse)
            return Array.from(new Set(senderWarehouses)).map(item => ({ label: item, value: item }));
        }
    }, [docParameters, selectedSeller]);
    const onSenderChange = (newSender: string) => {
        if (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || docType === STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE) return;
        const newSenderCountry = docParameters.sender ? docParameters.sender.filter(item => item.warehouse === newSender) : [];
        setValue('senderCountry', newSenderCountry.length ? newSenderCountry[0].country : '', { shouldValidate: true });
    }

    //receiver
    // const receiverOptions = docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || !docParameters.receiver ? [] : docParameters.receiver.map(item => ({label: item.warehouse, value: item.warehouse}));
    const receiverOptions = useMemo(() => {
        if (docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || !docParameters.receiver || needSeller() && !selectedSeller) return [];
        if (needSeller()) {
            const receiverWarehouses = docParameters.receiver.filter(item => item.seller === selectedSeller).map(item => item.warehouse)
            return Array.from(new Set(receiverWarehouses)).map(item => ({ label: item, value: item }));
        } else {
            const receiverWarehouses = docParameters.receiver.map(item => item.warehouse)
            return Array.from(new Set(receiverWarehouses)).map(item => ({ label: item, value: item }));
        }
    }, [docParameters, selectedSeller]);

    const onReceiverChange = (newReceiver: string) => {
        if (docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType === STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE) return;
        const newReceiverCountry = docParameters.receiver ? docParameters.receiver.filter(item => item.warehouse === newReceiver) : [];
        setValue('receiverCountry', newReceiverCountry.length ? newReceiverCountry[0].country : '', { shouldValidate: true });
    }

    //products
    const [selectAllProducts, setSelectAllProducts] = useState(false);

    const productQualityOptions = createOptions(docParameters.quality);
    //temporarily
    if (!docParameters.quality.includes('Saleable')) {
        productQualityOptions.push({ label: 'Saleable', value: 'Saleable' });
    }

    const productOptions = useMemo(() => {

        let sellersProducts = docParameters ? docParameters.products : [];
        if (needSeller()) {
            sellersProducts = selectedSeller ? sellersProducts.filter(item => item.seller === selectedSeller) : [];
        }

        return sellersProducts.map((item) => ({ label: `${item.name}`, value: item.uuid, extraSearch: item.sku }));

    }, [docParameters, selectedSeller]);

    const checkSelectedProductValue = (selectedValue) => {
        //console.log('selected val:', selectedValue, productOptions.filter(item=>item.value===selectedValue))

    }

    const deliveryType = watch('deliveryType');
    const isWapiCarrier = useMemo(() => deliveryType != 'Customer Carrier', [deliveryType]);

    const shippingUnitsOptions = useMemo(() => {
        let shippingUnits = docParameters && docParameters.shipingUnits ? docParameters.shipingUnits : [];
        return shippingUnits.map((item) => ({ label: `${item.unitName}`, value: item.unitName }));
    }, [docParameters]);

    //deliveryMethodOptions
    //const deliveryMethodOptions = useMemo(()=>docParameters?.deliveryMethod.map(item => ({label: item, value: item})),[docParameters]);
    //const deliveryMethodOptions = useMemo(()=>['PLL','SPD'].map(item => ({label: item, value: item} as OptionType)),[]);
    const deliveryMethod = watch('deliveryMethod');
    const container20 = watch('container20Amount');
    const container40 = watch('container40Amount');
    const palletsAmount = watch('palletsAmount');
    const cartonsAmount = watch('cartonsAmount');

    useEffect(() => {
        if (container20 || container40) {
            trigger('container20Amount');
            trigger('container40Amount');
        }

    }, [container20, container40]);


    const setQuantityActual = (record: SingleOrderProductFormType, index: number) => {
        const product = getValues('products')[index];
        setValue(`products.${index}.quantity`, +product.quantityPlan === 0 ? '' : product.quantityPlan, { shouldValidate: true });
        setValue(`products.${index}.quantityPlan`, +product.quantityPlan === 0 ? '' : product.quantityPlan, { shouldValidate: true });
    }

    const isQuantityActualHidden = !(docData?.status && docData?.status.toLowerCase() === 'finished');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getProductColumns = (control: Control<any>) => {
        return [
            {
                title: (
                    <div style={{ width: '40px', justifyContent: 'center', alignItems: 'center' }}>
                        <FieldBuilder
                            name={'selectedAllUnits'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked={selectAllProducts}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllProducts(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.products;
                                fields &&
                                    fields.forEach((field, index) => {
                                        setValue(`products.${index}.selected`, e.target.checked);
                                    });
                            }}
                        />
                    </div>
                ),
                dataIndex: 'selected',
                width: '40px',
                key: 'selected',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{ width: '40px', justifyContent: 'center', alignItems: 'center' }}>
                                <FieldBuilder
                                    name={`products.${index}.selected`}
                                    fieldType={FormFieldTypes.CHECKBOX}
                                    {...field}
                                    disabled={isDisabled}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                // title: 'Product*',
                title: <Tooltip title="Select the product" >
                    <span>Product*</span>
                </Tooltip>,
                dataIndex: 'product',
                width: '100%',
                key: 'product',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.product`}
                        control={control}
                        defaultValue={record.product}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ minWidth: '150px' }}>
                                <FieldBuilder
                                    name={`products.${index}.product`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productOptions}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(selectedValue) => {
                                        field.onChange(selectedValue);
                                        checkSelectedProductValue(selectedValue);
                                        //updateTotalProducts();
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            ...(isInboundOrStockMovement
                ? [
                      {
                          title: 'Product type',
                          dataIndex: 'productType',
                          key: 'productType',
                          minWidth: 110,
                          render: (_text, record, index) => {
                              const productUuid = products?.[index]?.product || record?.product;
                              const paramProduct = docParameters?.products?.find(
                                  (p) => p.uuid === productUuid || p.name === productUuid || p.sku === productUuid
                              );
                              return (
                                  <div style={{ minWidth: '90px' }}>
                                      <span>{paramProduct?.productType || ''}</span>
                                  </div>
                              );
                          },
                      },
                      {
                          title: (
                              <Tooltip
                                  title={
                                      StockMovementsHints(docNamesSingle[docType])['certificate'] ||
                                      ProductHints['category'] ||
                                      "Status of certificate (CPNP / Proof of notification) for the selected product (if required). 'No' means no certificates were provided"
                                  }
                                  open={isProductsTutorialMode ? true : undefined}
                                  placement="top"
                                  autoAdjustOverflow={false}
                                  getPopupContainer={(triggerNode) => (triggerNode.closest('.card') as HTMLElement) || document.body}
                                  overlayClassName={styles['tutorial-hint-antd-tooltip']}
                              >
                                  <span style={{ cursor: 'default' }}>CPNP / Proof of notification</span>
                              </Tooltip>
                          ),
                          dataIndex: 'documentStatus',
                          key: 'documentStatus',
                          minWidth: 180,
                          render: (_text, record, index) => {
                              const productUuid = products?.[index]?.product || record?.product;
                              return renderCertificateStatus(productUuid, receiverCountry, docParameters);
                          },
                      },
                  ]
                : []),
            {
                //title: 'Quantity plan*',
                title: <Tooltip title="Quantity of the product in pcs" >
                    <span>Quantity plan*</span>
                </Tooltip>,
                dataIndex: 'quantityPlan',
                key: 'quantityPlan',
                minWidth: 50,
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.quantityPlan`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ maxWidth: '70px' }}>
                                <FieldBuilder
                                    name={`products.${index}.quantityPlan`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    type={'number'}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        setQuantityActual(record, index);
                                    }}
                                    onlyWholeNumbers={true}
                                    classNames={!isQuantityActualHidden && record.quantity !== record.quantityPlan ? 'highlight-error' : ''}
                                />
                            </div>
                        )}
                        rules={{
                            required: 'filed is required',
                            pattern: {
                                value: /^\d+$/, // Allows only digits (0-9)
                                message: "Only whole numbers are allowed",
                            },
                        }}
                    />
                ),
            },
            {
                title: 'Quantity actual*',
                dataIndex: 'quantity',
                key: 'quantity',
                minWidth: 50,
                className: `${isQuantityActualHidden ? 'hidden-column' : ''}`,
                render: (_text, record, index) => (
                    <Controller
                        name={`products.${index}.quantity`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ maxWidth: '70px' }}>
                                <FieldBuilder
                                    name={`products.${index}.quantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={true}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        // calcProductTotal(record, index);
                                    }}
                                    classNames={!isQuantityActualHidden && record.quantity !== record.quantityPlan ? 'highlight-error' : ''}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Unit of measure',
                dataIndex: 'unitOfMeasure',
                key: 'unitOfMeasure',
                minWidth: 70,
                //responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.unitOfMeasure`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ minWidth: '70px', maxWidth: '70px' }}>
                                <FieldBuilder
                                    name={`products.${index}.unitOfMeasure`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    //options={getUnitsOptions(index)}
                                    disabled={true}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                //title: 'Quality',
                title: <Tooltip title="Quality of the product" >
                    <span>Quality*</span>
                </Tooltip>,
                dataIndex: 'quality',
                key: 'quality',
                minWidth: 150,
                responsive: ['md'] as ResponsiveBreakpoint[],
                render: (_text, _record, index) => (
                    <Controller
                        name={`products.${index}.quality`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ minWidth: '140px', maxWidth: '150px' }}>
                                <FieldBuilder
                                    name={`products.${index}.quality`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productQualityOptions}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                    }}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                title: '',
                key: 'action',
                minWidth: 50,
                maxWidth: 50,
                render: (_text, _record, index) => (
                    <button disabled={isDisabled} className='action-btn' onClick={() => { removeProduct(index); setValue('allCollect', false) }}>
                        <Icon name='waste-bin' />
                    </button>
                ),
            },
        ];
    }

    const removeProducts = () => {
        if (products.filter(item => item.selected).length > 0) {
            setValue('allCollect', false);
        }
        setValue('products', products.filter(item => !item.selected));
        setSelectAllProducts(false);
    }

    const handleSelectedSellerChange = (val: string) => {
        if (val != selectedSeller) {
            setValue('products', []);
            if (docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT) {
                setValue('sender', '');
                setValue('senderCountry', '');
            }
            if (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || docType === STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT) {
                setValue('receiver', '');
                setValue('receiverCountry', '');
            }
        }
    }

    //product selection
    const handleProductSelection = () => {
        setShowProductSelectionModal(true);
    }

    const handleAddSelection = (selectedProducts: SelectedProductType[]) => {
        setShowProductSelectionModal(false);

        //make copy of existing products
        const productsBeforeSelection = [...products];
        const fixedRows = [];
        setValue('products', []);

        //add selected products
        selectedProducts.forEach((selectedProduct, index) => {
            //check if product is already here (check key
            const existingProducts = productsBeforeSelection.filter(item => item.product === selectedProduct.product);
            if (existingProducts.length) {
                const sourceRow = existingProducts.length === 1 ? existingProducts : existingProducts.filter(item => item.key === selectedProduct.key);

                if (sourceRow.length) {
                    fixedRows.push(selectedProduct.key);
                    appendProduct({ ...sourceRow[0], quantity: selectedProduct.quantity });
                } else {
                    //change what we have
                    appendProduct({ ...existingProducts[0], quantity: selectedProduct.quantity });
                }
                setValue(`products.${index}.quantity`, selectedProduct.quantity);
                setValue(`products.${index}.quantityPlan`, selectedProduct.quantity);
            } else {
                //add new row
                appendProduct(
                    {
                        key: selectedProduct.key,
                        product: selectedProduct.product,
                        quantity: selectedProduct.quantity,
                        selected: false,
                        quantityPlan: selectedProduct.quantity,
                        unitOfMeasure: 'pcs',
                        quality: 'Saleable'
                    }
                );
            }

        });

        //set sender warehouse if needed
        if (selectedProducts.length && isOutboundOrStockMovement) {

            setValue('sender', selectedProducts[0].warehouse);
            if (receiver === selectedProducts[0].warehouse) {
                setValue('receiver', '');
                setValue('receiverCountry', '');
            }
            onSenderChange(selectedProducts[0].warehouse);
        }
    }

    //shipping units
    const [selectAllShippingUnits, setSelectAllShippingUnits] = useState(false);
    const removeShippingUnits = () => {
        setValue('shippingUnits', shippingUnits.filter(item => !item.selected));
        setSelectAllShippingUnits(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getShippingUnitsColumns = (control: Control<any>) => {
        return [
            {
                title: (
                    <div style={{ width: '40px', justifyContent: 'center', alignItems: 'center' }}>
                        <FieldBuilder
                            name={'selectedAllShippingUnits'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked={selectAllShippingUnits}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllShippingUnits(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.shippingUnits;
                                fields &&
                                fields.forEach((field, index) => {
                                    setValue(`shippingUnits.${index}.selected`, e.target.checked);
                                });
                            }}
                        />
                    </div>
                ),
                dataIndex: 'selected',
                width: '40px',
                key: 'selected',
                render: (_text, _record, index) => (
                    <Controller
                        name={`shippingUnits.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{ width: '40px', justifyContent: 'center', alignItems: 'center' }}>
                                <FieldBuilder
                                    name={`shippingUnits.${index}.selected`}
                                    fieldType={FormFieldTypes.CHECKBOX}
                                    {...field}
                                    disabled={isDisabled || isOutboundOrStockMovement}
                                />
                            </div>
                        )}
                    />
                ),
            },
            {
                // title: 'Product*',
                title: <Tooltip title="Select shipping unit" >
                    <span>Shipping unit*</span>
                </Tooltip>,
                dataIndex: 'unitName',
                width: '100%',
                key: 'unitName',
                render: (_text, record, index) => (
                    <Controller
                        name={`shippingUnits.${index}.unitName`}
                        control={control}
                        defaultValue={record.unitName}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ minWidth: '150px' }}>
                                <FieldBuilder
                                    name={`shippingUnits.${index}.unitName`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={shippingUnitsOptions}
                                    disabled={isDisabled || isOutboundOrStockMovement}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={!isOutboundOrStockMovement}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: <Tooltip title="Quantity of the unit in pcs" >
                    <span>Quantity*</span>
                </Tooltip>,
                dataIndex: 'unitQuantity',
                key: 'unitQuantity',
                minWidth: 70,
                render: (_text, _record, index) => (
                    <Controller
                        name={`shippingUnits.${index}.unitQuantity`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ maxWidth: '150px' }}>
                                <FieldBuilder
                                    name={`shippingUnits.${index}.unitQuantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    type={'number'}
                                    {...field}
                                    disabled={isDisabled || isOutboundOrStockMovement}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={!isOutboundOrStockMovement}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        // setQuantityActual(record, index);
                                    }}
                                    onlyWholeNumbers={true}
                                    // classNames={!isQuantityActualHidden && record.quantity !== record.quantityPlan ? 'highlight-error' : ''}
                                />
                            </div>
                        )}
                        rules={{
                            required: 'filed is required',
                            pattern: {
                                value: /^\d+$/, // Allows only digits (0-9)
                                message: "Only whole numbers are allowed",
                            },
                        }}
                    />
                ),
            },
            {
                title: 'Length, cm*',
                dataIndex: 'unitLength',
                key: 'unitLength',
                minWidth: 90,
                render: (_text, _record, index) => (
                    <Controller
                        name={`shippingUnits.${index}.unitLength`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ maxWidth: '150px' }}>
                                <FieldBuilder
                                    name={`shippingUnits.${index}.unitLength`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled || isOutboundOrStockMovement}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={!isOutboundOrStockMovement}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        // calcProductTotal(record, index);
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Width, cm*',
                dataIndex: 'unitWidth',
                key: 'unitWidth',
                minWidth: 90,
                render: (_text, _record, index) => (
                    <Controller
                        name={`shippingUnits.${index}.unitWidth`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ maxWidth: '150px' }}>
                                <FieldBuilder
                                    name={`shippingUnits.${index}.unitWidth`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        // calcProductTotal(record, index);
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Height, cm*',
                dataIndex: 'unitHeight',
                key: 'unitLength',
                minWidth: 90,
                render: (_text, _record, index) => (
                    <Controller
                        name={`shippingUnits.${index}.unitHeight`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ maxWidth: '150px' }}>
                                <FieldBuilder
                                    name={`shippingUnits.${index}.unitHeight`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        // calcProductTotal(record, index);
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Weight (1 unit), kg*',
                dataIndex: 'unitWeight',
                key: 'unitWeight',
                minWidth: 90,
                render: (_text, _record, index) => (
                    <Controller
                        name={`shippingUnits.${index}.unitWeight`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <div style={{ maxWidth: '150px' }}>
                                <FieldBuilder
                                    name={`shippingUnits.${index}.unitWeight`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onChange={(newValue: string) => {
                                        field.onChange(newValue);
                                        // updateTotalProducts();
                                        // calcProductTotal(record, index);
                                    }}
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },

            {
                title: '',
                key: 'action',
                minWidth: 50,
                maxWidth: 50,
                render: (_text, _record, index) => (
                    <button disabled={isDisabled} className='action-btn' onClick={() => { removeShippingUnit(index); }}>
                        <Icon name='waste-bin' />
                    </button>
                ),
            },
        ];
    }

    const [isSenderDisabled, setIsSenderDisabled] = useState<boolean>(isOutboundOrStockMovement && !!(docData && docData?.products && docData.products.length && sender));

    useEffect(() => {
        if (products.length && sender && isOutboundOrStockMovement) {
            //make field not clickable
            setIsSenderDisabled(true)
        } else {
            setIsSenderDisabled(false)
        }
    }, [products, sender]);

    //notifications
    let docNotifications: NotificationType[] = [];
    if (docData && docData.uuid && notifications && notifications.length) {
        docNotifications = notifications.filter(item => item.objectUuid === docData.uuid && item.status !== NOTIFICATION_STATUSES.READ)
    }

    useEffect(() => {
        if (products.length) {
            clearErrors('products');
            //trigger();
            //updateTabTitles([...tabTitles.filter(item=> item.title !='products' ).map(item=>item.title)])
        }
    }, [products]);

    useEffect(() => {
        if (shippingUnits.length) {
            clearErrors('shippingUnits');
        }
    }, [shippingUnits]);


    //form fields
    const generalFields = useMemo(() => GeneralFields(
        {
            newObject: !docData?.uuid,
            docType: docType,
            canEditATA: !!(docData?.uuid && !docData.canEdit && docData?.status !== 'Finished'),
        }
    ), [docData]);

    const detailsFields = useMemo(() => DetailsFields(
        {
            newObject: !docData?.uuid,
            docType: docType,
            countryOptions: allCountries,
            senderOptions, receiverOptions,
            onSenderChange, onReceiverChange,
            canEditETA: !!(docData?.uuid && !docData.canEdit && docData?.status !== 'Finished'),
            senderHide: !!docData?.senderHide,
            receiverHide: !!docData?.receiverHide,
            sender: sender, receiver: receiver,
            isSenderDisabled: isSenderDisabled,
            isEditMode: !isDisabled,
        }), [docData, products, sender, receiver, isSenderDisabled, isDisabled]);
    //const productsTotalFields = useMemo(()=>ProductsTotalFields(), [docData]);

    const cargoFields = useMemo(() => CargoFields(
        {
            newObject: !docData?.uuid,
            docType: docType,
            deliveryTypeOptions,
            deliveryMethod,
            deliveryMethodOptions: deliveryMethodOptions,
            container20Value: container20,
            container40Value: container40,
            palletsAmount,
            cartonsAmount,
            canDisplayCargoInfo: !!docData,
            canEdit: !!docData?.canEdit,
            //canDisplayCargoInfo: !!(docData && docData.deliveryMethod),
            //canDisplayCargoInfo: !!(docData && docData.status.toLowerCase()!=='draft' && docData.status.toLowerCase()!=='pending'),
        }), [docData, deliveryMethod, container20, container40, palletsAmount, cartonsAmount]);


    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(docData?.attachedFiles || []);

    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    //import files modal
    const addImportedProducts = (importedProducts) => {

        if (!importedProducts || !Array.isArray(importedProducts)) return;
        const existedRows = products.length;

        for (let i = 0; i < importedProducts.length; i++) {
            appendProduct({
                key: `product-${Date.now().toString()}_${existedRows + i}`,
                selected: false,
                product: importedProducts[i].product ? importedProducts[i].product.uuid || '' : '',
                quantityPlan: importedProducts[i].quantityPlan || '',
                quantity: importedProducts[i].quantity || importedProducts[i].quantityPlan || '',
                unitOfMeasure: importedProducts[i].unitOfMeasure || 'psc',
                quality: importedProducts[i].quality || 'Saleable',
            })
        }
    }

    const [importResponse, setImportResponse] = useState<any | null>(null);

    useEffect(() => {

        if (!importResponse) return;

        //check if it is an error
        if (importResponse?.status === 200) {
            //imported successfully

            //import data
            addImportedProducts(importResponse?.data?.data || importResponse?.data || []);

            //show success message
            const modalSubTitle = importType === 'fillByStock' ? 'Document filled by stock successfully' : 'Products are successfully imported';
            // setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: modalSubTitle, onClose: () => closeSuccessModal(true) })
            // setShowStatusModal(true);
            message.success(modalSubTitle);
        } else {
            //there are errors

            //import what we can
            addImportedProducts(importResponse?.response?.data?.data);

            //show error message
            const errorMessages = importResponse?.response?.data?.errorMessage || [];

            setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal })
            setShowStatusModal(true);

        }
    }, [importResponse]);


    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }
    const handleImportXLS = () => {
        setImportType('importXLS');
        setShowImportModal(true)
    }

    useEffect(() => {
        resetTabTables(tabTitleArray);
    }, [docData]);


    const fillByStock = async () => {
        setImportType('fillByStock');
        // setShowFillModal(true);

        setIsLoading(true);
        try {
            const requestData = {
                token,
                alias,
                warehouse: sender,
                // quality: data.quality.filter(item => item.enable).map(item=>item.quality),
            };

            try {
                sendUserBrowserInfo({ ...getBrowserInfo('FillStockMovementAllStock'), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }

            const res = await fillInboundByStock(superUser && ui ? { ...requestData, ui } : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                /*setImportResponse(res);*/

                if (res.data && 'data' in res.data && Array.isArray(res.data.data) && res.data.data.length) {
                    setValue('allCollect', true);
                    setImportResponse(res);

                }
            } else if (res && 'response' in res) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse && 'errorMessage' in errResponse.data) {
                    const errorMessages = errResponse?.data.errorMessage;
                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeErrorModal })
                    setShowStatusModal(true);
                }
            } else {
                setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Something went wrong! Please, try again later.`, onClose: closeErrorModal })
                setShowStatusModal(true);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFillByStock = async () => {
        if (!sender) {
            message.warning("Please, select sender warehouse first! We will fill the document by the full stock of this warehouse.");
            return;
        }

        if (products.length) {
            //the products are already filled. Confirm and clear already selected products to fill by stock
            setShowConfirmModalFillByStock(true);

        } else {
            await fillByStock();
        }
    }

    const sendJustETA = async (data) => {
        const requestData = {
            token,
            alias,
            documentData: {
                uuid: data.uuid,
                estimatedTimeArrives: data.estimatedTimeArrives,
                courierServiceTrackingNumber: data.courierServiceTrackingNumber,
            },
        };

        try {
            sendUserBrowserInfo({ ...getBrowserInfo('UpdateStockMovement/' + docType), body: superUser && ui ? { ...requestData, ui } : requestData })
        } catch { }

        return await updateInboundData(superUser && ui ? { ...requestData, ui } : requestData);
    }

    const sendDocument = async (data) => {
        const requestData = {
            token,
            alias,
            documentType: docType,
            documentData: data,
        };
        try {
            sendUserBrowserInfo({ ...getBrowserInfo('CreateStockMovement/' + docType), body: superUser && ui ? { ...requestData, ui } : requestData })
        } catch { }

        console.log('sendDocument', data);
        return await sendInboundData(superUser && ui ? { ...requestData, ui } : requestData);
    }

    const onSubmitForm = async (data) => {



        const curAction = docData ? AccessActions.EditObject : AccessActions.CreateObject;
        console.log(isActionIsAccessible(getAccessActionObject(docType), curAction))
        if (!isActionIsAccessible(getAccessActionObject(docType), curAction)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CreateUpdateStockMovement', getAccessActionObject(docType), curAction), body: { uuid: data?.uuid || '' } });
            } catch { }
            return null;
        }

        clearTabTitles();
        clearErrors();
        if (data.products.length === 0 && !isDraft && !isJustETA) {
            setError("products", { type: "manual", message: "Document needs to have at least one product" });
            updateTabTitles(['products']);
            return;
        }

        if (!data.incomingDate) {
            data.incomingDate = (new Date()).toISOString();
        }

        data.draft = isDraft;
        data.attachedFiles = selectedFiles;
        data.products.forEach(item => item.quality = item.quality || 'Saleable');

        if (data?.deliveryMethod !== DELIVERY_METHODS.CONTAINER) {
            data.container20Amount = 0;
            data.container40Amount = 0;
        }
        if (data?.deliveryMethod === DELIVERY_METHODS.CARTONS) {
            data.palletsAmount = 0;
        }

        if (data.shippingUnits.length === 0 && !isDraft && !isOutboundOrStockMovement && isWapiCarrier) {
            setError("shippingUnits", { type: "manual", message: "Shipping units are required!" });
            // toast.warn(`Shipping units are required!`, {
            //     position: "top-right",
            //     autoClose: 3000,
            // });
            updateTabTitles(['shippingUnits']);

            return;
        }

        if (!isDraft && !isJustETA && isInboundOrStockMovement) {
            const hasUnapprovedCertificates = data.products.some((item) => {
                const info = getProductDocumentInfo(
                    item.product,
                    data.receiverCountry || receiverCountry,
                    docParameters
                );
                return info.requiresCertificate && (!info.hasCertificate || !info.isApproved);
            });

            if (hasUnapprovedCertificates) {
                setPendingSubmitData(data);
                setShowCertConfirmModal(true);
                return;
            }
        }

        await executeSend(data);
    }

    const executeSend = async (data: any) => {
        setIsLoading(true);
        try {
            const res = isJustETA ? await sendJustETA(data) : await sendDocument(data);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Document is successfully ${docData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal })
                setShowStatusModal(true);

                if (!docData) {
                    setStockMovementsAsVisited(true);
                    if (docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS) {
                        addInboundsNumber();
                    }
                }

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
        } finally {
            setIsLoading(false);
            setIsJustETA(false);
        }
    }

    const serializedErrors = JSON.stringify(errors);

    useEffect(() => {
        const errorFields = Object.keys(errors).filter(key => {
            const err = errors[key];
            if (!err) return false;
            
            const hasRealError = (e: any): boolean => {
                if (!e) return false;
                if (e.message || e.type) return true;
                if (Array.isArray(e)) return e.some(hasRealError);
                if (typeof e === 'object') return Object.values(e).some(hasRealError);
                return false;
            };
            return hasRealError(err);
        });

        if (errorFields.length > 0) {
            updateTabTitles(errorFields);
        } else {
            clearTabTitles();
        }
    }, [serializedErrors, updateTabTitles, clearTabTitles]);

    const onError = (props: any) => {
        const curAction = docData ? AccessActions.EditObject : AccessActions.CreateObject;
        if (!isActionIsAccessible(getAccessActionObject(docType), curAction)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CreateUpdateStockMovement', getAccessActionObject(docType), curAction), body: { uuid: docData?.uuid || '' } });
            } catch { }

            return null;
        }

        if (isDraft || isJustETA) {
            clearErrors();
            clearTabTitles();

            if (needSeller() && props.seller) {
                setError('seller', {
                    type: 'manual',
                    message: 'Seller is required!',
                });

                toast.warn(`Seller is required for draft orders!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                updateTabTitles(['seller']);

            } else {
                const formData = getValues();
                return onSubmitForm(formData as SingleStockMovementFormType);
            }
        } else {
            let fieldNames = Object.keys(props);

            if (fieldNames.length > 0) {
                toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            if (!products.length) {
                setError('products', {
                    type: 'manual',
                    message: 'Products are empty! Document needs to have at least 1 product!',
                });

                toast.warn(`Document needs to have at least 1 product!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                fieldNames.push('products');
            }

            if (!shippingUnits.length && !isOutboundOrStockMovement && isWapiCarrier) {

                setError("shippingUnits", { type: "manual", message: "Shipping units are required!" });
                toast.warn(`Shipping units are required!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                fieldNames.push('shippingUnits');
            }

            updateTabTitles(fieldNames);
        }
    };

    const handleEditClick = () => {
        //     () => setIsDisabled(!(docData?.canEdit || !docData?.uuid))

        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('EditDoc/' + docType, getAccessActionObject(docType), AccessActions.EditObject), body: {} })
            } catch { }
            return;
        } else {
            setIsDisabled(!(docData?.canEdit || !docData?.uuid))
        }
    }

    const handleCancelDocClick = () => {
        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CancelDoc/' + docType, getAccessActionObject(docType), AccessActions.EditObject), body: { uuid: docData?.uuid || '' } });
            } catch { }
            return;
        } else {
            setShowConfirmModal(true)
        }
    }

    return <div className={`${styles['stock-movement']} is-${docType}`}>
        {isLoading && <Loader />}
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmitForm, onError)} autoComplete="off">
            <input autoComplete="false" name="hidden" type="text" style={{ display: 'none' }} />
            <Tabs id='stock-movement-tabs' tabTitles={tabTitles} classNames='inside-modal'
                notifications={docNotifications}>
                {isTabAllowed('General', forbiddenTabs) ? <div key='general-tab' className='general-tab'>
                    {needSeller() ? (
                        <div className='form-wrapper--seller card'>
                            <div className='grid-row'>
                                <Controller
                                    key='seller'
                                    name='seller'
                                    control={control}
                                    render={(
                                        {
                                            field: { ...props },
                                            fieldState: { error }
                                        }) => (
                                        <FieldBuilder
                                            // disabled={!!isDisabled}
                                            {...props}
                                            name='seller'
                                            label='Seller: '
                                            fieldType={FormFieldTypes.SELECT}
                                            options={(docData?.status !== 'Draft' && !!docData) ? sellersList : sellersListActive}
                                            placeholder={''}
                                            errorMessage={error?.message}
                                            errors={errors}
                                            disabled={isDisabled || (docData?.status !== 'Draft' && !!docData)}
                                            width={WidthType.w50}
                                            classNames={'seller-filter'}
                                            isClearable={false}
                                            onChange={(val: string) => {
                                                handleSelectedSellerChange(val);
                                                props.onChange(val);
                                            }}
                                        />
                                    )}
                                    rules={{ required: "Required field" }}
                                />
                            </div>
                            {!selectedSeller && <p className={'seller-notice'}>Select Seller to access Products and Sender/Receiver options </p>}
                        </div>
                    ) : null}
                    <CardWithHelpIcon classNames='card stock-movement--general' showHintsByDefault={showAllHints}>
                        <h3 className={styles['stock-movement__block-title']}>
                            <Icon name='general' />
                            General
                        </h3>
                        <div className='grid-row grid-row-mobile--100'>
                            <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors}
                                isDisabled={isDisabled} />
                        </div>
                    </CardWithHelpIcon>
                    <CardWithHelpIcon classNames='card stock-movement--details' showHintsByDefault={showAllHints}>
                        <h3 className={styles['stock-movement__block-title']}>
                            <Icon name='additional' />
                            Details
                        </h3>
                        <div className='grid-row grid-row-mobile--100'>
                            <FormFieldsBlock control={control} fieldsArray={detailsFields} errors={errors}
                                isDisabled={isDisabled} />
                        </div>
                    </CardWithHelpIcon>
                </div> : null}
                {isTabAllowed('Cargo info', forbiddenTabs) ? <div key='cargo-tab' className='cargo-tab'>
                    <CardWithHelpIcon classNames='card stock-movement--cargo' showHintsByDefault={showAllHints}>
                        <h3 className={styles['stock-movement__block-title']}>
                            <Icon name='shipping' />
                            Cargo info
                        </h3>
                        <div className={`${styles['stock-movement--cargo-inner-wrapper']}`}>
                            <div className='ttt'>
                                <div className='grid-row grid-row-mobile--100'>
                                    <FormFieldsBlock control={control} fieldsArray={cargoFields} errors={errors}
                                                     isDisabled={isDisabled} />
                                </div>
                            </div>
                        </div>
                    </CardWithHelpIcon>
                    {(!docData || !docData.shippingUnits || docData.shippingUnits && !docData.shippingUnits.length) && isOutboundOrStockMovement ? null : <CardWithHelpIcon classNames='card stock-movement--shipping' showHintsByDefault={showAllHints}>
                        <h3 className={styles['stock-movement__block-title']}>
                            <Icon name='pallet-freight' />
                            Shipping units
                        </h3>
                        <div className={`${styles['stock-movement--cargo-inner-wrapper']}`}>
                            <div className=''>
                                <div className={`grid-row  ${styles['stock-movement__shipping-units']} ${docType == STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT || docType === STOCK_MOVEMENT_DOC_TYPE.OUTBOUND ? styles['no-edit'] : styles['can-edit']}`}>
                                    <div className={`${styles['shipping-units-btns']} form-table--btns small-paddings width-100`}>
                                        <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn>
                                            <Button type="button" icon='add-table-row' iconOnTheRight
                                                    size={ButtonSize.SMALL} disabled={isDisabled || isOutboundOrStockMovement}
                                                    variant={ButtonVariant.SECONDARY} onClick={() => appendShippingUnit({
                                                key: `shipping-unit-${Date.now().toString()}`,
                                                selected: false,
                                                unitName: '',
                                                unitQuantity: '',
                                                unitLength: '',
                                                unitWidth: '',
                                                unitHeight: '',
                                                unitWeight: '',
                                            })}>
                                                Add
                                            </Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn>
                                            <Button type="button" icon='remove-table-row' iconOnTheRight
                                                    size={ButtonSize.SMALL} disabled={isDisabled || isOutboundOrStockMovement}
                                                    variant={ButtonVariant.SECONDARY} onClick={removeShippingUnits}>
                                                Remove selected
                                            </Button>
                                        </TutorialHintTooltip>
                                    </div>
                                    <div className={`${styles['shipping-units--table']} table-form-fields form-table`}>
                                        <Table
                                            columns={getShippingUnitsColumns(control)}
                                            dataSource={getValues('shippingUnits')?.map((field, index) => ({ key: field.unitName + '-' + index, ...field })) || []}
                                            pagination={false}
                                            rowKey="key"
                                            className={`has-border ${errors.shippingUnits ? 'has-error-decor' : ''}`}
                                        />
                                        {errors.shippingUnits && <p className={'error-message'}>{errors.shippingUnits?.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardWithHelpIcon> }
                </div> : null}

                {isTabAllowed('Products', forbiddenTabs) ? <div key='product-tab' className='product-tab'>
                    <CardWithHelpIcon classNames={`card min-height-600 ${styles['stock-movement--products']}`} showHintsByDefault={showAllHints}>
                        <h3 className={styles['stock-movement__block-title']}>
                            <Icon name='goods' />
                            Products
                        </h3>
                        <div className='grid-row mb-md'>
                            <div className='stock-movement--btns width-100'>
                                <div className='grid-row'>
                                    <div
                                        className='stock-movement--table-btns form-table--btns small-paddings width-100'>
                                        {(isOutboundOrStockMovement) ? (
                                            <TutorialHintTooltip hint={StockMovementsHints(docNamesSingle[docType])['fillByStock'] || ''} forBtn positionTop={isInboundOrStockMovement}>
                                                {<Tooltip title={!sender ? 'Please, select the sender warehouse first!' : ''} >
                                                    <span><Button
                                                        type="button"
                                                        icon="fill-doc"
                                                        iconOnTheRight
                                                        size={ButtonSize.SMALL}
                                                        disabled={isDisabled}
                                                        onClick={handleFillByStock}
                                                        classNames={!sender ? 'is-disabled' : ''}
                                                    >
                                                        Collect all
                                                    </Button></span>
                                                </Tooltip>}
                                            </TutorialHintTooltip>)
                                            : null
                                        }
                                        <TutorialHintTooltip
                                            hint={StockMovementsHints(docNamesSingle[docType])['importProducts'] || ''}
                                            forBtn
                                            positionTop={isInboundOrStockMovement}>
                                            <Button type="button" icon="import-file" iconOnTheRight
                                                size={ButtonSize.SMALL} disabled={isDisabled}
                                                onClick={handleImportXLS}>Import from xls</Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip
                                            hint={StockMovementsHints(docNamesSingle[docType])['selection'] || ''}
                                            forBtn
                                            positionTop={isInboundOrStockMovement}>
                                            <Button type="button" icon='selection' iconOnTheRight
                                                size={ButtonSize.SMALL} disabled={isDisabled}
                                                variant={ButtonVariant.SECONDARY}
                                                onClick={() => handleProductSelection()} classNames={styles['selection-btn']}>
                                                Add from List
                                            </Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn positionTop={isInboundOrStockMovement}>
                                            <Button type="button" icon='add-table-row' iconOnTheRight
                                                size={ButtonSize.SMALL} disabled={isDisabled}
                                                variant={ButtonVariant.SECONDARY} onClick={() => appendProduct({
                                                    key: `product-${Date.now().toString()}`,
                                                    selected: false,
                                                    product: '',
                                                    quantityPlan: '',
                                                    quantity: '',
                                                    unitOfMeasure: 'pcs',
                                                    quality: 'Saleable'
                                                })}>
                                                Add by SKU
                                            </Button>
                                        </TutorialHintTooltip>
                                        <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn positionTop={isInboundOrStockMovement}>
                                            <Button type="button" icon='remove-table-row' iconOnTheRight
                                                size={ButtonSize.SMALL} disabled={isDisabled}
                                                variant={ButtonVariant.SECONDARY} onClick={removeProducts}>
                                                Remove selected
                                            </Button>
                                        </TutorialHintTooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={productsCardRef} className={`${styles['stock-movement--table']} table-form-fields form-table`}>
                            <Table
                                columns={getProductColumns(control)}
                                dataSource={products?.map((field, index) => ({ key: field.product + '-' + index, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                                className={`has-border ${errors.products ? 'has-error-decor' : ''}`}
                            />
                            {errors.products && <p className={'error-message'}>{errors.products.message}</p>}

                        </div>
                        <div className={`grid-row ${styles['stock-movement--products-total']}`}>
                            {/*<FormFieldsBlock control={control} fieldsArray={productsTotalFields} errors={errors} isDisabled={isDisabled}/>*/}
                            <ProductsTotal weightGross={docData?.weightTotalGross || 0}
                                weightNet={docData?.weightTotalNet || 0} volume={docData?.volume || 0}
                                palletAmount={docData?.palletsAmount || 0}
                                packages={docData?.cartonsAmount || 0} />
                        </div>
                    </CardWithHelpIcon>
                </div> : null}
                {docData?.uuid && isTabAllowed('Services', forbiddenTabs) && <div key='services-tab' className='services-tab'>
                    <div className={`card min-height-600 ${styles['stock-movement--history']}`}>
                        <h3 className={styles['stock-movement__block-title']}>
                            <Icon name='bundle' />
                            Services
                        </h3>
                        <Services services={docData?.services} />
                    </div>
                </div>}
                {docData?.uuid && isTabAllowed('Status history', forbiddenTabs) && <div key='status-history-tab' className='status-history-tab'>
                    <div className={`card min-height-600 ${styles['stock-movement--history']}`}>
                        <h3 className={styles['stock-movement__block-title']}>
                            <Icon name='history' />
                            Status history
                        </h3>
                        <StatusHistory statusHistory={docData?.statusHistory} />
                    </div>
                </div>}
                {
                    docData?.uuid && docData?.PrecalculatedDeliveryCost && docData?.PrecalculatedDeliveryCost.length > 0 && isTabAllowed('DeliveryCost', forbiddenTabs) ? (
                        <div key='delivery-cost-approval-tab' className='delivery-cost-approval-tab'>
                            <div className={`card min-height-600 ${styles['stock-movement--cost-approval']}`}>
                                <h3 className={styles['stock-movement__block-title']}>
                                    <Icon name='approval' />
                                    Delivery cost approval
                                </h3>
                                <CostApproval
                                    costApproval={docData?.PrecalculatedDeliveryCost}
                                    docName={`${docType} ${docData?.number} from ${formatDateStringToDisplayString(docData.date)}`}
                                    uuid={docData?.uuid}
                                    docType={docType}
                                    refetchDoc={refetchDoc}
                                />
                            </div>
                        </div>
                    ) : null
                }
                {docData?.uuid && docData.tickets.length && isTabAllowed('Tickets', forbiddenTabs) ? <div key='tickets-tab' className='tickets-tab'>
                    <div className="card min-height-600 stock-movement--tickets">
                        <h3 className={styles['stock-movement__block-title']}>
                            <Icon name='ticket-gray' />
                            Tickets
                        </h3>
                        <DocumentTickets tickets={docData.tickets} />
                    </div>
                </div> : null}
                {isTabAllowed('Files', forbiddenTabs) ? <div key='files-tab' className='files-tab'>
                    <CardWithHelpIcon classNames="card min-height-600 stock-movement--files" showHintsByDefault={showAllHints}>
                        {/*<div className="card min-height-600 stock-movement--products">*/}
                        <TutorialHintTooltip hint={StockMovementsHints('')['files'] || ''} position='left'>
                            <h3 className={`${styles['stock-movement__block-title']} ${styles['title-small']}`}>
                                <Icon name='files' />
                                Files
                            </h3>
                        </TutorialHintTooltip>
                        <div className={styles['dropzoneBlock']}>
                            <DropZone readOnly={!!isDisabled} files={selectedFiles}
                                docUuid={docData?.canEdit ? '' : docData?.uuid}
                                onFilesChange={handleFilesChange}
                            // allowOnlyFormats={['pdf']}
                            // hint={'The supported file formats: PDF'}
                            />
                        </div>
                    </CardWithHelpIcon>
                </div> : null}
            </Tabs>

            <div className='form-submit-btn'>
                {docData && docData.uuid && isTabAllowed('Tickets', forbiddenTabs) ?
                    <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight
                        onClick={handleCreateTicket}>Create ticket</Button> : null}
                {docData?.uuid && docData?.status && docData?.status.toLowerCase() == 'draft' ?
                    <Button type='button' variant={ButtonVariant.PRIMARY} onClick={handleCancelDocClick}>Cancel
                        document</Button> : null}
                {isDisabled && docData?.canEdit && <Button type="button" disabled={false}
                    onClick={handleEditClick}
                    variant={ButtonVariant.PRIMARY}>Edit</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} variant={ButtonVariant.PRIMARY}
                    onClick={() => setIsDraft(true)}>Save as draft</Button>}
                {!isDisabled && <Button type="submit" disabled={isDisabled} onClick={() => setIsDraft(false)}
                    variant={ButtonVariant.PRIMARY}>Send</Button>}
                {isDisabled && docType === STOCK_MOVEMENT_DOC_TYPE.INBOUNDS && !docData?.canEdit && docData?.status !== 'Finished' &&
                    <Button type="submit" onClick={() => setIsJustETA(true)}
                        variant={ButtonVariant.PRIMARY}>Send new ETA</Button>}
            </div>
        </form>
        {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        {showImportModal &&
            <Modal title={`Import xls`} onClose={onImportModalClose} >
                <ImportFilesBlock
                    file='Products import.xlsx'
                    importFilesType={ImportFilesType.STOCK_MOVEMENTS_PRODUCTS}
                    setResponseData={setImportResponse}
                    closeModal={() => setShowImportModal(false)}
                />
            </Modal>
        }
        {showProductSelectionModal && <Modal title={`Product selection`} onClose={() => setShowProductSelectionModal(false)} noHeaderDecor >
            <ProductSelection
                alreadyAdded={products as SelectedProductType[]}
                handleAddSelection={handleAddSelection}
                selectedDocWarehouse={isOutboundOrStockMovement ? sender : ""}
                needWarehouses={isOutboundOrStockMovement}
                seller={selectedSeller}
            />
        </Modal>}
        {showTicketForm && <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} subjectType={TICKET_OBJECT_TYPES[docType]} subjectUuid={docData?.uuid} subject={`${STOCK_MOVEMENT_DOC_SUBJECT[docType]} ${docData?.number} ${docData?.date ? formatDateStringToDisplayString(docData.date) : ''}`} onClose={() => { setShowTicketForm(false); refetchDoc(); }} seller={needSeller() ? docData.seller : ''} />}
        {showConfirmModal && <ConfirmModal
            // actionText='Are you sure you want to cancel this document?'
            actionText='Are you sure you want to cancel this document?'
            onOk={handleConfirmCancelDoc}
            onCancel={() => setShowConfirmModal(false)}
        />}
        {showConfirmModalFillByStock && <ConfirmModal
            // actionText='Are you sure you want to cancel this document?'
            actionText='You already have some products selected in this document. To fill it with all remaining products from the selected sender warehouse we need to remove already selected products. Are you sure you want to continue?'
            onOk={() => { setValue('products', []); setShowConfirmModalFillByStock(false); fillByStock(); }}
            onCancel={() => setShowConfirmModalFillByStock(false)}
        />}
        {showCertConfirmModal && <ConfirmModal
            icon="error"
            title="Some certificates in your inbound are not approved yet."
            okText="Send anyway"
            cancelText="Cancel"
            onOk={handleConfirmSendAnyway}
            onCancel={handleCancelSendAnyway}
        >
            <p>
                You can still create and send the inbound, but please note that inbound processing may take longer than usual, and there is a risk that the products will not be added to stock until a valid document is provided.
            </p>
        </ConfirmModal>}
        {showHintQuestion && <HintsModal docName="Inbounds" onClose={handleCancelHints} onOk={showHints} />}
    </div>
}

export default StockMovementFormComponent;
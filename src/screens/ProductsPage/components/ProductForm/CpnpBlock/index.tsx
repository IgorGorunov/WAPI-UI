import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { arrayBufferToBase64, base64ToBlob, readFileAsArrayBuffer } from '@/utils/files';
import { AttachedFilesType, PRODUCT_FILE_TYPES, STATUS_MODAL_TYPES } from '@/types/utility';
import { COUNTRIES } from '@/types/countries';
import { CertificateCountriesType, RegistrationDocumentType } from '@/types/products';
import FieldBuilder from '@/components/FormBuilder/FieldBuilder';
import { FormFieldTypes } from '@/types/forms';
import Button, { ButtonVariant } from '@/components/Button/Button';
import Icon from '@/components/Icon';
import { toast } from '@/components/Toast';
import styles from './styles.module.scss';
import { formatDateToDisplayString, formatDateToString } from '@/utils/date';
import { isDateEmpty } from '@/components/FormBuilder/SingleDateInput';
import { ProductOtherHints } from "@/screens/ProductsPage/productsHints.constants";
import TutorialHintTooltip from '@/components/TutorialHintTooltip';
import { SyncAttachedFileAction, SyncAttachedFileItemType, syncAttachedFiles } from '@/services/files';
import useAuth from '@/context/authContext';
import useTenant from '@/context/tenantContext';
import Loader from '@/components/Loader';
import ModalStatus, { ModalStatusType } from '@/components/ModalStatus';

type StagedSyncEntry = SyncAttachedFileItemType & {
    key: string;
};

export type CpnpBlockProps = {
    /** Label shown above the country select, e.g. "CPNP (Cosmetics)" or "Proof of Notification" */
    label: string;
    /** Document type label shown in the table column and button, e.g. "CPNP" or "Proof of Notification" */
    documentTypeLabel: string;
    /** Product category label shown in the table, e.g. "Cosmetics" or "Nutra/Supplements" */
    categoryLabel: string;
    /** List of registration documents with statuses, countries, due dates */
    registrationDocuments: RegistrationDocumentType[];
    onRegistrationDocumentsChange: (docs: RegistrationDocumentType[]) => void;
    /** Attached files containing the actual file data */
    files: AttachedFilesType[];
    onFilesChange: (files: AttachedFilesType[]) => void;
    readOnly?: boolean;
    countriesRegistrationDocument?: CertificateCountriesType[];
    docUuid?: string;
    showSyncSend?: boolean;
    onSyncSuccess?: () => void;
};

const getCountryLabel = (code: string): string => {
    const upper = (code || '').trim().toUpperCase();
    if (upper === 'EU' || upper === 'MULTI (EU)') {
        return 'Multi (EU)';
    }
    const found = COUNTRIES.find((c) => c.value.toUpperCase() === upper);
    return found ? found.label : code;
};

const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const isDueDateEmpty = (dueDateStr?: string | null): boolean => {
    if (!dueDateStr || !dueDateStr.trim()) return true;
    if (dueDateStr.startsWith('0001-01-01') || dueDateStr.startsWith('1901-01-01')) return true;
    const d = new Date(dueDateStr);
    if (isNaN(d.getTime())) return true;
    return isDateEmpty(d) || d.getFullYear() <= 1901;
};

const formatDueDateStr = (dueDateStr?: string | null): string => {
    if (isDueDateEmpty(dueDateStr)) return '';
    try {
        const d = new Date(dueDateStr!);
        if (isNaN(d.getTime()) || isDateEmpty(d) || d.getFullYear() <= 1901) return '';
        return formatDateToString(d);
    } catch {
        return '';
    }
};

const CpnpBlock: React.FC<CpnpBlockProps> = ({
    label,
    documentTypeLabel,
    categoryLabel,
    registrationDocuments,
    onRegistrationDocumentsChange,
    files,
    onFilesChange,
    readOnly = false,
    countriesRegistrationDocument = [],
    docUuid = '',
    showSyncSend = false,
    onSyncSuccess,
}) => {
    const { token, superUser, ui } = useAuth();
    const { tenantData: { alias } } = useTenant();
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inlineFileInputRef = useRef<HTMLInputElement>(null);

    const [stagedSyncEntries, setStagedSyncEntries] = useState<StagedSyncEntry[]>([]);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({
        onClose: () => setShowStatusModal(false),
    });

    const currentProductFileType =
        documentTypeLabel.trim().toUpperCase() === 'CPNP'
            ? PRODUCT_FILE_TYPES.CPNP
            : PRODUCT_FILE_TYPES['Proof of notification'];

    const countryOptions = useMemo(() => {
        if (!countriesRegistrationDocument || countriesRegistrationDocument.length === 0) {
            return [];
        }

        const targetName = documentTypeLabel.trim().toLowerCase();
        const matchedDoc = countriesRegistrationDocument.find((doc) => {
            const docName = (doc.typeDocumentName || '').trim().toLowerCase();
            return (
                docName === targetName ||
                (targetName === 'cpnp' ? docName.includes('cpnp') : docName.includes('proof'))
            );
        });

        const rawCountries =
            matchedDoc?.Countries ||
            (matchedDoc as unknown as { countries?: { id: string; country: string }[] })?.countries ||
            [];

        return rawCountries.map((item) => ({
            label: getCountryLabel(item.country),
            value: item.id || item.country || 'EU',
            rawId: item.id || '',
            code: item.country,
        }));
    }, [countriesRegistrationDocument, documentTypeLabel]);

    const findMatchingCountryOption = useCallback(
        (countryVal?: string) => {
            if (!countryVal) return undefined;
            const trimmed = countryVal.trim();
            if (!trimmed) return undefined;
            const upper = trimmed.toUpperCase();
            const normalizedLabel = getCountryLabel(trimmed).trim().toUpperCase();
            const isEuMulti =
                upper === 'EU' ||
                upper === 'MULTI (EU)' ||
                upper === 'MULTI' ||
                normalizedLabel === 'MULTI (EU)';

            return countryOptions.find((c) => {
                if (c.value === trimmed || (c.rawId && c.rawId === trimmed)) return true;
                const cCodeUpper = (c.code || '').trim().toUpperCase();
                const cLabelUpper = (c.label || '').trim().toUpperCase();
                if (cCodeUpper === upper || cLabelUpper === upper || cLabelUpper === normalizedLabel) {
                    return true;
                }
                if (
                    isEuMulti &&
                    (cCodeUpper === 'EU' ||
                        cCodeUpper === 'MULTI (EU)' ||
                        cCodeUpper === 'MULTI' ||
                        cLabelUpper === 'MULTI (EU)')
                ) {
                    return true;
                }
                return false;
            });
        },
        [countryOptions]
    );

    const getDocCountryId = useCallback(
        (doc: RegistrationDocumentType): string => {
            const cId = typeof doc.country === 'object' ? doc.country?.id : (doc.country as unknown as string);
            const cCode = typeof doc.country === 'object' ? doc.country?.country : (doc.country as unknown as string);

            const isZeroUuid = cId && /^0+-0+-0+-0+-0+$/.test(cId.trim());

            if (cId && !isZeroUuid) {
                const matchedById = findMatchingCountryOption(cId);
                if (matchedById) return matchedById.value;
            }
            if (cCode) {
                const matchedByCode = findMatchingCountryOption(cCode);
                if (matchedByCode) return matchedByCode.value;
            }
            if (cId) {
                const matchedByIdFallback = findMatchingCountryOption(cId);
                if (matchedByIdFallback) return matchedByIdFallback.value;
            }
            // If both id and code are empty or zero-UUID, check if there is a Multi (EU) option
            if ((!cId || isZeroUuid) && !cCode) {
                const euOpt = findMatchingCountryOption('Multi (EU)');
                if (euOpt) return euOpt.value;
            }
            return (cId || cCode || '').trim();
        },
        [findMatchingCountryOption]
    );

    const getDocKey = useCallback(
        (doc: RegistrationDocumentType): string => {
            return doc.id || (doc as any).uuid || `${getDocCountryId(doc)}_${doc.name}`;
        },
        [getDocCountryId]
    );

    const findAttachedFile = useCallback(
        (doc: RegistrationDocumentType): AttachedFilesType | undefined => {
            return (
                files.find((f) => f.name && doc.name && f.name.trim() === doc.name.trim()) ||
                files.find((f) => f.id && doc.id && f.id === doc.id)
            );
        },
        [files]
    );

    // Track tutorial mode from CardWithHelpIcon
    const [isTutorialMode, setIsTutorialMode] = useState<boolean>(false);

    useEffect(() => {
        const cardEl =
            containerRef.current?.closest('.card-with-help-icon') ||
            containerRef.current?.closest('.product-info--files') ||
            containerRef.current?.parentElement?.closest('.card');
        if (!cardEl) return;

        const updateMode = () => {
            setIsTutorialMode(cardEl.classList.contains('tutorial-mode'));
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

    // Form inputs state (shared for adding and editing)
    const [pendingFile, setPendingFile] = useState<AttachedFilesType | null>(null);
    const [pendingCountry, setPendingCountry] = useState<string>('');
    const [pendingDate, setPendingDate] = useState<string>('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [countryError, setCountryError] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // ── file validation and processing ──────────────────────────────────────
    const validateAndProcessFile = useCallback(
        async (file: File) => {
            if (!editingId && registrationDocuments.length >= 10) {
                const msg = 'Maximum 10 files allowed in total!';
                setFileError(msg);
                toast.warn(msg, { position: 'top-right', autoClose: 2500 });
                return;
            }

            // Reject files over 10MB
            if (file.size > MAX_FILE_SIZE_BYTES) {
                const msg = 'File size exceeds the 10MB limit!';
                setFileError(msg);
                toast.warn(msg, {
                    position: 'top-right',
                    autoClose: 2500,
                });
                return;
            }

            const ext = file.name.split('.').pop()?.toLowerCase();
            if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
                const msg = 'Invalid file format. Only JPG, JPEG, PNG, and PDF are allowed!';
                setFileError(msg);
                toast.warn(msg, {
                    position: 'top-right',
                    autoClose: 2500,
                });
                return;
            }

            setFileError(null);
            const buffer = await readFileAsArrayBuffer(file);
            const base64 = arrayBufferToBase64(buffer);

            let mimeType = file.type;
            if (!mimeType) {
                if (ext === 'pdf') mimeType = 'application/pdf';
                else if (ext === 'png') mimeType = 'image/png';
                else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
                else mimeType = 'application/octet-stream';
            }

            const newFileEntry: AttachedFilesType = {
                name: file.name,
                type: mimeType,
                data: base64,
                productFileType: currentProductFileType,
                isNew: true,
            };

            setPendingFile(newFileEntry);
        },
        [editingId, registrationDocuments.length, currentProductFileType]
    );

    // ── file input handler ──────────────────────────────────────────────────
    const handleFileInputChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = e.target.files;
            if (!selectedFiles || selectedFiles.length === 0) return;

            if (selectedFiles.length > 1) {
                const msg = 'Only 1 file can be uploaded at a time!';
                setFileError(msg);
                toast.warn(msg, { position: 'top-right', autoClose: 2500 });
                e.target.value = '';
                return;
            }

            await validateAndProcessFile(selectedFiles[0]);
            // Reset input so selecting the same file again works
            e.target.value = '';
        },
        [validateAndProcessFile]
    );

    // ── drag and drop handlers ──────────────────────────────────────────────
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const droppedFiles = e.dataTransfer.files;
            if (!droppedFiles || droppedFiles.length === 0) return;

            if (droppedFiles.length > 1) {
                const msg = 'Only 1 file can be uploaded at a time!';
                setFileError(msg);
                toast.warn(msg, { position: 'top-right', autoClose: 2500 });
                return;
            }

            await validateAndProcessFile(droppedFiles[0]);
        },
        [validateAndProcessFile]
    );

    const handleRemovePendingFile = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setPendingFile(null);
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const getDocStatusRaw = (doc: RegistrationDocumentType): string => {
        return (
            doc.approvalStatus ||
            (doc as any).status ||
            (doc as any).approval_status ||
            (doc as any).approvalState ||
            ''
        ).trim();
    };

    const canModifyFile = (doc: RegistrationDocumentType) => {
        const att = findAttachedFile(doc);
        const raw = getDocStatusRaw(doc);
        const cleanStatus = raw.toLowerCase().replace(/[_-]/g, ' ');

        // Declined / rejected files can always be modified (edited / deleted)
        if (cleanStatus === 'declined' || cleanStatus === 'rejected') {
            return true;
        }

        // Just now added files (added in this session, not yet saved to backend)
        // Must be locally new (has isNew on attached file or no backend id), and not have a finalized backend status
        const hasBackendId = !!(doc.id || (doc as any).uuid);
        const isJustAdded = (!!att?.isNew || !hasBackendId) && (!raw || cleanStatus === 'just added');
        if (isJustAdded) {
            return true;
        }

        return false;
    };

    // Reset selected country if documentTypeLabel changes and the selected country is not in the new options
    useEffect(() => {
        if (pendingCountry && countryOptions.length > 0 && !countryOptions.some((c) => c.value === pendingCountry)) {
            setPendingCountry('');
            setCountryError(null);
        }
    }, [countryOptions, pendingCountry]);

    // ── Add new file entry ──────────────────────────────────────────────────
    const handleAddEntry = () => {
        if (registrationDocuments.length >= 10) {
            const msg = 'Maximum 10 files allowed in total!';
            setFileError(msg);
            toast.warn(msg, { position: 'top-right', autoClose: 2500 });
            return;
        }

        let hasError = false;
        if (!pendingCountry) {
            setCountryError('Please select a country.');
            hasError = true;
        } else if (
            registrationDocuments.some(
                (doc) => getDocCountryId(doc).toUpperCase() === pendingCountry.trim().toUpperCase()
            )
        ) {
            setCountryError('File for this country is already added.');
            hasError = true;
        }
        if (!pendingFile) {
            setFileError('Please upload a document.');
            hasError = true;
        }

        if (hasError || !pendingFile) {
            return;
        }

        const cleanDueDate = formatDueDateStr(pendingDate);
        const selectedCountryOpt = countryOptions.find((c) => c.value === pendingCountry);

        const newRegDoc: RegistrationDocumentType = {
            name: pendingFile.name,
            type: currentProductFileType,
            dueDate: cleanDueDate,
            country: {
                id: pendingCountry,
                country: selectedCountryOpt ? selectedCountryOpt.code : '',
            },
            approvalStatus: '',
        };

        const newAttachedFile: AttachedFilesType = {
            name: pendingFile.name,
            type: pendingFile.type,
            data: pendingFile.data,
            productFileType: currentProductFileType,
            isNew: true,
        };

        const newDocKey = getDocKey(newRegDoc);
        setStagedSyncEntries((prev) => [
            ...prev,
            {
                key: newDocKey,
                action: 'new',
                id: '',
                name: pendingFile.name,
                dueDate: cleanDueDate,
                country: pendingCountry,
                data: pendingFile.data,
            },
        ]);

        onRegistrationDocumentsChange([...registrationDocuments, newRegDoc]);
        onFilesChange([...files, newAttachedFile]);
        setPendingFile(null);
        setPendingCountry('');
        setPendingDate('');
        setCountryError(null);
        setFileError(null);
    };

    // ── Start editing a row ─────────────────────────────────────────────────
    const handleStartEdit = (record: RegistrationDocumentType) => {
        if (!canModifyFile(record)) return;
        setEditingId(getDocKey(record));
        setPendingCountry(getDocCountryId(record));
        setPendingDate(isDueDateEmpty(record.dueDate) ? '' : (record.dueDate || ''));

        const existingAtt = findAttachedFile(record);
        setPendingFile(
            existingAtt || {
                ...(record.id ? { id: record.id } : {}),
                name: record.name,
                type: 'application/pdf',
                data: '',
                productFileType: currentProductFileType,
            }
        );
        setCountryError(null);
        setFileError(null);
    };

    // ── Save edited row ─────────────────────────────────────────────────────
    const handleSaveEdit = () => {
        if (!editingId) return;

        let hasError = false;
        if (!pendingCountry) {
            setCountryError('Please select a country.');
            hasError = true;
        } else if (
            registrationDocuments.some(
                (doc) =>
                    getDocKey(doc) !== editingId &&
                    getDocCountryId(doc).toUpperCase() === pendingCountry.trim().toUpperCase()
            )
        ) {
            setCountryError('File for this country is already added.');
            hasError = true;
        }
        if (!pendingFile) {
            setFileError('Please upload a document.');
            hasError = true;
        }

        if (hasError || !pendingFile) {
            return;
        }

        const cleanDueDate = formatDueDateStr(pendingDate);
        const selectedCountryOpt = countryOptions.find((c) => c.value === pendingCountry);
        const editingDoc = registrationDocuments.find((doc) => getDocKey(doc) === editingId);
        const existingAtt = editingDoc ? findAttachedFile(editingDoc) : undefined;
        const resolvedData = pendingFile.data || existingAtt?.data || '';

        let updatedDocEntry: RegistrationDocumentType | null = null;
        const updatedDocs = registrationDocuments.map((doc) => {
            if (getDocKey(doc) === editingId) {
                const nextDoc: RegistrationDocumentType = {
                    ...doc,
                    ...(doc.id ? { id: doc.id } : {}),
                    name: pendingFile.name,
                    type: doc.type || currentProductFileType,
                    dueDate: cleanDueDate,
                    country: {
                        id: pendingCountry,
                        country: selectedCountryOpt
                            ? selectedCountryOpt.code
                            : (typeof doc.country === 'object' ? doc.country?.country || '' : ''),
                    },
                    approvalStatus: '',
                    status: '',
                } as any;
                updatedDocEntry = nextDoc;
                return nextDoc;
            }
            return doc;
        });

        const nextDocKey = updatedDocEntry ? getDocKey(updatedDocEntry) : `${pendingCountry}_${pendingFile.name}`;

        setStagedSyncEntries((prev) => {
            const existingStagedIdx = prev.findIndex((item) => item.key === editingId && item.action !== 'delete');
            if (existingStagedIdx !== -1) {
                const existingStaged = prev[existingStagedIdx];
                const isStillNew = existingStaged.action === 'new';
                const updatedItem: StagedSyncEntry = {
                    key: nextDocKey,
                    action: isStillNew ? 'new' : 'update',
                    id: isStillNew ? '' : (editingDoc?.id || existingStaged.id || ''),
                    name: pendingFile.name,
                    dueDate: cleanDueDate,
                    country: pendingCountry,
                    data: resolvedData || existingStaged.data,
                };
                const next = [...prev];
                next[existingStagedIdx] = updatedItem;
                return next;
            }
            return [
                ...prev,
                {
                    key: nextDocKey,
                    action: (editingDoc?.id ? 'update' : 'new') as SyncAttachedFileAction,
                    id: editingDoc?.id || '',
                    name: pendingFile.name,
                    dueDate: cleanDueDate,
                    country: pendingCountry,
                    data: resolvedData,
                },
            ];
        });

        const isMatchingAttachedFile = (file: AttachedFilesType) =>
            (existingAtt && file === existingAtt) ||
            (editingDoc?.name && file.name && file.name.trim() === editingDoc.name.trim()) ||
            (editingDoc?.id && file.id && file.id === editingDoc.id);

        const hasExistingFile = files.some(isMatchingAttachedFile);
        const updatedFiles: AttachedFilesType[] = hasExistingFile
            ? files.map((file) => {
                  if (isMatchingAttachedFile(file)) {
                      const nextFile: AttachedFilesType = {
                          name: pendingFile.name,
                          data: pendingFile.data || file.data,
                          type: pendingFile.type || file.type || 'application/pdf',
                          productFileType: file.productFileType || currentProductFileType,
                          isNew: true,
                      };
                      if (file.id && !file.isNew) {
                          nextFile.id = file.id;
                      }
                      return nextFile;
                  }
                  return file;
              })
            : [
                  ...files,
                  {
                      name: pendingFile.name,
                      data: pendingFile.data,
                      type: pendingFile.type || 'application/pdf',
                      productFileType: currentProductFileType,
                      isNew: true,
                  },
              ];

        onRegistrationDocumentsChange(updatedDocs);
        onFilesChange(updatedFiles);
        handleCancelEdit();
    };

    // ── Cancel editing ──────────────────────────────────────────────────────
    const handleCancelEdit = () => {
        setEditingId(null);
        setPendingFile(null);
        setPendingCountry('');
        setPendingDate('');
        setCountryError(null);
        setFileError(null);
    };

    // ── Delete a file ───────────────────────────────────────────────────────
    const handleRemove = (target: RegistrationDocumentType) => {
        if (!canModifyFile(target)) {
            toast.warn('Only just now added or declined files can be deleted.', {
                position: 'top-right',
                autoClose: 2500,
            });
            return;
        }

        const targetKey = getDocKey(target);
        if (editingId === targetKey) {
            handleCancelEdit();
        }

        const existingAtt = findAttachedFile(target);

        setStagedSyncEntries((prev) => {
            const existingStaged = prev.find((item) => item.key === targetKey && item.action !== 'delete');
            // If it was added in this session and never sent to backend, just remove it from staged entries
            if (existingStaged && existingStaged.action === 'new' && !target.id) {
                return prev.filter((item) => item !== existingStaged);
            }
            // Otherwise it is an existing backend file being deleted
            const filtered = existingStaged ? prev.filter((item) => item !== existingStaged) : prev;
            return [
                ...filtered,
                {
                    key: `delete_${target.id || targetKey}_${Date.now()}`,
                    action: 'delete',
                    id: target.id || existingStaged?.id || '',
                    name: target.name,
                    dueDate: formatDueDateStr(target.dueDate),
                    country: getDocCountryId(target),
                    data: existingAtt?.data || existingStaged?.data || '',
                },
            ];
        });

        onRegistrationDocumentsChange(registrationDocuments.filter((d) => getDocKey(d) !== targetKey));
        onFilesChange(
            files.filter(
                (f) =>
                    !(target.name && f.name && f.name.trim() === target.name.trim()) &&
                    !(target.id && f.id && f.id === target.id)
            )
        );
    };

    // ── Send staged changes to /SyncAttachedFiles ───────────────────────────
    const handleSyncSend = async () => {
        if (!docUuid || stagedSyncEntries.length === 0) return;

        try {
            setIsSyncing(true);
            const attachedFilesPayload: SyncAttachedFileItemType[] = stagedSyncEntries.map(
                ({ action, id, name, dueDate, country, data }) => ({
                    action,
                    id: action === 'new' ? '' : id,
                    name,
                    dueDate,
                    country,
                    data,
                })
            );

            const requestData = {
                token,
                alias,
                uuid: docUuid,
                attachedFiles: attachedFilesPayload,
            };

            const res = await syncAttachedFiles(superUser && ui ? { ...requestData, ui } : requestData);

            if (res && 'status' in res && res.status === 200) {
                setStagedSyncEntries([]);
                handleCancelEdit();
                setModalStatusInfo({
                    statusModalType: STATUS_MODAL_TYPES.SUCCESS,
                    title: 'Success',
                    subtitle: 'Files are successfully send',
                    onClose: () => {
                        setShowStatusModal(false);
                    },
                });
                setShowStatusModal(true);
                onSyncSuccess?.();
            } else {
                const errResponse = (res as any)?.response;
                const errorMessages =
                    errResponse?.data?.errorMessage ||
                    errResponse?.data?.message ||
                    (res as any)?.data?.errorMessage || ['Failed to send files.'];
                setModalStatusInfo({
                    statusModalType: STATUS_MODAL_TYPES.ERROR,
                    title: 'Error',
                    subtitle: 'Please, fix these errors!',
                    text: Array.isArray(errorMessages) ? errorMessages : [String(errorMessages)],
                    onClose: () => setShowStatusModal(false),
                });
                setShowStatusModal(true);
            }
        } catch (error: any) {
            console.error('Error syncing files:', error);
            const errorMessages =
                error?.response?.data?.errorMessage ||
                error?.response?.data?.message ||
                error?.message || ['Failed to send files.'];
            setModalStatusInfo({
                statusModalType: STATUS_MODAL_TYPES.ERROR,
                title: 'Error',
                subtitle: 'Please, fix these errors!',
                text: Array.isArray(errorMessages) ? errorMessages : [String(errorMessages)],
                onClose: () => setShowStatusModal(false),
            });
            setShowStatusModal(true);
        } finally {
            setIsSyncing(false);
        }
    };

    const resolveMimeType = (fileName: string, rawType?: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        const lowerType = (rawType || '').toLowerCase();
        if (ext === 'pdf' || lowerType.includes('pdf')) return 'application/pdf';
        if (ext === 'png' || lowerType.includes('png')) return 'image/png';
        if (ext === 'jpg' || ext === 'jpeg' || lowerType.includes('jpeg') || lowerType.includes('jpg')) {
            return 'image/jpeg';
        }
        if (lowerType.includes('/')) return rawType!;
        if (lowerType === 'image') return 'image/jpeg';
        return 'application/octet-stream';
    };

    const createFileBlob = (doc: RegistrationDocumentType): { blob: Blob; fileName: string } | null => {
        const file = findAttachedFile(doc);
        if (!file || !file.data) return null;
        const fileName = doc.name || file.name;
        const mimeType = resolveMimeType(fileName, file.type);
        const cleanBase64 = file.data.replace(/^data:.*?;base64,/, '');
        const blob = base64ToBlob(cleanBase64, mimeType);
        return { blob, fileName };
    };

    // ── View / Open file in new tab ─────────────────────────────────────────
    const handlePreview = (doc: RegistrationDocumentType) => {
        try {
            const res = createFileBlob(doc);
            if (!res) return;
            const url = window.URL.createObjectURL(res.blob);
            const newTab = window.open(url, '_blank');
            if (newTab) {
                newTab.document.title = res.fileName;
            }
        } catch (err) {
            console.error('Preview failed', err);
        }
    };

    // ── Download file ───────────────────────────────────────────────────────
    const handleDownload = (doc: RegistrationDocumentType) => {
        try {
            const res = createFileBlob(doc);
            if (!res) return;
            const url = window.URL.createObjectURL(res.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = res.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    // ── Status badge helper ─────────────────────────────────────────────────
    const getStatusInfo = (doc: RegistrationDocumentType): { label: string; className: string } | null => {
        const att = findAttachedFile(doc);
        const raw = getDocStatusRaw(doc);
        const clean = raw.toLowerCase().replace(/[_-]/g, ' ');

        // For files added locally in this session (not yet saved to backend and without a status)
        const hasBackendId = !!(doc.id || (doc as any).uuid);
        if ((att?.isNew || !hasBackendId) && (!raw || clean === 'just added')) {
            return null;
        }

        if (!raw) {
            return null;
        }

        if (clean === 'approved') {
            return { label: 'Approved', className: styles['status--approved'] };
        }
        if (clean === 'pending') {
            return { label: 'Pending', className: styles['status--pending'] };
        }
        if (clean === 'declined' || clean === 'rejected') {
            return { label: 'Declined', className: styles['status--declined'] };
        }
        if (clean === 'in progress' || clean === 'inprogress') {
            return { label: 'In progress', className: styles['status--in-progress'] };
        }

        return { label: raw, className: styles['status--default'] };
    };

    const columns = [
        {
            title: 'File name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: RegistrationDocumentType) => {
                const isEditingThisRow = editingId === getDocKey(record);
                const att = findAttachedFile(record);
                const resolvedName = name || att?.name || '';
                const displayName = isEditingThisRow && pendingFile ? pendingFile.name : resolvedName;
                const hasData = !!att?.data;

                return isEditingThisRow ? (
                    <div className={styles['file-edit-cell']}>
                        <Icon name="file-filled" />
                        <span className={styles['file-edit-name']} title={displayName}>
                            {displayName}
                        </span>
                        <button
                            type="button"
                            className={styles['replace-file-btn']}
                            onClick={() => inlineFileInputRef.current?.click()}
                            title="Replace attached file"
                        >
                            <Icon name="upload" />
                            <span>Replace</span>
                        </button>
                        <input
                            ref={inlineFileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                            style={{ display: 'none' }}
                            onChange={handleFileInputChange}
                        />
                    </div>
                ) : (
                    <span
                        className={styles['file-name']}
                        onClick={() => handlePreview(record)}
                        style={{ cursor: hasData ? 'pointer' : 'default' }}
                        title={hasData ? 'Click to view' : ''}
                    >
                        <Icon name="file-filled" />
                        <span>{resolvedName}</span>
                    </span>
                );
            },
        },
        {
            title: 'Product type',
            key: 'category',
            render: () => categoryLabel,
        },
        {
            title: 'Document type',
            key: 'docType',
            render: (_: unknown, record: RegistrationDocumentType) => record.type || documentTypeLabel,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: (_: unknown, record: RegistrationDocumentType) => {
                const isEditingThisRow = editingId === getDocKey(record);

                if (isEditingThisRow) {
                    return (
                        <div className={`${styles['inline-field']} ${styles['country-field']} ${countryError ? styles['has-error'] : ''}`}>
                            <FieldBuilder
                                name={`table-country-${getDocKey(record)}`}
                                fieldType={FormFieldTypes.SELECT}
                                label=""
                                // placeholder="Select country..."
                                options={countryOptions}
                                value={pendingCountry}
                                onChange={(val: string) => {
                                    setPendingCountry(val);
                                    if (val) setCountryError(null);
                                }}
                                errorMessage={countryError || undefined}
                                isSearchable={true}
                                isClearable={true}
                            />
                        </div>
                    );
                }

                const countryId = typeof record.country === 'object' ? record.country?.id : (record.country as unknown as string);
                const countryCode = typeof record.country === 'object' ? record.country?.country : (record.country as unknown as string);

                if (!countryId && !countryCode) return '—';
                const found = findMatchingCountryOption(countryId) || findMatchingCountryOption(countryCode);
                if (found) return found.label;
                if (countryCode) return getCountryLabel(countryCode);
                return countryId || '—';
            },
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (dueDate: string, record: RegistrationDocumentType) => {
                const isEditingThisRow = editingId === getDocKey(record);

                if (isEditingThisRow) {
                    return (
                        <div className={styles['inline-field']}>
                            <FieldBuilder
                                name={`table-date-${getDocKey(record)}`}
                                fieldType={FormFieldTypes.DATE}
                                label=""
                                // placeholder="Select date..."
                                value={pendingDate}
                                onChange={(val: string) => setPendingDate(isDueDateEmpty(val) ? '' : val)}
                                isClearable={true}
                                allowManualInput={true}
                            />
                        </div>
                    );
                }

                if (isDueDateEmpty(dueDate)) return '';
                try {
                    const d = new Date(dueDate);
                    if (isDateEmpty(d) || d.getFullYear() <= 1901) return '';
                    return formatDateToDisplayString(d);
                } catch {
                    return '';
                }
            },
        },
        {
            title: (
                <Tooltip
                    title={ProductOtherHints['certificateStatus']}
                    open={isTutorialMode}
                    placement="top"
                    autoAdjustOverflow={false}
                    getPopupContainer={(triggerNode) => (triggerNode.closest('.card') as HTMLElement) || document.body}
                    overlayClassName={styles['tutorial-hint-antd-tooltip']}
                >
                    <span style={{ cursor: 'default' }}>Status</span>
                </Tooltip>
            ),
            key: 'status',
            render: (_: unknown, record: RegistrationDocumentType) => {
                const s = getStatusInfo(record);
                if (!s) return '';

                return (
                    <span className={`${styles['status-badge']} ${s.className}`}>
                        <span className={styles['status-circle']}>
                            <Icon name={s.label == 'Approved' ? 'biggest-check' : s.label == 'Declined' ? 'close' : 'clock'}/>
                        </span>
                        {s.label}
                    </span>
                );
            },
        },
        {
            title: '',
            key: 'action',
            width: 80,
            render: (_: unknown, record: RegistrationDocumentType) => {
                if (readOnly || !canModifyFile(record)) return null;

                const isEditingThisRow = editingId === getDocKey(record);

                if (isEditingThisRow) {
                    return (
                        <div className={styles['action-buttons']}>
                            <button
                                type="button"
                                className={`${styles['action-btn']} ${styles['save-btn']}`}
                                title="Save changes"
                                onClick={handleSaveEdit}
                            >
                                <Icon name="biggest-check" />
                            </button>
                            <button
                                type="button"
                                className={`${styles['action-btn']} ${styles['cancel-btn']}`}
                                title="Cancel"
                                onClick={handleCancelEdit}
                            >
                                <Icon name="close" />
                            </button>
                        </div>
                    );
                }

                return (
                    <div className={styles['action-buttons']}>
                        <button
                            type="button"
                            className={`${styles['action-btn']} ${styles['edit-btn']}`}
                            title="Edit"
                            onClick={() => handleStartEdit(record)}
                        >
                            <Icon name="edit" />
                        </button>
                        <button
                            type="button"
                            className={`${styles['action-btn']} ${styles['delete-btn']}`}
                            title="Delete"
                            onClick={() => handleRemove(record)}
                        >
                            <Icon name="waste-bin" />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div ref={containerRef} className={`${styles['cpnp-block']} card`}>
            <p className={styles['extra-title']}>{label}</p>
            {!readOnly && (
                <div className={styles['cpnp-block__controls']}>
                    {/* Country select */}
                    <div className={`${styles['cpnp-block__country']} ${countryError ? styles['has-error'] : ''}`}>
                        <FieldBuilder
                            name="cpnp-country"
                            fieldType={FormFieldTypes.SELECT}
                            label={'Country'}
                            isRequired={true}
                            // placeholder="Select country..."
                            options={countryOptions}
                            value={pendingCountry}
                            onChange={(val: string) => {
                                setPendingCountry(val);
                                if (val) setCountryError(null);
                            }}
                            errorMessage={countryError || undefined}
                            isSearchable={true}
                            isClearable={true}
                            hint={documentTypeLabel === 'CPNP' ? ProductOtherHints['certificateCountryCPNP'] : ProductOtherHints['certificateCountryProof']}
                        />
                    </div>

                    {/* Upload file button (acts as file picker) */}
                    <div className={styles['cpnp-block__upload']}>
                        <TutorialHintTooltip hint={ProductOtherHints['certificateFile']}>
                            <label className={`${styles['cpnp-block__field-label']} ${styles['required']}`}>Document</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                style={{ display: 'none' }}
                                onChange={handleFileInputChange}
                            />
                            {!pendingFile ? (
                                <button
                                    type="button"
                                    className={`${styles['cpnp-block__upload-btn']} ${fileError ? styles['has-error'] : ''} ${isDragging ? styles['is-dragging'] : ''}`}
                                    onClick={() => {
                                        setFileError(null);
                                        fileInputRef.current?.click();
                                    }}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className={styles['cpnp-block__upload-content']}>
                                        <div className={styles['cpnp-block__upload-main']}>
                                            <Icon name="upload" />
                                            <span>Upload file</span>
                                        </div>
                                        <span className={styles['cpnp-block__upload-hint']}>
                                            The supported file formats: PDF, JPG, PNG (max 1 file, up to 10 total)
                                        </span>
                                    </div>
                                </button>
                            ) : (
                                <div
                                    className={`${styles['cpnp-block__file-preview']} ${fileError ? styles['has-error'] : ''} ${isDragging ? styles['is-dragging'] : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className={styles['cpnp-block__file-info']}>
                                        <Icon name="file-filled" />
                                        <span className={styles['cpnp-block__file-name']} title={pendingFile.name}>
                                            {pendingFile.name}
                                        </span>
                                    </div>
                                    <div className={styles['cpnp-block__file-actions']}>
                                        <button
                                            type="button"
                                            className={styles['cpnp-block__replace-btn']}
                                            onClick={() => {
                                                setFileError(null);
                                                fileInputRef.current?.click();
                                            }}
                                            title="Replace file"
                                        >
                                            <Icon name="upload" />
                                        </button>
                                        <button
                                            type="button"
                                            className={styles['cpnp-block__remove-btn']}
                                            onClick={handleRemovePendingFile}
                                            title="Remove file"
                                        >
                                            <Icon name="close" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {fileError && <p className={styles['error-message']}>{fileError}</p>}
                        </TutorialHintTooltip>
                    </div>

                    {/* Due date */}
                    <div className={styles['cpnp-block__date']}>
                        <FieldBuilder
                            name="cpnp-due-date"
                            fieldType={FormFieldTypes.DATE}
                            label="Due Date"
                            isRequired={false}
                            // placeholder="Select date..."
                            value={pendingDate}
                            onChange={(val: string) => setPendingDate(isDueDateEmpty(val) ? '' : val)}
                            isClearable={true}
                            allowManualInput={true}
                            hint={ProductOtherHints['certificateDueDate']}
                        />
                    </div>

                    {/* Action buttons */}
                    <div className={styles['cpnp-block__btn-wrap']}>
                        {editingId ? (
                            <div className={styles['cpnp-block__edit-actions']}>
                                <Button
                                    type="button"
                                    variant={ButtonVariant.PRIMARY}
                                    onClick={handleSaveEdit}
                                >
                                    Save {documentTypeLabel}
                                </Button>
                                <Button
                                    type="button"
                                    variant={ButtonVariant.SECONDARY}
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant={ButtonVariant.PRIMARY}
                                onClick={handleAddEntry}
                            >
                                Add {documentTypeLabel}
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Attached files table */}
            {registrationDocuments.length > 0 && (
                <div className={styles['cpnp-block__table-container']}>
                    <h5 className={styles['cpnp-block__table-title']}>Attached files list</h5>
                    <div className={`table-form-fields form-table ${styles['cpnp-block__table']}`}>
                        <Table
                            columns={columns}
                            dataSource={registrationDocuments.map((doc) => ({ ...doc, key: getDocKey(doc) }))}
                            pagination={false}
                            rowKey={(record) => getDocKey(record)}
                            size="small"
                            rowClassName={(record) =>
                                getDocKey(record) === editingId ? styles['row--editing'] : ''
                            }
                            onRow={(record) => {
                                const isEditingThisRow = editingId === getDocKey(record);
                                if (!isEditingThisRow) return {};
                                return {
                                    onKeyDown: (e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSaveEdit();
                                        } else if (e.key === 'Escape') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleCancelEdit();
                                        }
                                    },
                                };
                            }}
                        />
                    </div>
                </div>
            )}

            {showSyncSend && stagedSyncEntries.length > 0 && (
                <div className={styles['cpnp-block__send-wrap']}>
                    <Button
                        type="button"
                        variant={ButtonVariant.PRIMARY}
                        onClick={handleSyncSend}
                        disabled={isSyncing}
                    >
                        Send
                    </Button>
                </div>
            )}

            {isSyncing && <Loader />}
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </div>
    );
};

export default CpnpBlock;

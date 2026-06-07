import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type { Control } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import {Table, Tooltip, message} from "antd";
import useAuth from "@/context/authContext";
import useTenant from "@/context/tenantContext";
import { saveAntiFraudSettings } from "@/services/antiFraud";
import "@/styles/tables.scss";
import "@/styles/forms.scss";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Button, { ButtonSize, ButtonVariant } from "@/components/Button/Button";
import { Icon } from "@/components/Icon";
import {FormFieldTypes} from "@/types/forms";
import { isPhoneValid } from "@/utils/phoneNumber";
import FormFieldsBlock from "@/components/FormFieldsBlock";
import {GeneralFields} from "@/screens/AntiFraudSettingsPage/components/SettingsForm/antiFroudSettingsFields";
import TitleColumn from "@/components/TitleColumn";
import {
    ACTION_OPTIONS,
    ANTIFRAUD_ACTIONS,
    ANTIFRAUD_COD_TYPES,
    ANTIFRAUD_ZONES,
    AntiFraudSettingsFormType,
    COD_TYPE_OPTIONS,
    DEFAULT_ZONES,
    SUBSCRIPTION_OPTIONS,
    ZONE_COLORS,
    ZONE_OPTIONS,
    AntiFraudZoneType, AntiFraudDefaultSettingsType
} from "@/screens/AntiFraudSettingsPage/types";
import {round2, validateGradationCoverage} from "@/screens/AntiFraudSettingsPage/components/SettingsForm/utils";
import Checkbox from "@/components/FormBuilder/Checkbox";
import {Countries} from "@/types/countries";
import {AccessActions, AccessObjectTypes} from "@/types/auth";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";

export type AntiFraudSettingsPropsType = {
    antiFraudData?: AntiFraudSettingsFormType;
    onSuccessSave?: () => void;
    defaultSettings: AntiFraudDefaultSettingsType;
}

const AntiFraudSettings: React.FC<AntiFraudSettingsPropsType> = ({antiFraudData, onSuccessSave, defaultSettings}) => {
    const { token, ui, isActionIsAccessible } = useAuth();
    const { tenantData } = useTenant();
    const [gradationError, setGradationError] = useState<string>('');
    const [countryError, setCountryError] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [draggableRowIndex, setDraggableRowIndex] = useState<number | null>(null);

    const [isEditForbidden, setIsEditForbidden] = useState(false);

    useEffect(() => {
        if (!isActionIsAccessible(AccessObjectTypes["AntiFraud/Settings"], AccessActions.Edit)) {
            setIsEditForbidden(true);
        }
    }, [token, ui]);

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    const closeModal = useCallback(() => {
        setShowStatusModal(false);
    }, []);

    const countryOptions = useMemo(()=>(
        defaultSettings.countries.map(item => ({value: item.country, label: Countries[item.country] || '--'}))
    ),[defaultSettings.countries]);

    const defaultFormValues = useMemo(() => ({
        uuid: antiFraudData?.uuid || '',
        code: antiFraudData?.code || '',
        use: antiFraudData?.use || false,
        demoMode: antiFraudData?.demoMode || true,
        demoOrderCount: antiFraudData?.demoOrderCount || 0,
        checkingType: antiFraudData?.checkingType || '',
        description: antiFraudData?.description || '',
        subscription: antiFraudData?.subscription || 'Basic',
        codType: antiFraudData?.codType || ANTIFRAUD_COD_TYPES.All,
        startDate: antiFraudData?.startDate || '',
        endDate: antiFraudData?.endDate || '',
        countries: defaultSettings.countries.map((defCountry, index: number) => {
            const existing = antiFraudData?.countries?.find(c => c.country === defCountry.country);
            return {
                key: `${defCountry.country}__${Date.now().toString()}_${index}`,
                country: defCountry.country,
                use: existing ? existing.use : false,
            };
        }),
        gradation:
            antiFraudData && antiFraudData?.gradation && antiFraudData.gradation.length
                ? antiFraudData.gradation.map((item, index: number) => (
                    {
                        key:`${item.zone || 'zone'}_${Date.now().toString()}_${index}`,
                        zone: item.zone || ANTIFRAUD_ZONES.Grey,
                        minValue: item.minValue || 0,
                        maxValue: item.maxValue || 0,
                        action: item.action || ANTIFRAUD_ACTIONS.Block,
                        status: item.status || '',
                    })) : DEFAULT_ZONES,
        excludedPhoneNumbers: antiFraudData && antiFraudData?.excludedPhoneNumbers && antiFraudData.excludedPhoneNumbers.length
            ? antiFraudData.excludedPhoneNumbers.map((item, index: number) => (
                {
                    key:`${item.phone || 'phoneNumber'}_${Date.now().toString()}_${index}`,
                    phone: item.phone || '',
                })) : [],
    }),[antiFraudData]);

    const {
        control,
        handleSubmit,
        watch,
        getValues,
        setValue,
        formState: { errors, isDirty },
        reset,
    } = useForm<AntiFraudSettingsFormType>({
        mode: 'onSubmit',
        defaultValues: defaultFormValues,
    });

    const { fields: gradationFields, append: appendGradation, remove: removeGradation, move: moveGradation } = useFieldArray({ control, name: 'gradation' });
    const { append: appendPhone, remove: removePhone } = useFieldArray({ control, name: 'excludedPhoneNumbers' });

    const gradation = watch('gradation');

    const addGradationRow = useCallback(() => {
        const rows = getValues('gradation');
        const last = rows[rows.length - 1];
        const nextMin = last ? round2(last.maxValue + 0.01) : 0;
        const nextMax = round2(Math.min(nextMin + 10, 100));
        appendGradation({
            key: `grad-${Date.now().toString()}_${last}`,
            zone: 'Grey',
            minValue: nextMin,
            maxValue: nextMax,
            action: 'Allow',
            status: '',
        });
    }, [appendGradation, getValues]);

    const removeGradationRow = useCallback((idx: number) => {
        removeGradation(idx);
        setTimeout(() => {
            const rows = getValues('gradation');
            if (idx < rows.length) {
                const fixedMin = idx === 0 ? 0 : round2(rows[idx - 1].maxValue + 0.01);
                setValue(`gradation.${idx}.minValue`, fixedMin, { shouldValidate: true });
            }
        }, 0);
    }, [removeGradation, getValues, setValue]);

    //drag-and-drop
    const dragIndex = useRef<number | null>(null);

    const moveGradationRow = useCallback((fromIdx: number, toIdx: number) => {
        if (fromIdx === toIdx) return;
        moveGradation(fromIdx, toIdx);
    }, [moveGradation]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getGradationColumns = (control: Control<any>) => {
        return [
            {
                title: '',
                key: 'dragHandle',
                width: 32,
                render: (_text: any, _record: any) => {
                    const index = _record._mappedIndex;
                    return (
                        <span
                            className={styles['anti-fraud__drag-handle']}
                            title="Drag to reorder"
                            onMouseEnter={() => setDraggableRowIndex(index)}
                            onMouseLeave={() => setDraggableRowIndex(null)}
                        >
                            ⠿
                        </span>
                    );
                },
            },
            {
                title: <TitleColumn
                    minWidth="100px"
                    maxWidth="200px"
                    contentPosition="start"
                    childrenBefore={<Tooltip title="Sender country ➔ Receiver country"> Zone *</Tooltip>}>
                </TitleColumn>,
                dataIndex: 'zone',
                key: 'zone',
                // width: 150,
                render: (_text: any, _record: any) => {
                    const index = _record._mappedIndex;
                    const zone = gradation?.[index]?.zone as AntiFraudZoneType;
                    return (
                        <div
                            className={styles['anti-fraud__zone-cell']}
                            style={{ borderLeft: `4px solid ${ZONE_COLORS[zone] || '#ccc'}`, minWidth: '100px', maxWidth: '200px'}}
                        >
                            <Controller
                                key={`${_record.id}-${index}`}
                                name={`gradation.${index}.zone`}
                                control={control}
                                rules={{ required: 'Required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <FieldBuilder
                                        name={`gradation.${index}.zone`}
                                        fieldType={FormFieldTypes.SELECT}
                                        label=""
                                        {...field}
                                        value={field.value}
                                        options={ZONE_OPTIONS}
                                        onChange={(val) => field.onChange(val)}
                                        isClearable={false}
                                        isSearchable={false}
                                        errorMessage={error?.message}
                                        errors={errors}
                                    />
                                )}
                            />
                        </div>
                    );
                },
            },
            {
                title: 'Min value *',
                dataIndex: 'minValue',
                key: 'minValue',
                width: 70,
                render: (_text: any, _record: any) => {
                    const index = _record._mappedIndex;
                    return (
                    <div style={{ minWidth: '70px', maxWidth: '80px' }}>
                        <Controller
                            key={`${_record.id}-${index}`}
                            name={`gradation.${index}.minValue`}
                            control={control}
                            rules={{
                                required: 'Required',
                                min: { value: 0, message: 'Min 0' },
                                max: { value: 100, message: 'Max 100' },
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <FieldBuilder
                                    name={`gradation.${index}.minValue`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    label=""
                                    {...field}
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
                                    errorMessage={error?.message}
                                    errors={errors}
                                />
                            )}
                        />
                    </div>
                    );
                },
            },
            {
                title: 'Max value *',
                dataIndex: 'maxValue',
                key: 'maxValue',
                width: 70,
                render: (_text: any, _record: any) => {
                    const index = _record._mappedIndex;
                    return (
                    <div style={{ minWidth: '70px', maxWidth: '80px' }}>
                        <Controller
                            key={`${_record.id}-${index}`}
                            name={`gradation.${index}.maxValue`}
                            control={control}
                            rules={{
                                required: 'Required',
                                min: { value: 0, message: 'Min 0' },
                                max: { value: 100, message: 'Max 100' },
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <FieldBuilder
                                    name={`gradation.${index}.maxValue`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    label=""
                                    {...field}
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
                                    errorMessage={error?.message}
                                    errors={errors}
                                />
                            )}
                        />
                    </div>
                    );
                },
            },
            {
                title: 'Action *',
                dataIndex: 'action',
                key: 'action',
                width: 100,
                render: (_text: any, _record: any) => {
                    const index = _record._mappedIndex;
                    // const action = gradation?.[index]?.action as AntiFraudActionType;
                    return (
                        <div style={{ minWidth: '100px', maxWidth: '100px' }}>
                            <Controller
                                key={`${_record.id}-${index}`}
                                name={`gradation.${index}.action`}
                                control={control}
                                rules={{ required: 'Required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <FieldBuilder
                                        name={`gradation.${index}.action`}
                                        fieldType={FormFieldTypes.SELECT}
                                        label=""
                                        {...field}
                                        value={field.value}
                                        options={ACTION_OPTIONS}
                                        onChange={(val) => field.onChange(val)}
                                        isClearable={false}
                                        isSearchable={false}
                                        errorMessage={error?.message}
                                        errors={errors}
                                    />
                                )}
                            />
                        </div>
                    );
                },
            },
            {
                title: 'Status *',
                dataIndex: 'status',
                key: 'status',
                // width: '100%',
                render: (_text: any, _record: any) => {
                    const index = _record._mappedIndex;
                    return (
                    <div style={{ minWidth: '100px', maxWidth: '250px' }}>
                    <Controller
                        key={`${_record.id}-${index}`}
                        name={`gradation.${index}.status`}
                        control={control}
                        rules={{ required: 'Required' }}
                        render={({ field, fieldState: { error } }) => (
                            <FieldBuilder
                                name={`gradation.${index}.status`}
                                fieldType={FormFieldTypes.TEXT}
                                label=""
                                {...field}
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                placeholder="e.g. Safe"
                                errorMessage={error?.message}
                                errors={errors}
                            />
                        )}
                    />
                    </div>
                    );
                },
            },
            {
                title: '',
                key: 'action',
                width: 50,
                render: (_text: any, _record: any) => {
                    const index = _record._mappedIndex;
                    return (
                    <button
                        type="button"
                        className="action-btn"
                        onClick={() => removeGradationRow(index)}
                        title="Delete row"
                    >
                        <Icon name="waste-bin" />
                    </button>
                    );
                },
            },
        ];
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getPhoneColumns = (control: Control<any>) => {
        return [
            {
                title: '#',
                key: 'rowNumber',
                width: 40,
                render: (_text, _record, index) => (
                    <span style={{ color: 'var(--color-light-blue-gray)', fontSize: '11px' }}>{index + 1}</span>
                ),
            },
            {
                title: 'Phone number *',
                dataIndex: 'phone',
                key: 'phone',
                width: '100%',
                render: (_text, _record, index) => (
                    <Controller
                        name={`excludedPhoneNumbers.${index}.phone`}
                        control={control}
                        rules={{
                            required: 'Required',
                            validate: (v) =>
                                isPhoneValid(v) || 'Enter a valid phone number with country code (e.g. +380991234567)',
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <FieldBuilder
                                name={`excludedPhoneNumbers.${index}.phone`}
                                fieldType={FormFieldTypes.TEXT}
                                label=""
                                {...field}
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                placeholder="+380..."
                                errorMessage={error?.message}
                                errors={errors}
                            />
                        )}
                    />
                ),
            },
            {
                title: '',
                key: 'action',
                width: 50,
                render: (_text, _record, index) => (
                    <button
                        type="button"
                        className="action-btn"
                        onClick={() => removePhone(index)}
                        title="Delete phone"
                    >
                        <Icon name="waste-bin" />
                    </button>
                ),
            },
        ];
    };


    const checkCustomErrors = (data: AntiFraudSettingsFormType) => {
        let isValid = true;
        
        const isCountrySelected = data.countries.some(c => c.use);
        if (!isCountrySelected) {
            setCountryError("Select at least one country");
            isValid = false;
        } else {
            setCountryError("");
        }

        const coverageError = validateGradationCoverage(data.gradation);
        if (coverageError) {
            setGradationError(`${coverageError}`);
            isValid = false;
        } else {
            setGradationError("");
        }
        
        return isValid;
    };

    const scrollToFirstError = () => {
        setTimeout(() => {
            const errorElements = document.querySelectorAll('.has-error');
            if (errorElements.length > 0) {
                let firstElement = errorElements[0];
                let minTop = firstElement.getBoundingClientRect().top;
                for (let i = 1; i < errorElements.length; i++) {
                    const top = errorElements[i].getBoundingClientRect().top;
                    if (top < minTop && top > 0) {
                        minTop = top;
                        firstElement = errorElements[i];
                    }
                }
                const errorText = firstElement.querySelector('.error');
                (errorText || firstElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const onFormError = () => {
        checkCustomErrors(getValues());
        message.error("Please fix the errors in the form before submitting.");
        scrollToFirstError();
    };

    const onSubmit = useCallback(async (data: AntiFraudSettingsFormType) => {
        const isCustomValid = checkCustomErrors(data);
        if (!isCustomValid) {
            message.error("Please fix the errors in the form before submitting.");
            scrollToFirstError();
            return;
        }
        
        if (!token || !tenantData?.alias) return;
        
        setIsSaving(true);
        try {
            const res = await saveAntiFraudSettings({
                token,
                alias: tenantData.alias,
                ui,
                settings: data
            });
            if (res?.status === 200) {
                message.success("Settings saved successfully!");
                if (onSuccessSave) {
                    onSuccessSave();
                }

            } else if (res && 'response' in res) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse && 'errorMessage' in errResponse.data) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix errors!`, text: errorMessages, onClose: closeModal })
                    setShowStatusModal(true);
                }
            } else {
                message.error("Failed to save settings.");
            }
        } catch (e) {
            message.error("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    }, [token, tenantData?.alias, ui, onSuccessSave]);

    const handleReset = useCallback(() => {
        reset(defaultFormValues);
    }, [reset]);

    const generalFields = useMemo(()=>GeneralFields({subscriptionOptions: SUBSCRIPTION_OPTIONS, codTypeOptions: COD_TYPE_OPTIONS}), []);

    return (
        <div className={`card ${styles['anti-fraud']}`}>
            <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate>
                <div className={styles['anti-fraud__wrapper']}>
                    <div className={styles['anti-fraud__wrapper-inner']}>
                        {/*<p className='title-h4'>General settings</p>*/}
                        <div className={`grid-row ${styles['anti-fraud__settings-main']}`}>
                            <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors} />

                        </div>

                        {/*countries*/}
                        <div className={`${styles['anti-fraud__countries']} ${countryError ? 'has-error' : ''}`}>
                            <p className={"title-h4"}>
                                Countries *
                            </p>
                            {countryError && <p className="error" style={{marginTop: '4px', marginBottom: '8px', color: '#E62E2E', fontSize: '12px'}}>{countryError}</p>}
                            <ul 
                                className={` grid-row`} 
                                style={countryError ? { border: '1px solid #E62E2E', padding: '10px', borderRadius: '8px' } : {}}
                            >
                                    {countryOptions.map((item, index) => (
                                        <li key={item.value + '_' + index} className={`width-17`}>
                                            <Controller
                                                control={control}
                                                name={`countries.${index}.use`}
                                                render={({ field: { onChange, value } }) => (
                                                    <Checkbox
                                                        name={item.value}
                                                        label={item.label}
                                                        checked={value}
                                                        isCountry={true}
                                                        flagBefore={true}
                                                        disabled={isEditForbidden}
                                                        countryName={item.value}
                                                        onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                                                            onChange(val.target.checked);
                                                            if (countryError && val.target.checked) setCountryError(''); // Clear error on check
                                                        }}
                                                        classNames={'small-check'}
                                                    />
                                                )}
                                            />
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div 
                            className={`${styles['anti-fraud__table-section']} ${gradationError ? 'has-error' : ''}`}
                            style={gradationError ? { border: '1px solid #E62E2E', padding: '10px', borderRadius: '8px' } : {}}
                        >
                            <div className={styles['anti-fraud__table-section--gradation']}>
                                <div className={styles['anti-fraud__table-header']}>
                                    <div className={styles['anti-fraud__table-header-title']}>
                                        <p className='title-h4'>Score gradation</p>
                                        {gradationError && <p className="error" style={{marginTop: '4px', marginBottom: '8px', color: '#E62E2E', fontSize: '12px'}}>{gradationError}</p>}
                                        <p className={styles['anti-fraud__table-hint']}>
                                            Rows must cover 0–100 without gaps or overlaps (step&nbsp;0.01).
                                            Each row's min must equal the previous row's max&nbsp;+&nbsp;0.01.
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        size={ButtonSize.SMALL}
                                        variant={ButtonVariant.SECONDARY}
                                        icon="add-table-row"
                                        iconOnTheRight
                                        onClick={addGradationRow}
                                    >
                                        Add row
                                    </Button>
                                </div>


                                <div className={`${styles['anti-fraud__table-wrap']} table-form-fields form-table`}>
                                    <Table
                                        columns={getGradationColumns(control)}
                                        dataSource={gradationFields.map((field, idx) => ({ ...field, _mappedIndex: idx }))}
                                        pagination={false}
                                        rowKey="id"
                                        onRow={(_record) => {
                                            const isDraggable = draggableRowIndex === _record._mappedIndex;
                                            return {
                                                draggable: isDraggable,
                                                onDragStart: (e: React.DragEvent) => { 
                                                    if (!isDraggable) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    dragIndex.current = _record._mappedIndex; 
                                                },
                                                onDragOver: (e: React.DragEvent) => { e.preventDefault(); },
                                                onDrop: () => {
                                                    if (dragIndex.current !== null && dragIndex.current !== _record._mappedIndex) {
                                                        moveGradationRow(dragIndex.current, _record._mappedIndex);
                                                    }
                                                    dragIndex.current = null;
                                                },
                                                style: isDraggable ? { cursor: 'grab' } : {},
                                            };
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles['anti-fraud__table-section--phoneNumber']}>
                                <div className={styles['anti-fraud__table-header']}>
                                    <div className={styles['anti-fraud__table-header-title']}>
                                        <p className='title-h4'>Excluded phone numbers</p>
                                    </div>
                                    <Button
                                        type="button"
                                        size={ButtonSize.SMALL}
                                        variant={ButtonVariant.SECONDARY}
                                        icon="add-table-row"
                                        iconOnTheRight
                                        onClick={() => appendPhone({ key: `phone-${Date.now()}`, phone: '' })}
                                    >
                                        Add phone
                                    </Button>
                                </div>
                                <div className={styles['table-scroll-wrap']}>
                                    <div className={`${styles['anti-fraud__table-wrap']} ${styles['table-scroll-wrap--inner']} table-form-fields form-table`}>
                                        <Table
                                            columns={getPhoneColumns(control)}
                                            dataSource={getValues('excludedPhoneNumbers')?.map(row => ({ ...row })) || []}
                                            pagination={false}
                                            rowKey="key"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles['anti-fraud__actions']}>
                    <Button
                        type="button"
                        variant={ButtonVariant.SECONDARY}
                        size={ButtonSize.SMALL}
                        onClick={handleReset}
                        disabled={!isDirty || isSaving || isEditForbidden}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        variant={ButtonVariant.PRIMARY}
                        size={ButtonSize.SMALL}
                        disabled={isSaving || isEditForbidden}
                    >
                        {isSaving ? "Saving..." : "Save settings"}
                    </Button>
                </div>

            </form>
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </div>
    );
};

export default AntiFraudSettings;

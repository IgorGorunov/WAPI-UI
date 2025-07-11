import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {FormFieldTypes, WidthType} from "@/types/forms";
import {COUNTRIES} from "@/types/countries";
import "./styles.scss";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {
    ProductParamsType,
    SingleProductFormType,
    SingleProductType
} from "@/types/products";
import {
    FormFieldsAdditional1,
    FormFieldsAdditional2,
    FormFieldsGeneral,
    FormFieldsSKU,
    FormFieldsWarehouse,
} from "./ProductFormFields";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Button, {ButtonSize, ButtonVariant} from "@/components/Button/Button";
import {createOptions} from "@/utils/selectOptions";
import {Table} from 'antd';
import FormFieldsBlock from "@/components/FormFieldsBlock";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import {sendProductInfo} from "@/services/products";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import DropZone from '@/components/Dropzone';
import StatusHistory from "./StatusHistory";
import {toast, ToastContainer} from '@/components/Toast';
import "@/styles/tables.scss";
import '@/styles/forms.scss';
import {TabFields, TabTitles} from "./ProductFormTabs";
import {useTabsState} from "@/hooks/useTabsState";
import Loader from "@/components/Loader";
import {AttachedFilesType, STATUS_MODAL_TYPES} from "@/types/utility";
import useNotifications from "@/context/notificationContext";
import {NOTIFICATION_OBJECT_TYPES, NOTIFICATION_STATUSES, NotificationType} from "@/types/notifications";
import DocumentTickets from "@/components/DocumentTickets";
import SingleDocument from "@/components/SingleDocument";
import {TICKET_OBJECT_TYPES} from "@/types/tickets";
import CardWithHelpIcon from "@/components/CardWithHelpIcon";
import {ProductDimensionsHints, ProductOtherHints} from "@/screens/ProductsPage/productsHints.constants";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";
import {CommonHints} from "@/constants/commonHints";
import ConfirmModal from "@/components/ModalConfirm";
import {sendUserBrowserInfo} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import {isTabAllowed} from "@/utils/tabs";

const enum SendStatusType {
    DRAFT = 'draft',
    PENDING = 'pending',
    APPROVED = 'Approved',
}

type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type ProductPropsType = {
    isEdit?: boolean;
    isAdd?: boolean;
    uuid?: string | null;
    productParams: ProductParamsType;
    productData?: SingleProductType | null;
    closeProductModal: ()=>void;
    products: {name: string; uuid: string; quantity: number }[];
    refetchDoc: ()=>void;
    forbiddenTabs: string[] | null;
}
const ProductFormComponent: React.FC<ProductPropsType> = ({uuid, products, productParams, productData, closeProductModal, refetchDoc, forbiddenTabs}) => {
    const {notifications} = useNotifications();
    const { tenantData: { alias }} = useTenant();
    const {needSeller, sellersList, sellersListActive} = useAuth();

    const productIsApproved = !!(productData && productData?.status.toLowerCase() === 'approved') ;
    const productIsInDraft = !!(productData && productData?.status.toLowerCase() === 'draft');

    const [isDisabled, setIsDisabled] = useState(!!productData?.uuid);
    // const isDisabled = (productData?.status !== 'Draft' && productData?.status !=='Pending' && productData !== null);

    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeSuccessModal = useCallback(()=>{
        setShowStatusModal(false);
        closeProductModal();
    }, []);
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])


    const [isLoading, setIsLoading] = useState(false);
    const [sendStatus, setSendStatus] = useState(SendStatusType.DRAFT);

    //tickets
    const [showTicketForm, setShowTicketForm] = useState(false);
    const handleCreateTicket = () => {
        setShowTicketForm(true)
    }

    const countryArr = COUNTRIES.map(item => ({label: item.label, value: item.value.toUpperCase()}));

    type ApiResponse = {
        data?: any;
        response?: {
            data?: {
                errorMessage: string[];
            }
        }
    };

    const analogueOptions = useMemo(()=>{
        return products.map(item=>{return{value:item.uuid, label:item.name}})
    }, [products]);

    const {control, handleSubmit, formState: { errors }, getValues, setValue, watch, setError, clearErrors} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            uuid: productData?.uuid || uuid || '',
            name: productData?.name || '',
            fullName: productData?.fullName || '',
            status: productData?.status || SendStatusType.DRAFT,
            countryOfOrigin: productData?.countryOfOrigin || '',
            purchaseValue: productData?.purchaseValue || 0,
            sku: productData?.sku || '',
            amazonSku: productData?.amazonSku || '',
            hsCode: productData?.hsCode || '',
            typeOfStorage: productData?.typeOfStorage || '',
            salesPackingMaterial : productData?.salesPackingMaterial || '',
            specialTemperatureControl: productData?.specialTemperatureControl || '',
            specialDeliveryOrStorageRequirements: productData?.specialDeliveryOrStorageRequirements || '',
            whoProvidesPackagingMaterial: productData?.whoProvideExtraPacking || '',
            expiringTerm: productData?.expiringTerm || 0,
            liquid: productData?.liquid,
            glass: productData?.glass,
            fragile: productData?.fragile,
            fireproof: productData?.fireproof,
            packingBox: productData?.packingBox,
            hazmat: productData?.hazmat,
            unitOfMeasure: productData?.unitOfMeasure || 'pcs',
            withoutMasterCartonData: productData?.withoutMasterCartonData || productData?.unitOfMeasures.length<=1 || false,
            additionalService: !!productData?.additionalService || false,
            seller: productData?.seller || '',
            unitOfMeasures:
                productData && productData.unitOfMeasures
                    ? productData.unitOfMeasures.map((unit, index) => (
                        {
                            key: `unit-${unit.name}_${index}`,
                            selected: false,
                            name: unit.name || '',
                            coefficient: unit.coefficient || 0,
                            width: unit.width || 0,
                            length: unit.length || 0,
                            height: unit.height || 0,
                            weightGross: unit.weightGross || 0,
                            weightNet: unit.weightNet || 0,
                        }))
                    : [
                        {
                            key: `unit-psc-${Date.now().toString()}`,
                            selected: false,
                            name: 'pcs',
                            coefficient: 1,
                            width: 0,
                            length: 0,
                            height:  0,
                            weightGross: 0,
                            weightNet: 0,
                        },
                        {
                            key: `unit-box-${Date.now().toString()}`,
                            selected: false,
                            name: 'master carton',
                            coefficient: 0,
                            width: 0,
                            length: 0,
                            height:  0,
                            weightGross: 0,
                            weightNet: 0,
                        }
                    ],
            barcodes:
                productData && productData?.barcodes && productData.barcodes.length
                    ? productData.barcodes.map((code, index: number) => (
                        {
                            key: code || `barcode-${Date.now().toString()}_${index}`,
                            selected: false,
                            barcode: code || '',
                        }))
                    : [],
            aliases:
                productData && productData?.aliases && productData.aliases.length
                    ? productData.aliases.map((alias, index: number) => (
                        {
                            key: alias || `alias-${Date.now().toString()}_${index}`,
                            selected: false,
                            alias: alias || '',
                        }))
                    : [],
            bundleKit:
                productData && productData?.bundleKit && productData.bundleKit.length
                    ? productData.bundleKit.map((bundle, index: number) => (
                        {
                            key: bundle.uuid || `bundle-${Date.now().toString()}_${index}`,
                            selected: false,
                            uuid: bundle.uuid || '',
                            quantity: bundle.quantity || 0,
                        }))
                    : [],
            analogues:
                productData && productData?.analogues && productData.analogues.length
                    ? productData.analogues.map((analogue, index: number) => (
                        {
                            key: analogue || `analogue-${Date.now().toString()}_${index}`,
                            selected: false,
                            analogue: analogue || '',
                        }))
                    : [],
        }
    })
    const { append } = useFieldArray({ control, name: 'unitOfMeasures' });
    const { append: appendBarcode, remove: removeBarcode } = useFieldArray({ control, name: 'barcodes' });
    const { append: appendAlias, remove: removeAlias } = useFieldArray({ control, name: 'aliases' });
    const { append: appendBundle, remove: removeBundle } = useFieldArray({ control, name: 'bundleKit' });
    const { append: appendAnalogue, remove: removeAnalogue } = useFieldArray({ control, name: 'analogues' });
    const unitOfMeasures = watch('unitOfMeasures');
    const unitOfMeasure = watch('unitOfMeasure');
    const purchaseValue = watch('purchaseValue');
    const withoutMasterCartonData = watch('withoutMasterCartonData');

    const [unitOfMeasureOptions, setUnitOfMeasureOptions] = useState<string[]>([]);

    const getOptions = () => {
        // Extract names from unitOfMeasures array
        return unitOfMeasureOptions.map((item) => ({ value: item, label: item }));
    };

    const getBoxes = useCallback((arr) => {
        return arr.filter(item => item.name.toLowerCase().includes('box') || item.name.toLowerCase().includes('carton'));
    },[]);

    const getPieces = useCallback((arr) => {
        return arr.filter(item => !(item.name.toLowerCase().includes('box') || item.name.toLowerCase().includes('carton')));
    },[]);

    //additional virtual product
    const isAdditionalService = watch('additionalService');

    //confirm to remove master carton (box) data on setting Additional product
    const [showConfirmModalAdditionalService, setShowConfirmModalAdditionalService] = useState(false);
    const handleConfirmAdditionalService = () => {
        setShowConfirmModalAdditionalService(false);
        removeMasterCarton();
        setValue('withoutMasterCartonData', true);
    }
    const handleCancelAdditionalService = () => {
        setShowConfirmModalAdditionalService(false);
        setValue('additionalService', false);
    }

    const handleAdditionalServiceChange = (val: React.ChangeEvent<HTMLInputElement>) => {
        const boxes = getBoxes(getValues('unitOfMeasures'));

        if (val.target.checked) {
            if (!purchaseValue) {
                setValue('purchaseValue', 1);
            }
            if (!withoutMasterCartonData) {
                if (boxes.length && (boxes[0].coefficient || boxes[0].width || boxes[0].length || boxes[0].weightGross)) {
                    setShowConfirmModalAdditionalService(true);
                } else {
                    // setValue('additionalService', true)
                    setValue('withoutMasterCartonData', true);
                    removeMasterCarton();
                }
            }
        } else if (withoutMasterCartonData !== !!productData?.withoutMasterCartonData) {
            // setValue('additionalService', false);
            setValue('withoutMasterCartonData', productData?.withoutMasterCartonData);
            if (unitOfMeasures.length <=1 && !boxes.length) {
                append({  key: `unit-box-${Date.now().toString()}`, selected: false, name: 'master carton', coefficient:0, width: 0, length: 0, height: 0, weightGross:0, weightNet: 0 })
            }
        }
    }

    useEffect(() => {
        // Update the select options when the unitOfMeasures array changes
        const names: string[] = unitOfMeasures.map((row) => row.name as string);
        if (withoutMasterCartonData) {
            const pieces = getPieces(unitOfMeasures);
            setUnitOfMeasureOptions(pieces.map(item => item.name as string))
            if (unitOfMeasure && pieces.length && !pieces.filter(item => item.name == (unitOfMeasure as string)).length) {
                setValue('unitOfMeasure', '');
            }
        } else {
            setUnitOfMeasureOptions(names);
        }

    }, [setUnitOfMeasureOptions, getPieces, unitOfMeasures, withoutMasterCartonData]);


    const handleUnitNameChange = (newValue: string, index: number) => {
        // Update the unitOfMeasureOptions based on the changed "Unit Name"
        setUnitOfMeasureOptions(prevState => {
            const arr = [...prevState];
            arr[index]=newValue;
            return arr;
        });
    };

    const removeMasterCarton = () => {
        const newUnitsArr = getPieces(unitOfMeasures);
        setValue('unitOfMeasures', newUnitsArr);
    }

    //confirm to remove master carton data
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const handleConfirmToRemoveMasterCarton = () => {
        setShowConfirmModal(false);
        const boxes = getBoxes(unitOfMeasures);
        if (boxes.length) {
            setValue('withoutMasterCartonData', true);
            removeMasterCarton();
        }
    }

    const handleMasterCartonDataChange = (val: React.ChangeEvent<HTMLInputElement>, onChange) => {
        const boxes = getBoxes(unitOfMeasures);
        if (val.target.checked) {
            if (boxes.length && (boxes[0].coefficient || boxes[0].width || boxes[0].length || boxes[0].weightGross)) {
                setShowConfirmModal(true);
            } else {
                onChange(val);
                removeMasterCarton();
            }
        } else {
            onChange(val);
            if (unitOfMeasures.length <=1 && !boxes.length) {
                append({  key: `unit-box-${Date.now().toString()}`, selected: false, name: 'master carton', coefficient:0, width: 0, length: 0, height: 0, weightGross:0, weightNet: 0 })
            }
        }
    }

    const getUnitsColumns = (control: any) => {
        return [
            // {
            //     title: (
            //         <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
            //             <FieldBuilder
            //                 name={'selectedAllUnits'}
            //                 fieldType={FormFieldTypes.CHECKBOX}
            //                 checked ={selectAllUnits}
            //                 disabled={isDisabled || productIsApproved}
            //                 onChange={(e: ChangeEvent<HTMLInputElement>) => {
            //                     setSelectAllUnits(e.target.checked);
            //                     // Update the values of all checkboxes in the form when "Select All" is clicked
            //                     const values = getValues();
            //                     const fields = values.unitOfMeasures;
            //                     fields &&
            //                     fields.forEach((field, index) => {
            //                         setValue(`unitOfMeasures.${index}.selected`, e.target.checked);
            //                     });
            //                 }}
            //             /></div>
            //
            //     ),
            //     dataIndex: 'selected',
            //     width: '40px',
            //     key: 'selected',
            //     render: (text, record, index) => (
            //         <Controller
            //             name={`unitOfMeasures.${index}.selected`}
            //             control={control}
            //             render={({ field }) => (
            //                 <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
            //                     <FieldBuilder
            //                         name={'unitOfMeasures.${index}.selected'}
            //                         fieldType={FormFieldTypes.CHECKBOX}
            //                         {...field}
            //                         disabled={isDisabled  || productIsApproved}
            //                     />
            //                 </div>
            //             )}
            //         />
            //     ),
            // },
            {
                title: <TutorialHintTooltip hint={ProductDimensionsHints['name'] || ''}><div>Name *</div></TutorialHintTooltip>,
                dataIndex: 'name',
                width: '100%',
                key: 'name',
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].name`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].name`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    onChange={(newValue: string) => {field.onChange(newValue); handleUnitNameChange(newValue, index)}}
                                    disabled={isDisabled  || productIsApproved || isAdditionalService}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    onlyAllowedSymbols={true}
                                /></div>
                        )}
                        rules={{required: "Required field"}}
                    />
                ),
            },
            {
                title: 'Quantity *',
                dataIndex: 'coefficient',
                key: 'coefficient',
                //responsive: ['md'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].coefficient`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '100px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].coefficient`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled  || productIsApproved || isAdditionalService}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                /></div>

                        )}
                        rules={{ required: "Required field" }}
                    />
                ),
            },
            {
                title: `Width | mm${isAdditionalService ? '' : ' *'}`,
                dataIndex: 'width',
                key: 'width',
                //responsive: ['lg'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].width`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '110px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].width`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled  || productIsApproved || isAdditionalService}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                /></div>
                        )}
                        rules={{ required: isAdditionalService ? false : "Required field" }}
                    />
                ),
            },
            {
                title: `Length | mm${isAdditionalService ? '' : ' *'}`,
                dataIndex: 'length',
                key: 'length',
                //responsive: ['lg'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].length`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '110px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].length`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled || productIsApproved || isAdditionalService}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                /></div>
                        )}
                        rules={{ required: isAdditionalService ? false : "Required field" }}
                    />
                ),
            },
            {
                title: `Height | mm${isAdditionalService ? '' : ' *'}`,
                dataIndex: 'height',
                key: 'height',
                //responsive: ['lg'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].height`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '110px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].height`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled || productIsApproved || isAdditionalService}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                /></div>
                        )}
                        rules={{ required: isAdditionalService ? false : "Required field" }}
                    />
                ),
            },
            {
                title: `Weight gross | kg${isAdditionalService ? '' : ' *'}`,
                dataIndex: 'weightGross',
                key: 'weightGross',
                //responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].weightGross`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '120px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].weightGross`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled || productIsApproved || isAdditionalService}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                /></div>
                        )}
                        rules={{ required: isAdditionalService ? false : "Required field" }}
                    />
                ),
            },
            {
                title: 'Weight net | kg',
                dataIndex: 'Weight net',
                key: 'weightNet',
                responsive: ['sm'] as ResponsiveBreakpoint[],
                render: (text, record, index) => (
                    <Controller
                        name={`unitOfMeasures[${index}].weightNet`}
                        control={control}
                        render={({ field }) => (
                            <div style={{maxWidth: '110px'}}>
                                <FieldBuilder
                                    name={`unitOfMeasures[${index}].weightNet`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled || productIsApproved || isAdditionalService}
                                /></div>

                        )}
                    />
                ),
            },
            // {
            //     title: '',
            //     key: 'action',
            //     minWidth: 500,
            //     render: (text, record, index) => (
            //         <button disabled={checkMasterCarton(record) || isDisabled || productIsApproved} className='action-btn' onClick={() => removeUnits(index)}>
            //             <Icon name='waste-bin' />
            //         </button>
            //     ),
            // },
        ];
    }


    //Barcodes
    const barcodes = watch('barcodes');

    const [selectAllBarcodes, setSelectAllBarcodes] = useState(false);

    const getBarcodesColumns = (control: any) => {

        return [
            {
                title: (
                    <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                        <FieldBuilder
                            name={'selectedAllBarcodes'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked ={selectAllBarcodes}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllBarcodes(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.barcodes;
                                fields &&
                                fields.forEach((field, index) => {
                                    setValue(`barcodes.${index}.selected`, e.target.checked);
                                });
                            }}
                        />
                    </div>

                ),
                dataIndex: 'selected',
                key: 'selected',
                width: '40px',
                render: (text, record, index) => (
                    <Controller
                        name={`barcodes.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                                <FieldBuilder
                                    name={'barcodes.${index}.selected'}
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
                title: 'Barcode',
                dataIndex: 'barcode',
                width: '100%',
                key: 'barcode',
                render: (text, record, index) => (
                    <Controller
                        name={`barcodes[${index}].barcode`}
                        control={control}
                        render={({ field }) => (
                            <div style={{}}>
                                <FieldBuilder
                                    name={`barcodes.${index}.barcode`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    disabled={isDisabled}
                                /></div>
                        )}
                    />
                ),
            },
            {
                title: '',
                key: 'action',
                minWidth: 50,
                render: (text, record, index) => (
                    <button disabled={isDisabled} className='action-btn' onClick={() => removeBarcode(index)}>
                        <Icon name='waste-bin' />
                    </button>
                ),
            },
        ];
    }

    const removeBarcodes = () => {
        const newBarcodesArr = barcodes.filter(item => !item.selected);
        setValue('barcodes', newBarcodesArr);
        setSelectAllBarcodes(false);
    }

    //Aliases
    const aliases = watch('aliases');
    const [selectAllAliases, setSelectAllAliases] = useState(false);

    const getAliasesColumns = (control: any) => {
        return [
            {
                title: (
                    <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                        <FieldBuilder
                            name={'selectedAllAliases'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked ={selectAllAliases}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllAliases(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.aliases;
                                fields &&
                                fields.forEach((field, index) => {
                                    setValue(`aliases.${index}.selected`, e.target.checked);
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
                        name={`aliases.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                                <FieldBuilder
                                    name={'aliases.${index}.selected'}
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
                title: 'Alias',
                dataIndex: 'alias',
                width: '100%',
                key: 'alias',
                render: (text, record, index) => (
                    <Controller
                        name={`aliases[${index}].alias`}
                        control={control}
                        render={({ field }) => (
                            <div style={{}}>
                                <FieldBuilder
                                    name={`aliases.${index}.alias`}
                                    fieldType={FormFieldTypes.TEXT}
                                    {...field}
                                    disabled={isDisabled}
                                    onlyAllowedSymbols={false}
                                /></div>
                        )}
                    />
                ),
            },
            {
                title: '',
                key: 'action',
                minWidth: 50,
                render: (text, record, index) => (
                    <button disabled={isDisabled} className='action-btn' onClick={() => removeAlias(index)}>
                        <Icon name='waste-bin' />
                    </button>
                ),
            },
        ];
    }

    const removeAliases = () => {
        setValue('aliases', aliases.filter(item => !item.selected ));
        setSelectAllAliases(false);
    }

    //Bundles
    const bundleKit = watch('bundleKit');
    const [selectAllBundles, setSelectAllBundles] = useState(false);

    const getBundlesColumns = (control: any) => {
        return [
            {
                title: (
                    <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                        <FieldBuilder
                            name={'selectedAllBundles'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked ={selectAllBundles}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllBundles(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.bundleKit;
                                fields &&
                                fields.forEach((field, index) => {
                                    setValue(`bundleKit.${index}.selected`, e.target.checked);
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
                        name={`bundleKit.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                                <FieldBuilder
                                    name={'bundleKit.${index}.selected'}
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
                title: 'Product *',
                dataIndex: 'uuid',
                width: '100%',
                key: 'uuid',
                render: (text, record, index) => (
                    <Controller
                        name={`bundleKit[${index}].uuid`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{}}>
                                <FieldBuilder
                                    name={`bundleKit.${index}.uuid`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    disabled={isDisabled}
                                    options={analogueOptions}
                                    isSearchable={true}
                                /></div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Quantity *',
                dataIndex: 'quantity',
                key: 'quantity',
                render: (text, record, index) => (
                    <Controller
                        name={`bundleKit[${index}].quantity`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '80px'}}>
                                <FieldBuilder
                                    name={`bundleKit.${index}.quantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    disabled={isDisabled}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                /></div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: '',
                key: 'action',
                minWidth: 50,
                render: (text, record, index) => (
                    <button disabled={isDisabled} className='action-btn' onClick={() => removeBundle(index)}>
                        <Icon name='waste-bin' />
                    </button>
                ),
            },
        ];
    }

    const removeBundles = () => {
        setValue('bundleKit', bundleKit.filter(item => !item.selected ));
        setSelectAllBundles(false);
    }


    //Analogues
    const analogues = watch('analogues');
    const [selectAllAnalogues, setSelectAllAnalogues] = useState(false);

    const getAnaloguesColumns = (control: any) => {
        return [
            {
                title: (
                    <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                        <FieldBuilder
                            name={'selectedAllAnalogues'}
                            fieldType={FormFieldTypes.CHECKBOX}
                            checked ={selectAllAnalogues}
                            disabled={isDisabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectAllAnalogues(e.target.checked);
                                // Update the values of all checkboxes in the form when "Select All" is clicked
                                const values = getValues();
                                const fields = values.analogues;
                                fields &&
                                fields.forEach((field, index) => {
                                    setValue(`analogues.${index}.selected`, e.target.checked);
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
                        name={`analogues.${index}.selected`}
                        control={control}
                        render={({ field }) => (
                            <div style={{width: '40px', justifyContent: 'center', alignItems: 'center'}}>
                                <FieldBuilder
                                    name={'analogues.${index}.selected'}
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
                title: 'Analogue',
                dataIndex: 'analogue',
                width: '100%',
                key: 'analogue',
                render: (text, record, index) => (
                    <Controller
                        name={`analogues[${index}].analogue`}
                        control={control}
                        render={({ field }) => (
                            <div style={{}}>
                                <FieldBuilder
                                    name={`analogues.${index}.analogue`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    disabled={isDisabled}
                                    options={analogueOptions}
                                    isSearchable={true}
                                    isClearable={true}
                                /></div>
                        )}
                    />
                ),
            },
            {
                title: '',
                key: 'action',
                minWidth: 50,
                render: (text, record, index) => (
                    <button disabled={isDisabled} className='action-btn' onClick={() => removeAnalogue(index)}>
                        <Icon name='waste-bin' />
                    </button>
                ),
            },
        ];
    }

    const removeAnalogues = () => {
        setValue('analogues', analogues.filter(item => !item.selected ));
        setSelectAllAnalogues(false);
    }

    /////////////////////////
    const prepareProductDataForSending = (data) => {
        return {
            ...data,
            aliases: data.aliases.map(item => item.alias).filter(item => item !== ""),
            barcodes: data.barcodes.map(item => item.barcode).filter(item => item !== ""),
            analogues: data.analogues.map(item => item.analogue).filter(item => item !== ""),
            attachedFiles: selectedFiles,
        }
    }

    const [selectedFiles, setSelectedFiles] = useState<AttachedFilesType[]>(productData?.attachedFiles || []);
    const handleFilesChange = (files) => {
        setSelectedFiles(files);
    };

    //notifications
    let productNotifications: NotificationType[] = [];
    if (productData && productData.uuid && notifications && notifications.length) {
        productNotifications = notifications.filter(item => item.objectUuid === productData.uuid && item.status !== NOTIFICATION_STATUSES.READ)
    }

    const tabTitleArray =  TabTitles(!!productData?.uuid, !!(productData?.tickets && productData.tickets.length), forbiddenTabs);
    const {tabTitles, updateTabTitles, clearTabTitles, resetTabTables} = useTabsState(tabTitleArray, TabFields);

    useEffect(() => {
        resetTabTables(tabTitleArray);
    }, [productData]);

    const onSubmitForm = async (data: SingleProductFormType) => {

        const curAction = productData ? AccessActions.EditObject : AccessActions.CreateObject;
        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], curAction)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateProduct', AccessObjectTypes["Products/ProductsList"], curAction), body: {uuid: data?.uuid || ''}});
            } catch {}

            return null;
        }

        setIsLoading(true);
        clearTabTitles();
        data.status = sendStatus;

        if (data.additionalService) {
            const pieces = getPieces(data.unitOfMeasures);
            if (pieces.length > 0 && pieces[0].coefficient !== 1) {
                pieces[0].coefficient = 1;
            }
        }

        try {
            const requestData = {
                token,
                alias,
                productData: prepareProductDataForSending(data)
            };

            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateProduct'), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            const res: ApiResponse = await sendProductInfo(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "status" in res && res?.status === 200) {
                //success
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.SUCCESS, title: "Success", subtitle: `Product is successfully ${ productData?.uuid ? 'edited' : 'created'}!`, onClose: closeSuccessModal})
                setShowStatusModal(true);
            } else if (res && 'response' in res ) {
                const errResponse = res.response;

                if (errResponse && 'data' in errResponse &&  'errorMessage' in errResponse.data ) {
                    const errorMessages = errResponse?.data.errorMessage;

                    setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Error", subtitle: `Please, fix these errors!`, text: errorMessages, onClose: closeErrorModal})
                    setShowStatusModal(true);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const onError = (props: any) => {
        const curAction = productData ? AccessActions.EditObject : AccessActions.CreateObject;
        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], curAction)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateProduct', AccessObjectTypes["Products/ProductsList"], curAction), body: {uuid: productData?.uuid || ''}});
            } catch {}

            return null;
        }

        if (sendStatus === SendStatusType.DRAFT) {
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
                return onSubmitForm(formData as SingleProductFormType);
            }
        } else {
            let fieldNames = Object.keys(props);

            if (fieldNames.length > 0) {
                toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            updateTabTitles(fieldNames);
        }

        // if (sendStatus === SendStatusType.DRAFT) {
        //     clearErrors();
        //     const formData = getValues();
        //
        //     return onSubmitForm(formData as SingleProductFormType);
        // }
        //
        // const fieldNames = Object.keys(props);
        //
        // if (fieldNames.length > 0) {
        //     toast.warn(`Validation error. Fields: ${fieldNames.join(', ')}`, {
        //         position: "top-right",
        //         autoClose: 1000,
        //     });
        // }
        // updateTabTitles(fieldNames);
    };

    const generalFields = useMemo(()=> FormFieldsGeneral({countries: countryArr, isNew: !productData?.uuid, isAdditionalService, handleAdditionalServiceChange}), [COUNTRIES, isAdditionalService])
    const skuFields = useMemo(()=>FormFieldsSKU(), []);
    const warehouseFields = useMemo(()=>FormFieldsWarehouse({typeOfStorage: createOptions(productParams.typeOfStorage), salesPackingMaterial:createOptions(productParams.salesPackingMaterial), specialDeliveryOrStorageRequirements: createOptions(productParams.specialDeliveryOrStorageRequirements), isAdditionalService}),[productParams, isAdditionalService])
    const additionalFields = useMemo(()=> FormFieldsAdditional1({whoProvidesPackagingMaterial: createOptions(productParams.whoProvideExtraPacking)}), [])
    const additionalCheckboxes = useMemo(()=>FormFieldsAdditional2(), []);


    const handleClickEdit = () => {
        // ()=>setIsDisabled(!(productData.canEdit || !productData?.uuid ))} variant={ButtonVariant.PRIMARY

        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.EditObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('EditProduct', AccessObjectTypes["Products/ProductsList"], AccessActions.EditObject), body: {uuid: productData?.uuid || ''}});
            } catch {}

            return null;
        }
        setIsDisabled(!(productData.canEdit || !productData?.uuid ));
    }

    return <div className='product-info'>
        {isLoading && <Loader />}
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmitForm, onError)}>
            <Tabs id='tabs-iddd' tabTitles={tabTitles} classNames='inside-modal' notifications={productNotifications}>
                {isTabAllowed('Primary', forbiddenTabs) ? <div className='primary-tab'>
                    <>
                        {needSeller() ? (
                            <div className='form-wrapper--seller card'>
                                <div className='grid-row'>
                                    <Controller
                                        key='seller'
                                        name='seller'
                                        control={control}
                                        render={(
                                            {
                                                field: {...props},
                                                fieldState: {error}
                                            }) => (
                                            <FieldBuilder
                                                // disabled={!!isDisabled}
                                                {...props}
                                                name='seller'
                                                label='Seller* : '
                                                fieldType={FormFieldTypes.SELECT}
                                                options={(productData?.status !=='Draft' && !!productData) ? sellersList : sellersListActive}
                                                placeholder={''}
                                                errorMessage={error?.message}
                                                errors={errors}
                                                disabled={isDisabled || (productData?.status !=='Draft' && !!productData)}
                                                width={WidthType.w50}
                                                classNames={'seller-filter'}
                                                isClearable={false}
                                            />
                                        )}
                                        rules = {{required: "Required field"}}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <CardWithHelpIcon classNames='card product-info--general'>
                            <h3 className='product-info__block-title'>
                                <Icon name='general' />
                                General
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={generalFields} errors={errors} isDisabled={isDisabled}/>
                            </div>
                        </CardWithHelpIcon>
                        <CardWithHelpIcon classNames='card product-info--sku'>
                            <h3 className='product-info__block-title'>
                                <Icon name='sku' />
                                SKU
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={skuFields}  errors={errors} isDisabled={isDisabled}/>
                            </div>
                        </CardWithHelpIcon>
                        {!isAdditionalService ? <CardWithHelpIcon classNames='card product-info--warehouse'>
                            <h3 className='product-info__block-title'>
                                <Icon name='warehouse' />
                                Warehouse
                            </h3>
                            <div className='grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={warehouseFields} errors={errors} isDisabled={isDisabled} />
                            </div>
                        </CardWithHelpIcon> : null}
                        {!isAdditionalService ? <CardWithHelpIcon classNames='card product-info--additional'>
                            <h3 className='product-info__block-title'>
                                <Icon name='additional' />
                                Additional
                            </h3>

                            <div className='additional-selects grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={additionalFields} errors={errors} isDisabled={isDisabled} />
                            </div>

                            <div className='product-info__checkboxes grid-row'>
                                <FormFieldsBlock control={control} fieldsArray={additionalCheckboxes} errors={errors} isDisabled={isDisabled} />
                            </div>
                        </CardWithHelpIcon> : null}
                    </>
                </div> : null }
                {isTabAllowed('Dimensions', forbiddenTabs) ? <div className="dimensions-tab">
                    <CardWithHelpIcon classNames="card min-height-600 product-info--unitOfMeasures">
                        <h3 className='product-info__block-title'>
                            <Icon name='dimensions' />
                            Dimensions
                        </h3>
                        <div className='product-info--unitOfMeasures-select'>
                            <div className='grid-row'>
                                {/*    <div className='width-67 grid-row'>*/}
                                <Controller
                                    name="unitOfMeasure"
                                    control={control}
                                    render={({ field , fieldState: {error}}) => (
                                        <FieldBuilder
                                            fieldType={FormFieldTypes.SELECT}
                                            name='unitOfMeasure'
                                            label='Default unit'
                                            {...field}
                                            options={getOptions() || []}
                                            placeholder="Select Name"
                                            width={WidthType.w33}
                                            errorMessage={error?.message}
                                            errors={errors}
                                            isRequired={true}
                                            hint={ProductDimensionsHints['unitOfMeasure'] || ''}
                                            disabled={isDisabled || isAdditionalService}
                                        />
                                    )}
                                    rules={{ required: 'Field is required' }}
                                />
                            </div>
                        </div>
                        <div className='product-info--table table-form-fields form-table product-info--dimensions has-scroll' aria-disabled={productIsApproved || isAdditionalService}>
                            <Table
                                columns={getUnitsColumns(control)}
                                dataSource={getValues('unitOfMeasures')?.map((field) => ({ key: field.name, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />

                        </div>
                        {productIsApproved || productData && productData.unitOfMeasures.length>1 ? null :  <Controller
                            name="withoutMasterCartonData"
                            control={control}
                            render={({ field , fieldState: {error}}) => (
                                <FieldBuilder
                                    fieldType={FormFieldTypes.TOGGLE}
                                    name='withoutMasterCartonData'
                                    label="Product doesn't have master carton data"
                                    {...field}
                                    width={WidthType.w100}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    disabled={isDisabled || isAdditionalService}
                                    onChange={(val: React.ChangeEvent<HTMLInputElement>)=>{handleMasterCartonDataChange(val, field.onChange); }}
                                    //hint={ProductDimensionsHints['unitOfMeasure'] || ''}
                                />
                            )}
                            //rules={{ required: 'Field is required' }}
                        /> }
                    </CardWithHelpIcon>
                </div> : null }
                {isTabAllowed('Barcodes', forbiddenTabs ) ? <div className="barcodes-tab">
                    <CardWithHelpIcon classNames="card min-height-600 product-info--barcodes">
                        <h3 className='product-info__block-title title-small'>
                            <Icon name='barcodes'/>
                            Barcodes
                        </h3>
                        <div className='product-info--barcodes-btns'>
                            <div className='grid-row'>
                                <div className='product-info--table-btns small-paddings width-100'>
                                    <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn >
                                        <Button classNames='add-barcode-btn' type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL}
                                                disabled={isDisabled} variant={ButtonVariant.SECONDARY}
                                                onClick={() => appendBarcode({
                                                    key: `barcode-${Date.now().toString()}`,
                                                    selected: false,
                                                    barcode: ''
                                                })}>
                                            Add
                                        </Button>
                                    </TutorialHintTooltip>
                                    <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn >
                                        <Button classNames='remove-barcode-btn' type="button" icon='remove-table-row' iconOnTheRight size={ButtonSize.SMALL}
                                                disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeBarcodes}>
                                            Remove selected
                                        </Button>
                                    </TutorialHintTooltip>

                                </div>
                            </div>
                        </div>
                        <div className='product-info--table table-form-fields form-table '>
                            <Table
                                columns={getBarcodesColumns(control)}
                                dataSource={getValues('barcodes')?.map((field) => ({ key: field.barcode, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />

                        </div>
                    </CardWithHelpIcon>
                </div> : null }
                {isTabAllowed('Aliases', forbiddenTabs) ? <div className="aliases-tab">
                    <CardWithHelpIcon classNames="card min-height-600 product-info--aliases">
                        <TutorialHintTooltip hint={ProductOtherHints['aliases'] || ''} position='left' >
                            <h3 className='product-info__block-title title-small'>
                                <Icon name='aliases' />
                                Aliases
                            </h3>
                        </TutorialHintTooltip>
                        <div className='product-info--aliases-btns'>
                            <div className='grid-row'>
                                <div className='product-info--table-btns small-paddings width-100'>
                                    <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn >
                                        <Button classNames='add-alias-btn' type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY}  onClick={() => appendAlias({ key: `alias-${Date.now().toString()}`, selected: false, alias: '' })}>
                                            Add
                                        </Button>
                                    </TutorialHintTooltip>
                                    <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn >
                                        <Button classNames='remove-alias-btn' type="button" icon='remove-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeAliases}>
                                            Remove selected
                                        </Button>
                                    </TutorialHintTooltip>
                                </div>
                            </div>
                        </div>
                        <div className='product-info--table table-form-fields form-table '>
                            <Table
                                columns={getAliasesColumns(control)}
                                dataSource={getValues('aliases')?.map((field) => ({ key: field.alias, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />

                        </div>
                    </CardWithHelpIcon>
                </div> : null }
                {isTabAllowed('Virtual bundle kit', forbiddenTabs) ? <div className="bundles-tab">
                    <CardWithHelpIcon classNames="card min-height-600 product-info--bundleKit">
                        <TutorialHintTooltip hint={ProductOtherHints['virtualBundleKit'] || ''} position='left' >
                            <h3 className='product-info__block-title title-small'>
                                <Icon name='bundle' />
                                Bundle kit
                            </h3>
                        </TutorialHintTooltip>
                        <div className='product-info--bundles-btns'>
                            <div className='grid-row'>
                                <div className='product-info--table-btns small-paddings width-100'>
                                    <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn >
                                        <Button classNames='add-bundle-btn' type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled} variant={ButtonVariant.SECONDARY} onClick={() => appendBundle({ key: `bundle-${Date.now().toString()}`, selected: false, uuid: '', quantity:0 })}>
                                            Add
                                        </Button>
                                    </TutorialHintTooltip>
                                    <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn >
                                        <Button classNames='remove-bundle-btn' type="button" icon='remove-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeBundles}>
                                            Remove selected
                                        </Button>
                                    </TutorialHintTooltip>
                                </div>
                            </div>
                        </div>
                        <div className='product-info--table table-form-fields form-table '>
                            <Table
                                columns={getBundlesColumns(control)}
                                dataSource={getValues('bundleKit')?.map((field) => ({ key: `field.uuid-${Date.now().toString()}`, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />

                        </div>
                    </CardWithHelpIcon>
                </div> : null }
                {isTabAllowed('Analogues', forbiddenTabs) ? <div className="analogues-tab">
                    <CardWithHelpIcon classNames="card min-height-600 product-info--analogues">
                        <TutorialHintTooltip hint={ProductOtherHints['analogues'] || ''} position='left' >
                            <h3 className='product-info__block-title title-small'>
                                <Icon name='analogues' />
                                Analogues
                            </h3>
                        </TutorialHintTooltip>
                        <div className='product-info--analogues-btns'>
                            <div className='grid-row'>
                                <div className='product-info--table-btns small-paddings width-100'>
                                    <TutorialHintTooltip hint={CommonHints['addLine'] || ''} forBtn >
                                        <Button classNames='add-analogue-btn' type="button" icon='add-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY}  onClick={() => appendAnalogue({ key: `analogues-${Date.now().toString()}`, selected: false, analogue: '' })}>
                                            Add
                                        </Button>
                                    </TutorialHintTooltip>
                                    <TutorialHintTooltip hint={CommonHints['removeSelected'] || ''} forBtn >
                                        <Button classNames='remove-analogue-btn' type="button" icon='remove-table-row' iconOnTheRight size={ButtonSize.SMALL} disabled={isDisabled}  variant={ButtonVariant.SECONDARY} onClick={removeAnalogues}>
                                            Remove selected
                                        </Button>
                                    </TutorialHintTooltip>
                                </div>
                            </div>
                        </div>
                        <div className='product-info--table table-form-fields form-table'>
                            <Table
                                columns={getAnaloguesColumns(control)}
                                dataSource={getValues('analogues')?.map((field) => ({ key: field.analogue, ...field })) || []}
                                pagination={false}
                                rowKey="key"
                            />
                        </div>
                    </CardWithHelpIcon>
                </div> : null }
                {productData?.statusHistory && isTabAllowed('Status history', forbiddenTabs) ? <div className="status-history-tab">
                    <div className="card min-height-600 product-info--status-history">
                        <h3 className='product-info__block-title'>
                            <Icon name='history' />
                            Status history
                        </h3>
                        <StatusHistory statusHistory={productData?.statusHistory} />
                    </div>
                </div> : null}
                {productData?.uuid && productData.tickets.length && isTabAllowed('Tickets', forbiddenTabs) ? <div key='tickets-tab' className='tickets-tab'>
                    <div className="card min-height-600 product-info--tickets">
                        <h3 className='product-info__block-title'>
                            <Icon name='ticket' />
                            Tickets
                        </h3>
                        <DocumentTickets tickets={productData.tickets}/>
                    </div>
                </div> : null}
                {isTabAllowed('Files', forbiddenTabs) ? <div className='files-tab'>
                    <CardWithHelpIcon classNames="card min-height-600 product-info--files">
                        <TutorialHintTooltip hint={ProductOtherHints['files'] || ''} position='left' classNames='mb-md' >
                            <h3 className='product-info__block-title title-small'>
                                <Icon name='files' />
                                Files
                            </h3>
                        </TutorialHintTooltip>
                        <div className='dropzoneBlock'>
                            <DropZone
                                readOnly={!!isDisabled}
                                files={selectedFiles}
                                onFilesChange={handleFilesChange}
                                docUuid={productData?.canEdit ? productData?.uuid : ''}
                                allowOnlyFormats={['png', 'jpg', 'jpeg', 'pdf']}
                                hint={'The supported file formats: PNG, JPEG, PDF'}
                            />
                        </div>
                    </CardWithHelpIcon>
                </div> : null }
            </Tabs>
            <div className='form-submit-btn'>
                {productData && productData.uuid && isTabAllowed('Tickets', forbiddenTabs) ? <Button type='button' variant={ButtonVariant.PRIMARY} icon='add' iconOnTheRight onClick={handleCreateTicket}>Create ticket</Button> : null}
                {isDisabled && !productIsApproved && <Button type="button" disabled={false} onClick={handleClickEdit} variant={ButtonVariant.PRIMARY}>Edit</Button>}
                {!isDisabled && !productIsApproved && <Button type="submit" disabled={isDisabled || productIsApproved} onClick={()=>setSendStatus(SendStatusType.DRAFT)} variant={ButtonVariant.PRIMARY}>Save as draft</Button>}
                {(!isDisabled && !productIsApproved || productIsInDraft) && <Button type="submit"  onClick={()=>setSendStatus(SendStatusType.PENDING)} variant={ButtonVariant.PRIMARY}>Send to approve</Button>}
                {!isDisabled && productIsApproved && <Button type="submit" disabled={isDisabled} onClick={()=>setSendStatus(SendStatusType.APPROVED)} variant={ButtonVariant.PRIMARY}>Send</Button>}
            </div>
        </form>
        {showConfirmModal && <ConfirmModal
            actionText={`Are you sure you want to remove data about master carton? It's data will be cleared and row will be removed.`}
            onOk={handleConfirmToRemoveMasterCarton}
            onCancel={()=>setShowConfirmModal(false)}
        />}
        {showConfirmModalAdditionalService && <ConfirmModal
            actionText={`You have a master carton data for this product, which will be cleared. Do you want to mark this product as Additional virtual product and clear master carton data?`}
            onOk={handleConfirmAdditionalService}
            onCancel={handleCancelAdditionalService}
        />}
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
        {showTicketForm && <SingleDocument type={NOTIFICATION_OBJECT_TYPES.Ticket} subjectType={TICKET_OBJECT_TYPES.Product} subjectUuid={uuid} subject={productData?.name} onClose={()=>{setShowTicketForm(false); refetchDoc();}} seller={needSeller() ? productData.seller : ''} />}

    </div>
}

export default ProductFormComponent;
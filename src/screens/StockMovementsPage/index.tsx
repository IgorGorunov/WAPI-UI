import React, { useCallback, useEffect, useState } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import { useRouter } from "next/router";
import { Routes } from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import styles from "./styles.module.scss";
import Button from "@/components/Button/Button";
import { STOCK_MOVEMENT_DOC_TYPE, STOCK_MOVEMENT_ROUTES, StockMovementType } from "@/types/stockMovements";
import Loader from "@/components/Loader";
import StockMovementList from "@/screens/StockMovementsPage/components/StockMovementList";
import StockMovementForm from "@/screens/StockMovementsPage/components/StockMovementForm";
import useTourGuide from "@/context/tourGuideContext";
import { TourGuidePages } from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {
    tourGuideStepsStockMovements,
    tourGuideStepsStockMovementsNoDocs
} from "@/screens/StockMovementsPage/stockMovementsTourGuideSteps.constants";
import { sendUserBrowserInfo } from "@/services/userInfo";
import ModalStatus, { ModalStatusType } from "@/components/ModalStatus";
import { STATUS_MODAL_TYPES } from "@/types/utility";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import { usePagedListState, usePagedData, useFilterMetadata, processFiltersForApi, FilterValue } from "@/components/PagedList";
import { StockMovementsFilters, StockMovementFilterDataType } from "./types";
import { getLastFewDays} from "@/utils/date";
import {toast} from "@/components/Toast";
import {getStockMovementsExcel} from "@/services/stockMovements";

type StockMovementPageType = {
    docType: STOCK_MOVEMENT_DOC_TYPE;
}

// const getProductsByString = (item: StockMovementType) => {
//     return item.products.map(product => product.product).join('; ')
// }
//
// const getProductsWithQuantity = (item: StockMovementType) => {
//     return item.products.map(product => `${product.product} - ${product.quantity}`).join('; ')
// }

const docNamesPlural = {
    [STOCK_MOVEMENT_DOC_TYPE.INBOUNDS]: 'Inbounds',
    [STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT]: 'Stock movements',
    [STOCK_MOVEMENT_DOC_TYPE.OUTBOUND]: 'Outbounds',
    [STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE]: 'Logistic services',
}

export const docNamesSingle = {
    [STOCK_MOVEMENT_DOC_TYPE.INBOUNDS]: 'Inbound',
    [STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT]: 'Stock movement',
    [STOCK_MOVEMENT_DOC_TYPE.OUTBOUND]: 'Outbound',
    [STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE]: 'Logistic service',
}

export const getAccessActionObject = (docType: STOCK_MOVEMENT_DOC_TYPE) => {
    switch (docType) {
        case STOCK_MOVEMENT_DOC_TYPE.INBOUNDS:
            return AccessObjectTypes["StockManagment/Inbounds"];
        case STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT:
            return AccessObjectTypes["StockManagment/StockMovements"];
        case STOCK_MOVEMENT_DOC_TYPE.OUTBOUND:
            return AccessObjectTypes["StockManagment/Outbounds"];
        case STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE:
            return AccessObjectTypes["StockManagment/LogisticServices"];
        default: null;
    }
}

const StockMovementsPage: React.FC<StockMovementPageType> = ({ docType }) => {
    const Router = useRouter();
    const { tenantData: { alias } } = useTenant();
    const { token, ui, getBrowserInfo, isActionIsAccessible, getForbiddenTabs } = useAuth();

    useEffect(() => {
        if (!token) Router.push(Routes.Login);
    }, [token]);

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditStockMovement(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace(STOCK_MOVEMENT_ROUTES[docType]);
        }

    }, [Router.query]);

    //universal state management via URL
    const { state, updatePeriod, updateFilters, updateSearch, updatePage, updatePageSize, updateSort, clearAllFilters } = usePagedListState<StockMovementsFilters>(
        {} as Partial<StockMovementsFilters>,
        {
            defaultPageSize: 10,
            defaultDateRange: { startDate: getLastFewDays(new Date(), 30), endDate: new Date() },
            defaultSortBy: 'incomingDate',
            defaultSortOrder: 'desc',
        }
    );

    //fetch paginated stock movements — documentType passed as extraParams
    const { data: stockMovementData, count: totalDocs, isLoading: isLoadingDocs, refetch: refetchDocs } = usePagedData<StockMovementType>(
        '/GetPagedStockMovementList',
        state,
        {
            token,
            alias,
            ui,
            enabled: !!token && isActionIsAccessible(getAccessActionObject(docType), AccessActions.ListView),
            extraParams: { documentType: docType },
        }
    );

    //fetch filter metadata — documentType is required by this endpoint too
    const { metadata: filterMetadata, isLoading: isLoadingFilters } = useFilterMetadata<StockMovementFilterDataType>(
        '/GetPagedFiltersStockMovement',
        { startDate: state.startDate, endDate: state.endDate },
        { token, alias, ui, enabled: !!token, extraParams: { documentType: docType } },
    );

    const isLoading = isLoadingDocs || isLoadingFilters;

    //track forbidden tabs
    const [forbiddenTabs, setForbiddenTabs] = useState<string[]>(getForbiddenTabs(getAccessActionObject(docType)) || []);
    useEffect(() => {
        setForbiddenTabs(getForbiddenTabs(getAccessActionObject(docType)));
    }, [docType]);

    //single document data
    const [showStockMovementModal, setShowStockMovementModal] = useState(false);
    const [isDocNew, setIsDocNew] = useState(true);
    const [docUuid, setDocUuid] = useState<string | null>(null);

    const onShowStockMovementModalClose = () => {
        setShowStockMovementModal(false);
    }

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    const closeErrorModal = useCallback(() => {
        setShowStatusModal(false);
    }, [])

    const handleRefresh = () => {
        refetchDocs();
    };

    const handleEditStockMovement = (uuid: string) => {
        setIsDocNew(false);
        setDocUuid(uuid)

        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.ViewObject)) {
            try {
                sendUserBrowserInfo({
                    ...getBrowserInfo('ViewEditDoc/' + docType, getAccessActionObject(docType), AccessActions.ViewObject),
                    body: { uuid: uuid }
                });
            } catch {
            }
            setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal })
            setShowStatusModal(true);
            return null;
        } else {
            setShowStockMovementModal(true);
        }

    }

    const handleAddOrder = () => {
        setIsDocNew(true);
        setDocUuid(null);

        if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CreateDoc/' + docType, getAccessActionObject(docType), AccessActions.CreateObject), body: {} });
            } catch { }
            return null;
        } else {
            setShowStockMovementModal(true);
        }
    }

    // const handleExportXLS = () => {
    //     try {
    //         sendUserBrowserInfo({ ...getBrowserInfo('ExportStockMovementsList/' + docType, getAccessActionObject(docType), AccessActions.ExportList), body: { startDate: state.startDate, endDate: state.endDate } });
    //     } catch { }
    //
    //     if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.ExportList)) {
    //         return null;
    //     }
    //
    //     const filteredData = stockMovementData.map(item => ({
    //         Number: item.number,
    //         "Incoming date": item.incomingDate,
    //         "Incoming number": item.incomingNumber,
    //         Status: item.status,
    //         ETA: item.estimatedTimeArrives,
    //         Sender: item.sender,
    //         "Sender Country": item.senderCountry,
    //         Receiver: item.receiver,
    //         "receiver Country": item.receiverCountry,
    //         Products: item.productsByString || getProductsByString(item),
    //         'Products with quantity': getProductsWithQuantity(item),
    //         Services: '€ ' + item.servicesAmount,
    //     }));
    //     exportFileXLS(filteredData, docNamesPlural[docType]);
    // }

    const handleExportXLS = async () => {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('ExportStockMovementsList/' + docType, getAccessActionObject(docType), AccessActions.ExportList), body: { startDate: state.startDate, endDate: state.endDate } });
            } catch { }

            if (!isActionIsAccessible(getAccessActionObject(docType), AccessActions.ExportList)) {
                return;
            }

        const exportPromise = async () => {
            const res = await getStockMovementsExcel({
                token,
                alias,
                ui,
                documentType: docType,
                startDate: state.startDate,
                endDate: state.endDate,
                filter: processFiltersForApi(state.filters as Record<string, FilterValue>) as any,
                search: state.search,
                fullTextSearch: state.fullTextSearch,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder
            });

            if (res && res.data) {
                const { base64ToBlob } = await import('@/utils/files');
                const attachedFile = res.data;
                const blob = base64ToBlob(attachedFile.data, attachedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                // Ensure extension exists and append unique timestamp to bypass OS "Save As/Overwrite" dialogs
                let downloadName = docNamesPlural[docType]+".xlsx";

                const parts = downloadName.split('.');
                const ext = parts.length > 1 ? parts.pop() || 'xlsx' : 'xlsx';
                const baseName = parts.length > 0 ? parts.join('.') : downloadName;

                const finalExt = ext.toLowerCase().startsWith('xls') ? ext : 'xlsx';
                a.download = `${baseName}.${finalExt}`;

                setTimeout(() => {
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => window.URL.revokeObjectURL(url), 100);
                }, 100);
            } else {
                throw new Error("Empty response");
            }
        };

        try {
            toast.promise(
                exportPromise(),
                {
                    pending: 'Downloading documents...',
                    success: {
                        render: 'File downloaded successfully!',
                        autoClose: 2000 //disappear in 2 seconds
                    },
                    error: 'Failed to download file'
                },
                {
                    className: 'download-toast'
                }
            );
        } catch (error) {
            console.error("Export failed", error);
        }
    };


    //tour guide
    const { runTour, setRunTour, isTutorialWatched } = useTourGuide();
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages[docType])) {
            if (!isLoading && stockMovementData && stockMovementData.length > 0) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading, docType]);

    useEffect(() => {
        setSteps(stockMovementData?.length ? tourGuideStepsStockMovements(docNamesSingle[docType].toLowerCase()) : tourGuideStepsStockMovementsNoDocs(docNamesSingle[docType].toLowerCase()))
    }, [stockMovementData]);


    return (
        <Layout hasHeader hasFooter>
            <SeoHead title={docNamesPlural[docType]} description={`Our ${docNamesPlural[docType]} page`} />
            <div className={styles["stock-movement-page__container"]}>
                {isLoading && <Loader />}
                <Header pageTitle={docNamesPlural[docType]} toRight needTutorialBtn >
                    <Button classNames='add-doc' icon="add" iconOnTheRight onClick={handleAddOrder}>Add</Button>
                    <Button classNames='export-docs' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>

                {stockMovementData && <StockMovementList
                    docType={docType}
                    docs={stockMovementData}
                    isLoading={isLoading}
                    totalDocs={totalDocs}
                    filterMetadata={filterMetadata}
                    currentPage={state.page}
                    pageSize={state.limit}
                    searchTerm={state.search}
                    fullTextSearch={state.fullTextSearch}
                    sortBy={state.sortBy}
                    sortOrder={state.sortOrder}
                    selectedFilters={state.filters}
                    onPageChange={updatePage}
                    onPageSizeChange={updatePageSize}
                    onSearchChange={updateSearch}
                    onSortChange={updateSort}
                    onFiltersChange={updateFilters}
                    onClearFilters={clearAllFilters}
                    handleEditDoc={handleEditStockMovement}
                    handleRefresh={handleRefresh}
                    forbiddenTabs={forbiddenTabs}
                    startDate={state.startDate}
                    endDate={state.endDate}
                    onPeriodChange={updatePeriod}
                />}
            </div>
            {showStockMovementModal && (isDocNew && !docUuid || !isDocNew && docUuid) &&
                <StockMovementForm
                    docType={docType}
                    docUuid={docUuid}
                    closeDocModal={onShowStockMovementModalClose}
                    closeModalOnSuccess={() => { setShowStockMovementModal(false); handleRefresh(); }}
                />
            }
            {stockMovementData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages[docType]} /> : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </Layout>
    )
}

export default StockMovementsPage;
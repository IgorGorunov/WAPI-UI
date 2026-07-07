import React, { useCallback, useEffect, useState } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import AmazonPrepList from "./components/AmazonPrepList";
import styles from "./styles.module.scss";
import Button from "@/components/Button/Button";
import { getLastFewDays, formatDateTimeToStringWithDotWithoutSeconds } from "@/utils/date";
import { AmazonPrepOrderType } from "@/types/amazonPrep";
import AmazonPrepForm from "./components/AmazonPrepForm";
import Loader from "@/components/Loader";
import useTourGuide from "@/context/tourGuideContext";
import { TourGuidePages } from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import { tourGuideStepsAmazonPrep, tourGuideStepsAmazonPrepNoDocs } from "./amazomPrepTourGuideSteps.constants";
import { sendUserBrowserInfo } from "@/services/userInfo";
import ModalStatus, { ModalStatusType } from "@/components/ModalStatus";
import { STATUS_MODAL_TYPES } from "@/types/utility";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import { AmazonPrepFilters, AmazonPrepFilterDataType } from "./types";
import { usePagedListState, usePagedData, useFilterMetadata, processFiltersForApi, FilterValue } from "@/components/PagedList";

const AmazonPrepPage = () => {
    const { tenantData: { alias } } = useTenant();
    const { token, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    // const today = new Date();
    // const firstDay = getLastFewDays(today, 30);
    // const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({ startDate: firstDay, endDate: today })
    const Router = useRouter();

    const { state, updateFilters, updateSearch, updatePage, updatePageSize, updateSort, clearAllFilters, updatePeriod } = usePagedListState<AmazonPrepFilters>(
        {} as Partial<AmazonPrepFilters>,
        // 'amazonPrepFilters',
        // { page: 1, limit: 10 }
        {
            defaultPageSize: 10,
            defaultDateRange: { startDate: getLastFewDays(new Date(), 30), endDate: new Date() },
            defaultSortBy: 'date',
            defaultSortOrder: 'desc',
        }
    );

    const { data: amazonPrepOrdersData, count: totalOrders, isLoading: isLoadingOrders, refetch: forceUpdateList } = usePagedData<AmazonPrepOrderType>(
        '/GetPagedAmazonPrepsList',
        state,
        // AccessObjectTypes["Orders/AmazonPrep"],
        // AccessActions.ListView
        { token, alias, ui, enabled: !!token }
    );

    // Filter metadata
    const { metadata: filterMetadata, isLoading: isLoadingFilters } = useFilterMetadata<AmazonPrepFilterDataType>(
        '/GetPagedFiltersAmazonPrepsList',
        // state,
        // AccessObjectTypes["Orders/AmazonPrep"],
        // AccessActions.ListView
        { startDate: state.startDate, endDate: state.endDate },
        { token, alias, ui, enabled: !!token }
    );

    const isLoading = isLoadingOrders || isLoadingFilters;

    //tour guide
    const { runTour, setRunTour, isTutorialWatched } = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.AmazonPreps)) {
            if (!isLoading && amazonPrepOrdersData) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(amazonPrepOrdersData?.length ? tourGuideStepsAmazonPrep : tourGuideStepsAmazonPrepNoDocs);
    }, [amazonPrepOrdersData]);

    //single order data
    const [showAmazonPrepOrderModal, setShowAmazonPrepOrderModal] = useState(false);
    const [isAmazonPrepNew, setIsAmazonPrepNew] = useState(true);
    const [amazonPrepUuid, setAmazonPrepUuid] = useState<string | null>(null);

    const onAmazonPrepOrderModalClose = () => {
        setShowAmazonPrepOrderModal(false);
    }

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    const closeErrorModal = useCallback(() => {
        setShowStatusModal(false);
    }, [])


    // const fetchData = useCallback(() => {
    //     forceUpdateList();
    //     forceUpdateMetadata();
    // }, [forceUpdateList, forceUpdateMetadata]);

    const handleEditAmazonPrepOrder = async (uuid: string) => {
        setIsAmazonPrepNew(false);
        setAmazonPrepUuid(uuid);

        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ViewObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CreateUpdateAmazonPrep', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ViewObject), body: { uuid: uuid } });
            } catch { }
            setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal })
            setShowStatusModal(true);
        } else {
            setShowAmazonPrepOrderModal(true);
        }
    }

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditAmazonPrepOrder(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/amazonPrep');
        }
    }, [Router.query]);

    const handleAddAmazonPrepOrder = (
    ) => {
        setIsAmazonPrepNew(true);
        setAmazonPrepUuid(null);
        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CreateAmazonPrep', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.CreateObject), body: {} });

                setModalStatusInfo({
                    statusModalType: STATUS_MODAL_TYPES.ERROR,
                    title: "Warning",
                    subtitle: `You have limited access to this action`,
                    onClose: closeErrorModal
                });
                setShowStatusModal(true);
            } catch { }
        } else {
            setShowAmazonPrepOrderModal(true);
        }
    }

    const handleExportXLS = async () => {
        try {
            sendUserBrowserInfo({ ...getBrowserInfo('ExportAmazonPrepList', AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ExportList), body: { startDate: state.startDate, endDate: state.endDate } });
        } catch { }

        if (!isActionIsAccessible(AccessObjectTypes["Orders/AmazonPrep"], AccessActions.ExportList)) {
            return;
        }

        const { toast } = await import('@/components/Toast');
        const toastId = toast.loading('Downloading Amazon preps...', { className: 'download-toast', closeButton: true });

        const handleError = (errorMsg: string, error?: any) => {
            console.error("Export failed", error || new Error(errorMsg));
            toast.dismiss(toastId);
            toast.error(errorMsg, { autoClose: 3000 });
        };

        try {
            const { getAmazonPrepsExcel } = await import('@/services/amazonePrep');
            const res = await getAmazonPrepsExcel({
                token,
                alias,
                ui,
                startDate: state.startDate,
                endDate: state.endDate,
                filter: processFiltersForApi(state.filters as Record<string, FilterValue>) as any,
                search: state.search,
                fullTextSearch: state.fullTextSearch,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder
            });

            if (res && (res as any).isAxiosError) {
                return handleError((res as any).response?.data?.errorMessage || "Failed to download file", res);
            }

            if (res && res.data) {
                if ((res.data as any).errorMessage) {
                    return handleError((res.data as any).errorMessage);
                }
                const { base64ToBlob } = await import('@/utils/files');
                const attachedFile = res.data;
                const blob = base64ToBlob(attachedFile.data as string, attachedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                let downloadName = attachedFile.name || "AmazonPrepOrders.xlsx";

                const dateStr = formatDateTimeToStringWithDotWithoutSeconds(new Date().toISOString()).replace(/[.:\s]/g, '-');
                const parts = downloadName.split('.');
                const ext = parts.length > 1 ? parts.pop() || 'xlsx' : 'xlsx';
                const baseName = parts.length > 0 ? parts.join('.') : downloadName;

                const finalExt = ext.toLowerCase().startsWith('xls') ? ext : 'xlsx';
                a.download = `${baseName}_${dateStr}.${finalExt}`;

                setTimeout(() => {
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => window.URL.revokeObjectURL(url), 100);
                }, 100);

                toast.dismiss(toastId);
                toast.success('File downloaded successfully!', { autoClose: 2000 });
            } else {
                return handleError("Empty response");
            }
        } catch (error: any) {
            handleError(typeof error?.message === 'string' ? error.message : 'Failed to download file', error);
        }
    }

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Amazon prep' description='Our Amazon prep page' />
            <div className={styles["amazon-prep-page__container"]}>
                {isLoading && <Loader />}
                <Header pageTitle='Amazon prep' toRight needTutorialBtn >
                    <Button classNames='add-order' icon="add" iconOnTheRight onClick={handleAddAmazonPrepOrder}>Add order</Button>
                    <Button classNames='export-orders' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>
                {amazonPrepOrdersData && <AmazonPrepList 
                    amazonPrepOrders={amazonPrepOrdersData} 
                    handleEditAmazonPrepOrder={handleEditAmazonPrepOrder} 
                    isLoading={isLoadingOrders}
                    totalOrders={totalOrders}
                    filterMetadata={filterMetadata}
                    currentPage={state.page}
                    pageSize={state.limit}
                    searchTerm={state.search}
                    fullTextSearch={state.fullTextSearch}
                    sortBy={state.sortBy}
                    sortOrder={state.sortOrder}
                    selectedFilters={{
                        status: state.filters.status,
                        warehouse: state.filters.warehouse,
                        receiverCountry: state.filters.receiverCountry,
                        seller: state.filters.seller
                    }}
                    onPageChange={updatePage}
                    onPageSizeChange={updatePageSize}
                    onSearchChange={updateSearch}
                    onSortChange={updateSort}
                    onFiltersChange={updateFilters}
                    onClearFilters={clearAllFilters}
                    startDate={state.startDate}
                    endDate={state.endDate}
                    onPeriodChange={updatePeriod}
                    handleRefresh={forceUpdateList}
                />}
            </div>
            {showAmazonPrepOrderModal && (amazonPrepUuid || isAmazonPrepNew) &&
                <AmazonPrepForm
                    docUuid={amazonPrepUuid}
                    onCloseModal={onAmazonPrepOrderModalClose}
                    onCloseModalWithSuccess={() => { setShowAmazonPrepOrderModal(false); forceUpdateList(); }}
                />
            }
            {amazonPrepOrdersData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.AmazonPreps} /> : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </Layout>
    )
}

export default AmazonPrepPage;
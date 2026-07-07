import React, { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import OrderList from "./components/OrderList";
import styles from "./styles.module.scss";
import Button from "@/components/Button/Button";
import { getLastFewDays } from "@/utils/date";
import { OrderType, OrderFilterDataType, OrdersFilters } from "@/types/orders";
import Modal from "@/components/Modal";
import OrderForm from "./components/OrderForm";
import ImportFilesBlock from "@/components/ImportFilesBlock";
import Loader from "@/components/Loader";
import { ImportFilesType } from "@/types/importFiles";
import useTourGuide from "@/context/tourGuideContext";
import { TourGuidePages } from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import { tourGuideStepsOrders, tourGuideStepsOrdersNoDocs } from "./ordersTourGuideSteps.constants";
import { sendUserBrowserInfo } from "@/services/userInfo";
import ModalStatus, { ModalStatusType } from "@/components/ModalStatus";
import { STATUS_MODAL_TYPES } from "@/types/utility";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import { usePagedListState, usePagedData, useFilterMetadata, processFiltersForApi, FilterValue } from "@/components/PagedList";
import {getOrdersExcel} from "@/services/orders";
import {base64ToBlob} from "@/utils/files";
import {toast} from "react-toastify";

const OrdersPage = () => {
    const Router = useRouter();
    const { tenantData: { alias } } = useTenant();
    const { token, ui, getBrowserInfo, isActionIsAccessible, getForbiddenTabs } = useAuth();

    // universal state management via url
    const { state, updatePeriod, updateFilters, updateSearch, updatePage, updatePageSize, updateSort, clearAllFilters } = usePagedListState<OrdersFilters>(
        {} as Partial<OrdersFilters>, // default filters
        {
            defaultPageSize: 10,
            defaultDateRange: { startDate: getLastFewDays(new Date(), 5), endDate: new Date() },
            defaultSortBy: 'date',
            defaultSortOrder: 'desc',
        }
    );

    // fetch paginated orders
    const { data: orders, count: totalOrders, isLoading: isLoadingOrders, isPreviousData, refetch: refetchOrders } = usePagedData<OrderType>(
        '/GetPagedOrdersList',
        state,
        { token, alias, ui, enabled: !!token }
    );

    //fetch filter metadata
    const { metadata: filterMetadata, isLoading: isLoadingFilters } = useFilterMetadata<OrderFilterDataType>(
        '/GetPagedFilters',
        { startDate: state.startDate, endDate: state.endDate },
        { token, alias, ui, enabled: !!token }
    );

    const isLoading = isLoadingOrders || isLoadingFilters;
    const isFirstLoad = isLoadingOrders && !isPreviousData;

    //track forbidden tabs
    const [forbiddenTabs, setForbiddenTabs] = useState<string[]>([]);
    useEffect(() => {
        setForbiddenTabs(getForbiddenTabs(AccessObjectTypes["Orders/Fullfillment"]));
    }, []);

    //handle direct order uid navigation (from emails, etc.)
    useEffect(() => {
        const { uuid } = Router.query;
        if (uuid) {
            handleEditOrder(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/orders', undefined, { shallow: true });
        }
    }, [Router.query.uuid]);

    // Tour guide
    const { runTour, setRunTour, isTutorialWatched } = useTourGuide();
    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Orders)) {
            if (!isLoading && orders && orders.length > 0) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading, orders]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(orders?.length ? tourGuideStepsOrders : tourGuideStepsOrdersNoDocs);
    }, [orders]);

    //preserve scroll position across refetches
    const savedScrollY = useRef<number | null>(null);
    useEffect(() => {
        if (savedScrollY.current !== null) {
            const y = savedScrollY.current;
            savedScrollY.current = null;
            // Use rAF to wait for the DOM to repaint after new data renders
            requestAnimationFrame(() => {
                window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
            });
        }
    }, [orders]);

    //import modal
    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => setShowImportModal(false);

    // order form modal
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderUuid, setOrderUuid] = useState('');
    const [isOrderNew, setIsOrderNew] = useState(true);
    const onOrderModalClose = () => setShowOrderModal(false);

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) });
    const closeErrorModal = useCallback(() => setShowStatusModal(false), []);

    //edit order handler
    const handleEditOrder = (uuid: string) => {
        console.log('click ', uuid, orderUuid, showOrderModal);
        setIsOrderNew(false);
        setOrderUuid(uuid);

        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('ViewEditOrder', AccessObjectTypes["Orders/Fullfillment"], AccessActions.ViewObject), body: { uuid } });
            } catch { }

            setModalStatusInfo({
                statusModalType: STATUS_MODAL_TYPES.ERROR,
                title: "Warning",
                subtitle: `You have limited access to this action`,
                onClose: closeErrorModal
            });
            setShowStatusModal(true);
            return;
        }

        setShowOrderModal(true);
    };

    useEffect(() => {
        console.log('showOrderModal ', showOrderModal, 'orderUuid ', orderUuid);
    }, [showOrderModal, orderUuid]);

    //add order handler
    const handleAddOrder = () => {
        setIsOrderNew(true);
        setOrderUuid(null);

        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CreateOrder', AccessObjectTypes["Orders/Fullfillment"], AccessActions.CreateObject), body: {} });
            } catch { }
            return;
        }

        setShowOrderModal(true);
    };

    //import handler
    const handleImportXLS = () => {
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.BulkCreate)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('BulkOrdersCreate', AccessObjectTypes["Orders/Fullfillment"], AccessActions.BulkCreate), body: {} });
            } catch { }
            return;
        }
        setShowImportModal(true);
    };

    const handleExportXLS = async () => {
        try {
            sendUserBrowserInfo({
                ...getBrowserInfo('ExportFulfilmentList', AccessObjectTypes["Orders/Fullfillment"], AccessActions.ExportList),
                body: { startDate: state.startDate, endDate: state.endDate }
            });
        } catch { }

        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.ExportList)) {
            return;
        }

        const toastId = toast.loading('Downloading Orders...', { className: 'download-toast', closeButton: true });

        const handleError = (errorMsg: string, error?: any) => {
            console.error("Export failed", error || new Error(errorMsg));
            toast.dismiss(toastId);
            toast.error(errorMsg, { autoClose: 3000 });
        };

        try {
            const res = await getOrdersExcel({
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

            // Handle resolved AxiosError from api interceptor
            if (res && (res as any).isAxiosError) {
                const errorMsg = (res as any).response?.data?.errorMessage || "Failed to download file";
                return handleError(errorMsg, res);
            }

            if (res && res.data) {
                // Check if backend returned 200 OK but with an errorMessage
                if ((res.data as any).errorMessage) {
                    return handleError((res.data as any).errorMessage);
                }

                const attachedFile = res.data;
                if (!attachedFile.data) {
                    return handleError("No data in response");
                }

                const blob = base64ToBlob(attachedFile.data, attachedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                //ensure extension exists and append unique timestamp to bypass OS "Save As/Overwrite" dialogs
                let downloadName = attachedFile.name || "Orders.xlsx";

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

                toast.dismiss(toastId);
                toast.success('File downloaded successfully!', { autoClose: 2000 });
            } else {
                return handleError("Empty response");
            }
        } catch (error: any) {
            const errorMsg = typeof error?.message === 'string' ? error.message : 'Failed to download file';
            handleError(errorMsg, error);
        }
    };

    // Refresh orders after create/update
    const handleRefresh = () => {
        savedScrollY.current = window.scrollY;
        refetchOrders();
    };

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Orders (fulfillments)' description='Our orders page' />
            <div className={`page-component ${styles['orders-page__container']}`}>
                {isFirstLoad && (<Loader />)}

                <Header pageTitle='Fulfillment' toRight needTutorialBtn>
                    <Button classNames='add-order' icon="add" iconOnTheRight onClick={handleAddOrder}>
                        Add order
                    </Button>
                    <Button classNames='import-orders' icon="import-file" iconOnTheRight onClick={handleImportXLS}>
                        Import xls
                    </Button>
                    <Button classNames='export-orders' icon="download-file" iconOnTheRight onClick={handleExportXLS}>
                        Export list
                    </Button>
                </Header>

                {orders && (
                    <OrderList
                        orders={orders}
                        isLoading={isPreviousData}
                        totalOrders={totalOrders}
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
                        handleEditOrder={handleEditOrder}
                        handleRefresh={handleRefresh}
                        forbiddenTabs={forbiddenTabs}
                        startDate={state.startDate}
                        endDate={state.endDate}
                        onPeriodChange={updatePeriod}
                    />
                )}
            </div>

            {/* Order Form Modal (unchanged) */}
            {showOrderModal && (orderUuid || isOrderNew) && (
                <OrderForm
                    orderUuid={orderUuid}
                    closeOrderModal={onOrderModalClose}
                    closeOrderModalOnSuccess={() => {
                        onOrderModalClose();
                        handleRefresh();
                    }}
                />
            )}

            {/* Import Modal */}
            {showImportModal && (
                <Modal title={`Import xls`} onClose={onImportModalClose}>
                    <ImportFilesBlock
                        file='OrderTemplate.xlsx'
                        importFilesType={ImportFilesType.ORDERS}
                        closeModal={() => setShowImportModal(false)}
                    />
                </Modal>
            )}

            {/* Tour Guide */}
            {orders && runTour && steps ? (
                <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Orders} />
            ) : null}

            {/* Status Modal */}
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </Layout>
    );
};

export default OrdersPage;

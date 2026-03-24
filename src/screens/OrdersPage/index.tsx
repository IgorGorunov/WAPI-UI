import React, { useCallback, useEffect, useState } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import OrderList from "./components/OrderList";
import "./styles.scss";
import Button from "@/components/Button/Button";
import { formatDateTimeToStringWithDotWithoutSeconds, getLastFewDays } from "@/utils/date";
import { OrderType, OrderFilterDataType } from "@/types/orders";
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
import { OrdersFilters } from "./types";

const OrdersPage = () => {
    const Router = useRouter();
    const { tenantData: { alias, orderTitles } } = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, getForbiddenTabs } = useAuth();

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
    const { data: orders, count: totalOrders, isLoading: isLoadingOrders } = usePagedData<OrderType>(
        '/GetPagedOrdersList',
        state,
        { token, alias, ui, enabled: !!token }
    );

    console.log('121212', orders.length, totalOrders)

    // fetch filter metadata
    const { metadata: filterMetadata, isLoading: isLoadingFilters } = useFilterMetadata<OrderFilterDataType>(
        '/GetPagedFilters',
        { startDate: state.startDate, endDate: state.endDate },
        { token, alias, ui, enabled: !!token }
    );

    const isLoading = isLoadingOrders || isLoadingFilters;

    // track forbidden tabs
    const [forbiddenTabs, setForbiddenTabs] = useState<string[]>([]);
    useEffect(() => {
        setForbiddenTabs(getForbiddenTabs(AccessObjectTypes["Orders/Fullfillment"]));
    }, []);

    // handle direct order uid navigation (from emails, etc.)
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

    // import modal
    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => setShowImportModal(false);

    // order form modal
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderUuid, setOrderUuid] = useState('');
    const [isOrderNew, setIsOrderNew] = useState(true);
    const onOrderModalClose = () => setShowOrderModal(false);

    // status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) });
    const closeErrorModal = useCallback(() => setShowStatusModal(false), []);

    // edit order handler
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

    // Add order handler
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

    // Import handler
    const handleImportXLS = () => {
        if (!isActionIsAccessible(AccessObjectTypes["Orders/Fullfillment"], AccessActions.BulkCreate)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('BulkOrdersCreate', AccessObjectTypes["Orders/Fullfillment"], AccessActions.BulkCreate), body: {} });
            } catch { }
            return;
        }
        setShowImportModal(true);
    };

    // Export handler
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

        const exportPromise = async () => {
            const { getOrdersExcel } = await import('@/services/orders');
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

            if (res && res.data) {
                const { base64ToBlob } = await import('@/utils/files');
                const attachedFile = res.data;
                const blob = base64ToBlob(attachedFile.data, attachedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                // Ensure extension exists and append unique timestamp to bypass OS "Save As/Overwrite" dialogs
                let downloadName = attachedFile.name || "Orders.xlsx";

                const dateStr = formatDateTimeToStringWithDotWithoutSeconds(new Date().toISOString()).replace(/[.:\s]/g, '-');
                const parts = downloadName.split('.');
                const ext = parts.length > 1 ? parts.pop() || 'xlsx' : 'xlsx';
                const baseName = parts.length > 0 ? parts.join('.') : downloadName;

                const finalExt = ext.toLowerCase().startsWith('xls') ? ext : 'xlsx';
                a.download = `${baseName}_${dateStr}.${finalExt}`;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error("Empty response");
            }
        };

        try {
            const { toast } = await import('@/components/Toast');
            toast.promise(
                exportPromise(),
                {
                    pending: 'Downloading Orders...',
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

    // Refresh orders after create/update
    const handleRefresh = () => {
        // The usePagedData hook will automatically refetch when we force a re-render
        // We can trigger this by updating the page to itself
        updatePage(state.page);
    };

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Orders (fulfillments)' description='Our orders page' />
            <div className="page-component orders-page__container">
                {isLoading && (<Loader />)}

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
                        isLoading={isLoading}
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

import React, { useEffect, useState } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import {getProductsStockExcel} from "@/services/products";
import {
    usePagedListState,
    usePagedData,
    useFilterMetadata,
    processFiltersForApi,
    FilterValue
} from "@/components/PagedList";
import { ProductStockFilters } from "./types";
import { ProductStockFilterDataType } from "@/types/products";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import ProductList from "./components/ProductList";
import styles from "./styles.module.scss";
import Button from "@/components/Button/Button";
import { ProductStockType } from "@/types/products";
import Loader from "@/components/Loader";
import useTourGuide from "@/context/tourGuideContext";
import { TourGuidePages } from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import { tourGuideStepsProductsStock, tourGuideStepsProductsStockNoDocs } from "./productsStockTourGuideSteps.constants";
import { sendUserBrowserInfo } from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import {toast} from "@/components/Toast";

const ProductsStockPage = () => {
    const { tenantData: { alias } } = useTenant();
    const { token, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    const { state, updateFilters, updateSearch, updatePage, updatePageSize, updateSort, clearAllFilters } = usePagedListState<ProductStockFilters>(
        {} as Partial<ProductStockFilters>,
        {
            defaultPageSize: 10,
            defaultSortBy: 'name',
            defaultSortOrder: 'asc',
            disableDateRange: true,
        }
    );

    const { data: productsData, count: totalProducts, isLoading: isLoadingProducts } = usePagedData<ProductStockType>(
        '/GetPagedProductsStock',
        state,
        { token, alias, ui, enabled: !!token }
    );

    const { metadata: filterMetadata, isLoading: isLoadingFilters } = useFilterMetadata<ProductStockFilterDataType>(
        '/GetPagedFiltersProductStock',
        {},
        { token, alias, ui, enabled: !!token }
    );

    const isLoading = isLoadingProducts || isLoadingFilters;
    const [warehouseForReport, setWarehouseForReport] = useState('');

    const handleRefresh = () => {
        updatePage(state.page);
    };

    //tour guide
    const { runTour, setRunTour, isTutorialWatched } = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.ProductsStock)) {
            if (!isLoading && productsData && productsData.length > 0) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading]);

    const [steps, setSteps] = useState(tourGuideStepsProductsStockNoDocs);
    useEffect(() => {
        setSteps(productsData?.length ? tourGuideStepsProductsStock : tourGuideStepsProductsStockNoDocs);
    }, [productsData]);

    const handleExportXLS = async () => {
        try {
            sendUserBrowserInfo({
                ...getBrowserInfo('ExportProductStockList', AccessObjectTypes["Products/ProductsStock"], AccessActions.ExportList),
                body: { startDate: state.startDate, endDate: state.endDate }
            });
        } catch { }

        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsStock"], AccessActions.ExportList)) {
            return;
        }

        const toastId = toast.loading('Downloading products...', { className: 'download-toast', closeButton: true });

        const handleError = (errorMsg: string, error?: any) => {
            console.error("Export failed", error || new Error(errorMsg));
            toast.dismiss(toastId);
            toast.error(errorMsg, { autoClose: 3000 });
        };

        try {
            const res = await getProductsStockExcel({
                token,
                alias,
                ui,
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
                const blob = base64ToBlob(attachedFile.data, attachedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                let downloadName = "Products stock.xlsx";

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
            handleError(typeof error?.message === 'string' ? error.message : 'Failed to download file', error);
        }
    };


    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Product stock' description='Our product stock page' />
            <div className={styles["products-stock__container"]}>
                {isLoading && <Loader />}
                <Header pageTitle='Products stock' toRight needTutorialBtn>
                    <Button classNames='export-products-stock' icon="download-file" iconOnTheRight onClick={handleExportXLS}>
                        Export list
                    </Button>
                </Header>
                {productsData && (
                    <ProductList 
                        products={productsData} 
                        isLoading={isLoading}
                        totalProducts={totalProducts}
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
                        handleRefresh={handleRefresh}
                        setWarehouseForExport={setWarehouseForReport} 
                    />
                )}
                {productsData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.ProductsStock} /> : null}
            </div>
        </Layout>
    )
}

export default ProductsStockPage;
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import { useRouter } from "next/router";

import {
    usePagedListState,
    usePagedData,
    useFilterMetadata,
    processFiltersForApi,
    FilterValue
} from "@/components/PagedList";
import { ProductFilterDataType, ProductsFilters } from "@/types/products";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import ProductList from "./components/ProductList";
import styles from "./styles.module.scss";
import Button from "@/components/Button/Button";
import { ProductType } from "@/types/products";
import Modal from "@/components/Modal";
import ProductForm from "@/screens/ProductsPage/components/ProductForm";
import '@/components/Toast/styles.module.scss'
import ImportFilesBlock from "@/components/ImportFilesBlock";
import Loader from "@/components/Loader";
import { ImportFilesType } from "@/types/importFiles";
import TourGuide from "@/components/TourGuide";
import useTourGuide from "@/context/tourGuideContext";
import { tourGuideStepsProduct, tourGuideStepsProductNoDocs } from "./productListTourGuideSteps.constants";
import { TourGuidePages } from "@/types/tourGuide";
import { sendUserBrowserInfo } from "@/services/userInfo";
import ModalStatus, { ModalStatusType } from "@/components/ModalStatus";
import { STATUS_MODAL_TYPES } from "@/types/utility";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import {getProductsExcel} from "@/services/products";
import {toast} from "@/components/Toast";

const ProductsPage = () => {
    const Router = useRouter();
    const { tenantData: { alias } } = useTenant();
    const { token, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    //universal state management via url
    const { state, updateFilters, updateSearch, updatePage, updatePageSize, updateSort, clearAllFilters } = usePagedListState<ProductsFilters>(
        {} as Partial<ProductsFilters>,
        {
            defaultPageSize: 10,
            defaultSortBy: 'name',
            defaultSortOrder: 'asc',
            disableDateRange: true,
        }
    );

    //fetch paginated products
    const { data: productsData, count: totalProducts, isLoading: isLoadingProducts, refetch: refetchProducts } = usePagedData<ProductType>(
        '/GetPagedProductsList',
        state,
        { token, alias, ui, enabled: !!token }
    );

    //fetch filter metadata
    const { metadata: filterMetadata, isLoading: isLoadingFilters } = useFilterMetadata<ProductFilterDataType>(
        '/GetPagedFiltersProduct',
        {},
        { token, alias, ui, enabled: !!token }
    );

    const isLoading = isLoadingProducts || isLoadingFilters;
    const [uuid, setUuid] = useState<string | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [showModal, setShowModal] = useState(false);

    //tour guide
    const { runTour, setRunTour, isTutorialWatched } = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Products)) {
            if (!isLoading && productsData && productsData.length > 0) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading, productsData]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(productsData?.length ? tourGuideStepsProduct : tourGuideStepsProductNoDocs);
    }, [productsData]);

    const handleRefresh = () => {
        refetchProducts();
    };

    //import files modal
    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    const closeErrorModal = useCallback(() => {
        setShowStatusModal(false);
    }, []);

    const productsAsOptions = useMemo(() => {
        return productsData ? productsData.map(item => {
            const sum = item.stock.reduce((sum: number, cur) => sum + cur.available, 0);
            return { ...item, quantity: sum };
        }) : [];

    }, [productsData])

    const handleEditProduct = (uuid: string) => {
        setUuid(uuid);
        setIsNew(false);
        setShowModal(true);
        //fetchProductData(uuid);
        // setProductsData(prevState => {
        //     if (prevState && prevState.length) {
        //         const el = prevState.filter(item => item.uuid === uuid);
        //         if (el.length) {
        //             return [...prevState.filter(item => item.uuid !== uuid), {...el[0], notifications: false}].sort((a,b)=>a.name.toLowerCase()<b.name.toLowerCase() ? -1 : 1)
        //         }
        //     }
        //     return prevState;
        // });
    }

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditProduct(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/products');
        }
    }, [Router.query]);


    const handleAddProduct = () => {
        setUuid(null);

        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('CreateProduct', AccessObjectTypes["Products/ProductsList"], AccessActions.CreateObject), body: {} });
            } catch { }
            setModalStatusInfo({ statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal })
            setShowStatusModal(true);
            return null;
        }

        setIsNew(true);
        setShowModal(true);
    }
    const handleImportXLS = () => {
        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.BulkCreate)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('BulkCreateProducts', AccessObjectTypes["Products/ProductsList"], AccessActions.BulkCreate), body: {} });
            } catch { }

            return null;
        }

        setShowImportModal(true)
    }

    const handleExportXLS = async () => {
        try {
            sendUserBrowserInfo({
                ...getBrowserInfo('ExportProductList', AccessObjectTypes["Products/ProductsList"], AccessActions.ExportList),
                body: { startDate: state.startDate, endDate: state.endDate }
            });
        } catch { }

        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.ExportList)) {
            return;
        }

        const exportPromise = async () => {
            const res = await getProductsExcel({
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
                let downloadName = attachedFile.name || "Products.xlsx";

                const parts = downloadName.split('.');
                const ext = parts.length > 1 ? parts.pop() || 'xlsx' : 'xlsx';
                const baseName = parts.length > 0 ? parts.join('.') : downloadName;

                const finalExt = ext.toLowerCase().startsWith('xls') ? ext : 'xlsx';
                a.download = `${baseName}.${finalExt}`;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error("Empty response");
            }
        };

        try {
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

    const onModalClose = () => {
        setShowModal(false);
    }

    return (
        <Layout hasFooter>
            <SeoHead title='Product list' description='Our product list page' />
            <div className={styles['products-page__container']}>
                {isLoading && <Loader />}
                <Header pageTitle='Products' toRight needTutorialBtn>
                    <Button classNames='add-product' icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>
                    <Button classNames='import-products' icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button classNames='export-products' icon="download-file" iconOnTheRight onClick={handleExportXLS}>
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
                        handleEditProduct={handleEditProduct} 
                        handleRefresh={handleRefresh} 
                    />
                )}
            </div>
            {showModal && (uuid && !isNew || !uuid && isNew) &&
                <ProductForm uuid={uuid} products={productsAsOptions} onClose={onModalClose} onCloseSuccess={() => { setShowModal(false); handleRefresh(); }} />
            }
            {showImportModal &&
                <Modal title={`Import xls`} onClose={()=>{onImportModalClose(); handleRefresh();}} >
                    <ImportFilesBlock file='Master data.xlsx' importFilesType={ImportFilesType.PRODUCTS} closeModal={() => {setShowImportModal(false); handleRefresh();}} />
                </Modal>
            }
            {productsData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Products} /> : null}
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </Layout>
    )
}

export default ProductsPage;
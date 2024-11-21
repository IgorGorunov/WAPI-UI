import React, {useCallback, useEffect, useMemo, useState} from "react";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {useRouter} from "next/router";
import {getProducts} from "@/services/products";

import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import ProductList from "./components/ProductList";
import "./styles.scss";
import Button from "@/components/Button/Button";
import {exportFileXLS} from "@/utils/files";
import {ProductType} from "@/types/products";
import Modal from "@/components/Modal";
import ProductForm from "@/screens/ProductsPage/components/ProductForm";
import 'react-toastify/dist/ReactToastify.css';
import '@/components/Toast/styles.scss'
import ImportFilesBlock from "@/components/ImportFilesBlock";
import Loader from "@/components/Loader";
import {ImportFilesType} from "@/types/importFiles";
import TourGuide from "@/components/TourGuide";
import useTourGuide from "@/context/tourGuideContext";
import {tourGuideStepsProduct, tourGuideStepsProductNoDocs} from "./productListTourGuideSteps.constants";
import {TourGuidePages} from "@/types/tourGuide";
import {sendUserBrowserInfo} from "@/services/userInfo";

const ProductsPage = () => {
    const Router = useRouter();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    const [productsData, setProductsData] = useState<any | null>(null);
    const [uuid, setUuid]=useState<string|null>(null);
    const [isNew, setIsNew] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Products)) {
            if (!isLoading && productsData) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(productsData?.length ? tourGuideStepsProduct : tourGuideStepsProductNoDocs);
    }, [productsData]);

    //import files modal
    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }

    type ApiResponse = {
        data: any;
    };

    // const isProductSelected = (prevState: ProductType[], uuid: string) => {
    //     if (!prevState) return false;
    //     //console.log('prev state:', prevState)
    //     const neededProduct = prevState.find(item=>item.uuid===uuid);
    //
    //     //console.log('is selected', prevState, neededProduct)
    //
    //     if (neededProduct) {
    //         return neededProduct.selected || false;
    //     } else {
    //         return false;
    //     }
    // }

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            // const prevProductData = productsData || [];
            // setProductsData([]);
            const requestData = {token: token};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetProductsList', AccessObjectTypes["Products/ProductsList"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.ListView)) {
                setProductsData([]);
                return null;
            }
            const res: ApiResponse = await getProducts(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setProductsData(res.data);
                //setProductsData(prevState => [...res.data.map(product => ({...product, selected: isProductSelected(prevState, product.uuid)}))])
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[]);

    useEffect(() => {
        fetchData();
    }, [token]);

    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(productsData)

    const productsAsOptions = useMemo(()=>{
        return productsData ? productsData.map(item => {
            const sum = item.stock.reduce((sum: number, cur)=> sum+cur.available, 0);
            return {...item, quantity: sum};
        }) : [];

    },[productsData])

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
        //setSingleProductData(null);
        setUuid(null);

        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.CreateObject)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('CreateUpdateProduct', AccessObjectTypes["Products/ProductsList"], AccessActions.CreateObject), body: {}});
            } catch {}

            return null;
        }

        setIsNew(true);
        setShowModal(true);
    }
    const handleImportXLS = () => {
        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.BulkCreate)) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('BulkCreateProducts', AccessObjectTypes["Products/ProductsList"], AccessActions.BulkCreate), body: {}});
            } catch {}

            return null;
        }

        setShowImportModal(true)
    }

    const handleExportXLS = () => {
        try {
            sendUserBrowserInfo({...getBrowserInfo('ExportProductList', AccessObjectTypes["Products/ProductsList"], AccessActions.ExportList), body: {}});
        } catch {}

        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.ExportList)) {
            return null;
        }

        const filteredData = filteredProducts.map(item => ({
            status: item.status,
            sku: item.sku,
            name: item.name,
            dimension: item.dimension,
            weight: item.weight,
            aliases: item.aliases,
            barcodes: item.barcodes,
        }));
        exportFileXLS(filteredData, "Products")
    }

    const onModalClose =() => {
        setShowModal(false);
    }

    return (
        <Layout hasFooter>
            <div className="products-page__container">
                {isLoading && <Loader />}
                <Header pageTitle='Products' toRight needTutorialBtn>
                {/*<Header pageTitle='Products' toRight >*/}
                    {/*<Button icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>*/}
                    <Button classNames='add-product' icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>
                    <Button classNames='import-products' icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button classNames='export-products' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>
                {productsData && <ProductList products={productsData} setFilteredProducts={setFilteredProducts} setProductsData={setProductsData} handleEditProduct={handleEditProduct} reFetchData={fetchData}/>}
            </div>
            {showModal && (uuid && !isNew || !uuid && isNew) &&
                <ProductForm uuid={uuid} products={productsAsOptions} onClose={onModalClose} onCloseSuccess={()=>{setShowModal(false);fetchData();}} />
            }
            {showImportModal &&
                <Modal title={`Import xls`} onClose={onImportModalClose} >
                    <ImportFilesBlock file='Master data.xlsx' importFilesType={ImportFilesType.PRODUCTS} closeModal={()=>setShowImportModal(false)}/>
                </Modal>
            }
            {productsData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Products} /> : null}
        </Layout>
    )
}

export default ProductsPage;
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
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
import TourGuide, {TourGuideStepType} from "@/components/TourGuide";
import useTourGuide from "@/context/tourGuideContext";


const tourGuideStepsProduct: TourGuideStepType[] = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Here you can sort your products by clicking the name of the chosen column.',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Here you can filter the products.',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below.',
    },
    {
        target: '.add-product',
        content: 'Here you can add a product. It will then be checked by our logistics manager.',
        //disableBeacon: true,
    },
    {
        target: '.import-products',
        content: 'Here you can import products by bulk from Excel.',
    },
    {
        target: '.export-products',
        content: 'Here you can export products into Excel \n' +
            'Note: All filters will be applied into export file',
    },
]

const ProductsPage = () => {
    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [productsData, setProductsData] = useState<any | null>(null);
    const [uuid, setUuid]=useState<string|null>(null);
    const [isNew, setIsNew] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // //tour guide
    // const {runTour, setRunTour, checkTutorial} = useTourGuide();
    //
    // useEffect(() => {
    //     if (!checkTutorial('Catalogs/Products')) {
    //         if (!isLoading && productsData) {
    //             setTimeout(() => setRunTour(true), 1000);
    //         }
    //     }
    // }, [isLoading]);

    //import files modal
    const [showImportModal, setShowImportModal] = useState(false);
    const onImportModalClose = () => {
        setShowImportModal(false);
    }

    type ApiResponse = {
        data: any;
    };

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            const res: ApiResponse = await getProducts(
                {token: token}
            );

            if (res && "data" in res) {
                setProductsData(res.data);
                // setUuid(uuid);
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
        setProductsData(prevState => {
            if (prevState && prevState.length) {
                const el = prevState.filter(item => item.uuid === uuid);
                if (el.length) {
                    return [...prevState.filter(item => item.uuid !== uuid), {...el[0], notifications: false}].sort((a,b)=>a.name.toLowerCase()<b.name.toLowerCase() ? -1 : 1)
                }
            }
            return prevState;
        });
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
        setIsNew(true);
        setShowModal(true);
    }
    const handleImportXLS = () => {
        setShowImportModal(true)
    }

    const handleExportXLS = () => {
        const filteredData = filteredProducts.map(item => ({
            status: item.status,
            sku: item.sku,
            name: item.name,
            dimension: item.dimension,
            weight: item.weight,
            aliases: item.aliases,
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
                {/*<Header pageTitle='Products' toRight needTutorialBtn>*/}
                <Header pageTitle='Products' toRight >
                    {/*<Button icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>*/}
                    <Button classNames='add-product' icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>
                    <Button classNames='import-products' icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button classNames='export-products' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>
                {productsData && <ProductList products={productsData} setFilteredProducts={setFilteredProducts} handleEditProduct={handleEditProduct}/>}
            </div>
            {showModal && (uuid && !isNew || !uuid && isNew) &&
                <ProductForm uuid={uuid} products={productsAsOptions} onClose={onModalClose} onCloseSuccess={()=>{setShowModal(false);fetchData();}} />
                // <Modal title={`${singleProductData ? 'Product': 'Product'}`} onClose={onModalClose} >
                //     <ProductForm productParams={productParams} productData={singleProductData} uuid={uuid} products={productsAsOptions} closeProductModal={()=>{setShowModal(false);fetchData();}}/>
                // </Modal>
            }
            {showImportModal &&
                <Modal title={`Import xls`} onClose={onImportModalClose} >
                    <ImportFilesBlock file='Master data.xlsx' importFilesType={ImportFilesType.PRODUCTS} closeModal={()=>setShowImportModal(false)}/>
                </Modal>
            }
            {/*{productsData && runTour && tourGuideStepsProduct ? <TourGuide steps={tourGuideStepsProduct} run={runTour} pageName='Catalogs/Products' /> : null}*/}
        </Layout>
    )
}

export default ProductsPage;
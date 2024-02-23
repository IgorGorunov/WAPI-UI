import React, {useCallback, useEffect, useMemo, useState} from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {getProductByUID, getProductParameters, getProducts} from "@/services/products";

import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import ProductList from "./components/ProductList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import Button from "@/components/Button/Button";
import {exportFileXLS} from "@/utils/files";
import {ProductParamsType, ProductType, SingleProductType} from "@/types/products";
import Modal from "@/components/Modal";
import ProductForm from "@/screens/ProductsPage/components/ProductForm";
import 'react-toastify/dist/ReactToastify.css';
import '@/components/Toast/styles.scss'
import ImportFilesBlock from "@/components/ImportFilesBlock";
import Loader from "@/components/Loader";
import {verifyUser} from "@/utils/userData";
import {ImportFilesType} from "@/types/importFiles";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";

const ProductsPage = () => {
    const Router = useRouter();
    const { token, setToken, currentDate } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [productsData, setProductsData] = useState<any | null>(null);
    const [singleProductData, setSingleProductData] = useState<SingleProductType|null>(null);
    const [uuid, setUuid]=useState<string|null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [productParams, setProductParams] = useState<ProductParamsType|null>(null);

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

            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await getProducts(
                {token: token}
            );

            if (res && "data" in res) {
                setProductsData(res.data);
                setUuid(uuid);
                setIsLoading(false);
            } else {
                console.error("API did not return expected data");
            }

            const resParams: ApiResponse = await getProductParameters(
                {token: token}
            );

            if (resParams && "data" in resParams) {
                setProductParams(resParams.data);
                //setIsLoading(false);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
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
        fetchProductData(uuid);
        setProductsData(prevState => {
            if (prevState && prevState.length) {
                const el = prevState.filter(item => item.uuid === uuid);
                if (el.length) {
                    return [...prevState.filter(item => item.uuid !== uuid), {...el[0], notifications: false}].sort((a,b)=>a.wapiTrackingNumber<b.wapiTrackingNumber ? 1 : -1)
                }
            }
            return [...prevState];
        });
        setShowModal(true);
    }

    useEffect(() => {
        const { uuid } = Router.query;

        if (uuid) {
            handleEditProduct(Array.isArray(uuid) ? uuid[0] : uuid);
            Router.replace('/products');
        }
    }, [Router.query]);


    const fetchProductData = async (uuid) => {
        try {
            setIsLoading(true);
            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await getProductByUID(
                {token: token, uuid: uuid}
            );

            if (res && "data" in res) {
                // res.data.uuid = uuid;
                setSingleProductData(res.data);
                setUuid(uuid);
                //setShowModal(true);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProduct = () => {
        setSingleProductData(null);
        setUuid(null);
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

    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();
    const onModalClose =() => {
        setShowModal(false);
        if (singleProductData && singleProductData.uuid) {
            setDocNotificationsAsRead(singleProductData.uuid);
        }
    }

    return (
            <Layout hasFooter>
                <div className="products-page__container">
                    {isLoading && <Loader />}
                    <Header pageTitle='Products' toRight >
                        {/*<Button icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>*/}
                        <Button icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>
                        <Button icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                        <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                    </Header>
                    {productsData && <ProductList products={productsData} setFilteredProducts={setFilteredProducts} handleEditProduct={handleEditProduct}/>}
                </div>
                {showModal &&
                    <Modal title={`${singleProductData ? 'Product': 'Product'}`} onClose={onModalClose} >
                        <ProductForm productParams={productParams} productData={singleProductData} uuid={uuid} products={productsAsOptions} closeProductModal={()=>{setShowModal(false);fetchData();}}/>
                    </Modal>
                }
                {showImportModal &&
                    <Modal title={`Import xls`} onClose={onImportModalClose} >
                        <ImportFilesBlock file='Master data.xlsx' importFilesType={ImportFilesType.PRODUCTS} closeModal={()=>setShowImportModal(false)}/>
                    </Modal>
                }
            </Layout>


    )
}

export default ProductsPage;
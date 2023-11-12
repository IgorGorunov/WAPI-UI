import React, {useState, useEffect, useCallback} from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {getProductByUID, getProductParameters, getProducts} from "@/services/products";

import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import ProductList from "./components/ProductList";
import {verifyToken} from "@/services/auth";
import Skeleton from "@/components/Skeleton/Skeleton";
import "./styles.scss";
import {getDasboardData} from "@/services/dashboard";
import Button from "@/components/Button/Button";
import {exportFileXLS} from "@/utils/files";
import {ProductType, ProductParamsType, SingleProductType} from "@/types/products";
import Modal from "@/components/Modal";
import Tabs from "@/components/Tabs";
import ProductForm from "@/screens/ProductsPage/components/ProductForm";

const ProductsPage = () => {
    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [productsData, setProductsData] = useState<any | null>(null);
    const [singleProductData, setSingleProductData] = useState<SingleProductType|null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [productParams, setProductParams] = useState<ProductParamsType|null>(null);

    type ApiResponse = {
        data: any;
    };

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            //verify token
            console.log("token: ", token);
            if (!await verifyToken(token)) {
                console.log("token is wrong");
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await getProducts(
                {token: token}
            );

            if (res && "data" in res) {
                setProductsData(res.data);
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
    console.log("products data: ", productsData);


    const fetchProductData = async (uuid) => {
        try {
            setIsLoading(true);
            //verify token
            if (!await verifyToken(token)) {
                console.log("token is wrong");
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await getProductByUID(
                {token: token, uuid: uuid}
            );

            if (res && "data" in res) {
                setSingleProductData(res.data);
                setIsLoading(false);
                setShowModal(true);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        } finally {

        }
    };
    const handleAddProduct = () => {

        //temporary


        setShowModal(true);
    }
    const handleImportXLS = () => {

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
        console.log("it is closed");
        setShowModal(false);
    }

    return (
        <Layout hasFooter>
            <div className="products-page__container">
                {isLoading && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        zIndex: 1000
                    }}>
                        <Skeleton type="round" width="500px" height="300px" />
                    </div>
                )}
                <Header pageTitle='Products' toRight >
                    {/*<Button icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>*/}
                    <Button icon="add" iconOnTheRight onClick={()=>fetchProductData('94962cb9-fc73-4554-b7d0-ea2485d346ec')}>Add product</Button>
                    <Button icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export xls</Button>
                </Header>
                {productsData && <ProductList products={productsData} setFilteredProducts={setFilteredProducts}/>}
            </div>
            {showModal &&
                <Modal name='product' title='Add product' onClose={onModalClose} >
                    <ProductForm productParams={productParams} productData={singleProductData} />
                </Modal>
            }
        </Layout>
    )
}

export default ProductsPage;
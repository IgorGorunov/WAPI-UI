import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getProducts } from "@/services/products";

import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
//import Header from "./components/Header"
import Header from "@/components/Header";
import ProductList from "./components/ProductList";
import {verifyToken} from "@/services/auth";
import Skeleton from "@/components/Skeleton/Skeleton";
import "./styles.scss";
import {getDasboardData} from "@/services/dashboard";
import Button from "@/components/Button/Button";
import {exportFileXLS} from "@/utils/files";
import {ProductType} from "@/types/products";

const ProductsPage = () => {

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [productsData, setProductsData] = useState<any | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        type ApiResponse = {
            data: any;
        };

        const fetchData = async () => {
            try {
                setIsLoading(true);
                //verify token
                if (!await verifyToken(token)) {
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

            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(productsData)


    const handleEditProduct = (uuid: string) => {
        console.log("uuid", uuid)
    }

    const handleAddProduct = () => {

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
                    <Button icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>
                    <Button icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export xls</Button>
                </Header>
                {productsData && <ProductList products={productsData} setFilteredProducts={setFilteredProducts} handleEditProduct={handleEditProduct}/>}
            </div>
        </Layout>
    )
}

export default ProductsPage;
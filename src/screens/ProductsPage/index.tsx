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

            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    console.log("products data: ", productsData);

    const handleAddProduct = () => {

    }
    const handleImportXLS = () => {

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
                        <Skeleton type="loader" width="500px" height="300px" />
                    </div>
                )}
                <Header pageTitle='Products' toRight >
                    <Button icon="add" iconOnTheRight onClick={handleAddProduct}>Add product</Button>
                    <Button icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
                </Header>
                {productsData && <ProductList products={productsData}/>}
            </div>
        </Layout>
    )
}

export default ProductsPage;
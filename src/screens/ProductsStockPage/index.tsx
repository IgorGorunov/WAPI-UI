import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getProductsStock } from "@/services/products";

import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
//import Header from "./components/Header"
import Header from '@/components/Header';
import ProductList from "./components/ProductList";
import {verifyToken} from "@/services/auth";

import "./styles.scss";
import Skeleton from "@/components/Skeleton/Skeleton";
import Button from "@/components/Button/Button";
import {ProductStockType} from "@/types/products";
import {exportFileXLS} from "@/utils/files";

const ProductsStockPage = () => {

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [productsData, setProductsData] = useState<any | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<ProductStockType[] | null>(null);
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

                const res: ApiResponse = await getProductsStock(
                    {token: token}
                );

                if (res && "data" in res) {
                    setProductsData(res.data);
                    setFilteredProducts(res.data);
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
    const handleExportXLS = () => {
        const filteredData = filteredProducts.map(item => ({
            sku: item.sku,
            name: item.name,
            warehouse: item.warehouse,
            warehouseSku: item.warehouseSku,
            country: item.country,
            total: item.total,
            damaged: item.damaged,
            expired: item.expired,
            undefinedStatus: item.undefinedStatus,
            withoutBox: item.withoutBox,
            forPlacement: item.forPlacement,
            reserved: item.reserved,
            available: item.available,
        }));
        exportFileXLS(filteredData, "ProductsStock")
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="products-stock__container">
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
                <Header pageTitle='Products stock' toRight >
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Download report</Button>
                </Header>
                {productsData && <ProductList products={productsData} setFilteredProducts={setFilteredProducts}/>}
            </div>
        </Layout>
    )
}

export default ProductsStockPage;
import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getProductsStock } from "@/services/products";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import ProductList from "./components/ProductList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import Button from "@/components/Button/Button";
import {ProductStockType} from "@/types/products";
import {exportFileXLS} from "@/utils/files";
import Loader from "@/components/Loader";
import {verifyUser} from "@/utils/userData";

const ProductsStockPage = () => {

    const Router = useRouter();
    const { token, setToken, currentDate } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [productsData, setProductsData] = useState<any | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<ProductStockType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [warehouseForReport, setWarehouseForReport] = useState('');

    useEffect(() => {
        type ApiResponse = {
            data: any;
        };

        const fetchData = async () => {
            try {
                setIsLoading(true);
                //verify token
                const responseVerification = await verifyToken(token);
                if (!verifyUser(responseVerification, currentDate) ){
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

    const handleExportXLS = () => {
        const filteredData = filteredProducts.map(item => ({
            sku: item.sku,
            name: item.name,
            warehouse: item.warehouse,
            warehouseSku: item.warehouseSku,
            country: item.country,
            available: item.available,
            reserved: item.reserved,
            damaged: item.damaged,
            expired: item.expired,
            undefinedStatus: item.undefinedStatus,
            withoutBox: item.withoutBox,
            forPlacement: item.forPlacement,
            total: item.total,
        }));
        exportFileXLS(filteredData, `ProductsStock${warehouseForReport ? "_"+warehouseForReport : ""}`)
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="products-stock__container">
                {isLoading && <Loader />}
                <Header pageTitle='Products stock' toRight >
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Download report</Button>
                </Header>
                {productsData && <ProductList products={productsData} setFilteredProducts={setFilteredProducts} setWarehouseForExport={setWarehouseForReport}/>}
            </div>
        </Layout>
    )
}

export default ProductsStockPage;
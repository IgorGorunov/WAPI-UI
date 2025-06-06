import React, {useEffect, useState} from "react";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {getProductsStock} from "@/services/products";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import ProductList from "./components/ProductList";
import "./styles.scss";
import Button from "@/components/Button/Button";
import {ProductStockType} from "@/types/products";
import {exportFileXLS} from "@/utils/files";
import Loader from "@/components/Loader";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {tourGuideStepsProductsStock, tourGuideStepsProductsStockNoDocs} from "./productsStockTourGuideSteps.constants";
import {sendUserBrowserInfo} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";

const ProductsStockPage = () => {
    const { tenantData: { alias }} = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

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
                setProductsData([]);
                setFilteredProducts([]);
                const requestData = {token, alias};
                try {
                    sendUserBrowserInfo({...getBrowserInfo('GetProductsStock', AccessObjectTypes["Products/ProductsStock"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
                } catch {}

                if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsStock"], AccessActions.ListView)){
                    setProductsData([]);
                    setFilteredProducts([]);
                    setIsLoading(false);
                    return;
                }
                const res: ApiResponse = await getProductsStock(superUser && ui ? {...requestData, ui} : requestData);

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
        try {
            sendUserBrowserInfo({...getBrowserInfo('ExportProductStockList', AccessObjectTypes["Products/ProductsStock"], AccessActions.ExportList), body: {}});
        } catch {}

        if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsStock"], AccessActions.ExportList)) {
            return null;
        }

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
            onShipping: item.onShipping,
            total: item.total,
        }));
        exportFileXLS(filteredData, `ProductsStock${warehouseForReport ? "_"+warehouseForReport : ""}`)
    }

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.ProductsStock)) {
            if (!isLoading && productsData) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading]);

    const [steps, setSteps] = useState(tourGuideStepsProductsStockNoDocs);
    useEffect(() => {
        setSteps(productsData?.length ? tourGuideStepsProductsStock : tourGuideStepsProductsStockNoDocs);
    }, [productsData]);

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Product stock' description='Our product stock page' />
            <div className="products-stock__container">
                {isLoading && <Loader />}
                <Header pageTitle='Products stock' toRight needTutorialBtn >
                    <Button classNames='export-products' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>
                {productsData && <ProductList products={productsData} setFilteredProducts={setFilteredProducts} setWarehouseForExport={setWarehouseForReport}/>}
                {productsData && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.ProductsStock} /> : null}
            </div>
        </Layout>
    )
}

export default ProductsStockPage;
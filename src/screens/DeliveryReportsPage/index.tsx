import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getDeliveryReports } from "@/services/deliveryReports";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import DeliveryReportsList from "./components/DeliveryReportsList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import Skeleton from "@/components/Skeleton/Skeleton";
import Button from "@/components/Button/Button";
import {DeliveryReportType} from "@/types/deliveryReports";
import {exportFileXLS} from "@/utils/files";

const DeliveryReportsPage = () => {

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [deliveryReportsData, setDeliveryReportsData] = useState<any | null>(null);
    const [filteredDeliveryReports, setFilteredDeliveryReports] = useState<DeliveryReportType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        type ApiResponse = {
            data: any;
        };

        const fetchData = async () => {
            try {
                setIsLoading(true);
                if (!await verifyToken(token)) {
                    await Router.push(Routes.Login);
                }

                const res: ApiResponse = await getDeliveryReports(
                    {token: token}
                );

                if (res && "data" in res) {
                    setDeliveryReportsData(res.data);
                    setFilteredDeliveryReports(res.data);
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

    const handleAddInvoice = () => {

    }
    const handleExportXLS = () => {
        const filteredData = filteredDeliveryReports.map(item => ({
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
        exportFileXLS(filteredData, "Delivery reports")
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="delivery-reports__container">
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
                <Header pageTitle='Delivery reports' toRight >
                    {/*<Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Download report</Button>*/}
                </Header>
                {deliveryReportsData && <DeliveryReportsList deliveryReports={deliveryReportsData} setFilteredDeliveryReports={setFilteredDeliveryReports}/>}
            </div>
        </Layout>
    )
}

export default DeliveryReportsPage;
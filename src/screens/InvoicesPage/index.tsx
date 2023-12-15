import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getInvoices } from "@/services/invoices";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import InvoiceList from "./components/InvoiceList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import Skeleton from "@/components/Skeleton/Skeleton";
import Button from "@/components/Button/Button";
import {InvoiceType} from "@/types/invoices";
import {exportFileXLS} from "@/utils/files";

const InvoicesPage = () => {

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [invoicesData, setInvoicesData] = useState<any | null>(null);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[] | null>(null);
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

                const res: ApiResponse = await getInvoices(
                    {token: token}
                );

                if (res && "data" in res) {
                    setInvoicesData(res.data);
                    setFilteredInvoices(res.data);
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
        const filteredData = filteredInvoices.map(item => ({
            status: item.status,
            number: item.number,
            date: item.date,
            dueDate: item.dueDate,
            amount: item.amount,
            currency: item.currency,
            payd: item.payd,
            debt: item.debt,
            overdue: item.overdue,
        }));
        exportFileXLS(filteredData, "Invoices")
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="invoices__container">
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
                <Header pageTitle='Invoices' toRight >
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Download report</Button>
                </Header>
                {invoicesData && <InvoiceList invoices={invoicesData} setFilteredInvoices={setFilteredInvoices}/>}
            </div>
        </Layout>
    )
}

export default InvoicesPage;
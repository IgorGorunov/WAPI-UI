import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getInvoices, getInvoicesDebts, getInvoiceForm } from "@/services/invoices";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import InvoiceList from "./components/InvoiceList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import Skeleton from "@/components/Skeleton/Skeleton";
import Button from "@/components/Button/Button";
import {InvoiceType, BalanceInfoType, InvoiceBalanceType} from "@/types/invoices";
import {exportFileXLS} from "@/utils/files";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getFirstDayOfYear} from "@/utils/date";
import BalanceInfoCard from "@/screens/InvoicesPage/components/BalanceInfoCard";

const InvoicesPage = () => {

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    //balance/debt
    const [invoiceBalance, setInvoiceBalance] = useState<InvoiceBalanceType|null>(null);

    const [invoicesData, setInvoicesData] = useState<any | null>(null);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    //period
    const today = new Date();
    const firstDay = getFirstDayOfYear(today);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})

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
                    {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate) }
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

    }, [token, curPeriod]);

    useEffect(() => {
        type ApiResponse = {
            data: any;
        };

        const fetchDebtData = async () => {
            try {
                setIsLoading(true);
                if (!await verifyToken(token)) {
                    await Router.push(Routes.Login);
                }

                const res: ApiResponse = await getInvoicesDebts(
                    { token: token }
                );

                if (res && "data" in res) {
                    console.log("debt:", res.data);
                    setInvoiceBalance(res.data);

                } else {
                    console.error("API did not return expected data");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDebtData();

    }, []);


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
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Download invoices list</Button>
                </Header>
                {invoiceBalance ? (
                    <div className="grid-row balance-info-block">
                        {invoiceBalance.debt && invoiceBalance.debt.length ? (
                            <div className='width-33 grid-col-33'>
                                <BalanceInfoCard title={"Total debt"} type="debt" balanceArray={invoiceBalance.debt} />
                            </div>
                        ) : null}
                        {invoiceBalance.overdue && invoiceBalance.overdue.length ? (
                            <div className='width-33  grid-col-33'>
                                <BalanceInfoCard title={"Overdue"} type="overdue" balanceArray={invoiceBalance.overdue} />
                            </div>
                        ) : null}
                        {invoiceBalance.overdueLimit ? (
                            <div className='width-33 grid-col-33'>
                                <BalanceInfoCard title={"Overdue limit"} type="limit" balanceArray={invoiceBalance.overdueLimit} />
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {invoicesData && <InvoiceList invoices={invoicesData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod} setFilteredInvoices={setFilteredInvoices}/>}
            </div>
        </Layout>
    )
}

export default InvoicesPage;
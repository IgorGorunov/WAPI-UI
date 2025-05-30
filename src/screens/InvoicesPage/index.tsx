import React, {useEffect, useState} from "react";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {getInvoices, getInvoicesDebts} from "@/services/invoices";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import InvoiceList from "./components/InvoiceList";
import "./styles.scss";
import Button from "@/components/Button/Button";
import {InvoiceBalanceType, InvoiceType} from "@/types/invoices";
import {exportFileXLS} from "@/utils/files";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays,} from "@/utils/date";
import BalanceInfoCard from "@/screens/InvoicesPage/components/BalanceInfoCard";
import Loader from "@/components/Loader";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {tourGuideStepsInvoices, tourGuideStepsInvoicesNoDocs} from "./invoicesTourGuideSteps.constants";
import {sendUserBrowserInfo} from "@/services/userInfo";

const InvoicesPage = () => {

    const { token, currentDate, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    //balance/debt
    const [invoiceBalance, setInvoiceBalance] = useState<InvoiceBalanceType|null>(null);

    const [invoicesData, setInvoicesData] = useState<any | null>(null);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    //period
    const today = currentDate;
    const firstDay = getLastFewDays(today,30);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})

    useEffect(() => {
        type ApiResponse = {
            data: any;
        };

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const requestData = {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate) }

                try {
                    sendUserBrowserInfo({...getBrowserInfo('GetInvoicesList', AccessObjectTypes["Finances/Invoices"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
                } catch {}

                if (!isActionIsAccessible(AccessObjectTypes["Finances/Invoices"], AccessActions.ListView)) {
                    setInvoicesData([]);
                    setFilteredInvoices([]);
                    return null;
                }

                const res: ApiResponse = await getInvoices(superUser && ui ? {...requestData, ui} : requestData);

                if (res && "data" in res) {
                    setInvoicesData(res.data.sort((a,b) => a.date > b.date ? -1 : 1));
                    setFilteredInvoices(res.data.sort((a,b) => a.date > b.date ? -1 : 1));
                } else {
                    console.error("API did not return expected data");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
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
                const requestData = { token: token };

                try {
                    sendUserBrowserInfo({...getBrowserInfo('GetInvoicesDebt', AccessObjectTypes["Finances/Invoices"], AccessActions.View), body: superUser && ui ? {...requestData, ui} : requestData})
                } catch {}

                if (!isActionIsAccessible(AccessObjectTypes["Finances/Invoices"], AccessActions.View)) {
                    setInvoiceBalance({
                        "overdueLimit": [
                            {
                                "limit": 0,
                                "currency": "EUR"
                            }
                        ],
                        "overdue": [
                            {
                                "overdue": 0,
                                "currency": "EUR"
                            }
                        ],
                        "debt": [
                            {
                                "debt": 0,
                                "currency": "EUR"
                            }
                        ]
                    });
                    return;
                }
                const res: ApiResponse = await getInvoicesDebts(superUser && ui ? {...requestData, ui} : requestData);

                if (res && "data" in res) {
                    setInvoiceBalance(res.data);

                } else {
                    console.error("API did not return expected data");
                    setIsLoading(false);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDebtData();

    }, [token, curPeriod]);


    const handleExportXLS = () => {
        try {
            sendUserBrowserInfo({...getBrowserInfo('ExportInvoicesList', AccessObjectTypes["Finances/Invoices"], AccessActions.ExportList), body: {startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate)}});
        } catch {}

        if (!isActionIsAccessible(AccessObjectTypes["Finances/Invoices"], AccessActions.ExportList)) {
            return null;
        }

        const filteredData = filteredInvoices.map(item => ({
            status: item.status,
            number: item.number,
            date: item.date,
            dueDate: item.dueDate,
            amount: item.amount,
            currency: item.currency,
            paid: item.paid,
            debt: item.debt,
            overdue: item.overdue,
        }));
        exportFileXLS(filteredData, "Invoices")
    }

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Invoices)) {
            if (!isLoading && invoicesData!==null) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [invoicesData]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(invoicesData?.length ? tourGuideStepsInvoices : tourGuideStepsInvoicesNoDocs);
    }, [invoicesData]);

    return (
        <Layout hasHeader hasFooter>
            <div className="invoices__container">
                {isLoading && <Loader />}
                <Header pageTitle='Invoices' toRight needTutorialBtn >
                    <Button classNames='export-invoices' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>
                {invoiceBalance ? (
                    <div className="grid-row balance-info-block has-cards-block">
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
            {invoicesData!==null && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Invoices} /> : null}
        </Layout>
    )
}

export default InvoicesPage;
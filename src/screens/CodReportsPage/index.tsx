import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getCodReports , getCODIndicators} from "@/services/codReports";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import CodReportsList from "./components/CodReportsList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import Skeleton from "@/components/Skeleton/Skeleton";
import Button from "@/components/Button/Button";
import {CODIndicatorsType, CodReportType} from "@/types/codReports";
import {exportFileXLS} from "@/utils/files";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {DateRangeType} from "@/types/dashboard";
import CODIndicatorsCard from "@/screens/CodReportsPage/components/CODIndicators";

const CodReportsPage = () => {

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [CODIndicators, setCODIndicators] = useState<CODIndicatorsType|null>(null);

    const [codReportsData, setCodReportsData] = useState<any | null>(null);
    const [filteredCodReports, setFilteredCodReports] = useState<CodReportType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    //period
    const today = new Date();
    const firstDay = getLastFewDays(today, 30);
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

                const res: ApiResponse = await getCodReports(
                    {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate) }
                );

                if (res && "data" in res) {
                    setCodReportsData(res.data);
                    setFilteredCodReports(res.data);
                    setIsLoading(false);
                } else {
                    console.error("API did not return expected data");
                    setIsLoading(false);
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

                const res: ApiResponse = await getCODIndicators(
                    {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate) }
                );

                if (res && "data" in res) {
                    setCODIndicators(res.data);

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
        const filteredData = filteredCodReports.map(item => ({
            number: item.number,
            date: item.date,
            amount: item.amount,
            currency: item.currency,
            period: item.period,
            ordersCount: item.ordersCount,
        }));
        exportFileXLS(filteredData, "Cod reports")
    }

    return (
        <Layout hasHeader hasFooter>
            <div className="cod-reports__container">
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
                <Header pageTitle='Cod reports' toRight >
                    <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Download COD reports list</Button>
                </Header>
                {CODIndicators ? (
                    <div className="grid-row indicator-info-block has-cards-block">
                        {CODIndicators.yearAmount && CODIndicators.yearAmount.length ? (
                            <div className='width-33 grid-col-33'>
                                <CODIndicatorsCard title={"Year to date"} type="amount" indicatorsArray={CODIndicators.yearAmount} />
                            </div>
                        ) : null}
                        {CODIndicators.monthAmount && CODIndicators.monthAmount.length ? (
                            <div className='width-33  grid-col-33'>
                                <CODIndicatorsCard title={"Month to date"} type="amount" indicatorsArray={CODIndicators.monthAmount} />
                            </div>
                        ) : null}
                        {CODIndicators.currentAmount ? (
                            <div className='width-33 grid-col-33'>
                                <CODIndicatorsCard title={"Current period"} type="amount" indicatorsArray={CODIndicators.currentAmount} />
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {codReportsData && <CodReportsList codReports={codReportsData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod}  setFilteredCodReports={setFilteredCodReports}/>}
            </div>
        </Layout>
    )
}

export default CodReportsPage;
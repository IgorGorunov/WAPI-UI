import React, { useState, useEffect } from "react";
import useAuth from "@/context/authContext";
import { getCodReports , getCODIndicators} from "@/services/codReports";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import CodReportsList from "./components/CodReportsList";
import "./styles.scss";
import Button from "@/components/Button/Button";
import {CODIndicatorsType, CodReportType} from "@/types/codReports";
import {exportFileXLS} from "@/utils/files";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {DateRangeType} from "@/types/dashboard";
import CODIndicatorsCard from "@/screens/CodReportsPage/components/CODIndicators";
import Loader from "@/components/Loader";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {
    tourGuideStepsCodReports,
    tourGuideStepsCodReportsNoDocs
} from "./codReportTourGuideSteps.constants";
import {useTranslations} from "next-intl";

const CodReportsPage = () => {
    const t = useTranslations('CodReports');
    const tGuide = useTranslations('CodReports.tourGuide');
    const tBtns = useTranslations('common.buttons');

    const { token, currentDate, superUser, ui } = useAuth();

    const [CODIndicators, setCODIndicators] = useState<CODIndicatorsType|null>(null);

    const [codReportsData, setCodReportsData] = useState<any | null>(null);
    const [filteredCodReports, setFilteredCodReports] = useState<CodReportType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    //period
    const today = currentDate;
    const firstDay = getLastFewDays(today, 30);
    const [curPeriod, setCurrentPeriod] = useState<DateRangeType>({startDate: firstDay, endDate: today})

    useEffect(() => {
        type ApiResponse = {
            data: any;
        };

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const requestData = {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate) };
                const res: ApiResponse = await getCodReports(superUser && ui ? {...requestData, ui} : requestData);

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
                const requestData = {token: token, startDate: formatDateToString(curPeriod.startDate), endDate: formatDateToString(curPeriod.endDate) };
                const res: ApiResponse = await getCODIndicators(superUser && ui ? {...requestData, ui} : requestData);

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

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.CodReports)) {
            if (!isLoading && codReportsData!==null) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [codReportsData]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(tourGuideStepsCodReports(tGuide));
    }, [codReportsData]);

    return (
        <Layout hasHeader hasFooter>
            <div className="cod-reports__container">
                {isLoading && <Loader />}
                <Header pageTitle={t('headerTitle')} toRight needTutorialBtn >
                    <Button classNames='export-file' icon="download-file" iconOnTheRight onClick={handleExportXLS}>{tBtns('exportList')}</Button>
                </Header>
                {CODIndicators ? (
                    <div className="grid-row indicator-info-block has-cards-block">
                        {CODIndicators.yearAmount && CODIndicators.yearAmount.length ? (
                            <div className='width-33 grid-col-33'>
                                <CODIndicatorsCard title={t('yearToDate')} type="amount" indicatorsArray={CODIndicators.yearAmount} classNames='year' />
                            </div>
                        ) : null}
                        {CODIndicators.monthAmount && CODIndicators.monthAmount.length ? (
                            <div className='width-33  grid-col-33'>
                                <CODIndicatorsCard title={t('monthToDate')} type="amount" indicatorsArray={CODIndicators.monthAmount} classNames='month' />
                            </div>
                        ) : null}
                        {CODIndicators.currentAmount ? (
                            <div className='width-33 grid-col-33'>
                                <CODIndicatorsCard title={t('currentPeriod')} type="amount" indicatorsArray={CODIndicators.currentAmount} classNames='current' />
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {codReportsData && <CodReportsList codReports={codReportsData} currentRange={curPeriod} setCurrentRange={setCurrentPeriod}  setFilteredCodReports={setFilteredCodReports}/>}
            </div>
            {codReportsData!==null && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.CodReports} /> : null}
        </Layout>
    )
}

export default CodReportsPage;
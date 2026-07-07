import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import {getCODIndicators, getCodReportsExcel} from "@/services/codReports";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import CodReportsList from "./components/CodReportsList";
import styles from "./styles.module.scss";
import Button from "@/components/Button/Button";
import { CODIndicatorsType, CODIndicatorType } from "@/types/codReports";
import { formatDateToString, getLastFewDays } from "@/utils/date";
import CODIndicatorsCard from "@/screens/CodReportsPage/components/CODIndicators";
import Loader from "@/components/Loader";
import useTourGuide from "@/context/tourGuideContext";
import { TourGuidePages } from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {
    tourGuideStepsCodReports,
    tourGuideStepsCodReportsNoDocs
} from "./codReportTourGuideSteps.constants";
import { sendUserBrowserInfo } from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import Select from "@/components/FormBuilder/Select/SelectField";
import {usePagedListState, usePagedData} from "@/components/PagedList";
import { toast } from "react-toastify";
import { CodReportType } from "@/types/codReports";
import {base64ToBlob} from "@/utils/files";

const CodReportsPage = () => {
    const { tenantData: { alias } } = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList } = useAuth();

    const {
        state,
        updatePeriod,
        updateSearch,
        updatePage,
        updatePageSize,
        updateSort,
    } = usePagedListState(
        {},
        {
            defaultPageSize: 10,
            defaultDateRange: { startDate: getLastFewDays(new Date(), 30), endDate: new Date() },
            defaultSortBy: 'date',
            defaultSortOrder: 'desc',
        }
    );

    // ── Paginated COD report list ───────────────────────────────────────────
    const {
        data: codReports,
        count: totalCodReports,
        isLoading: isLoadingCodReports,
        isPreviousData,
    } = usePagedData<CodReportType>(
        '/GetPagesCODReportsList',
        state,
        { token, alias, ui, enabled: !!token }
    );

    const isLoading = isLoadingCodReports;
    const isFirstLoad = isLoading && !isPreviousData;

    const [CODIndicators, setCODIndicators] = useState<CODIndicatorsType | null>(null);
    const [CODIndicatorsBySeller, setCODIndicatorsBySeller] = useState<CODIndicatorsType | null>(null);

    useEffect(() => {
        const fetchIndicators = async () => {
            try {
                const requestData = {
                    token: token,
                    alias,
                    startDate: formatDateToString(new Date(state.startDate)),
                    endDate: formatDateToString(new Date(state.endDate)),
                };

                try {
                    sendUserBrowserInfo({ ...getBrowserInfo('GetCODIndicators', AccessObjectTypes["Finances/CODReports"], AccessActions.View), body: superUser && ui ? { ...requestData, ui } : requestData })
                } catch { }

                if (!isActionIsAccessible(AccessObjectTypes["Finances/CODReports"], AccessActions.View)) {
                    setCODIndicators({
                        "currentAmount": [{ "amount": 0, "currency": "EUR" }],
                        "monthAmount": [{ "amount": 0, "currency": "EUR" }],
                        "yearAmount": [{ "amount": 0, "currency": "EUR" }]
                    });
                    return null;
                }

                const res = await getCODIndicators(superUser && ui ? { ...requestData, ui } : requestData);

                if (res && "data" in res) {
                    setCODIndicators(res.data);
                } else {
                    console.error("API did not return expected data");
                }
            } catch (error) {
                console.error("Error fetching COD indicators:", error);
            }
        };

        if (token && state.startDate && state.endDate) fetchIndicators();
    }, [token, state.startDate, state.endDate]);

    const [selectedSeller, setSelectedSeller] = useState<string>('All sellers');
    const sellersOptions = useMemo(() => {
        return [{ label: 'All sellers', value: 'All sellers' }, ...sellersList.map(item => ({ ...item }))];
    }, [sellersList]);

    const handleSelectedSellerChange = useCallback((seller: string) => {
        setSelectedSeller(seller);
    }, []);

    const getSumOfIndicators = useCallback((indicatorsArray: CODIndicatorType[]) => {
        let indicators = indicatorsArray;
        if (needSeller && selectedSeller && selectedSeller !== 'All sellers') {
            indicators = indicatorsArray.filter(item => item?.seller === selectedSeller);
        }
        const currency = Array.from(new Set(indicators.map(item => item.currency))).sort();
        return currency.map(currency => {
            const f = indicators.filter(item => item.currency === currency);
            const sum = f.reduce((acc, item) => acc + item.amount, 0);
            return { currency, amount: sum };
        })
    }, [needSeller(), selectedSeller]);

    const getFilteredIndicators = (data: CODIndicatorsType) => ({
        "currentAmount": getSumOfIndicators(data?.currentAmount || []),
        "monthAmount": getSumOfIndicators(data?.monthAmount || []),
        "yearAmount": getSumOfIndicators(data?.yearAmount || []),
    });

    useEffect(() => {
        setCODIndicatorsBySeller(getFilteredIndicators(CODIndicators));
    }, [selectedSeller, CODIndicators]);

    const handleExportXLS = async () => {
        try {
            sendUserBrowserInfo({ ...getBrowserInfo('ExportCodReportsList', AccessObjectTypes["Finances/CODReports"], AccessActions.ExportList), body: { startDate: state.startDate, endDate: state.endDate } });
        } catch { }

        if (!isActionIsAccessible(AccessObjectTypes["Finances/CODReports"], AccessActions.ExportList)) {
            return;
        }

        // toast.info('Export is coming soon — endpoint not yet confirmed.', { autoClose: 3000 });
        const toastId = toast.loading('Downloading COD reports...', { className: 'download-toast', closeButton: true });

        const handleError = (errorMsg: string, error?: any) => {
            console.error("Export failed", error || new Error(errorMsg));
            toast.dismiss(toastId);
            toast.error(errorMsg, { autoClose: 3000 });
        };

        try {
            const res = await getCodReportsExcel({
                token,
                alias,
                ui,
                startDate: state.startDate,
                endDate: state.endDate,
                // filter: processFiltersForApi(state.filters as Record<string, FilterValue>) as any,
                search: state.search,
                fullTextSearch: state.fullTextSearch,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder
            });

            if (res && (res as any).isAxiosError) {
                return handleError((res as any).response?.data?.errorMessage || "Failed to download file", res);
            }

            if (res && res.data) {
                if ((res.data as any).errorMessage) {
                    return handleError((res.data as any).errorMessage);
                }
                const attachedFile = res.data;
                const blob = base64ToBlob(attachedFile.data, attachedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                //ensure extension exists and append unique timestamp to bypass OS "Save As/Overwrite" dialogs
                let downloadName = attachedFile.name || "COD-reports.xlsx";

                const parts = downloadName.split('.');
                const ext = parts.length > 1 ? parts.pop() || 'xlsx' : 'xlsx';
                const baseName = parts.length > 0 ? parts.join('.') : downloadName;

                const finalExt = ext.toLowerCase().startsWith('xls') ? ext : 'xlsx';
                a.download = `${baseName}.${finalExt}`;

                setTimeout(() => {
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => window.URL.revokeObjectURL(url), 100);
                }, 100);

                toast.dismiss(toastId);
                toast.success('File downloaded successfully!', { autoClose: 2000 });
            } else {
                return handleError("Empty response");
            }
        } catch (error: any) {
            handleError(typeof error?.message === 'string' ? error.message : 'Failed to download file', error);
        }
    };

    // ── Tour guide ──────────────────────────────────────────────────────────
    const { runTour, setRunTour, isTutorialWatched } = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.CodReports)) {
            if (!isLoading && codReports && codReports.length > 0) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading, codReports]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(codReports?.length ? tourGuideStepsCodReports : tourGuideStepsCodReportsNoDocs);
    }, [codReports]);

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='COD reports' description='Our COD reports page' />
            <div className={styles['cod-reports__container']}>
                {isFirstLoad && <Loader />}
                <Header pageTitle='COD reports' toRight needTutorialBtn >
                    <Button classNames='export-file' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
                </Header>
                {needSeller() ?
                    <div className='seller-filter-block under-header-seller-filter'>
                        <Select
                            key='seller-filter'
                            name='selectedSeller'
                            label='Seller: '
                            value={selectedSeller}
                            onChange={(val) => { handleSelectedSellerChange(val as string) }}
                            options={sellersOptions}
                            classNames='seller-filter seller-filter--with-inactive-options full-sized'
                            isClearable={false}
                        />
                    </div>
                    : null
                }
                {CODIndicatorsBySeller ? (
                    <div className={`grid-row ${styles['indicator-info-block']} has-cards-block`}>
                        {CODIndicatorsBySeller.yearAmount ? (
                            <div className={`width-33 ${styles['grid-col-33']}`}>
                                <CODIndicatorsCard title={"Year to date"} type="amount" indicatorsArray={CODIndicatorsBySeller.yearAmount} classNames='year' />
                            </div>
                        ) : null}
                        {CODIndicatorsBySeller.monthAmount ? (
                            <div className={`width-33 ${styles['grid-col-33']}`}>
                                <CODIndicatorsCard title={"Month to date"} type="amount" indicatorsArray={CODIndicatorsBySeller.monthAmount} classNames='month' />
                            </div>
                        ) : null}
                        {CODIndicatorsBySeller.currentAmount ? (
                            <div className={`width-33 ${styles['grid-col-33']}`}>
                                <CODIndicatorsCard title={"Current period"} type="amount" indicatorsArray={CODIndicatorsBySeller.currentAmount} classNames='current' />
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {codReports && (
                    <CodReportsList
                        codReports={codReports}
                        isLoading={isPreviousData}
                        totalCodReports={totalCodReports}
                        currentPage={state.page}
                        pageSize={state.limit}
                        searchTerm={state.search}
                        sortBy={state.sortBy}
                        sortOrder={state.sortOrder}
                        onPageChange={updatePage}
                        onPageSizeChange={updatePageSize}
                        onSearchChange={updateSearch}
                        onSortChange={updateSort}
                        selectedSeller={selectedSeller}
                        startDate={state.startDate}
                        endDate={state.endDate}
                        onPeriodChange={updatePeriod}
                    />
                )}
            </div>
            {codReports !== null && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.CodReports} /> : null}
        </Layout>
    )
}

export default CodReportsPage;
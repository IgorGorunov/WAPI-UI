import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes } from "@/types/auth";
import {getInvoicesDebts, getInvoicesExcel} from "@/services/invoices";
import Layout from "@/components/Layout/Layout";
import Header from '@/components/Header';
import InvoiceList from "./components/InvoiceList";
import styles from "./styles.module.scss";
import Button from "@/components/Button/Button";
import { BalanceInfoType, InvoiceBalanceType, InvoiceType } from "@/types/invoices";
import { getLastFewDays, } from "@/utils/date";
import BalanceInfoCard from "@/screens/InvoicesPage/components/BalanceInfoCard";
import Loader from "@/components/Loader";
import useTourGuide from "@/context/tourGuideContext";
import { TourGuidePages } from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import { tourGuideStepsInvoices, tourGuideStepsInvoicesNoDocs } from "./invoicesTourGuideSteps.constants";
import { sendUserBrowserInfo } from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import Select from "@/components/FormBuilder/Select/SelectField";
import {usePagedListState, usePagedData, processFiltersForApi, FilterValue} from "@/components/PagedList";
import { toast } from "react-toastify";
import { InvoiceFilters } from "./types";
import {base64ToBlob} from "@/utils/files";

import { useFilterMetadata } from "@/components/PagedList";
import { InvoiceFilterDataType } from "@/types/invoices";

const InvoicesPage = () => {
    const { tenantData: { alias } } = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList } = useAuth();

    const {
        state,
        updatePeriod,
        updateFilters,
        updateSearch,
        updatePage,
        updatePageSize,
        updateSort,
        clearAllFilters,
    } = usePagedListState<InvoiceFilters>(
        {} as Partial<InvoiceFilters>,
        {
            defaultPageSize: 10,
            defaultDateRange: { startDate: getLastFewDays(new Date(), 30), endDate: new Date() },
            defaultSortBy: 'date',
            defaultSortOrder: 'desc',
        }
    );

    // ── Paginated invoice list ──────────────────────────────────────────────
    const {
        data: invoices,
        count: totalInvoices,
        isLoading: isLoadingInvoices,
        isPreviousData,
    } = usePagedData<InvoiceType>(
        '/GetPagedInvoicesList',
        state,
        { token, alias, ui, enabled: !!token }
    );

    const { metadata: filterMetadata, isLoading: isLoadingFilters } = useFilterMetadata<InvoiceFilterDataType>(
        '/GetPagedFiltersInvoicesList',
        { startDate: state.startDate, endDate: state.endDate },
        { token, alias, ui, enabled: !!token }
    );

    const isLoading = isLoadingInvoices || isLoadingFilters;
    const isFirstLoad = isLoading && !isPreviousData;

    const [invoiceBalance, setInvoiceBalance] = useState<InvoiceBalanceType | null>(null);
    const [invoiceBalanceBySeller, setInvoiceBalanceBySeller] = useState<InvoiceBalanceType | null>(null);

    useEffect(() => {
        const fetchDebtData = async () => {
            try {
                const requestData = { token: token, alias };

                try {
                    sendUserBrowserInfo({ ...getBrowserInfo('GetInvoicesDebt', AccessObjectTypes["Finances/Invoices"], AccessActions.View), body: superUser && ui ? { ...requestData, ui } : requestData })
                } catch { }

                if (!isActionIsAccessible(AccessObjectTypes["Finances/Invoices"], AccessActions.View)) {
                    setInvoiceBalance({
                        "overdueLimit": [{ "limit": 0, "currency": "EUR" }],
                        "overdue": [{ "overdue": 0, "currency": "EUR" }],
                        "debt": [{ "debt": 0, "currency": "EUR" }]
                    } as any);
                    return;
                }

                const res = await getInvoicesDebts(superUser && ui ? { ...requestData, ui } : requestData);

                if (res && "data" in res) {
                    setInvoiceBalance(res.data);
                } else {
                    console.error("API did not return expected data");
                }
            } catch (error) {
                console.error("Error fetching debt data:", error);
            }
        };

        if (token) fetchDebtData();
    }, [token]);

    const [selectedSeller, setSelectedSeller] = useState<string>('All sellers');
    const sellersOptions = useMemo(() => {
        return [{ label: 'All sellers', value: 'All sellers' }, ...sellersList.map(item => ({ ...item }))];
    }, [sellersList]);

    const handleSelectedSellerChange = useCallback((seller: string) => {
        setSelectedSeller(seller);
    }, []);

    const getSumOfIndicators = useCallback((indicatorsArray: BalanceInfoType[]) => {
        let indicators = indicatorsArray;
        if (needSeller && selectedSeller && selectedSeller !== 'All sellers') {
            indicators = indicatorsArray.filter(item => item?.seller === selectedSeller);
        }
        const currency = Array.from(new Set(indicators.map(item => item.currency))).sort();
        return currency.map(currency => {
            const f = indicators.filter(item => item.currency === currency);
            const debt = f.reduce((acc, item) => acc + (item.debt || 0), 0);
            const overdue = f.reduce((acc, item) => acc + (item.overdue || 0), 0);
            const limit = f.reduce((acc, item) => acc + (item.limit || 0), 0);
            return { currency, debt, overdue, limit };
        })
    }, [needSeller(), selectedSeller]);

    const getFilteredIndicators = (data: InvoiceBalanceType) => ({
        "debt": getSumOfIndicators(data?.debt || []),
        "overdue": getSumOfIndicators(data?.overdue || []),
        "overdueLimit": getSumOfIndicators(data?.overdueLimit || []),
    });

    useEffect(() => {
        setInvoiceBalanceBySeller(getFilteredIndicators(invoiceBalance));
    }, [selectedSeller, invoiceBalance]);

    const handleExportXLS = () => {
        try {
            sendUserBrowserInfo({ ...getBrowserInfo('ExportInvoicesList', AccessObjectTypes["Finances/Invoices"], AccessActions.ExportList), body: { startDate: state.startDate, endDate: state.endDate } });
        } catch { }

        if (!isActionIsAccessible(AccessObjectTypes["Finances/Invoices"], AccessActions.ExportList)) {
            return;
        }

        // toast.info('Export is coming soon — endpoint not yet confirmed.', { autoClose: 3000 });
        const exportPromise = async () => {
            const res = await getInvoicesExcel({
                token,
                alias,
                ui,
                startDate: state.startDate,
                endDate: state.endDate,
                filter: processFiltersForApi(state.filters as Record<string, FilterValue>) as any,
                search: state.search,
                fullTextSearch: state.fullTextSearch,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder
            });

            if (res && res.data) {
                const attachedFile = res.data;
                const blob = base64ToBlob(attachedFile.data, attachedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                //ensure extension exists and append unique timestamp to bypass OS "Save As/Overwrite" dialogs
                let downloadName = attachedFile.name || "Invoices.xlsx";

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
            } else {
                throw new Error("Empty response");
            }
        };

        try {
            toast.promise(
                exportPromise(),
                {
                    pending: 'Downloading Invoices...',
                    success: {
                        render: 'File downloaded successfully!',
                        autoClose: 2000 //disappear in 2 seconds
                    },
                    error: 'Failed to download file'
                },
                {
                    className: 'download-toast'
                }
            );
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    const { runTour, setRunTour, isTutorialWatched } = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Invoices)) {
            if (!isLoading && invoices && invoices.length > 0) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading, invoices]);

    const [steps, setSteps] = useState([]);
    useEffect(() => {
        setSteps(invoices?.length ? tourGuideStepsInvoices : tourGuideStepsInvoicesNoDocs);
    }, [invoices]);

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Invoices' description='Our Invoices page' />
            <div className={styles['invoices__container']}>
                {isFirstLoad && <Loader />}
                <Header pageTitle='Invoices' toRight needTutorialBtn >
                    <Button classNames='export-invoices' icon="download-file" iconOnTheRight onClick={handleExportXLS}>Export list</Button>
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
                {invoiceBalance ? (
                    <div className={`grid-row ${styles['balance-info-block']} has-cards-block`}>
                        {invoiceBalanceBySeller.debt ? (
                            <div className={`width-33 ${styles['grid-col-33']}`}>
                                <BalanceInfoCard title={"Total debt"} type="debt" balanceArray={invoiceBalanceBySeller.debt} />
                            </div>
                        ) : null}
                        {invoiceBalanceBySeller.overdue ? (
                            <div className={`width-33 ${styles['grid-col-33']}`}>
                                <BalanceInfoCard title={"Overdue"} type="overdue" balanceArray={invoiceBalanceBySeller.overdue} />
                            </div>
                        ) : null}
                        {invoiceBalanceBySeller.overdueLimit ? (
                            <div className={`width-33 ${styles['grid-col-33']}`}>
                                <BalanceInfoCard title={"Overdue limit"} type="limit" balanceArray={invoiceBalanceBySeller.overdueLimit} />
                            </div>
                        ) : null}
                    </div>
                ) : null}
                {invoices && (
                    <InvoiceList
                        invoices={invoices}
                        isLoading={isPreviousData}
                        totalInvoices={totalInvoices}
                        filterMetadata={filterMetadata}
                        currentPage={state.page}
                        pageSize={state.limit}
                        searchTerm={state.search}
                        fullTextSearch={state.fullTextSearch}
                        sortBy={state.sortBy}
                        sortOrder={state.sortOrder}
                        selectedFilters={state.filters}
                        onPageChange={updatePage}
                        onPageSizeChange={updatePageSize}
                        onSearchChange={updateSearch}
                        onSortChange={updateSort}
                        onFiltersChange={updateFilters}
                        onClearFilters={clearAllFilters}
                        selectedSeller={selectedSeller}
                        startDate={state.startDate}
                        endDate={state.endDate}
                        onPeriodChange={updatePeriod}
                    />
                )}
            </div>
            {invoices !== null && runTour && steps ? <TourGuide steps={steps} run={runTour} pageName={TourGuidePages.Invoices} /> : null}
        </Layout>
    )
}

export default InvoicesPage;
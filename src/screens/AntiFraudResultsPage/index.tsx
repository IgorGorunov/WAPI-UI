import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import Button from "@/components/Button/Button";
import SearchField from "@/components/SearchField";
import SeoHead from "@/components/SeoHead";
import DateInput from "@/components/DateInput";
import useAuth from "@/context/authContext";
import useTenant from "@/context/tenantContext";
import { DateRangeType } from "@/types/dashboard";
import {
    getLastFewDays,
    formatDateToString,
} from "@/utils/date";
import { getAntiFraudResultList, getAntiFraudResultDetails } from "@/services/antiFraud";
import {
    AntiFraudResultType,
    AntiFraudResultObject,
    AntiFraudResultDetailsCache,
} from "./types";
import ResultsTable from "./components/ResultsTable";
import ResultDetailsModal from "./components/ResultDetailsModal";
import PhoneCheckModal from "./components/PhoneCheckModal";
import styles from "./styles.module.scss";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import { FormFieldTypes } from "@/types/forms";
import SearchContainer from "@/components/SearchContainer";
import {sendUserBrowserInfo} from "@/services/userInfo";
import {AccessActions, AccessObjectTypes} from "@/types/auth";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";

const AntiFraudResultsPage = () => {
    const { tenantData: { alias } } = useTenant();
    const { token, ui, isActionIsAccessible, getBrowserInfo } = useAuth();

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) })
    const closeErrorModal = useCallback(() => {
        setShowStatusModal(false);
    }, [])

    const [currentPeriod, setCurrentPeriod] = useState<DateRangeType>({
        startDate: getLastFewDays(new Date(), 30),
        endDate: new Date(),
    });

    const [allResults, setAllResults] = useState<AntiFraudResultType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    const [fullTextSearch, setFullTextSearch] = useState(false);
    const handleFullTextSearchChange = () => {
        setFullTextSearch(prevState => !prevState);
        if (searchTerm) {
            setCurrentPage(1);
        }
    };
    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearch',
        label: 'Full text search',
        checked: fullTextSearch,
        onChange: handleFullTextSearchChange,
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [sortColumn, setSortColumn] = useState<keyof AntiFraudResultType>("requestPeriod");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const detailCache = useRef<AntiFraudResultDetailsCache>({});

    const [selectedRow, setSelectedRow] = useState<AntiFraudResultType | null>(null);
    const [modalDetail, setModalDetail] = useState<AntiFraudResultObject | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

    const [canViewList, setCanViewList] = useState(false);

    useEffect(() => {
        setCanViewList(isActionIsAccessible('AntiFraud/Results', AccessActions.ListView));
    }, [token, ui]);

    const fetchResults = useCallback(async () => {
        if (!token || !alias) return;

        const requestData = {
            token,
            alias,
            ui,
            startDate: formatDateToString(currentPeriod.startDate),
            endDate: formatDateToString(currentPeriod.endDate),
        };

        try {
            sendUserBrowserInfo({ ...getBrowserInfo('GetAntiFraudResultsList'), body: requestData })
        } catch { }

        try {
            setIsLoading(true);
            setAllResults([]);

            const res = await getAntiFraudResultList(requestData);

            if (res && "data" in res && res.data) {
                const raw = res.data;
                // Handle both array and { data: [] } response shapes
                const list: AntiFraudResultType[] = Array.isArray(raw)
                    ? raw
                    : (raw as any).data ?? [];
                setAllResults(list.map(item=>({...item, numberForDisplay: item.shipmentOrder==='None' ? item.phoneNumber : item.shipmentOrder })));
            } else {
                setAllResults([]);
            }
        } catch (err) {
            console.error("Error fetching AntiFraud results:", err);
            setAllResults([]);
        } finally {
            setIsLoading(false);
        }
        setCurrentPage(1);
    }, [token, alias, ui, currentPeriod]);

    useEffect(() => {
        if (!canViewList) return;
        fetchResults();
    }, [token, currentPeriod, canViewList]);

    const filteredResults = useMemo<AntiFraudResultType[]>(() => {
        const term = appliedSearch.trim().toLowerCase();

        return allResults
            .filter(row => {
                if (!term) return true;
                
                return Object.keys(row).some(key => {
                    const value = (row as any)[key];
                    if (key !== 'uuid' && value !== null && value !== undefined) {
                        const stringValue = typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
                        const searchTermsArray = term.split(' ');

                        if (fullTextSearch) {
                            return searchTermsArray.every(word => stringValue.includes(word));
                        } else {
                            return searchTermsArray.some(word => stringValue.includes(word));
                        }
                    }
                    return false;
                });
            })
            .sort((a, b) => {
                const av = a[sortColumn];
                const bv = b[sortColumn];
                const cmp = av > bv ? 1 : av < bv ? -1 : 0;
                return sortDirection === "asc" ? cmp : -cmp;
            });
    }, [allResults, appliedSearch, fullTextSearch, sortColumn, sortDirection]);

    const pagedResults = useMemo<AntiFraudResultType[]>(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredResults.slice(start, start + pageSize);
    }, [filteredResults, currentPage, pageSize]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        if (!value) {
            setAppliedSearch("");
            setCurrentPage(1);
        }
    };

    const handleSearchExecute = (value: string) => {
        setAppliedSearch(value);
        setCurrentPage(1);
    };

    const handleSearchClear = () => {
        setSearchTerm("");
        setAppliedSearch("");
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const handleSortChange = (col: string, dir: "asc" | "desc") => {
        setSortColumn(col as keyof AntiFraudResultType);
        setSortDirection(dir);
        setCurrentPage(1);
    };

    const handleRowClick = useCallback(async (uuid: string) => {

        if (!isActionIsAccessible('AntiFraud/Results', AccessActions.View)) {
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('ViewResultDetails', AccessObjectTypes["AntiFraud/Results"], AccessActions.View), body: {token, ui, alias, uuid } });
            } catch { }

            setModalStatusInfo({
                statusModalType: STATUS_MODAL_TYPES.ERROR,
                title: "Warning",
                subtitle: `You have limited access to this action`,
                onClose: closeErrorModal
            });
            setShowStatusModal(true);
            return;
        }

        const row = allResults.find(r => r.uuid === uuid) ?? null;
        setSelectedRow(row);
        setDetailError(null);

        try {
            sendUserBrowserInfo({ ...getBrowserInfo('GetAntiFraudResult'), body: {token, alias, ui, uuid} })
        } catch { }

        // Cache hit
        if (detailCache.current[uuid]) {
            setModalDetail(detailCache.current[uuid]);
            console.log('Cache hit for UUID:', uuid);
            return;
        }

        // Cache miss — fetch from backend
        setModalDetail(null);
        setIsLoadingDetail(true);

        try {
            const response = await getAntiFraudResultDetails({ token, alias, ui, uuid });
            console.log('Response details:', response);
            if (response?.data) {
                const parsed: AntiFraudResultObject =
                    typeof response.data === "string"
                        ? JSON.parse(response.data)
                        : response.data;

                detailCache.current[uuid] = parsed;
                setModalDetail(parsed);
                console.log('Parsed details:', parsed);
            } else {
                setDetailError("No detail data returned from the server.");
            }
        } catch (err) {
            console.error("Failed to fetch AntiFraud result details:", err);
            setDetailError("Failed to load details. Please try again.");
        } finally {
            setIsLoadingDetail(false);
        }
    }, [allResults, token, alias, ui]);

    const handleCloseModal = useCallback(() => {
        setSelectedRow(null);
        setModalDetail(null);
        setDetailError(null);
    }, []);

    const handleCheckPhoneNumber = () => {
        if (!isActionIsAccessible('AntiFraud/PhoneChecker', AccessActions.View)) {
            setModalStatusInfo({
                statusModalType: STATUS_MODAL_TYPES.ERROR,
                title: "Warning",
                subtitle: `You have limited access to this action`,
                onClose: closeErrorModal
            });
            setShowStatusModal(true);
            return;
        }

        setIsPhoneModalOpen(true);
    };

    const handlePhoneCheckSuccess = (data: AntiFraudResultType) => {
        setIsPhoneModalOpen(false);

        setSelectedRow(data);
        setModalDetail(data?.result);
        fetchResults();
    };

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title="WAPI Checker Results" description="WAPI Checker monitoring results" />

            <div className={`page-component ${styles["anti-fraud-results-page"]}`}>
                {/*{isLoading && <Loader />}*/}

                <Header pageTitle="WAPI Checker Results" toRight >
                    <Button icon="biggest-check" iconOnTheRight={true} onClick={handleCheckPhoneNumber}>Check phone</Button>
                </Header>

                <SearchContainer>
                    {/*<Button type="button" disabled={false} onClick={() => setIsFiltersVisible(prev => !prev)} variant={ButtonVariant.FILTER} icon={'filter'}></Button>*/}

                    <DateInput
                        currentRange={currentPeriod}
                        handleRangeChange={(newRange: DateRangeType) => {
                            setCurrentPeriod(newRange);
                            setCurrentPage(1);
                        }}
                    />


                    <div className='search-block'>
                        <SearchField
                            searchTerm={searchTerm}
                            handleChange={handleSearchChange}
                            handleSearch={handleSearchExecute}
                            handleClear={handleSearchClear}
                            manualSearch={true}
                        />
                        <FieldBuilder {...fullTextSearchField} />
                    </div>
                </SearchContainer>

                <ResultsTable
                    results={pagedResults}
                    isLoading={isLoading}
                    totalCount={filteredResults.length}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    sortBy={sortColumn}
                    sortOrder={sortDirection}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    onSortChange={handleSortChange}
                    onRowClick={handleRowClick}
                />
            </div>

            {isPhoneModalOpen && (
                <PhoneCheckModal 
                    onClose={() => setIsPhoneModalOpen(false)} 
                    onSuccess={handlePhoneCheckSuccess} 
                />
            )}

            {selectedRow && modalDetail && (
                <ResultDetailsModal
                    row={selectedRow}
                    detail={modalDetail}
                    isLoading={isLoadingDetail}
                    error={detailError}
                    onClose={handleCloseModal}
                    hasOrder={selectedRow.shipmentOrder !== "None" && !!selectedRow.shipmentOrder}
                />
            )}
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </Layout>
    );
};

export default AntiFraudResultsPage;

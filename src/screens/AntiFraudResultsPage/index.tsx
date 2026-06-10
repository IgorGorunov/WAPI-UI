import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import Button, {ButtonVariant} from "@/components/Button/Button";
import SearchField from "@/components/SearchField";
import SeoHead from "@/components/SeoHead";
import DateInput from "@/components/DateInput";
import useAuth from "@/context/authContext";
import useTenant from "@/context/tenantContext";
import {DateRangeType} from "@/types/dashboard";
import {formatDateToString, getLastFewDays,} from "@/utils/date";
import {getAntiFraudResultDetails, getAntiFraudResultList} from "@/services/antiFraud";
import {AntiFraudResultDetailsCache, AntiFraudResultObject, AntiFraudResultType,} from "./types";
import ResultsTable from "./components/ResultsTable";
import ResultDetailsModal from "./components/ResultDetailsModal";
import PhoneCheckModal from "./components/PhoneCheckModal";
import styles from "./styles.module.scss";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormFieldTypes} from "@/types/forms";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import {sendUserBrowserInfo} from "@/services/userInfo";
import {AccessActions, AccessObjectTypes} from "@/types/auth";
import {FILTER_TYPE, STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {FilterComponentType} from "@/types/filters";
import {ZONE_COLORS} from "@/screens/AntiFraudSettingsPage/types";

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

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [isOpenFilterZone, setIsOpenFilterZone] = useState(false);
    const [filterZone, setFilterZone] = useState<string[]>([]);
    
    const [isOpenFilterSuccessPercent, setIsOpenFilterSuccessPercent] = useState(false);
    const [filterSuccessPercent, setFilterSuccessPercent] = useState<string[]>([]);

    const [appliedFilterZone, setAppliedFilterZone] = useState<string[]>([]);
    const [appliedFilterSuccessPercent, setAppliedFilterSuccessPercent] = useState<string[]>([]);

    const calcFilterAmount = useCallback((property: keyof AntiFraudResultType, value: string) => {
        return allResults.filter(row => row[property] === value).length || 0;
    }, [allResults]);

    const transformedZones = useMemo(() => {
        const uniqueZones = Array.from(new Set(allResults.map(r => r.zone)));
        return uniqueZones.map(zone => ({
            value: zone,
            label: zone,
            color: ZONE_COLORS[zone as keyof typeof ZONE_COLORS] || "#7D8FB3",
            amount: calcFilterAmount('zone', zone)
        }));
    }, [allResults, calcFilterAmount]);

    const handleFilterZoneChange = (newZones: string[]) => {
        setFilterZone(newZones);
    };

    const handleFilterSuccessPercentChange = (newRange: string[]) => {
        setFilterSuccessPercent(newRange);
    };

    const applyFilters = () => {
        setAppliedFilterZone(filterZone);
        setAppliedFilterSuccessPercent(filterSuccessPercent);
        setCurrentPage(1);
    };

    const handleClearAllFilters = () => {
        setFilterZone([]);
        setFilterSuccessPercent([]);
        setAppliedFilterZone([]);
        setAppliedFilterSuccessPercent([]);
        setCurrentPage(1);
    };

    const hasUnappliedChanges = useMemo(() => {
        if (filterZone.length !== appliedFilterZone.length) return true;
        if (filterZone.some(z => !appliedFilterZone.includes(z))) return true;

        if (filterSuccessPercent.length !== appliedFilterSuccessPercent.length) return true;
        if (filterSuccessPercent.some((v, i) => v !== appliedFilterSuccessPercent[i])) return true;

        return false;
    }, [filterZone, appliedFilterZone, filterSuccessPercent, appliedFilterSuccessPercent]);

    const isOnlyBasic = allResults.length > 0 && allResults.every(r => r.subscription === 'Basic' || r.subscription === 'basic');

    const antiFraudFilters: FilterComponentType[] = [
        {
            filterTitle: 'Zone',
            icon: 'issue',
            filterDescriptions: '',
            filterOptions: transformedZones,
            filterState: filterZone,
            filterType: FILTER_TYPE.COLORED_TEXT,
            setFilterState: handleFilterZoneChange,
            isOpen: isOpenFilterZone,
            setIsOpen: setIsOpenFilterZone,
            onClose: () => handleFilterZoneChange([]),
            onClick: () => { setIsFiltersVisible(true); setIsOpenFilterZone(true); },
            isFiltersVisible: isFiltersVisible,
        },
        ...(isOnlyBasic ? [] : [{
            filterTitle: 'Buyout %',
            icon: 'status',
            filterType: FILTER_TYPE.SLIDER,
            filterDescriptions: '',
            filterOptions: [{ value: '0', label: '0' }, { value: '100', label: '100' }],
            filterState: filterSuccessPercent,
            setFilterState: handleFilterSuccessPercentChange,
            isOpen: isOpenFilterSuccessPercent,
            setIsOpen: setIsOpenFilterSuccessPercent,
            onClose: () => handleFilterSuccessPercentChange([]),
            onClick: () => { setIsFiltersVisible(true); setIsOpenFilterSuccessPercent(true); },
            isFiltersVisible: isFiltersVisible,
        } as FilterComponentType])
    ];

    const appliedAntiFraudFilters = antiFraudFilters.map(filter => {
        if (filter.filterTitle === 'Zone') return { ...filter, filterState: appliedFilterZone, onClose: () => { setFilterZone([]); setAppliedFilterZone([]); setCurrentPage(1); } };
        if (filter.filterTitle === 'Buyout %') return { ...filter, filterState: appliedFilterSuccessPercent, onClose: () => { setFilterSuccessPercent([]); setAppliedFilterSuccessPercent([]); setCurrentPage(1); } };
        return filter;
    });

    const isFiltersChosenVisible = appliedFilterZone.length > 0 || appliedFilterSuccessPercent.length > 0;

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
            .filter(row => {
                return !appliedFilterZone.length || appliedFilterZone.includes(row.zone);
            })
            .filter(row => {
                if (!appliedFilterSuccessPercent.length) return true;
                const percent = row.subscription === 'Basic' ? -1 : row.successfullPercent ?? 0;
                const min = Number(appliedFilterSuccessPercent[0]);
                const max = Number(appliedFilterSuccessPercent[1]);
                return percent >= min && percent <= max;
            })
            .sort((a, b) => {
                const av = a[sortColumn];
                const bv = b[sortColumn];
                const cmp = av > bv ? 1 : av < bv ? -1 : 0;
                return sortDirection === "asc" ? cmp : -cmp;
            });
    }, [allResults, appliedSearch, fullTextSearch, sortColumn, sortDirection, appliedFilterZone, appliedFilterSuccessPercent]);

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

    const [canCheckPhoneNumber, setCanCheckPhoneNumber] = useState(false);
    useEffect(() => {
        setCanCheckPhoneNumber(isActionIsAccessible('AntiFraud/PhoneChecker', AccessActions.View))
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
                    {canCheckPhoneNumber ? <Button icon="biggest-check" iconOnTheRight={true} onClick={handleCheckPhoneNumber}>Check phone</Button> : null}
                </Header>

                <SearchContainer>
                    <Button type="button" disabled={false} onClick={() => setIsFiltersVisible(prev => !prev)} variant={ButtonVariant.FILTER} icon={'filter'}></Button>

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
                    filters={appliedAntiFraudFilters}
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

            <FiltersContainer
                isFiltersVisible={isFiltersVisible}
                setIsFiltersVisible={setIsFiltersVisible}
                onClearFilters={handleClearAllFilters}
                onApplyFilters={applyFilters}
                hasUnappliedChanges={hasUnappliedChanges}
            >
                <FiltersListWithOptions filters={antiFraudFilters} />
            </FiltersContainer>

            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </Layout>
    );
};

export default AntiFraudResultsPage;

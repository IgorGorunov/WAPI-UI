import React, {useCallback, useEffect, useMemo, useState} from "react";
import useAuth, {AccessActions} from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import "./styles.scss";
import {getReportData, getReportParams} from "@/services/reports";
import {
    REPORT_TITLES,
    REPORT_TYPES,
    ReportParametersType,
} from "@/types/reports";
import Loader from "@/components/Loader";
import Button, {ButtonVariant} from "@/components/Button/Button";
import DateInput from "@/components/DateInput";
import SearchField from "@/components/SearchField";
import SearchContainer from "@/components/SearchContainer";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {DateRangeType} from "@/types/dashboard";
import FiltersContainer from "@/components/FiltersContainer";
import ReportTable from "./ReportTable";
import RadioButton from "@/components/FormBuilder/RadioButton";
import {
    getVariantByReportType,
    getVariantDimensionColsByReportType,
    getVariantDimensionNumberByReportType,
    getVariantGroupColsByReportType,
    getVariantOptionsByReportType,
    getVariantResourceColsByReportType,
    getVariantSortingColsByReportType,
    isFilterVisibleByReportType, transformReportType
} from "./utils";

import {Countries} from "@/types/countries";
import RadioSwitch from "@/components/FormBuilder/RadioSwitch";
import Icon from "@/components/Icon";
import {Tooltip} from "antd";
import {aggregateTableData} from "@/utils/aggregateTable";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {tourGuideStepsReports, tourGuideStepsReportsWithoutVariants} from "./reportTourGuideSteps.constants";
import {sendUserBrowserInfo} from "@/services/userInfo";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import SelectField from "@/components/FormBuilder/Select/SelectField";

type ReportPagePropType = {
    reportType: REPORT_TYPES;
}

const ReportPage:React.FC<ReportPagePropType> = ({reportType}) => {
    const Router = useRouter();
    const { tenantData: { alias }} = useTenant();
    const { token, getToken, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList } = useAuth();

    useEffect(() => {
        if (!getToken()) Router.push(Routes.Login);
    }, [token]);

    const [isLoading, setIsLoading] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleBackToReportsPage = () => {
        Router.push(Routes.ReportsList);
    }

    //tour guide
    const {runTour, setRunTour, isReportWatched} = useTourGuide();

    useEffect(() => {
        if (reportType && !isReportWatched(reportType)) {
            if (!isLoading) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading]);

    const today = new Date();
    const firstDay = getLastFewDays(today, 30);
    const [currentRange, setCurrentRange] = useState<DateRangeType>({startDate: firstDay, endDate: today})

    //seller filter
    const getActiveSeller = () => {
        if (sellersList && sellersList.length) {
            const activeSeller = sellersList.filter(item=>!item.inactive);
            return activeSeller.length ? activeSeller[0].value : sellersList[0].value;
        }
        return '';
    }
    const [selectedSeller, setSelectedSeller] = useState<string>(getActiveSeller());


    const sellersOptions = useMemo(()=>{
        return [ ...sellersList.map(item=>({...item}))];
    }, [sellersList]);

    const [isCurrentRangeChanged, setIsCurrentRangeChanged] = useState(true);

    const [noData, setNoData] = useState(true);

    //const [productsOnStocksData, setProductsOnStocksData] = useState<ProductsOnStocksReportType|null>(null)
    const [collapsedData, setCollapsedData] = useState<any|null>(null)

    const [reportParams, setReportParams] = useState<ReportParametersType|null>(null);
    const [reportDataAllSellers, setReportDataAllSellers] = useState<any|null>(null);
    const [reportData, setReportData] = useState<any|null>(null);

    const [resourceColumnNames, setResourceColumnNames] = useState<string[]>([]);

    type ApiResponse = {
        data: any;
    };

    const fetchParamsData = useCallback(async () => {
        try {
            setIsLoading(true);
            const requestData = {token, alias};

            const res: ApiResponse = await getReportParams(superUser && ui ? {...requestData, ui} : requestData);

            if (res.data) {
                setReportParams(res.data);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);

        }
    },[]);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const requestData = {token, alias, reportType, startDate: formatDateToString(currentRange.startDate), endDate: formatDateToString(currentRange.endDate)};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetReportData/'+reportType, transformReportType(reportType), AccessActions.GenerateReport), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(transformReportType(reportType), AccessActions.GenerateReport) ) {
                setReportDataAllSellers(null);
                setReportData(null);
                return;
            }

            const res: any = await getReportData(superUser && ui ? {...requestData, ui} : requestData);

            if (res.data) {
                setReportDataAllSellers(res.data);
                setReportData(needSeller() ? selectedSeller ? res.data.filter(item=>item.seller === selectedSeller): [] : res.data);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token, currentRange, selectedSeller]);

    useEffect(() => {
        fetchParamsData();
    }, [token]);


    // Search and filters
    const [searchTerm, setSearchTerm] = useState('');
    // const [fullTextSearch, setFullTextSearch] = useState(true);
    // const fullTextSearchField = {
    //     fieldType: FormFieldTypes.TOGGLE,
    //     name: 'fullTextSearch',
    //     label: 'Full text search',
    //     checked: fullTextSearch,
    //     onChange: ()=>{setFullTextSearch(prevState => !prevState)},
    //     classNames: 'full-text-search-toggle',
    //     hideTextOnMobile: true,
    // }

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(prevState => !prevState);
    };

    //filters
    const [filterWarehouse, setFilterWarehouse] = useState<string[]>([]);
    const [filterCountry, setFilterCountry] = useState<string[]>([]);

    const {warehouseOptions, countryOptions} = useMemo(() => {
        const warehouses: string[] = [];
        const countries: string[] = [];
        reportParams && reportParams.warehouses.forEach(item => {
            if (!selectedSeller || !needSeller() || selectedSeller && (selectedSeller === 'All sellers' || selectedSeller === item.seller)) {
                countries.push(item.country);
                warehouses.push(item.warehouse);
            }
        });

        const uniqueCountries = Array.from(new Set(countries)).filter(country => country).sort();
        const uniqueWarehouses = Array.from(new Set(warehouses)).filter(warehouse => warehouse).sort();

        let warehouseOptions = [
            ...uniqueWarehouses.map(warehouse => ({
                label: warehouse,
                value: warehouse,
            }))
        ];

        let countryOptions = [
            ...uniqueCountries.map(country => ({
                value: country,
                label: Countries[country] as string || country,
            }))
        ];

        if (reportData && isFilterVisibleByReportType(reportType, 'country')) {
            const reportCountries = reportData.map(item=> item.country.toUpperCase());
            countryOptions = countryOptions.filter(item => reportCountries.includes(item.value.toUpperCase()));
        }
        if (reportData && isFilterVisibleByReportType(reportType, 'warehouse')) {
            const reportWarehouses = reportData.map(item=> item.warehouse.toUpperCase());
            warehouseOptions =  warehouseOptions.filter(item => reportWarehouses.includes(item.value.toUpperCase()));
        }

        return {warehouseOptions, countryOptions}
    }, [reportParams, reportData, reportType, selectedSeller]);

    const [isOpenFilterWarehouse, setIsOpenFilterWarehouse] = useState(false);
    const [isOpenFilterCountry, setIsOpenFilterCountry] = useState(false);

    const [filterCourierService, setFilterCourierService] = useState<string[]>([]);
    const courierServiceOptions = useMemo(()=> {
        const courierServices = reportParams?.courierServices && reportParams.courierServices.length ? reportParams.courierServices.map(item => item) : [];
        const uniqueCourierServices = Array.from(new Set(courierServices)).filter(item => item).sort();
        const courierServicesOptions = [
            ...uniqueCourierServices.map(item => ({
                value: item,
                label: item,
            }))
        ];
        if (reportData && isFilterVisibleByReportType(reportType, 'courierService')) {
            const reportCourierServices = reportData.map(item=> item.courierService.toUpperCase());
            return courierServicesOptions.filter(item => reportCourierServices.includes(item.value.toUpperCase()));
        }
        return courierServicesOptions;
    }, [reportParams, reportData, reportType]);
    const [isOpenFilterCourierService, setIsOpenFilterCourierService] = useState(false);

    const [filterReceiverCountry, setFilterReceiverCountry] = useState<string[]>([]);
    const receiverCountryOptions = useMemo(()=> {
        const receiverCountries = reportParams?.countries && reportParams.countries.length ? reportParams.countries.map(item => item) : [];
        const uniqueReceiverCountries = Array.from(new Set(receiverCountries)).filter(item => item).sort();
        const receiverCountryOptions = [
            ...uniqueReceiverCountries.map(country => ({
                value: country,
                label: Countries[country] as string || country,
            }))
        ];
        if (reportData && isFilterVisibleByReportType(reportType, 'receiverCountry')) {
            const reportReceiverCountries = reportData.map(item=> item.receiverCountryCode.toUpperCase());
            return receiverCountryOptions.filter(item => reportReceiverCountries.includes(item.value.toUpperCase()));
        }



        return receiverCountryOptions;
    }, [reportParams, reportData, reportType]);

    const [isOpenFilterReceiverCountry, setIsOpenFilterReceiverCountry] = useState(false);

    const [filterProduct, setFilterProduct] = useState<string[]>([]);
    const productOptions = useMemo(()=> {
        const products = reportParams?.products && reportParams.products.length ? reportParams.products.filter(item=>!selectedSeller || !needSeller() || selectedSeller && (selectedSeller === 'All sellers' || selectedSeller===item.seller)).map(product => product.name) : [];
        const uniqueProducts = Array.from(new Set(products)).filter(product => product).sort();
        let productOptions =  [
            ...uniqueProducts.map(product => ({
                value: product,
                label: product,
            }))
        ];

        if (reportData && isFilterVisibleByReportType(reportType, 'product')) {
            const reportProducts = reportData.map(item=> item.product.toUpperCase());
            productOptions = productOptions.filter(item => reportProducts.includes(item.value.toUpperCase()));
        }

        return productOptions;
    }, [reportParams, reportData, reportType, selectedSeller]);
    const [isOpenFilterProduct, setIsOpenFilterProduct] = useState(false);

    const [filterProductType, setFilterProductType] = useState<string[]>([]);
    const productTypeOptions = useMemo(()=> {
        const productTypes = reportParams?.productTypes && reportParams.productTypes.length ? reportParams.productTypes.map(item => item) : [];
        const uniqueProductTypes = Array.from(new Set(productTypes)).filter(productType => productType).sort();
        let productTypeOptions = [
            ...uniqueProductTypes.map(productType => ({
                value: productType,
                label: productType,
            }))
        ];
        if (reportData && isFilterVisibleByReportType(reportType, 'productType')) {
            const reportProductTypes = reportData.map(item=> item.productType.toUpperCase());
            productTypeOptions = productTypeOptions.filter(item => reportProductTypes.includes(item.value.toUpperCase()));
        }

        return productTypeOptions;
    }, [reportParams, reportData, reportType]);
    const [isOpenFilterProductType, setIsOpenFilterProductType] = useState(false);

    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const statusOptions = useMemo(()=> {
        const statuses = reportParams?.statuses && reportParams.statuses.length ? reportParams.statuses.map(item => item) : [];
        const uniqueStatuses = Array.from(new Set(statuses)).filter(item => item).sort();
        let statusOptions = [
            ...uniqueStatuses.map(item => ({
                value: item,
                label: item,
            }))
        ];
        if (reportData && isFilterVisibleByReportType(reportType, 'status')) {
            const reportStatuses = reportData.map(item=> item.status.toUpperCase());
            statusOptions = statusOptions.filter(item => reportStatuses.includes(item.value.toUpperCase()));
        }

        return statusOptions;
    }, [reportParams, reportData, reportType]);
    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);


    const reportFilters = [];
    if (isFilterVisibleByReportType(reportType, 'country')) {
        reportFilters.push(
            {
                filterTitle: 'Country',
                icon: 'country-location',
                isCountry: true,
                filterDescriptions: '',
                filterOptions: reportType === REPORT_TYPES.SALE_DYNAMIC ? receiverCountryOptions : countryOptions,
                filterState: filterCountry,
                setFilterState: setFilterCountry,
                isOpen: isOpenFilterCountry,
                setIsOpen: setIsOpenFilterCountry,
                onClose: ()=>setFilterCountry([]),
                onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterCountry(true)},
            },
        )
    }
    if (isFilterVisibleByReportType(reportType, 'receiverCountry')) {
        reportFilters.push(
            {
                filterTitle: 'Country',
                icon: 'country-in',
                isCountry: true,
                filterDescriptions: '',
                filterOptions: receiverCountryOptions,
                filterState:filterReceiverCountry,
                setFilterState: setFilterReceiverCountry,
                isOpen: isOpenFilterReceiverCountry,
                setIsOpen: setIsOpenFilterReceiverCountry,
                onClose: ()=>setFilterReceiverCountry([]),
                onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterReceiverCountry(true)},
            },
        )
    }
    if (isFilterVisibleByReportType(reportType, 'warehouse')) {
        reportFilters.push(
            {
                filterTitle: 'Warehouse',
                icon: 'warehouse',
                filterDescriptions: '',
                filterOptions: warehouseOptions,
                filterState: filterWarehouse,
                setFilterState: setFilterWarehouse,
                isOpen: isOpenFilterWarehouse,
                setIsOpen: setIsOpenFilterWarehouse,
                onClose: ()=>setFilterWarehouse([]),
                onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterWarehouse(true)},
            },
        )
    }
    if (isFilterVisibleByReportType(reportType, 'courierService')) {
        reportFilters.push(
            {
                filterTitle: 'Courier service',
                icon: 'courier-service',
                filterDescriptions: '',
                filterOptions: courierServiceOptions,
                filterState: filterCourierService,
                setFilterState: setFilterCourierService,
                isOpen: isOpenFilterCourierService,
                setIsOpen: setIsOpenFilterCourierService,
                onClose: ()=>setFilterCourierService([]),
                onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterCourierService(true)},
            },
        )
    }
    if (isFilterVisibleByReportType(reportType, 'product')) {
        reportFilters.push(
            {
                filterTitle: 'Product',
                icon: 'package',
                filterDescriptions: '',
                filterOptions: productOptions,
                filterState: filterProduct,
                setFilterState: setFilterProduct,
                isOpen: isOpenFilterProduct,
                setIsOpen: setIsOpenFilterProduct,
                onClose: ()=>setFilterProduct([]),
                onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterProduct(true)},
            },
        )
    }
    if (isFilterVisibleByReportType(reportType, 'productType')) {
        reportFilters.push(
            {
                filterTitle: 'Product type',
                icon: 'package',
                filterDescriptions: '',
                filterOptions:productTypeOptions,
                filterState: filterProductType,
                setFilterState: setFilterProductType,
                isOpen: isOpenFilterProductType,
                setIsOpen: setIsOpenFilterProductType,
                onClose: ()=>setFilterProductType([]),
                onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterProductType(true)},
            },
        )
    }
    if (isFilterVisibleByReportType(reportType, 'status')) {
        reportFilters.push(
            {
                filterTitle: 'Status',
                icon: 'status',
                filterDescriptions: '',
                filterOptions: statusOptions,
                filterState: filterStatus,
                setFilterState: setFilterStatus,
                isOpen: isOpenFilterStatus,
                setIsOpen: setIsOpenFilterStatus,
                onClose: () => setFilterStatus([]),
                onClick: () => {
                    setIsFiltersVisible(true);
                    setIsOpenFilterStatus(true)
                },
            },
        )
    }


    useEffect(() => {
        setIsCurrentRangeChanged(true);
    }, [currentRange]);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
    };

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTerm(newSearchTerm);
    };

    const handleClearAllFilters = () => {
        setFilterProduct([]);
        setFilterCountry([]);
        setFilterProductType([]);
        setFilterReceiverCountry([]);
        setFilterWarehouse([]);
        setFilterStatus([]);
        setFilterCourierService([])
    }

    const [groupedFields, setGroupedFields] = useState<string[]>([]);
    const [dimensionsCount, setDimensionsCont] = useState(0);
    const [sortingCols, setSortingCols] = useState([]);



    const handleReportChange = async() => {
        //setIsCalculating(true);

        const curVariantAsString = reportType === REPORT_TYPES.DELIVERY_RATES || reportType===REPORT_TYPES.REPORT_SALES ? `${periodVariantType}_${curVariant}` : curVariant;

        const curVariantAsType = getVariantByReportType(reportType, curVariantAsString);

        setGroupedFields(getVariantGroupColsByReportType(reportType, curVariantAsType));
        const dimensionCols = getVariantDimensionColsByReportType(reportType, curVariantAsType);
        setDimensionsCont(getVariantDimensionNumberByReportType(reportType, curVariantAsType).length);


        const filteredData = reportData ? reportData.filter(reportDataRow => {

            const matchesSearch = !searchTerm.trim() || Object.keys(reportDataRow).some(key => {
                const value = reportDataRow[key];
                const stringValue = typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
                const searchTermsArray = searchTerm.trim().toLowerCase().replace(',',' ').replace('\\n',' ').replace('  ', ' ').split(' ').filter(item=>item);

                return searchTermsArray.some(word => stringValue.includes(word));
            });

            const matchesCountry = !filterCountry.length || filterCountry.includes(reportDataRow?.country) || filterCountry.includes(reportDataRow?.countryCode);
            const matchesReceiverCountry = !filterReceiverCountry.length ||  filterReceiverCountry.includes(reportDataRow?.receiverCountryCode);
            const matchesWarehouse = !filterWarehouse.length || filterWarehouse.includes(reportDataRow?.warehouse);
            const matchesCourierService = !filterCourierService.length || filterCourierService.includes(reportDataRow?.courierService);
            const matchesProduct = !filterProduct.length || filterProduct.includes(reportDataRow?.product);
            const matchesProductType = !filterProductType.length || filterProductType.includes(reportDataRow?.productType);
            const matchesStatus = !filterStatus.length || filterStatus.includes(reportDataRow?.status);

            return matchesSearch && matchesCountry && matchesReceiverCountry && matchesWarehouse && matchesCourierService && matchesProduct && matchesProductType && matchesStatus;
        }) : [];

        const resourceColumns = getVariantResourceColsByReportType(reportType, curVariantAsType, reportData);
        setResourceColumnNames([...resourceColumns.sumCols, ...resourceColumns.uniqueCols]);

        //const reportDataCollapsed = reportData ? collapseTable(dimensionCols, resourceColumns.sumCols, resourceColumns.uniqueCols)(filteredData, ()=>{setIsCalculating(false)}) : [];
        try {
            setIsCalculating(true);
            if (reportData) {
                const reportDataCollapsed = await  aggregateTableData(filteredData, dimensionCols, resourceColumns.sumCols, resourceColumns.uniqueCols, resourceColumns.concatenatedCols)

                if (reportDataCollapsed) {
                    setCollapsedData(reportDataCollapsed);
                } else {
                    setCollapsedData([]);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCalculating(false);
        }
    }

    // handle report
    const handleGenerateReport = () => {
        if (!isActionIsAccessible(transformReportType(reportType), AccessActions.GenerateReport) ) {
            try {
                sendUserBrowserInfo({...getBrowserInfo('GenerateReport/'+reportType, transformReportType(reportType), AccessActions.GenerateReport), body: {startDate: formatDateToString(currentRange.startDate), endDate: formatDateToString(currentRange.endDate)}});
            } catch {}
            return;
        }

        setNoData(false);

        if (isCurrentRangeChanged) {
            fetchData();
            setIsCurrentRangeChanged(false);
            handleClearAllFilters();
        }
    }

    useEffect(() => {
        if (reportDataAllSellers && reportDataAllSellers.length > 0 && needSeller() && selectedSeller) {
            setReportData(reportDataAllSellers.filter(item=>item.seller === selectedSeller));
        } else {
            setReportData(null);
        }

    }, [selectedSeller]);


    //variants
    const reportVariants = getVariantOptionsByReportType(reportType);

    const [periodVariantType, setPeriodVariantType] = useState<string>('OFF');
    const periodVariantOptions =
        [{label: 'Off', value: 'OFF'},{label: 'Month', value: 'MONTH'},{label: 'Week', value: 'WEEK'}];

    const [curVariant, setCurVariant] = useState<string>(reportVariants.length ? reportVariants[0].value : '');

    useEffect(() => {
        const curVariantAsString = reportType === REPORT_TYPES.DELIVERY_RATES || reportType === REPORT_TYPES.REPORT_SALES ? `${periodVariantType}_${curVariant}` : curVariant;
        const curVariantAsType = getVariantByReportType(reportType, curVariantAsString);

        setSortingCols(getVariantSortingColsByReportType(reportType, curVariantAsType));

    }, [curVariant, periodVariantType]);

    useEffect(() => {
        setIsCalculating(true);
        handleReportChange();
    }, [reportData, periodVariantType, curVariant, searchTerm, filterCountry, filterProduct, filterWarehouse, filterReceiverCountry, filterProductType, filterCourierService, filterStatus]);

    useEffect(() => {
        setIsCalculating(false);
    }, [collapsedData]);

    return (
        <Layout hasFooter>
            <SeoHead title={REPORT_TITLES[reportType]} description='Our report page' />
            <div className="page-container report-page report-page__container">
                {(isLoading || isCalculating)&& (<Loader />)}
                <Header pageTitle={REPORT_TITLES[reportType]} toRight needTutorialBtn />
                <button className='bread-crumbs-to-reports' onClick={handleBackToReportsPage}>
                    <Icon name={"keyboard-arrow-right"} />
                    <span>Reports</span>
                </button>
                {/*filters , search , + */}
                <SearchContainer>
                    <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                    <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                    <div className='search-block'>
                        <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{setSearchTerm(""); handleFilterChange("");}} />
                        {/*<FieldBuilder {...fullTextSearchField} />*/}
                    </div>
                    <Button classNames='generate-report-btn' onClick={handleGenerateReport}>Generate</Button>
                </SearchContainer>
                {needSeller() ?
                    <div className='seller-filter-block seller-filter-block--reports'>
                        <SelectField
                            key='seller-filter'
                            name='selectedSeller'
                            label='Seller: '
                            value={selectedSeller}
                            onChange={(val)=>setSelectedSeller(val as  string)}
                            //options={[{label: 'All sellers', value: 'All sellers'}, ...sellersList]}
                            options={sellersOptions}
                            classNames='seller-filter seller-filter--with-inactive-options full-sized'
                            isClearable={false}
                        />
                    </div>
                    : null
                }
                {reportType !== REPORT_TYPES.SALE_DYNAMIC
                    ? <div className='variant-container'>
                        <div className='variant-container__wrapper'>
                            <p className='variant-container__period-type-title'>Variant:</p>
                            {reportType===REPORT_TYPES.DELIVERY_RATES || reportType === REPORT_TYPES.REPORT_SALES ? (
                                    <div className='variant-container__period-type-wrapper'>
                                        <RadioSwitch name='periodVariantType' value={periodVariantType} onChange={(val)=>setPeriodVariantType(val as string)} options={periodVariantOptions} classNames='pt-0' />
                                    </div>)
                                : null
                            }
                            <RadioButton name='reportvariants' options={reportVariants} value={curVariant.toString()} onChange={(val)=>{setIsCalculating(true);setCurVariant(val.toString());}} classNames='pt-0' />
                        </div>
                    </div>
                    : null
                }
                {/* report variants */}
                <div className='filter-info-container'>
                    <div className='current-filter-container'>
                        <FiltersChosen filters={reportFilters} />
                    </div>

                </div>
                {/* Report */}
                <div className = 'report-results__wrapper'>
                    {/*{!noData && collapsedData ? <div className='report-hint'>*/}
                    {/*    <Tooltip title={`To see what each column means, hover over its name. */}
                    {/*            To sort the report by column, click on the column name. */}
                    {/*            To sort by multiple columns, press Shift and click on the column names.`} >*/}
                    {/*        <span className='hint-icon'>Hint<Icon name='question' /></span>*/}
                    {/*    </Tooltip>*/}
                    {/*</div> : null}*/}
                    <div className={`report-results ${isCurrentRangeChanged ? 'need-rerender' : ''}`}>
                        {isCurrentRangeChanged && !noData && <div className='need-rerender-overlay'><p className='need-rerender-text'>Please, run "Generate"!</p></div>}

                        {!noData && collapsedData ? <>
                            <div className='report-hint'>
                                <Tooltip title={`To see what each column means, hover over its name. 
                                    To sort the report by column, click on the column name. 
                                    To sort by multiple columns, press Shift and click on the column names.`} >
                                    <span className='hint-icon'>Hint<Icon name='question' /></span>
                                </Tooltip>
                                </div>
                                <ReportTable
                                    curPeriod={currentRange}
                                    reportData={collapsedData}
                                    reportType={reportType}
                                    reportVariantAsString={reportType === REPORT_TYPES.DELIVERY_RATES || reportType === REPORT_TYPES.REPORT_SALES ? periodVariantType+'_'+curVariant : curVariant}
                                    reportGrouping={groupedFields}
                                    dimensionsCount={dimensionsCount}
                                    //searchText={searchTerm}
                                    searchText=''
                                    sortingCols={sortingCols}
                                    resourceColumnNames={resourceColumnNames}
                                />
                            </> :
                            <div className='report-generate-hint'>
                                Please select a period, variant and click on the Generate button
                            </div>
                        }
                    </div>
                </div>

                <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible} onClearFilters={handleClearAllFilters}>
                    <FiltersListWithOptions filters={reportFilters} />
                </FiltersContainer>


            </div>
            {runTour && tourGuideStepsReports ? <TourGuide steps={reportType===REPORT_TYPES.SALE_DYNAMIC ? tourGuideStepsReportsWithoutVariants: tourGuideStepsReports} run={runTour} pageName={TourGuidePages[`Report_${reportType}`]} /> : null}
        </Layout>


    )
}

export default ReportPage;
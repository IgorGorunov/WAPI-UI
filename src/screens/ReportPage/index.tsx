import React, {useCallback, useEffect, useMemo, useState} from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import {verifyUser} from "@/utils/userData";
import {getReportData, getReportParams} from "@/services/reports";
import {REPORT_TITLES, REPORT_TYPES, ReportParametersType} from "@/types/reports";
import Loader from "@/components/Loader";
import Button, {ButtonVariant} from "@/components/Button/Button";
import DateInput from "@/components/DateInput";
import SearchField from "@/components/SearchField";
import SearchContainer from "@/components/SearchContainer";
import {formatDateToString, getLastFewDays} from "@/utils/date";
import {DateRangeType} from "@/types/dashboard";
import FiltersBlock from "@/components/FiltersBlock";
import FiltersContainer from "@/components/FiltersContainer";
import ReportTable from "./ReportTable";
import RadioButton from "@/components/FormBuilder/RadioButton";
import {collapseTable} from "@/utils/collapseTable";
import {
    getVariantByReportType,
    getVariantDimensionColsByReportType,
    getVariantDimensionNumberByReportType,
    getVariantGroupColsByReportType,
    getVariantOptionsByReportType,
    getVariantResourceColsByReportType,
    getVariantSortingColsByReportType,
    isFilterVisibleByReportType
} from "./utils";

import {Countries} from "@/types/countries";
import CurrentFilters from "@/components/CurrentFilters";
import RadioSwitch from "@/components/FormBuilder/RadioSwitch";
import Icon from "@/components/Icon";
import {Tooltip} from "antd";

type ReportPagePropType = {
    reportType: REPORT_TYPES;
}

const ReportPage:React.FC<ReportPagePropType> = ({reportType}) => {
    const Router = useRouter();
    const { token, setToken, currentDate } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    useEffect(() => {
        if (!token) Router.push(Routes.Login);
    }, [token]);

    const today = currentDate;
    const firstDay = getLastFewDays(today, 30);
    const [currentRange, setCurrentRange] = useState<DateRangeType>({startDate: firstDay, endDate: today})



    const [isCurrentRangeChanged, setIsCurrentRangeChanged] = useState(true);

    const [noData, setNoData] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    //const [productsOnStocksData, setProductsOnStocksData] = useState<ProductsOnStocksReportType|null>(null)
    const [collapsedData, setCollapsedData] = useState<any|null>(null)

    const [reportParams, setReportParams] = useState<ReportParametersType|null>(null);
    const [reportData, setReportData] = useState<any|null>(null);

    const [resourceColumnNames, setResourceColumnNames] = useState<string[]>([]);

    type ApiResponse = {
        data: any;
    };

    const fetchParamsData = useCallback(async () => {
        try {
            setIsLoading(true);

            //verify token
            const responseVerification = await verifyToken(token);
            if (!verifyUser(responseVerification, currentDate) ){
                await Router.push(Routes.Login);
            }

            const res: ApiResponse = await getReportParams(
                {token: token}
            );

            //console.log("report params:", res );
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

            // //verify token
            // const responseVerification = await verifyToken(token);
            // if (!verifyUser(responseVerification, currentDate) ){
            //     await Router.push(Routes.Login);
            // }
            const res: any = await getReportData(
                {token: token, reportType: reportType, startDate: formatDateToString(currentRange.startDate), endDate: formatDateToString(currentRange.endDate)}
            );

            console.log("report data:", res );
            if (res.data) {
                setReportData(res.data);
                console.log('report data: ', res.data);
            }


        } catch (error) {
            console.error("Error fetching data:", error);
            console.log('error')
        } finally {
            setIsLoading(false);
            console.log('finally')

        }
    },[token, currentRange]);

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
            countries.push(item.country);
            warehouses.push(item.warehouse);
        });

        const uniqueCountries = Array.from(new Set(countries)).filter(country => country).sort();
        const uniqueWarehouses = Array.from(new Set(warehouses)).filter(warehouse => warehouse).sort();

        const warehouseOptions = [
            ...uniqueWarehouses.map(warehouse => ({
                label: warehouse,
                value: warehouse,
            }))
        ];

        const countryOptions = [
            ...uniqueCountries.map(country => ({
                value: country,
                label: Countries[country] as string || country,
            }))
        ];

        return {warehouseOptions, countryOptions}

    },[reportParams]);

    const [isOpenFilterWarehouse, setIsOpenFilterWarehouse] = useState(false);
    const [isOpenFilterCountry, setIsOpenFilterCountry] = useState(false);

    const [filterCourierService, setFilterCourierService] = useState<string[]>([]);
    const courierServiceOptions = useMemo(()=> {
        const courierServices = reportParams?.courierServices && reportParams.courierServices.length ? reportParams.courierServices.map(item => item) : [];
        const uniqueCourierServices = Array.from(new Set(courierServices)).filter(item => item).sort();
        return [
            ...uniqueCourierServices.map(item => ({
                value: item,
                label: item,
            }))
        ];
    }, [reportParams])
    const [isOpenFilterCourierService, setIsOpenFilterCourierService] = useState(false);

    const [filterReceiverCountry, setFilterReceiverCountry] = useState<string[]>([]);
    const receiverCountryOptions = useMemo(()=> {
        const receiverCountries = reportParams?.countries && reportParams.countries.length ? reportParams.countries.map(item => item) : [];
        const uniqueReceiverCountries = Array.from(new Set(receiverCountries)).filter(item => item).sort();
        return [
            ...uniqueReceiverCountries.map(country => ({
                value: country,
                label: Countries[country] as string || country,
            }))
        ];
    }, [reportParams])
    const [isOpenFilterReceiverCountry, setIsOpenFilterReceiverCountry] = useState(false);

    const [filterProduct, setFilterProduct] = useState<string[]>([]);
    const productOptions = useMemo(()=> {
        const products = reportParams?.products && reportParams.products.length ? reportParams.products.map(product => product.name) : [];
        const uniqueProducts = Array.from(new Set(products)).filter(product => product).sort();
        return [
            ...uniqueProducts.map(product => ({
                value: product,
                label: product,
            }))
        ];
    }, [reportParams])
    const [isOpenFilterProduct, setIsOpenFilterProduct] = useState(false);

    const [filterProductType, setFilterProductType] = useState<string[]>([]);
    const productTypeOptions = useMemo(()=> {
        const productTypes = reportParams?.productTypes && reportParams.productTypes.length ? reportParams.productTypes.map(item => item) : [];
        const uniqueProductTypes = Array.from(new Set(productTypes)).filter(productType => productType).sort();
        return [
            ...uniqueProductTypes.map(productType => ({
                value: productType,
                label: productType,
            }))
        ];
    }, [reportParams])
    const [isOpenFilterProductType, setIsOpenFilterProductType] = useState(false);

    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const statusOptions = useMemo(()=> {
        const statuses = reportParams?.statuses && reportParams.statuses.length ? reportParams.statuses.map(item => item) : [];
        const uniqueStatuses = Array.from(new Set(statuses)).filter(item => item).sort();
        return [
            ...uniqueStatuses.map(item => ({
                value: item,
                label: item,
            }))
        ];
    }, [reportParams])
    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);


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

        //console.log('curVariantAsType 123', curVariantAsType, curVariantAsString);

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
            const matchesReceiverCountry = !filterReceiverCountry.length || filterReceiverCountry.includes(reportDataRow?.receiverCountryCode);
            const matchesWarehouse = !filterWarehouse.length || filterWarehouse.includes(reportDataRow?.warehouse);
            const matchesCourierService = !filterCourierService.length || filterCourierService.includes(reportDataRow?.courierServices);
            const matchesProduct = !filterProduct.length || filterProduct.includes(reportDataRow?.product);
            const matchesProductType = !filterProductType.length || filterProductType.includes(reportDataRow?.productType);
            const matchesStatus = !filterStatus.length || filterStatus.includes(reportDataRow?.status);

            return matchesSearch && matchesCountry && matchesReceiverCountry && matchesWarehouse && matchesCourierService && matchesProduct && matchesProductType && matchesStatus;
        }) : [];

        const resourceColumns = getVariantResourceColsByReportType(reportType, curVariantAsType, reportData);
        setResourceColumnNames([...resourceColumns.sumCols, ...resourceColumns.uniqueCols]);
        //console.log('resource cols:', resourceColumns);

        const reportDataCollapsed = reportData ? collapseTable(dimensionCols, resourceColumns.sumCols, resourceColumns.uniqueCols)(filteredData, ()=>{setIsCalculating(false)}) : [];

        setCollapsedData(reportDataCollapsed);

    }

    // handle report
    const handleGenerateReport = () => {
        setNoData(false);

        if (isCurrentRangeChanged) {
            fetchData();
            setIsCurrentRangeChanged(false);
        }
    }


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
        console.log('report data changed: ', reportData)
    }, [reportData]);

    useEffect(() => {
        setIsCalculating(false);

        //console.log('collapsed data: ', collapsedData)

    }, [collapsedData]);

    return (
        <Layout hasFooter>
            <div className="page-container report-page report-page__container">
                {(isLoading || isCalculating)&& (<Loader />)}
                <Header pageTitle={REPORT_TITLES[reportType]} toRight >

                </Header>

                {/*filters , search , + */}
                <SearchContainer>
                    <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                    <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                    <div className='search-block'>
                        <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{setSearchTerm(""); handleFilterChange("");}} />
                        {/*<FieldBuilder {...fullTextSearchField} />*/}
                    </div>
                    <Button onClick={handleGenerateReport}>Generate</Button>
                </SearchContainer>
                {reportType !== REPORT_TYPES.SALE_DYNAMIC ?<div className='variant-container'>
                    <p className='variant-container__period-type-title'>Variant:</p>
                    {reportType===REPORT_TYPES.DELIVERY_RATES || reportType === REPORT_TYPES.REPORT_SALES ? (
                            <div className='variant-container__period-type-wrapper'>
                                {/*<p className='variant-container__period-type-title'>Group by period:</p>*/}
                                <RadioSwitch name='periodVariantType' value={periodVariantType} onChange={(val)=>setPeriodVariantType(val as string)} options={periodVariantOptions} />
                            </div>)
                        : null
                    }
                    <RadioButton name='reportvariants' options={reportVariants} value={curVariant.toString()} onChange={(val)=>{setIsCalculating(true);setCurVariant(val.toString());}}/>
                </div> : null}
                {/* report variants */}
                <div className='filter-info-container'>
                    <div className='current-filter-container'>
                        <CurrentFilters title='Country' filterState={filterCountry} options={reportType === REPORT_TYPES.SALE_DYNAMIC ? receiverCountryOptions : countryOptions} onClose={()=>setFilterCountry([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterCountry(true)}} />
                        <CurrentFilters title='Country' filterState={filterReceiverCountry} options={receiverCountryOptions} onClose={()=>setFilterReceiverCountry([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterReceiverCountry(true)}} />
                        <CurrentFilters title='Warehouse' filterState={filterWarehouse} options={warehouseOptions} onClose={()=>setFilterWarehouse([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterWarehouse(true)}}/>
                        <CurrentFilters title='Courier service' filterState={filterCourierService} options={countryOptions} onClose={()=>setFilterCourierService([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterCourierService(true)}}/>
                        <CurrentFilters title='Product' filterState={filterProduct} options={productOptions} onClose={()=>setFilterProduct([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterProduct(true)}}/>
                        <CurrentFilters title='Product type' filterState={filterProductType} options={productTypeOptions} onClose={()=>setFilterProductType([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterProductType(true)}}/>
                        <CurrentFilters title='Status' filterState={filterStatus} options={statusOptions} onClose={()=>setFilterStatus([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)}}/>
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
                    {isFilterVisibleByReportType(reportType, 'country') && <FiltersBlock filterTitle='Country' isCountry={true} filterOptions={reportType === REPORT_TYPES.SALE_DYNAMIC ? receiverCountryOptions : countryOptions} filterState={filterCountry} setFilterState={setFilterCountry} isOpen={isOpenFilterCountry} setIsOpen={setIsOpenFilterCountry}/>}
                    {isFilterVisibleByReportType(reportType, 'receiverCountry') && <FiltersBlock filterTitle='Country' isCountry={true} filterOptions={receiverCountryOptions} filterState={filterReceiverCountry} setFilterState={setFilterReceiverCountry} isOpen={isOpenFilterReceiverCountry} setIsOpen={setIsOpenFilterReceiverCountry}/>}
                    {isFilterVisibleByReportType(reportType, 'warehouse') && <FiltersBlock filterTitle='Warehouse' filterOptions={warehouseOptions} filterState={filterWarehouse} setFilterState={setFilterWarehouse} isOpen={isOpenFilterWarehouse} setIsOpen={setIsOpenFilterWarehouse}/>}
                    {isFilterVisibleByReportType(reportType, 'courierService') && <FiltersBlock filterTitle='Courier service' filterOptions={courierServiceOptions} filterState={filterCourierService} setFilterState={setFilterCourierService} isOpen={isOpenFilterCourierService} setIsOpen={setIsOpenFilterCourierService}/>}
                    {isFilterVisibleByReportType(reportType, 'product') && <FiltersBlock filterTitle='Product' filterOptions={productOptions} filterState={filterProduct} setFilterState={setFilterProduct} isOpen={isOpenFilterProduct} setIsOpen={setIsOpenFilterProduct}/>}
                    {isFilterVisibleByReportType(reportType, 'productType') && <FiltersBlock filterTitle='Product type' filterOptions={productTypeOptions} filterState={filterProductType} setFilterState={setFilterProductType} isOpen={isOpenFilterProductType} setIsOpen={setIsOpenFilterProductType}/>}
                    {isFilterVisibleByReportType(reportType, 'status') && <FiltersBlock filterTitle='Status' filterOptions={statusOptions} filterState={filterStatus} setFilterState={setFilterStatus} isOpen={isOpenFilterStatus} setIsOpen={setIsOpenFilterStatus}/>}
                </FiltersContainer>


            </div>

        </Layout>


    )
}

export default ReportPage;
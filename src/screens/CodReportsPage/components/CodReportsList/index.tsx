import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pagination, Table} from 'antd';
import {ColumnType} from "antd/es/table";
import "./styles.scss";
import "@/styles/tables.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {CodReportType} from "@/types/codReports";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import Head from "next/head";
import {PageOptions} from '@/constants/pagination';
import getSymbolFromCurrency from "currency-symbol-map";
import {DateRangeType} from "@/types/dashboard";
import DateInput from "@/components/DateInput";
import {getCODReportForm} from "@/services/codReports";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import Loader from "@/components/Loader";
import {formatDateStringToDisplayString} from "@/utils/date";
import SearchField from "@/components/SearchField";
import SearchContainer from "@/components/SearchContainer";
import {sendUserBrowserInfo} from "@/services/userInfo";

type CodReportsListType = {
    codReports: CodReportType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredCodReports: React.Dispatch<React.SetStateAction<CodReportType[]>>;
}

const CODReportsList: React.FC<CodReportsListType> = ({codReports,currentRange, setCurrentRange, setFilteredCodReports}) => {

    const [animating, setAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    // Pagination
    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const handleChangePage = (page: number) => {
        setAnimating(true);
        setTimeout(() => {
            setCurrent(page);
            setAnimating(false);
        }, 500);
    };
    const handleChangePageSize = (size: number) => {
        setPageSize(size);
        setCurrent(1);
    };

    // Sorting
    const [sortColumn, setSortColumn] = useState<keyof CodReportType>();
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof CodReportType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    // Filter and searching
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (newSearchTerm: string) => {
        if (newSearchTerm !== undefined) {
            setSearchTerm(newSearchTerm);
        }
    };
    const filteredCODReports = useMemo(() => {
        setCurrent(1);
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = codReports.filter(product => {
            const matchesSearch = !searchTerm || Object.keys(product).some(key => {
                const value = product[key];
                return key !== 'uuid' && typeof value === 'string' && value.toLowerCase().includes(searchTermLower);
            });
            return matchesSearch;
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                if (sortDirection === 'ascend') {
                    return a[sortColumn] > b[sortColumn] ? 1 : -1;
                } else {
                    return a[sortColumn] < b[sortColumn] ? 1 : -1;
                }
            });
        }
        return filtered;
    }, [codReports, searchTerm, sortColumn, sortDirection]);

    //const [showDatepicker, setShowDatepicker] = useState(false);

    useEffect(() => {
        setFilteredCodReports(filteredCODReports)
    }, [filteredCODReports]);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        //setShowDatepicker(false);
    };

    const handleDownloadCORReport = async (uuid) => {
       setIsLoading(true);
        try {
            const requestData = { token: token, uuid: uuid };

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetCODReportPrintForm', AccessObjectTypes["Finances/CODReports"], AccessActions.DownloadPrintForm), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Finances/CODReports"], AccessActions.DownloadPrintForm)) {
                return null;
            }

            const response = await getCODReportForm(superUser && ui ? {...requestData, ui} : requestData);

            if (response && response.data) {
                const files = response.data;
                if (files.length) {
                    files.forEach(file => {
                        const decodedData = atob(file.data);

                        // Convert base64 to Uint8Array
                        const arrayBuffer = new Uint8Array(decodedData.length);
                        for (let i = 0; i < decodedData.length; i++) {
                            arrayBuffer[i] = decodedData.charCodeAt(i);
                        }

                        // // Create a Blob
                        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

                        // Create a download link
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = file.name;

                        // Append the link to the document and trigger a click event
                        document.body.appendChild(link);
                        link.click();

                        // Remove the link from the document
                        document.body.removeChild(link);
                    });
                }
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const columns: ColumnType<CodReportType>[] = useMemo(() => [
        {
            title: <TitleColumn
                title="Number"
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start"/>
            ),
            dataIndex: 'number',
            key: 'number',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
        },
        {
            title: <TitleColumn
                title="Date"
                minWidth="80px"
                maxWidth="150px"
                contentPosition="start"
            />,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="80px" maxWidth="150px"  contentPosition="start"/>
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
        },
        {
            title: <TitleColumn
                title="Amount"
                minWidth="100px"
                maxWidth="100px"
                contentPosition="start"
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative ? 'red' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="100px"
                            maxWidth="200px"
                            contentPosition="start"
                            textColor={textColor}
                        >
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="100px"
                            maxWidth="200px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                }
            },
            dataIndex: 'amount',
            key: 'amount',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
        },
        {
            title: <TitleColumn
                title="Period"
                minWidth="150px"
                maxWidth="200px"
                contentPosition="start"
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="150px" maxWidth="200px"  contentPosition="start"/>
            ),
            dataIndex: 'period',
            key: 'period',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title="Orders count"
                minWidth="80px"
                maxWidth="150px"
                contentPosition="start"
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="150px"  contentPosition="start"/>
            ),
            dataIndex: 'ordersCount',
            key: 'ordersCount',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
            responsive: ['md'],
        },
        {
             title: <TitleColumn title="" minWidth="100px" maxWidth="800px" contentPosition="end"/>,
            render: (text: string, record: CodReportType) => (
                <TableCell
                    minWidth="100px"
                    maxWidth="800px"
                    contentPosition="end"
                    childrenBefore={
                        <span className="lines-cell-style">
                        <Icon name="download-file" />
                        </span>}>
                </TableCell>
            ),
            dataIndex: 'uuid',
            key: 'uuid',
            sorter: true,
            onHeaderCell: (column: ColumnType<CodReportType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof CodReportType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleDownloadCORReport(record.uuid)}
                };
            },
            responsive: ['lg'],
        },
    ], [handleHeaderCellClick]);

    return (
        <div className='table'>
            {isLoading && <Loader />}
            <Head>
                <title>Cod reports</title>
                <meta name="cod reports" content="cod" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            {/*<div className="date-filter-container">*/}
            {/*    <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />*/}
            {/*    <Input*/}
            {/*        placeholder="🔍 Search..."*/}
            {/*        value={searchTerm}*/}
            {/*        onChange={e => handleFilterChange(e.target.value)}*/}
            {/*        className="search-input"*/}
            {/*    />*/}
            {/*</div>*/}
            <SearchContainer>
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <div className='search-block'>
                    <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{setSearchTerm(""); handleFilterChange("");}} />
                </div>
            </SearchContainer>
            <div className="page-size-container">
                <span className="page-size-text"></span>
                <PageSizeSelector
                    options={PageOptions}
                    value={pageSize}
                    onChange={(value: number) => handleChangePageSize(value)}
                />
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredCODReports?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={filteredCODReports.slice((current - 1) * pageSize, current * pageSize).map(item => ({
                        ...item,
                        key: item.tableKey,
                    }))}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total COD reports:<span className='order-products-total__list-item__value'>{filteredCODReports.length}</span></li>
                    </ul>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={filteredCODReports.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default React.memo(CODReportsList);
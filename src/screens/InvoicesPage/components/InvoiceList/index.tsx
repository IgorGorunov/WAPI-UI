import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pagination, Table, TableColumnProps, Tooltip} from 'antd';
import {ColumnType} from "antd/es/table";
import "./styles.scss";
import "@/styles/tables.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {InvoiceType} from "@/types/invoices";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import {PageOptions} from '@/constants/pagination';
import getSymbolFromCurrency from "currency-symbol-map";
import {DateRangeType} from "@/types/dashboard";
import {getInvoiceForm} from "@/services/invoices";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import Loader from "@/components/Loader";
import {FormFieldTypes} from "@/types/forms";
import Button, {ButtonVariant} from "@/components/Button/Button";
import SearchField from "@/components/SearchField";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchContainer from "@/components/SearchContainer";
import {FILTER_TYPE} from "@/types/utility";
import DateInput from "@/components/DateInput";
import FiltersContainer from "@/components/FiltersContainer";
import {formatDateStringToDisplayString} from "@/utils/date";
import {sendUserBrowserInfo} from "@/services/userInfo";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import useTenant from "@/context/tenantContext";


export const StatusColors = {
    "Paid": "#29CC39",
    "Credit note": "#5380F5",
    "Unpaid": "#FEDB4F",
    "Partiallity paid": "#5380F5",
    "Overdue": "#FF4000",
    "Overpaid": "#29CC39",
};

type InvoiceListType = {
    invoices:InvoiceType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredInvoices: React.Dispatch<React.SetStateAction<InvoiceType[]>>;
    selectedSeller: string;
}

const InvoiceList: React.FC<InvoiceListType> = ({invoices, currentRange, setCurrentRange, setFilteredInvoices, selectedSeller}) => {

    const [animating, setAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //const Router = useRouter();
    const { tenantData: { alias }} = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible, needSeller, sellersList } = useAuth();

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
    const [sortColumn, setSortColumn] = useState<keyof InvoiceType>();
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof InvoiceType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);

    const getSellerName = useCallback((sellerUid: string) => {
        const t = sellersList.find(item=>item.value===sellerUid);
        return t ? t.label : ' - ';
    }, [sellersList]);

    // Filter and searching
    const [searchTerm, setSearchTerm] = useState('');

    const [fullTextSearch, setFullTextSearch] = useState(true);
    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearch',
        label: 'Full text search',
        checked: fullTextSearch,
        onChange: ()=>{setFullTextSearch(prevState => !prevState)},
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    }

    const calcOrderAmount = useCallback((property, value) => {
        return invoices.filter(item=>!selectedSeller || selectedSeller==='All sellers' || selectedSeller===item.seller).filter(invoice => invoice[property].toLowerCase() === value.toLowerCase()).length || 0;
    },[invoices, selectedSeller]);

    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const uniqueStatuses = useMemo(() => {
        const statuses = invoices.filter(item => !selectedSeller || selectedSeller==='All sellers' || selectedSeller===item.seller).map(invoice => invoice.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [invoices, selectedSeller]);
    uniqueStatuses.sort();
    const transformedStatuses = useMemo(() => ([
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
            amount: calcOrderAmount('status', status),
            color: StatusColors[status] || 'white',
        }))
    ]), [uniqueStatuses]);

    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const invoiceFilters = [
        {
            filterTitle: 'Status',
            icon: 'status',
            filterDescriptions: '',
            filterType: FILTER_TYPE.COLORED_CIRCLE,
            filterOptions: transformedStatuses,
            filterState: filterStatus,
            setFilterState: setFilterStatus,
            isOpen: isOpenFilterStatus,
            setIsOpen: setIsOpenFilterStatus,
            onClose: ()=>setFilterStatus([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)},
        },
    ];

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTerm(newSearchTerm);
    };
    const handleDownloadInvoice = async (uuid, type='download') => {
        setIsLoading(true);
        try {
            const requestData = { token: token, alias, uuid: uuid, type };

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetInvoicePrintForm', AccessObjectTypes["Finances/Invoices"], AccessActions.DownloadPrintForm), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Finances/Invoices"], AccessActions.DownloadPrintForm) ) {
                return null;
            }

            const response = await getInvoiceForm(superUser && ui ? {...requestData, ui} : requestData);

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


                        if (type === 'preview') {
                            // Open Blob object in new tab
                            const url = URL.createObjectURL(blob);
                            const newTab = window.open(url, '_blank');
                            if (newTab) {
                                newTab.document.title = file.name;
                            } else {
                                alert('Please allow pop-ups for this site to open the file.');
                            }
                        } else {
                            // Create a download link
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = file.name;

                            // Append the link to the document and trigger a click event
                            document.body.appendChild(link);
                            link.click();

                            // Remove the link from the document
                            document.body.removeChild(link);
                        }
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

    const filteredInvoices = useMemo(() => {
        setCurrent(1);
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = invoices.filter(invoice => {
            const matchesSearch = !searchTerm || Object.keys(invoice).some(key => {
                const value = invoice[key];
                return key !== 'uuid' && typeof value === 'string' && value.toLowerCase().includes(searchTermLower);
            });
            const matchesStatus = !filterStatus.length || filterStatus.map(item=>item.toLowerCase()).includes(invoice.status.toLowerCase());
            const matchesSeller = !selectedSeller || selectedSeller==='All sellers' || selectedSeller === invoice.seller;
            return matchesSearch && matchesStatus && matchesSeller;
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
    }, [invoices, searchTerm, filterStatus, sortColumn, sortDirection, selectedSeller]);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        //setShowDatepicker(false);
    };

    useEffect(() => {
        setFilteredInvoices(filteredInvoices)
    }, [filteredInvoices]);

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

    const SellerColumns: TableColumnProps<InvoiceType>[] = [];
    if (needSeller()) {
        SellerColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="70px"
                maxWidth="90px"
                contentPosition="left"
                childrenBefore={
                    <Tooltip title="Seller's name" >
                        <>
                            <span className='table-header-title'>Seller</span>
                            {sortColumn==='seller' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                            {sortColumn==='seller' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                        </>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="70px"
                        maxWidth="90px"
                        contentPosition="left"
                        childrenBefore={
                            <div className="seller-container">
                                {getSellerName(record.seller)}
                            </div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'seller',
            key: 'seller',
            sorter: false,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<InvoiceType>);
    }

    const columns: ColumnType<InvoiceType>[] = useMemo(() => [
        {
            title: <TitleColumn
                title=""
                minWidth="100px"
                maxWidth="100px"
                contentPosition="start"
                childrenBefore={
                    <>
                        <span className='table-header-title'>Status</span>
                        {sortColumn==='status' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='status' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                }
            />,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.status);
                return (
                    <TableCell
                        minWidth="100px"
                        maxWidth="100px"
                        contentPosition="start"
                        value={text}
                        childrenBefore={
                            <span style={{
                                borderBottom: `2px solid ${underlineColor}`,
                                display: 'inline-block',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                backgroundColor: underlineColor,
                                marginRight: '5px',
                                justifyContent: 'center',}}
                            >
                        </span>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title=""
                minWidth="60px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={
                    <>
                        <span className='table-header-title'>Number</span>
                        {sortColumn==='number' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='number' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                }

            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="80px"  contentPosition="start"/>
            ),
            dataIndex: 'number',
            key: 'number',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title=""
                minWidth="60px"
                maxWidth="150px"
                contentPosition="start"
                childrenBefore={
                    <>
                        <span className='table-header-title'>Date</span>
                        {sortColumn==='date' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='date' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                }
            />,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="60px" maxWidth="80px"  contentPosition="start"/>
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        ...SellerColumns,
        {
            title: <TitleColumn
                title=""
                minWidth="60px"
                maxWidth="150px"
                contentPosition="start"
                childrenBefore={
                    <>
                        <span className='table-header-title'>Amount</span>
                        {sortColumn==='amount' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='amount' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                }
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="60px"
                            maxWidth="150px"
                            contentPosition="start"
                            textColor={textColor}
                        >
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="60px"
                            maxWidth="150px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                }
            },
            dataIndex: 'amount',
            key: 'amount',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
        },
        {
            title: <TitleColumn
                title=""
                minWidth="60px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <>
                        <span className='table-header-title'>Due date</span>
                        {sortColumn==='dueDate' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='dueDate' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                }
            />,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="60px" maxWidth="150px"  contentPosition="start"/>
            ),
            dataIndex: 'dueDate',
            key: 'dueDate',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title=""
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <>
                        <span className='table-header-title'>Overdue</span>
                        {sortColumn==='overdue' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='overdue' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px"  contentPosition="start"/>
            ),
            dataIndex: 'overdue',
            key: 'overdue',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                title=""
                minWidth="75px"
                maxWidth="75px"
                contentPosition="start"
                childrenBefore={
                    <>
                        <span className='table-header-title'>Paid</span>
                        {sortColumn==='paid' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='paid' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                }
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                }
            },
            dataIndex: 'paid',
            key: 'paid',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },

        {
            title: <TitleColumn
                title=""
                minWidth="75px"
                maxWidth="75px"
                contentPosition="start"
                childrenBefore={
                    <>
                        <span className='table-header-title'>Debt</span>
                        {sortColumn==='debt' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='debt' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                }
            />,
            render: (text: string, record) => {
                const isNegative = parseFloat(text) < 0;
                const textColor = isNegative && record.debt !== 0 ? '#29CC39' : undefined;
                if (record.currency) {
                    const currencySymbol = getSymbolFromCurrency(record.currency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="start"
                            textColor={textColor}>
                        </TableCell>
                    );
                }
            },
            dataIndex: 'debt',
            key: 'debt',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="" minWidth="80px" maxWidth="130px" contentPosition="start"/>,
            render: (text: string, record: InvoiceType) => (
                <div className='services-cell-style__wrapper'>
                    <TableCell
                        minWidth="35px"
                        maxWidth="60px"
                        contentPosition="center"
                        childrenBefore={
                            <span className="services-cell-style" onClick={()=>handleDownloadInvoice(record.uuid)}>
                                <Icon name="download-file" />
                            </span>}>
                    </TableCell>
                    <TableCell
                        minWidth="35px"
                        maxWidth="60px"
                        contentPosition="center"
                        childrenBefore={
                            <span className="services-cell-style" onClick={()=> handleDownloadInvoice(record.uuid, 'preview')}>
                        <Icon name="preview" />
                        </span>}>
                    </TableCell>
                </div>
            ),
            dataIndex: 'uuid',
            key: 'uuid',
            sorter: true,
            onHeaderCell: (column: ColumnType<InvoiceType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof InvoiceType),
            }),
            // onCell: (record) => {
            //     return {
            //         onClick: () => {handleDownloadInvoice(record.uuid)}
            //     };
            // },
            //responsive: ['lg'],
        },


    ], [handleHeaderCellClick, sortColumn, sortDirection]);
    return (
        <div className='table invoices-list'>
            {isLoading && <Loader />}

            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <div className='search-block'>
                    <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{setSearchTerm(""); handleFilterChange("");}} />
                    <FieldBuilder {...fullTextSearchField} />
                </div>
            </SearchContainer>

            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    <FiltersChosen filters={invoiceFilters} />
                    {/*<CurrentFilters title='Status' filterState={filterStatus} options={transformedStatuses} onClose={()=>setFilterStatus([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)}} />*/}
                </div>
                <div className="page-size-container">
                    <span className="page-size-text"></span>
                    <PageSizeSelector
                        options={PageOptions}
                        value={pageSize}
                        onChange={(value: number) => handleChangePageSize(value)}
                    />
                </div>
            </div>

            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredInvoices?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={filteredInvoices.slice((current - 1) * pageSize, current * pageSize).map(item => ({
                        ...item,
                        key: item.tableKey,
                    }))}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total invoices:<span className='order-products-total__list-item__value'>{invoices.length}</span></li>
                    </ul>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={filteredInvoices.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>

            <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible} onClearFilters={()=>setFilterStatus([])}>
                <FiltersListWithOptions filters={invoiceFilters} />
                {/*<FiltersBlock filterTitle='Status' filterType={FILTER_TYPE.COLORED_CIRCLE} filterOptions={transformedWarehouses} filterState={filterStatus} setFilterState={setFilterStatus} isOpen={isOpenFilterStatus} setIsOpen={setIsOpenFilterStatus}/>*/}
            </FiltersContainer>
        </div>
    );
};

export default React.memo(InvoiceList);
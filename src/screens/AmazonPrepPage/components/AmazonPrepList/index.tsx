import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Pagination, Popover, Table, TableColumnProps, Tooltip} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@/styles/tables.scss";
import Icon from "@/components/Icon";
import {ColumnType} from "antd/es/table";
import DateInput from "@/components/DateInput";
import {DateRangeType} from "@/types/dashboard";
import {AmazonPrepOrderType} from "@/types/amazonPrep";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, {ButtonVariant} from "@/components/Button/Button";
import Head from "next/head";
import {StatusColors} from "@/screens/DashboardPage/components/OrderStatuses";
import SearchField from "@/components/SearchField";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormFieldTypes} from "@/types/forms";
import CurrentFilters from "@/components/CurrentFilters";
import FiltersBlock from "@/components/FiltersBlock";
import {Countries} from "@/types/countries";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import {formatDateStringToDisplayString} from "@/utils/date";
import {useIsTouchDevice} from "@/hooks/useTouchDevice";
import SimplePopup from "@/components/SimplePopup";
import {MessageKeys, useTranslations} from "next-intl";
import {itemRender} from "@/utils/pagination";
import {PageOptions} from "@/constants/pagination";


type AmazonPrepListType = {
    amazonPrepOrders: AmazonPrepOrderType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredAmazonPrepOrders: React.Dispatch<React.SetStateAction<AmazonPrepOrderType[]>>;
    handleEditAmazonPrepOrder(uuid: string): void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const AmazonPrepList: React.FC<AmazonPrepListType> = ({amazonPrepOrders, currentRange, setCurrentRange, setFilteredAmazonPrepOrders,handleEditAmazonPrepOrder}) => {
    const t = useTranslations('AmazonPrep')
    const tCommon = useTranslations('common');
    const tCountry = useTranslations('countries');

    const isTouchDevice = useIsTouchDevice();

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getProductItems = useCallback((hoveredOrder) => {
        return hoveredOrder ? hoveredOrder.products.map(orderItem => ({
            uuid: hoveredOrder.uuid,
            title: orderItem.product,
            description: orderItem.quantity
        })) : [];
    }, []);

    const [fullTextSearch, setFullTextSearch] = useState(true);
    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearch',
        label: tCommon('fullTextSearchLabel'),
        checked: fullTextSearch,
        onChange: ()=>{setFullTextSearch(prevState => !prevState)},
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    }


    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
    const [isOpenFilterWarehouse, setIsOpenFilterWarehouse] = useState(false);
    const [isOpenFilterReceiverCountry, setIsOpenFilterReceiverCountry] = useState(false);

    const calcOrderAmount = useCallback((property: string, value: string) => {
        return amazonPrepOrders.filter(order => order[property].toLowerCase() === value.toLowerCase()).length || 0;
    },[amazonPrepOrders]);

    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    // const allStatuses = orders.map(order => order.status);
    const uniqueStatuses = useMemo(() => {
        const statuses = amazonPrepOrders.map(order => order.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [amazonPrepOrders]);
    uniqueStatuses.sort();
    const transformedStatuses = useMemo(() => ([
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
            amount: calcOrderAmount('status', status),
        }))
    ]), [uniqueStatuses]);

    // useEffect(() => {
    //     setFilterStatus(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueStatuses.includes(selectedValue))];
    //     })
    // }, [uniqueStatuses]);

    const [filterWarehouse, setFilterWarehouse] = useState<string[]>([]);
    // const allWarehouses = orders.map(order => order.warehouse);
    const uniqueWarehouses = useMemo(() => {
        const warehouses = amazonPrepOrders.map(order => order.warehouse);
        return Array.from(new Set(warehouses)).filter(warehouse => warehouse).sort();
    }, [amazonPrepOrders]);
    uniqueWarehouses.sort();
    const transformedWarehouses = useMemo(() => ([
        ...uniqueWarehouses.map(warehouse => ({
            value: warehouse,
            label: warehouse,
            amount: calcOrderAmount('warehouse', warehouse),
        }))
    ]), [uniqueWarehouses]);

    // useEffect(() => {
    //     setFilterWarehouse(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueWarehouses.includes(selectedValue))];
    //     })
    // }, [uniqueWarehouses]);

    const [filterReceiverCountry, setFilterReceiverCountry] = useState<string[]>([]);
    // const allReceiverCountries = orders.map(order => order.receiverCountry);
    const uniqueReceiverCountries = useMemo(() => {
        const receiverCountries = amazonPrepOrders.map(order => order.receiverCountry);
        return Array.from(new Set(receiverCountries)).filter(country => country).sort();
    }, [amazonPrepOrders]);
    uniqueReceiverCountries.sort();
    const transformedReceiverCountries = useMemo(() => ([
        ...uniqueReceiverCountries.map(country => ({
            value: country,
            label: tCountry(country.toLowerCase() as MessageKeys<any, any>) || country,
            amount: calcOrderAmount('receiverCountry', country),
        }))
    ]), [uniqueReceiverCountries]);

    // useEffect(() => {
    //     setFilterReceiverCountry(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueReceiverCountries.includes(selectedValue))];
    //     })
    // }, [uniqueReceiverCountries]);

    const handleClearAllFilters = () => {
        setFilterStatus([]);
        setFilterWarehouse([]);
        setFilterReceiverCountry([]);

        //close filter modal
        //setIsFiltersVisible(false);
    }

    const getUnderlineColor = useCallback((statusText: string) => {
        return StatusColors[statusText] || 'black';
    }, []);

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

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTerm(newSearchTerm);
    };

    const [sortColumn, setSortColumn] = useState<keyof AmazonPrepOrderType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof AmazonPrepOrderType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    const filteredOrders = useMemo(() => {
        setCurrent(1);

        return amazonPrepOrders.filter(order => {
            const matchesSearch = !searchTerm.trim() || Object.keys(order).some(key => {
                const value = order[key];
                if (key !== 'uuid') {
                    const stringValue = typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
                    const searchTermsArray = searchTerm.trim().toLowerCase().split(' ');

                    if (fullTextSearch) {
                        return searchTermsArray.every(word => stringValue.includes(word));
                    } else {
                        return searchTermsArray.some(word => stringValue.includes(word));
                    }
                }
            });
            const matchesStatus = !filterStatus.length ||
                (filterStatus.includes(order.status));
            const matchesWarehouse = !filterWarehouse.length ||
                filterWarehouse.map(item=>item.toLowerCase()).includes(order.warehouse.toLowerCase());
            const matchesReceiverCountry = !filterReceiverCountry.length ||
                filterReceiverCountry.map(item => item.toLowerCase()).includes(order.receiverCountry.toLowerCase());
            return matchesSearch && matchesStatus && matchesWarehouse && matchesReceiverCountry;
        }).sort((a, b) => {
            if (!sortColumn) return 0;
            if (sortDirection === 'ascend') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        });
    }, [amazonPrepOrders, searchTerm, fullTextSearch, filterStatus, filterWarehouse, filterReceiverCountry, sortColumn, sortDirection]);

    //const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange: DateRangeType) => {
        setCurrentRange(newRange);
        //setShowDatepicker(false);
    };

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    useEffect(() => {
        setFilteredAmazonPrepOrders(filteredOrders);

    }, [filteredOrders]);

    const curWidth = useMemo(()=>{
        const displayedData = filteredOrders.slice((current - 1) * pageSize, current * pageSize);
        const maxAmount = displayedData.reduce((acc,item)=> Math.max(acc, item.productLines),0).toString().length;
        const width = 47+maxAmount*9;
        return width.toString()+'px';
    },[current, pageSize, filteredOrders]);

    const columns: TableColumnProps<AmazonPrepOrderType>[]  = [
        {
            key: 'warehouseCountries',
            title: <TitleColumn
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenBefore={<Tooltip title={t('listColumns.countriesHint')}> <Icon  name={"car"}/></Tooltip>}>
                    </TitleColumn>,
            render: (text: string, record) =>
                <TableCell
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    value={'➔'}
                    childrenBefore={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.warehouseCountry.toLowerCase()} flag-icon`}></span>
                            <div style={{ fontSize: '8px' }}>{record.warehouseCountry}</div>
                        </div>
                    }
                    childrenAfter={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}></span>
                            <div style={{ fontSize: '8px' }}>{record.receiverCountry}</div>
                        </div>
                }
                >
                </TableCell>,
            dataIndex: 'icon',
            // key: 'icon',
        },
        {
            title: <TitleColumn title="" minWidth="20px" maxWidth="20px" contentPosition="start"
            />,
            render: (text: string, record: AmazonPrepOrderType) => (
                <TableCell
                    className='no-padding'
                    minWidth="20px"
                    maxWidth="20px"
                    contentPosition="center"
                    childrenAfter ={
                        <span style={{marginTop:'3px'}}>{record.notifications ? <Icon name="notification" />: null}</span>}
                >
                </TableCell>

            ),
            dataIndex: 'notifications',
            key: 'notifications',
            sorter: true,
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="" minWidth="60px" maxWidth="60px" contentPosition="start" childrenBefore={<Tooltip title={t('listColumns.statusHint')}><span>{t('listColumns.status')}</span></Tooltip>}
                    />,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.statusGroup);
                return (
                    <TableCell
                        minWidth="60px"
                        maxWidth="60px"
                        contentPosition="start"
                        childrenAfter={
                            <span style={{
                                borderBottom: `2px solid ${underlineColor}`,
                                display: 'inline-block',
                            }}>
                        {text}
                        </span>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
        },
        {
            title: <TitleColumn minWidth="80px" maxWidth="80px" contentPosition="start" childrenBefore={<Tooltip title={t('listColumns.dateHint')}><span>{t('listColumns.date')}</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="80px" maxWidth="80px" contentPosition="start"  />
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
        },
        {
            title: <TitleColumn minWidth="80px" maxWidth="80px" contentPosition="start" childrenBefore={<Tooltip title={t('listColumns.whNumberHint')}><span>{t('listColumns.whNumber')}</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer'/>
            ),
            dataIndex: 'wapiTrackingNumber',
            key: 'wapiTrackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleEditAmazonPrepOrder(record.uuid)}
                };
            },
        },
        {
            title: <TitleColumn minWidth="100px" maxWidth="100px" contentPosition="start" childrenBefore={<Tooltip title={t('listColumns.asnHint')}><span>{t('listColumns.asn')}</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="start"/>
            ),
            dataIndex: 'asnNumber',
            key: 'asnNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleEditAmazonPrepOrder(record.uuid)}
                };
            },
            responsive: ['md'],
        },
        {
            title: <TitleColumn minWidth="100px" maxWidth="100px" contentPosition="start" childrenBefore={<Tooltip title={t('listColumns.orderIdHint')}><span>{t('listColumns.orderId')}</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="start"/>
            ),
            dataIndex: 'clientOrderID',
            key: 'clientOrderID',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="60px" maxWidth="60px" contentPosition="start" childrenBefore={<Tooltip title={t('listColumns.warehouseHint')}><span>{t('listColumns.warehouse')}</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start"/>
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn minWidth="60px" maxWidth="60px" contentPosition="start" childrenBefore={<Tooltip title={t('listColumns.courierHint')}><span>{t('listColumns.courier')}</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start"/>
            ),
            dataIndex: 'courierService',
            key: 'courierService',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn minWidth="40px" maxWidth="40px" contentPosition="center" childrenBefore={<Tooltip title={t('listColumns.methodHint')}><span>{t('listColumns.method')}</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'deliveryMethod',
            key: 'deliveryMethod',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="50px"
                maxWidth="50px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title={t('listColumns.productsHint')} >
                        <span><Icon name={"shopping-cart"}/></span>
                    </Tooltip>
                }
            />,
            render: (text: string, record: AmazonPrepOrderType) => (
                <TableCell
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenAfter ={
                        <Popover
                            content={record.products.length ? <SimplePopup
                                items={getProductItems(record)}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span style={{width: curWidth}} className="products-cell-style">{text} <Icon name="info" /></span>
                        </Popover>
                    }
                />
            ),
            dataIndex: 'productLines',
            key: 'productLines',
            sorter: true,
            onHeaderCell: (column: ColumnType<AmazonPrepOrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof AmazonPrepOrderType),
            }),
            responsive: ['lg'],
        },
        ];
    return (
        <div className="table">
            <Head>
                <title>{t('headerTitle')}</title>
                <meta name="amazon prep" content="amazon prep" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
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
                    <CurrentFilters title={tCommon('filters.status')} filterState={filterStatus} options={transformedStatuses} onClose={()=>setFilterStatus([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)}} />
                    <CurrentFilters title={tCommon('filters.warehouse')} filterState={filterWarehouse} options={transformedWarehouses} onClose={()=>setFilterWarehouse([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterWarehouse(true)}}/>
                    <CurrentFilters title={tCommon('filters.receiverCountry')} filterState={filterReceiverCountry} options={transformedReceiverCountries} onClose={()=>setFilterReceiverCountry([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterReceiverCountry(true)}} />
                </div>
                <div className="page-size-container">
                    <span className="page-size-text"></span>
                    <PageSizeSelector
                        options={PageOptions(tCommon)}
                        value={pageSize}
                        onChange={(value: number) => handleChangePageSize(value)}
                    />
                </div>
            </div>

            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredOrders?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={filteredOrders.map(item => ({...item, key:item.uuid})).slice((current - 1) * pageSize, current * pageSize)}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                    showSorterTooltip={false}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>{t('totalOrders')}:<span className='order-products-total__list-item__value'>{filteredOrders.length}</span></li>
                    </ul>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={filteredOrders.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                    itemRender={itemRender(tCommon)}
                />
             </div>

            <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible} onClearFilters={handleClearAllFilters}>
                <FiltersBlock filterTitle={tCommon('filters.status')} filterOptions={transformedStatuses} filterState={filterStatus} setFilterState={setFilterStatus} isOpen={isOpenFilterStatus} setIsOpen={setIsOpenFilterStatus}/>
                <FiltersBlock filterTitle={tCommon('filters.warehouse')} filterOptions={transformedWarehouses} filterState={filterWarehouse} setFilterState={setFilterWarehouse} isOpen={isOpenFilterWarehouse} setIsOpen={setIsOpenFilterWarehouse}/>
                <FiltersBlock filterTitle={tCommon('filters.receiverCountry')} isCountry={true} filterOptions={transformedReceiverCountries} filterState={filterReceiverCountry} setFilterState={setFilterReceiverCountry} isOpen={isOpenFilterReceiverCountry} setIsOpen={setIsOpenFilterReceiverCountry}/>
            </FiltersContainer>

        </div>
    );
};

export default React.memo(AmazonPrepList);
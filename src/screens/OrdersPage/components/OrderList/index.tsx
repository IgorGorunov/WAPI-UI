import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Pagination, Table, TableColumnProps, Tooltip} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@/styles/tables.scss";
import Selector from "@/components/InputSelect";
import Icon from "@/components/Icon";
import getSymbolFromCurrency from 'currency-symbol-map';
import {StatusColors} from '@/screens/DashboardPage/components/OrderStatuses';
import UniversalPopup from "@/components/UniversalPopup";
import {ColumnType} from "antd/es/table";
import DateInput from "@/components/DateInput";
import {DateRangeType} from "@/types/dashboard";
import {OrderType} from "@/types/orders";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, {ButtonVariant} from "@/components/Button/Button";
import Head from "next/head";
import {FormFieldTypes} from "@/types/forms";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchField from "@/components/SearchField";
import {Countries} from "@/types/countries";
import FiltersBlock from "@/components/FiltersBlock";
import CurrentFilters from "@/components/CurrentFilters";


type OrderListType = {
    orders: OrderType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredOrders: React.Dispatch<React.SetStateAction<OrderType[]>>;
    handleEditOrder(uuid: string): void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const isFilterBurger = true;

const OrderList: React.FC<OrderListType> = ({orders, currentRange, setCurrentRange, setFilteredOrders,handleEditOrder}) => {

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDisplayedPopup, setIsDisplayedPopup] = useState(false);
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [hoveredOrder, setHoveredOrder] = useState<OrderType | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);

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

    const productItems = orders.flatMap(order => {
        return order.products.map(orderItem => ({
            uuid: order.uuid,
            title: orderItem.product,
            description: orderItem.quantity
        }));
    }).filter(item => item.uuid === hoveredOrder?.uuid);

    const troubleStatusesItems = orders.flatMap(order => {
        return order.troubleStatuses.map(orderItem => ({
            uuid: order.uuid,
            title: orderItem.period,
            description: orderItem.troubleStatus + ': ' + orderItem.additionalInfo,
        }));
    }).filter(item => item.uuid === hoveredOrder?.uuid);

    const claimItems = orders.flatMap(order => {
        return order.claims.map(orderItem => ({
            uuid: order.uuid,
            title: orderItem.date,
            description: orderItem.status,
        }));
    }).filter(item => item.uuid === hoveredOrder?.uuid);

    const receiverItem = orders.flatMap(order => [
        { uuid: order.uuid, title: "Country", description: order.receiverCountry },
        { uuid: order.uuid, title: "City", description: order.receiverCity },
        { uuid: order.uuid, title: "Zip", description: order.receiverZip },
        { uuid: order.uuid, title: "Address", description: order.receiverAddress },
        { uuid: order.uuid, title: "Full name", description: order.receiverFullName },
        { uuid: order.uuid, title: "Phone", description: order.receiverPhone },
        { uuid: order.uuid, title: "E-mail", description: order.receiverEMail },
        { uuid: order.uuid, title: "Comment", description: order.receiverComment },
    ]).filter(item => item.uuid === hoveredOrder?.uuid);

    const statusAdditionalInfoItem = orders.flatMap(order => [
        { uuid: order.uuid, title: order.lastUpdateDate, description: order.statusAdditionalInfo },
    ]).filter(item => item.uuid === hoveredOrder?.uuid);


    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    // const allStatuses = orders.map(order => order.status);
    const uniqueStatuses = useMemo(() => {
        const statuses = orders.map(order => order.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [orders]);
    uniqueStatuses.sort();
    const transformedStatuses = useMemo(() => ([
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
        }))
    ]), [uniqueStatuses]);

    const [filterTroubleStatus, setFilterTroubleStatus] = useState<string[]>([]);

    const uniqueTroubleStatuses = useMemo(() => {
        const statuses = orders.map(order => order.lastTroubleStatus);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [orders]);
    uniqueStatuses.sort();
    const transformedTroubleStatuses = useMemo(() => ([
        {
            value: '-All trouble statuses-',
            label: '-All trouble statuses-',
        },
        ...uniqueTroubleStatuses.map(status => ({
            value: status,
            label: status,
        }))
    ]), [uniqueTroubleStatuses]);

    const [filterClaims, setFilterClaims] = useState<string[]>([]);
    const claimFilterOptions = useMemo(() => ([
        {
            value: 'With claims',
            label: 'With claims',
        },
        {
            value: 'Without claims',
            label: 'Without claims',
        },
    ]), []);

    const [filterWarehouse, setFilterWarehouse] = useState<string[]>([]);
    // const allWarehouses = orders.map(order => order.warehouse);
    const uniqueWarehouses = useMemo(() => {
        const warehouses = orders.map(order => order.warehouse);
        return Array.from(new Set(warehouses)).filter(warehouse => warehouse).sort();
    }, [orders]);
    uniqueWarehouses.sort();
    const transformedWarehouses = useMemo(() => ([
        ...uniqueWarehouses.map(warehouse => ({
            value: warehouse,
            label: warehouse,
        }))
    ]), [uniqueWarehouses]);

    const [filterCourierService, setFilterCourierService] = useState<string[]>([]);
    // const allCourierServices = orders.map(order => order.courierService);
    const uniqueCourierServices = useMemo(() => {
        const courierServices = orders.map(order => order.courierService);
        return Array.from(new Set(courierServices)).filter(courier => courier).sort();
    }, [orders]);
    uniqueCourierServices.sort();
    const transformedCourierServices = useMemo(() => ([
        ...uniqueCourierServices.map(courier => ({
            value: courier,
            label: courier,
        }))
    ]), [uniqueCourierServices]);

    const [filterReceiverCountry, setFilterReceiverCountry] = useState<string[]>([]);
    // const allReceiverCountries = orders.map(order => order.receiverCountry);
    const uniqueReceiverCountries = useMemo(() => {
        const receiverCountries = orders.map(order => order.receiverCountry);
        return Array.from(new Set(receiverCountries)).filter(country => country).sort();
    }, [orders]);
    uniqueReceiverCountries.sort();
    const transformedReceiverCountries = useMemo(() => ([
        ...uniqueReceiverCountries.map(country => ({
            value: country,
            label: Countries[country] as string || country
        }))
    ]), [uniqueReceiverCountries]);


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

    const [sortColumn, setSortColumn] = useState<keyof OrderType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof OrderType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    const filteredOrders = useMemo(() => {
        setCurrent(1);

        return orders.filter(order => {

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
                return false;
            });

            const matchesStatus = !filterStatus.length ||
                (filterStatus.includes(order.status));
            const matchesTroubleStatus = !filterTroubleStatus.length || (filterTroubleStatus.includes('-All trouble statuses-') && order.lastTroubleStatus.length) ||
                filterTroubleStatus.includes(order.lastTroubleStatus);
            const matchesClaims = !filterClaims.length || (filterClaims.includes('With claims') && order.claimsExist) ||
                (filterClaims.includes('Without claims') && !order.claimsExist);
            const matchesWarehouse = !filterWarehouse.length ||
                filterWarehouse.map(item=>item.toLowerCase()).includes(order.warehouse.toLowerCase());
            const matchesCourierService = !filterCourierService.length ||
                filterCourierService.map(item=>item.toLowerCase()).includes(order.courierService.toLowerCase());
            const matchesReceiverCountry = !filterReceiverCountry.length ||
                filterReceiverCountry.map(item => item.toLowerCase()).includes(order.receiverCountry.toLowerCase());
            return matchesSearch && matchesStatus && matchesTroubleStatus && matchesClaims && matchesWarehouse && matchesCourierService && matchesReceiverCountry;
        }).sort((a, b) => {
            if (!sortColumn) return 0;
            if (sortDirection === 'ascend') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        });
    }, [orders, searchTerm, filterStatus, filterTroubleStatus, filterClaims, filterWarehouse, filterCourierService, filterReceiverCountry, sortColumn, sortDirection, fullTextSearch]);

    const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        setShowDatepicker(false);
    };

    //filters
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(prevState => !prevState);
    };
    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
    const [isOpenFilterTroubleStatus, setIsOpenFilterTroubleStatus] = useState(false);
    const [isOpenFilterClaim, setIsOpenFilterClaim] = useState(false);
    const [isOpenFilterWarehouse, setIsOpenFilterWarehouse] = useState(false);
    const [isOpenFilterCourierStatus, setIsOpenFilterCourierStatus] = useState(false);
    const [isOpenFilterReceiverCountry, setIsOpenFilterReceiverCountry] = useState(false);


    useEffect(() => {
        setFilteredOrders(filteredOrders);

    }, [filteredOrders]);

    const columns: TableColumnProps<OrderType>[]  = [
        {
            title: <TitleColumn
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenBefore={<Icon name={"car"}/>}>
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
                            <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}
                                  onClick={(e) => {
                                      setHoveredOrder(record);
                                      setHoveredColumn('receiver');
                                      setMousePosition({ x: e.clientX, y: e.clientY });
                                      setIsDisplayedPopup(!isDisplayedPopup);
                                  }}
                                  onMouseEnter={(e) => {
                                      setHoveredOrder(record);
                                      setHoveredColumn('receiver');
                                      setMousePosition({ x: e.clientX, y: e.clientY });
                                      setIsDisplayedPopup(true);

                                  }}
                                  onMouseLeave={() => {
                                      setHoveredOrder(null);
                                      setHoveredColumn('');
                                      setMousePosition(null);
                                      setIsDisplayedPopup(false);
                                  }}
                            />
                            <div style={{ fontSize: '8px' }}>{record.receiverCountry}</div>
                        </div>
                }
                >
                </TableCell>,
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: <TitleColumn
                minWidth="24px"
                maxWidth="24px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="This column displays if order has Claims" color='#5380F5'>
                        <span><Icon name={"complaint"}/></span>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                return (
                    <TableCell
                        minWidth="24px"
                        maxWidth="24px"
                        contentPosition="center"
                        childrenBefore={
                            record.claimsExist && (
                                <div style={{
                                    minHeight: '8px',
                                    minWidth: '8px',
                                    backgroundColor: 'red',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    alignSelf: 'center',
                                }}
                                     onClick={(e) => {
                                         setHoveredOrder(record);
                                         setHoveredColumn('claims');
                                         setMousePosition({ x: e.clientX, y: e.clientY });
                                         setIsDisplayedPopup(!isDisplayedPopup);

                                     }}
                                     onMouseEnter={(e) => {
                                         setHoveredOrder(record);
                                         setHoveredColumn('claims');
                                         setMousePosition({ x: e.clientX, y: e.clientY });
                                         setIsDisplayedPopup(true);

                                     }}
                                     onMouseLeave={() => {
                                         setHoveredOrder(null);
                                         setHoveredColumn('');
                                         setMousePosition(null);
                                         setIsDisplayedPopup(false);
                                     }}/>
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'claimsExist',
            key: 'claimsExist',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="24px"
                maxWidth="24px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="This column displays if order has Trouble statuses" color='#5380F5'>
                        <span><Icon name={"trouble"}/></span>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                return (
                    <TableCell
                        minWidth="24px"
                        maxWidth="24px"
                        contentPosition="center"
                        childrenBefore={
                            record.troubleStatusesExist && (
                                <div style={{
                                    minHeight: '8px',
                                    minWidth: '8px',
                                    backgroundColor: 'red',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    alignSelf: 'center',
                                }}
                                     onClick={(e) => {
                                         setHoveredOrder(record);
                                         setHoveredColumn('troubleStatus');
                                         setMousePosition({ x: e.clientX, y: e.clientY });
                                         setIsDisplayedPopup(!isDisplayedPopup);

                                     }}
                                     onMouseEnter={(e) => {
                                         setHoveredOrder(record);
                                         setHoveredColumn('troubleStatus');
                                         setMousePosition({ x: e.clientX, y: e.clientY });
                                         setIsDisplayedPopup(true);

                                     }}
                                     onMouseLeave={() => {
                                         setHoveredOrder(null);
                                         setHoveredColumn('');
                                         setMousePosition(null);
                                         setIsDisplayedPopup(false);
                                     }}/>
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'troubleStatus',
            key: 'troubleStatus',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="Status" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
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
                            }}
                          onClick={(e) => {
                              setHoveredOrder(record);
                              setHoveredColumn('statusAdditionalInfo');
                              setMousePosition({ x: e.clientX, y: e.clientY });
                              setIsDisplayedPopup(!isDisplayedPopup);

                          }}
                          onMouseEnter={(e) => {
                              setHoveredOrder(record);
                              setHoveredColumn('statusAdditionalInfo');
                              setMousePosition({ x: e.clientX, y: e.clientY });
                              setIsDisplayedPopup(true);

                          }}
                          onMouseLeave={() => {
                              setHoveredOrder(null);
                              setHoveredColumn('');
                              setMousePosition(null);
                              setIsDisplayedPopup(false);
                          }}
                        >
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
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="Date" minWidth="80px" maxWidth="80px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start"/>
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn title="WH number" minWidth="80px" maxWidth="80px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="80px"
                    maxWidth="80px"
                    contentPosition="start"
                    textColor='var(--color-blue)'
                    cursor='pointer'
                />
            ),
            dataIndex: 'wapiTrackingNumber',
            key: 'wapiTrackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleEditOrder(record.uuid)}
                };
            },
        },
        {
            title: <TitleColumn title="COD" minWidth="75px" maxWidth="75px" contentPosition="center"/>,
            render: (text: string, record) => {
                if (record.codCurrency) {
                    const currencySymbol = getSymbolFromCurrency(record.codCurrency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="center">
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell
                            value={'-'}
                            minWidth="75px"
                            maxWidth="75px"
                            contentPosition="center">
                        </TableCell>
                    );
                }
            },
            dataIndex: 'codAmount',
            key: 'codAmount',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Order ID" minWidth="80px" maxWidth="80px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start"/>
            ),

            dataIndex: 'clientOrderID',
            key: 'clientOrderID',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Warehouse" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start"/>
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Courier" minWidth="75px" maxWidth="75px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="75px" maxWidth="75px" contentPosition="start"/>
            ),
            dataIndex: 'courierService',
            key: 'courierService',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Tracking" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string, record) => (
                <TableCell  minWidth="60px" maxWidth="60px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer' childrenBefore={text && <span  className='track-link' >Track<Icon name='track'/></span> }/>
            ),
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {
                        if (record.trackingLink) {
                            window.open(record.trackingLink, '_blank');
                        }
                    },
                };
            },
            responsive: ['lg'],
        },
        {
            title: <TitleColumn
                minWidth="50px"
                maxWidth="50px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="This column displays Products" color='#5380F5'>
                        <span><Icon name={"shopping-cart"}/></span>
                    </Tooltip>
                }
            />,
            render: (text: string, record: OrderType) => (
                <TableCell
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenAfter ={
                    <span
                        className="products-cell-style"
                        onClick={(e) => {
                            setHoveredOrder(record);
                            setHoveredColumn('productLines');
                            setMousePosition({ x: e.clientX, y: e.clientY });
                            setIsDisplayedPopup(!isDisplayedPopup);
                        }}
                        onMouseEnter={(e) => {
                            setHoveredOrder(record);
                            setHoveredColumn('productLines');
                            setMousePosition({ x: e.clientX, y: e.clientY });
                            setIsDisplayedPopup(true);
                        }}
                        onMouseLeave={() => {
                            setHoveredOrder(null);
                            setHoveredColumn('');
                            setMousePosition(null);
                            setIsDisplayedPopup(false);
                        }}
                    >
                        {text} <Icon name="info" />
                    </span>}>
                </TableCell>

            ),
            dataIndex: 'productLines',
            key: 'productLines',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        },
    ];

    return (
        <div className="table">
            <Head>
                <title>Orders</title>
                <meta name="orders" content="orders" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div className="search-container">
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.MOBILE} icon={'filter'}></Button>
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <div className='search-block'>
                <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{setSearchTerm(""); handleFilterChange("");}} />
                <FieldBuilder {...fullTextSearchField} /></div>
            </div>
            {/*{isFiltersVisible && (*/}
            {/*<div className="filter-container">*/}
            {/*    /!*<DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />*!/*/}
            {/*    <Selector*/}
            {/*        label='Status:'*/}
            {/*        options={transformedStatuses}*/}
            {/*        value={filterStatus}*/}
            {/*        onChange={(value: string) => setFilterStatus(value)}*/}
            {/*    />*/}
            {/*    <Selector*/}
            {/*        label='Trouble status:'*/}
            {/*        options={transformedTroubleStatuses}*/}
            {/*        value={filterTroubleStatus}*/}
            {/*        onChange={(value: string) => setFilterTroubleStatus(value)}*/}
            {/*    />*/}
            {/*    <Selector*/}
            {/*        label='Claims:'*/}
            {/*        options={claimFilterOptions}*/}
            {/*        value={filterClaims}*/}
            {/*        onChange={(value: string) => setFilterClaims(value)}*/}
            {/*    />*/}
            {/*    <Selector*/}
            {/*        label='Warehouse:'*/}
            {/*        options={transformedWarehouses}*/}
            {/*        value={filterWarehouse}*/}
            {/*        onChange={(value: string) => setFilterWarehouse(value)}*/}
            {/*    />*/}
            {/*    <Selector*/}
            {/*        label='Courier service:'*/}
            {/*        options={transformedCourierServices}*/}
            {/*        value={filterCourierService}*/}
            {/*        onChange={(value: string) => setFilterCourierService(value)}*/}
            {/*    />*/}
            {/*    <Selector*/}
            {/*        label='Country:'*/}
            {/*        options={transformedReceiverCountries}*/}
            {/*        value={filterReceiverCountry}*/}
            {/*        onChange={(value: string) => setFilterReceiverCountry(value)}*/}
            {/*    />*/}

            {/*    </div>)}*/}
            <div className={`doc-filters-block ${isFiltersVisible ? 'is-visible' : ''} ${isFilterBurger ? 'is-fixed' : ""}`}>
                <div className='doc-filters-block__wrapper'>
                    <div className='filters-close' onClick={()=>setIsFiltersVisible(false)}>
                        <Icon name='close' />
                    </div>
                    <FiltersBlock filterTitle='Status' filterOptions={transformedStatuses} filterState={filterStatus} setFilterState={setFilterStatus} isOpen={isOpenFilterStatus} setIsOpen={setIsOpenFilterStatus}/>
                    <FiltersBlock filterTitle='Trouble status' filterOptions={transformedTroubleStatuses} isMultiple={false} filterState={filterTroubleStatus} setFilterState={setFilterTroubleStatus} isOpen={isOpenFilterTroubleStatus} setIsOpen={setIsOpenFilterTroubleStatus}/>
                    <FiltersBlock filterTitle='Claims' filterOptions={claimFilterOptions} filterState={filterClaims} setFilterState={setFilterClaims} isOpen={isOpenFilterClaim} setIsOpen={setIsOpenFilterClaim}/>
                    <FiltersBlock filterTitle='Warehouse' filterOptions={transformedWarehouses} filterState={filterWarehouse} setFilterState={setFilterWarehouse} isOpen={isOpenFilterWarehouse} setIsOpen={setIsOpenFilterWarehouse}/>
                    <FiltersBlock filterTitle='Courier service' filterOptions={transformedCourierServices} filterState={filterCourierService} setFilterState={setFilterCourierService} isOpen={isOpenFilterCourierStatus} setIsOpen={setIsOpenFilterCourierStatus}/>
                    <FiltersBlock filterTitle='Receiver country' filterOptions={transformedReceiverCountries} filterState={filterReceiverCountry} setFilterState={setFilterReceiverCountry} isOpen={isOpenFilterReceiverCountry} setIsOpen={setIsOpenFilterReceiverCountry}/>
                </div>
            </div>
            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    <CurrentFilters title='Status' filterState={filterStatus} options={transformedStatuses} onClose={()=>setFilterStatus([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)}} />
                    <CurrentFilters title='Trouble status' filterState={filterTroubleStatus} options={transformedTroubleStatuses} onClose={()=>setFilterTroubleStatus([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterTroubleStatus(true);}}/>
                    <CurrentFilters title='Claims' filterState={filterClaims} options={claimFilterOptions} onClose={()=>setFilterClaims([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterClaim(true)}} />
                    <CurrentFilters title='Warehouse' filterState={filterWarehouse} options={transformedWarehouses} onClose={()=>setFilterWarehouse([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterWarehouse(true)}}/>
                    <CurrentFilters title='Courier service' filterState={filterCourierService} options={transformedCourierServices} onClose={()=>setFilterCourierService([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterCourierStatus(true)}}/>
                    <CurrentFilters title='Receiver country' filterState={filterReceiverCountry} options={transformedReceiverCountries} onClose={()=>setFilterReceiverCountry([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterReceiverCountry(true)}} />
                </div>
                <div className="page-size-container">
                    <span className="page-size-text"></span>
                    <PageSizeSelector
                        options={pageOptions}
                        value={pageSize}
                        onChange={(value: number) => handleChangePageSize(value)}
                    />
                </div>

            </div>

            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredOrders?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={filteredOrders.slice((current - 1) * pageSize, current * pageSize)}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                />
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={filteredOrders.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>
            {hoveredOrder && isDisplayedPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: mousePosition?.y || 0,
                        left: mousePosition?.x || 0,
                    }}
                >
                    <UniversalPopup
                        width={
                            (() => {
                                switch (hoveredColumn) {
                                    case 'productLines':
                                        return null;
                                    case 'status':
                                        return 800;
                                    case 'statusAdditionalInfo':
                                        return 400;
                                    case 'receiver':
                                        return 350;
                                    default:
                                        return null;
                                }
                            })()
                        }
                        items={
                            (() => {
                                switch (hoveredColumn) {
                                    case 'productLines':
                                        return productItems;
                                    case 'claims':
                                        return claimItems;
                                    case 'troubleStatus':
                                        return troubleStatusesItems;
                                    case 'receiver':
                                        return receiverItem;
                                    case 'statusAdditionalInfo':
                                        return statusAdditionalInfoItem;
                                    default:
                                        return [];
                                }
                            })()
                        }
                        position={
                            (() => {
                                switch (hoveredColumn) {
                                    case 'productLines':
                                        return 'left';
                                    case 'status':
                                        return 'right';
                                    default:
                                        return 'right';
                                }
                            })()
                        }
                        handleClose={()=>setIsDisplayedPopup(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(OrderList);
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pagination, Table, TableColumnProps} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@/styles/tables.scss";
import Icon from "@/components/Icon";
import UniversalPopup from "@/components/UniversalPopup";
import {ColumnType} from "antd/es/table";
import DateInput from "@/components/DateInput";
import {DateRangeType} from "@/types/dashboard";
import {STOCK_MOVEMENT_DOC_TYPE, StockMovementType} from "@/types/stockMovements";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, {ButtonVariant} from "@/components/Button/Button";
import Head from "next/head";
import {FormFieldTypes} from "@/types/forms";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchField from "@/components/SearchField";
import {Countries} from "@/types/countries";
import CurrentFilters from "@/components/CurrentFilters";
import FiltersBlock from "@/components/FiltersBlock";
import SearchContainer from "@/components/SearchContainer";


type StockMovementsListType = {
    docType: STOCK_MOVEMENT_DOC_TYPE;
    docs: StockMovementType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredDocs: React.Dispatch<React.SetStateAction<StockMovementType[]>>;
    handleEditDoc(uuid: string): void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const StockMovementsList: React.FC<StockMovementsListType> = ({docType, docs, currentRange, setCurrentRange, setFilteredDocs, handleEditDoc }) => {

    console.log('docs:', docs);

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDisplayedPopup, setIsDisplayedPopup] = useState(false);
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [hoveredDoc, setHoveredDoc] = useState<StockMovementType | null>(null);
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

    const productItems = docs.flatMap(doc => {
        return doc.products.map(docItem => ({
            uuid: doc.uuid,
            title: docItem.product,
            description: docItem.quantity
        }));
    }).filter(item => item.uuid === hoveredDoc?.uuid);

    //filters
    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
    const [isOpenFilterSenderCountry, setIsOpenFilterSenderCountry] = useState(false);
    const [isOpenFilterSender, setIsOpenFilterSender] = useState(false);
    const [isOpenFilterReceiverCountry, setIsOpenFilterReceiverCountry] = useState(false);
    const [isOpenFilterReceiver, setIsOpenFilterReceiver] = useState(false);

    const calcOrderAmount = useCallback((property, value) => {
        return docs.filter(doc => doc[property].toLowerCase() === value.toLowerCase()).length || 0;
    },[docs]);

    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const uniqueStatuses = useMemo(() => {
        const statuses = docs.map(order => order.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [docs]);
    uniqueStatuses.sort();
    const transformedStatuses = useMemo(() => ([
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
            amount: calcOrderAmount('status', status),
        }))
    ]), [uniqueStatuses]);

    //SenderCountry
    const [filterSenderCountry, setFilterSenderCountry] = useState<string[]>([]);
    const senderCountryOptions = useMemo(() => {
        const senderCountries = docs.map(doc => doc.senderCountry);
        const uniqueSenderCountries = Array.from(new Set(senderCountries)).filter(senderCountry => senderCountry);

        return [
            ...uniqueSenderCountries.map(senderCountry => ({
                value: senderCountry,
                label: Countries[senderCountry] as string || senderCountry,
                amount: calcOrderAmount('senderCountry', senderCountry)
            })),
        ].sort((option1, option2)=> {return option1.label > option2.label ? 1 : -1});
    }, [docs]);

    //Sender
    const [filterSender, setFilterSender] = useState<string[]>([]);
    const senderOptions = useMemo(() => {
        const senders = docs.map(doc => doc.sender);
        const uniqueSenders = Array.from(new Set(senders)).filter(sender => sender).sort();

        return [
            ...uniqueSenders.map(sender => ({
                value: sender,
                label: sender,
                amount: calcOrderAmount('sender', sender),
            })),
        ];
    }, [docs]);

    //ReceiverCountry
    const [filterReceiverCountry, setFilterReceiverCountry] = useState<string[]>([]);
    const receiverCountryOptions = useMemo(() => {
        const receiverCountries = docs.map(doc => doc.receiverCountry);
        const uniqueReceiverCountries = Array.from(new Set(receiverCountries)).filter(receiverCountry => receiverCountry);

        return [
            ...uniqueReceiverCountries.map(receiverCountry => ({
                value: receiverCountry,
                label: Countries[receiverCountry] as string || receiverCountry,
                amount: calcOrderAmount('receiverCountry', receiverCountry),
            })),
        ].sort((option1, option2)=> {return option1.label > option2.label ? 1 : -1});
    }, [docs]);

    //Receiver
    const [filterReceiver, setFilterReceiver] = useState<string[]>([]);
    const receiverOptions = useMemo(() => {
        const receivers = docs.map(doc => doc.receiver);
        const uniqueReceivers = Array.from(new Set(receivers)).filter(receiver => receiver).sort();

        return [
            ...uniqueReceivers.map(receiver => ({
                value: receiver,
                label: receiver,
                amount: calcOrderAmount('receiver', receiver),
            })),
        ];
    }, [docs]);

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

    const [sortColumn, setSortColumn] = useState<keyof StockMovementType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof StockMovementType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    const filteredDocs = useMemo(() => {
        setCurrent(1);

        return docs.filter(doc => {

            const matchesSearch = !searchTerm.trim() || Object.keys(doc).some(key => {
                const value = doc[key];
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
                (filterStatus.includes(doc.status));

            const matchesSenderCountry = !filterSenderCountry.length ||
                filterSenderCountry.map(item=>item.toLowerCase()).includes(doc.senderCountry.toLowerCase());
            const matchesReceiverCountry = !filterReceiverCountry.length ||
                filterReceiverCountry.map(item => item.toLowerCase()).includes(doc.receiverCountry.toLowerCase());
            const matchesSender = docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS || !filterSender.length ||
                filterSender.map(item=>item.toLowerCase()).includes(doc.sender.toLowerCase());
            const matchesReceiver = docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND || !filterReceiver.length ||
                filterReceiver.map(item=>item.toLowerCase()).includes(doc.receiver.toLowerCase());
            return matchesSearch && matchesStatus && matchesSenderCountry && matchesReceiverCountry && matchesReceiver && matchesSender;
        }).sort((a, b) => {
            if (!sortColumn) return 0;
            if (sortDirection === 'ascend') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        });
    }, [docs, searchTerm, filterStatus, filterSenderCountry, filterReceiverCountry, filterReceiver, filterSender, sortColumn, sortDirection, fullTextSearch]);

    const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
        setShowDatepicker(false);
    };

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    useEffect(() => {
        setFilteredDocs(filteredDocs);

        console.log("filtered: ", filteredDocs)

    }, [filteredDocs]);

    const columns: TableColumnProps<StockMovementType>[]  = [
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
                            <span className={`fi fi-${record.senderCountry.toLowerCase()} flag-icon`}></span>
                            <div style={{ fontSize: '8px' }}>{record.senderCountry}</div>
                        </div>
                    }
                    childrenAfter={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}
                                  onClick={(e) => {
                                      setHoveredDoc(record);
                                      setHoveredColumn('receiver');
                                      setMousePosition({ x: e.clientX, y: e.clientY });
                                      setIsDisplayedPopup(!isDisplayedPopup);
                                  }}
                                  onMouseEnter={(e) => {
                                      setHoveredDoc(record);
                                      setHoveredColumn('receiver');
                                      setMousePosition({ x: e.clientX, y: e.clientY });
                                      setIsDisplayedPopup(true);

                                  }}
                                  onMouseLeave={() => {
                                      setHoveredDoc(null);
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
            title: <TitleColumn title="Status" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string, record) => {
                //const underlineColor = getUnderlineColor(record.status);
                return (
                    <TableCell
                        minWidth="60px"
                        maxWidth="60px"
                        contentPosition="start"
                        childrenAfter={
                            <span style={{
                                // borderBottom: `2px solid violet`,
                                display: 'inline-block',
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
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
        },
        {
            title: <TitleColumn title="Date" minWidth="75px" maxWidth="75px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="75px" maxWidth="75px" contentPosition="start"/>
            ),
            dataIndex: 'incomingDate',
            key: 'incomingDate',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
        },
        {
            title: <TitleColumn title="Incoming #" minWidth="70px" maxWidth="70px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="70px"
                    maxWidth="70px"
                    contentPosition="start"
                    textColor='var(--color-blue)'
                    cursor='pointer'
                />
            ),
            dataIndex: 'incomingNumber',
            key: 'incomingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleEditDoc(record.uuid)}
                };
            },
        },
        {
            title: <TitleColumn title="Sender" minWidth="80px" maxWidth="80px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="start"/>
            ),

            dataIndex: 'sender',
            key: 'sender',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Receiver" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="start"/>
            ),
            dataIndex: 'receiver',
            key: 'receiver',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="ETA" minWidth="50px" maxWidth="50px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="50px" maxWidth="50px" contentPosition="start"/>
            ),
            dataIndex: 'estimatedTimeArrives',
            key: 'estimatedTimeArrives',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['md'],
        },
        // {
        //     title: <TitleColumn title="Packa- ges" minWidth="30px" maxWidth="50px" contentPosition="start"/>,
        //     render: (text: string) => (
        //         <TableCell value={text} minWidth="30px" maxWidth="50px" contentPosition="start"/>
        //     ),
        //     dataIndex: 'packages',
        //     key: 'packages',
        //     sorter: true,
        //     onHeaderCell: (column: ColumnType<StockMovementType>) => ({
        //         onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
        //     }),
        //     responsive: ['lg'],
        // },
        // {
        //     title: <TitleColumn title="Pallet amount" minWidth="30px" maxWidth="50px" contentPosition="start"/>,
        //     render: (text: string) => (
        //         <TableCell value={text} minWidth="30px" maxWidth="50px" contentPosition="start"/>
        //     ),
        //     dataIndex: 'palletAmount',
        //     key: 'palletAmount',
        //     sorter: true,
        //     onHeaderCell: (column: ColumnType<StockMovementType>) => ({
        //         onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
        //     }),
        //     responsive: ['lg'],
        // },
        {
            title: <TitleColumn title="Volume" minWidth="40px" maxWidth="50px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="50px" contentPosition="start"/>
            ),
            dataIndex: 'volume',
            key: 'volume',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Weight gross" minWidth="40px" maxWidth="50px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="50px" contentPosition="start"/>
            ),
            dataIndex: 'weightGross',
            key: 'weightGross',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Weight net" minWidth="40px" maxWidth="50px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="50px" contentPosition="start"/>
            ),
            dataIndex: 'weightNet',
            key: 'weightNet',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Products" minWidth="70px" maxWidth="70px" contentPosition="start"/>,
            render: (text: string, record: StockMovementType) => {
                const productCount = record.products.reduce(
                    (accumulator, currentValue) => accumulator + currentValue.quantity,
                    0,
                );

                return (
                    <TableCell
                        minWidth="70px"
                        maxWidth="70px"
                        contentPosition="center"
                        childrenAfter ={
                        <span
                            className="products-cell-style"
                            onClick={(e) => {
                                setHoveredDoc(record);
                                setHoveredColumn('productLines');
                                setMousePosition({ x: e.clientX, y: e.clientY });
                                setIsDisplayedPopup(!isDisplayedPopup);
                            }}
                            onMouseEnter={(e) => {
                                setHoveredDoc(record);
                                setHoveredColumn('productLines');
                                setMousePosition({ x: e.clientX, y: e.clientY });
                                setIsDisplayedPopup(true);
                            }}
                            onMouseLeave={() => {
                                setHoveredDoc(null);
                                setHoveredColumn('');
                                setMousePosition(null);
                                setIsDisplayedPopup(false);
                            }}
                        >
                            {productCount} <Icon name="info" />
                        </span>}>
                    </TableCell>
                );
            },
            dataIndex: 'productLines',
            key: 'productLines',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
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
                    <CurrentFilters title='Status' filterState={filterStatus} options={transformedStatuses} onClose={()=>setFilterStatus([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)}} />
                    <CurrentFilters title='Sender' filterState={filterSender} options={senderOptions} onClose={()=>setFilterSender([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterSender(true)}}/>
                    <CurrentFilters title='Sender country' filterState={filterSenderCountry} options={senderCountryOptions} onClose={()=>setFilterSenderCountry([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterSenderCountry(true)}}/>
                    <CurrentFilters title='Receiver' filterState={filterReceiver} options={receiverOptions} onClose={()=>setFilterReceiver([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterReceiver(true)}}/>
                    <CurrentFilters title='Receiver country' filterState={filterReceiverCountry} options={receiverCountryOptions} onClose={()=>setFilterReceiverCountry([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterReceiverCountry(true)}} />
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
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredDocs?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={filteredDocs.slice((current - 1) * pageSize, current * pageSize)}
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
                    total={filteredDocs.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>
            <div  className={`doc-filters-block__overlay ${isFiltersVisible ? 'is-visible-overlay' : ''} `} onClick={()=>{setIsFiltersVisible(false); }} >
                <div className={`doc-filters-block ${isFiltersVisible ? 'is-visible' : ''} is-fixed`} onClick={(e)=>e.stopPropagation()}>
                    <div className='doc-filters-block__wrapper'>
                        <div className='filters-close' onClick={()=>setIsFiltersVisible(false)}>
                            <Icon name='close' />
                        </div>
                        <FiltersBlock filterTitle='Status' filterOptions={transformedStatuses} filterState={filterStatus} setFilterState={setFilterStatus} isOpen={isOpenFilterStatus} setIsOpen={setIsOpenFilterStatus}/>
                        <FiltersBlock filterTitle='Sender' filterState={filterSender} filterOptions={senderOptions} setFilterState={setFilterSender} isOpen={isOpenFilterSender} setIsOpen={setIsOpenFilterSender}/>
                        <FiltersBlock filterTitle='Sender country' filterState={filterSenderCountry} filterOptions={senderCountryOptions} setFilterState={setFilterSenderCountry} isOpen={isOpenFilterSenderCountry} setIsOpen={setIsOpenFilterSenderCountry}/>
                        <FiltersBlock filterTitle='Receiver' filterState={filterReceiver} filterOptions={receiverOptions} setFilterState={setFilterReceiver} isOpen={isOpenFilterReceiver} setIsOpen={setIsOpenFilterReceiver} />
                        <FiltersBlock filterTitle='Receiver country' filterOptions={receiverCountryOptions} filterState={filterReceiverCountry} setFilterState={setFilterReceiverCountry} isOpen={isOpenFilterReceiverCountry} setIsOpen={setIsOpenFilterReceiverCountry}/>
                    </div>
                </div>
            </div>
            {hoveredDoc && isDisplayedPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: mousePosition?.y || 0,
                        left: mousePosition?.x || 0,
                    }}
                >
                    <UniversalPopup
                        items={
                            (() => {
                                switch (hoveredColumn) {
                                    case 'productLines':
                                        return productItems;
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
                                    // case 'status':
                                    //     return 'right';
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

export default React.memo(StockMovementsList);
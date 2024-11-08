import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pagination, Popover, Table, TableColumnProps, Tooltip} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@/styles/tables.scss";
import Icon from "@/components/Icon";
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
import FiltersContainer from "@/components/FiltersContainer";
import {formatDateStringToDisplayString} from "@/utils/date";
import SimplePopup from "@/components/SimplePopup";
import {useIsTouchDevice} from "@/hooks/useTouchDevice";


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

const getDocType = (docType: STOCK_MOVEMENT_DOC_TYPE) => {
    if (docType===STOCK_MOVEMENT_DOC_TYPE.INBOUNDS) {
        return 'inbounds';
    } else if (docType===STOCK_MOVEMENT_DOC_TYPE.OUTBOUND) {
        return 'outbounds';
    } else if (docType===STOCK_MOVEMENT_DOC_TYPE.STOCK_MOVEMENT) {
        return 'stock movements';
    } else if (docType===STOCK_MOVEMENT_DOC_TYPE.LOGISTIC_SERVICE) {
            return 'logistic services';
    } else return 'documents'
}

const StockMovementsList: React.FC<StockMovementsListType> = ({docType, docs, currentRange, setCurrentRange, setFilteredDocs, handleEditDoc }) => {
    const isTouchDevice = useIsTouchDevice();

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [fullTextSearch, setFullTextSearch] = useState(true);
    const handleFullTextSearchChange = () => {
        setFullTextSearch(prevState => !prevState)
        if (searchTerm) {
            setCurrent(1);
        }
    }
    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearch',
        label: 'Full text search',
        checked: fullTextSearch,
        onChange: handleFullTextSearchChange,
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    }

    const getProductItems = useCallback((hoveredDoc) => {
        return hoveredDoc ? hoveredDoc.products.map(docItem => ({
            uuid: hoveredDoc.uuid,
            title: docItem.product,
            description: docItem.quantity
        })) : [];
    }, []);

    //filters
    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
    const [isOpenFilterSenderCountry, setIsOpenFilterSenderCountry] = useState(false);
    const [isOpenFilterSender, setIsOpenFilterSender] = useState(false);
    const [isOpenFilterReceiverCountry, setIsOpenFilterReceiverCountry] = useState(false);
    const [isOpenFilterReceiver, setIsOpenFilterReceiver] = useState(false);

    const calcOrderAmount = useCallback((property, value) => {
        return docs.filter(doc => doc[property] !== null && doc[property].toLowerCase() === value.toLowerCase()).length || 0;
    },[docs]);

    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const handleFilterStatusChange = (newStatuses: string[]) => {
        setFilterStatus(newStatuses);
        setCurrent(1);
    }
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

    // useEffect(() => {
    //     setFilterStatus(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueStatuses.includes(selectedValue))];
    //     })
    // }, [uniqueStatuses]);

    //SenderCountry
    const [filterSenderCountry, setFilterSenderCountry] = useState<string[]>([]);
    const handleFilterSenderCountryChange = (newValue: string[]) => {
        setFilterSenderCountry(newValue);
        setCurrent(1);
    }
    const uniqueSenderCountries = useMemo(() => {
        const senderCountries = docs.map(doc => doc.senderCountry);
        return Array.from(new Set(senderCountries)).filter(senderCountry => senderCountry);
    }, [docs]);
    uniqueSenderCountries.sort();

    const senderCountryOptions = useMemo(() => {
        return [
            ...uniqueSenderCountries.map(senderCountry => ({
                value: senderCountry,
                label: Countries[senderCountry] as string || senderCountry,
                amount: calcOrderAmount('senderCountry', senderCountry)
            })),
        ].sort((option1, option2)=> {return option1.label > option2.label ? 1 : -1});
    }, [uniqueSenderCountries]);

    // useEffect(() => {
    //     setFilterSenderCountry(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueSenderCountries.includes(selectedValue))];
    //     })
    // }, [uniqueSenderCountries]);

    //Sender
    const [filterSender, setFilterSender] = useState<string[]>([]);
    const handleFilterSenderChange = (newValue: string[]) => {
        setFilterSender(newValue);
        setCurrent(1);
    }
    const uniqueSenders = useMemo(() => {
        const senders = docs.map(doc => doc.sender);
        return Array.from(new Set(senders)).filter(sender => sender).sort();
    }, [docs]);
    uniqueSenders.sort();

    const senderOptions = useMemo(() => {
        return [
            ...uniqueSenders.map(sender => ({
                value: sender,
                label: sender,
                amount: calcOrderAmount('sender', sender),
            })),
        ];
    }, [uniqueSenders]);

    // useEffect(() => {
    //     setFilterSender(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueSenders.includes(selectedValue))];
    //     })
    // }, [uniqueSenders]);

    //ReceiverCountry
    const [filterReceiverCountry, setFilterReceiverCountry] = useState<string[]>([]);
    const handleFilterReceiverCountryChange = (newValue: string[]) => {
        setFilterReceiverCountry(newValue);
        setCurrent(1);
    }
    const uniqueReceiverCountries = useMemo(() => {
        const receiverCountries = docs.map(doc => doc.receiverCountry);
        return Array.from(new Set(receiverCountries)).filter(receiverCountry => receiverCountry);
    }, [docs]);
    uniqueReceiverCountries.sort();

    const receiverCountryOptions = useMemo(() => {
        return [
            ...uniqueReceiverCountries.map(receiverCountry => ({
                value: receiverCountry,
                label: Countries[receiverCountry] as string || receiverCountry,
                amount: calcOrderAmount('receiverCountry', receiverCountry),
            })),
        ].sort((option1, option2)=> {return option1.label > option2.label ? 1 : -1});
    }, [uniqueReceiverCountries]);

    // useEffect(() => {
    //     setFilterReceiverCountry(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueReceiverCountries.includes(selectedValue))];
    //     })
    // }, [uniqueReceiverCountries]);

    //Receiver
    const [filterReceiver, setFilterReceiver] = useState<string[]>([]);
    const handleFilterReceiverChange = (newValue: string[]) => {
        setFilterReceiver(newValue);
        setCurrent(1);
    }
    const uniqueReceivers = useMemo(() => {
        const receivers = docs.map(doc => doc.receiver);
        return Array.from(new Set(receivers)).filter(receiver => receiver).sort();
    }, [docs]);
    uniqueReceivers.sort();

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
    }, [uniqueReceivers]);

    // useEffect(() => {
    //     setFilterReceiver(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueReceivers.includes(selectedValue))];
    //     })
    // }, [uniqueReceivers]);

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
        setCurrent(1)
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
        //setCurrent(1);

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
            const matchesSender =  !filterSender.length ||
                filterSender.map(item=>item.toLowerCase()).includes(doc.sender.toLowerCase());
            const matchesReceiver =  !filterReceiver.length ||
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


    const handleDateRangeSave = (newRange) => {
        setCurrentRange(newRange);
    };

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const handleClearAllFilters = () => {
        setFilterStatus([]);
        setFilterSender([]);
        setFilterSenderCountry([]);
        setFilterReceiver([]);
        setFilterReceiverCountry([]);

        setCurrent(1);
        //close filter modal
        //setIsFiltersVisible(false);
    }

    useEffect(() => {
        setFilteredDocs(filteredDocs);
    }, [filteredDocs]);

    const curWidth = useMemo(()=>{
        const displayedData = filteredDocs.slice((current - 1) * pageSize, current * pageSize);
        const maxAmount = displayedData.reduce((acc,item)=> Math.max(acc, item.products.reduce(
            (accumulator, currentValue) => accumulator + currentValue.quantity,
            0,
        )),0).toString().length;
        const width = 47+maxAmount*9;
        return width.toString()+'px';
    },[current,pageSize, filteredDocs]);

    const columns: TableColumnProps<StockMovementType>[]  = [
        {
            title: <TitleColumn
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenBefore={
                        <Tooltip title="Sender country ➔ Receiver country" >
                            <span><Icon name={"car"}/></span>
                        </Tooltip>
                    }
            >
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
                            />
                            <div style={{ fontSize: '8px' }}>{record.receiverCountry}</div>
                        </div>

                    }
                />,
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="100px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title={`Current condition or state of ${getDocType(docType).substring(0, getDocType(docType).length - 1)} with estimated date`}>
                        <span>Status</span>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                //const underlineColor = getUnderlineColor(record.status);
                return (
                    <TableCell
                        minWidth="100px"
                        maxWidth="100px"
                        contentPosition="start"
                        childrenBefore={
                            <div>
                                <div>
                                    {text}
                                </div>
                                <div style={{fontSize:'9px', marginTop: '4px'}}>
                                    {record.statusDate !='0001-01-01T00:00:00'
                                        ? <>ETA: {formatDateStringToDisplayString(record.statusDate)}</>
                                        : record.estimatedTimeArrives && record.estimatedTimeArrives != '0001-01-01T00:00:00'
                                            ? <>ETA: {formatDateStringToDisplayString(record.estimatedTimeArrives)}</>
                                            : ''
                                    }
                                </div>
                            </div>
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
            title: <TitleColumn minWidth="80px" maxWidth="80px" contentPosition="start" childrenBefore={<Tooltip title="When an order was created"><span>Date</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="80px" maxWidth="80px" contentPosition="start"/>
            ),
            dataIndex: 'incomingDate',
            key: 'incomingDate',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
        },
        {
            title: <TitleColumn minWidth="70px" maxWidth="700px" contentPosition="start"  childrenBefore={<Tooltip title="Document identifier within the WAPI system"><span>Number</span></Tooltip>}/>,
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
            dataIndex: 'number',
            key: 'number',
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
            title: <TitleColumn minWidth="120px" maxWidth="200px" contentPosition="start" childrenBefore={<Tooltip title="Document number in the seller's system"><span>Incoming #</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="120px"
                    maxWidth="200px"
                    contentPosition="start"
                />
            ),
            dataIndex: 'incomingNumber',
            key: 'incomingNumber',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn minWidth="100px" maxWidth="120px" contentPosition="start" childrenBefore={<Tooltip title="The source responsible for initiating the movement of products"><span>Sender</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="120px" contentPosition="start"/>
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
            title: <TitleColumn minWidth="100px" maxWidth="120px" contentPosition="start" childrenBefore={<Tooltip title="The recipient of products"><span>Receiver</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="120px" contentPosition="start"/>
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
            title: <TitleColumn minWidth="80px" maxWidth="80px" contentPosition="start" childrenBefore={<Tooltip title="Estimated arrival time"><span>ETA</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={formatDateStringToDisplayString(text)} minWidth="80px" maxWidth="80px" contentPosition="start"/>
            ),
            dataIndex: 'estimatedTimeArrives',
            key: 'estimatedTimeArrives',
            sorter: true,
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="70px" maxWidth="70px" contentPosition="center" childrenBefore={
                <Tooltip title="Products" >
                    <span><Icon name={"shopping-cart"}/></span>
                </Tooltip>
            }/>,
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
                            <Popover
                                content={record.products.length ? <SimplePopup
                                    items={getProductItems(record)}
                                /> : null}
                                trigger={isTouchDevice ? 'click' : 'hover'}
                                placement="left"
                                overlayClassName="doc-list-popover"
                            >
                                <span style={{width: curWidth}} className="products-cell-style">{productCount} <Icon name="info" /></span>
                            </Popover>
                        }
                    />
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
                    <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{handleFilterChange("");}} />
                    <FieldBuilder {...fullTextSearchField} />
                </div>
            </SearchContainer>

            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    <CurrentFilters title='Status' filterState={filterStatus} options={transformedStatuses} onClose={()=>handleFilterStatusChange([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)}} />
                    <CurrentFilters title='Sender' filterState={filterSender} options={senderOptions} onClose={()=>handleFilterSenderChange([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterSender(true)}}/>
                    <CurrentFilters title='Sender country' filterState={filterSenderCountry} options={senderCountryOptions} onClose={()=>handleFilterSenderCountryChange([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterSenderCountry(true)}}/>
                    <CurrentFilters title='Receiver' filterState={filterReceiver} options={receiverOptions} onClose={()=>handleFilterReceiverChange([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterReceiver(true)}}/>
                    <CurrentFilters title='Receiver country' filterState={filterReceiverCountry} options={receiverCountryOptions} onClose={()=>handleFilterReceiverCountryChange([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterReceiverCountry(true)}} />
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
                    dataSource={filteredDocs.slice((current - 1) * pageSize, current * pageSize).map(item => ({...item, key:item.tableKey}))}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                    showSorterTooltip={false}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total {getDocType(docType)}:<span className='order-products-total__list-item__value'>{filteredDocs.length}</span></li>
                    </ul>
                </div>
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

            <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible} onClearFilters={handleClearAllFilters}>
                <FiltersBlock filterTitle='Status' filterOptions={transformedStatuses} filterState={filterStatus} setFilterState={handleFilterStatusChange} isOpen={isOpenFilterStatus} setIsOpen={setIsOpenFilterStatus}/>
                <FiltersBlock filterTitle='Sender' filterState={filterSender} filterOptions={senderOptions} setFilterState={handleFilterSenderChange} isOpen={isOpenFilterSender} setIsOpen={setIsOpenFilterSender}/>
                <FiltersBlock filterTitle='Sender country' isCountry={true} filterState={filterSenderCountry} filterOptions={senderCountryOptions} setFilterState={handleFilterSenderCountryChange} isOpen={isOpenFilterSenderCountry} setIsOpen={setIsOpenFilterSenderCountry}/>
                <FiltersBlock filterTitle='Receiver' filterState={filterReceiver} filterOptions={receiverOptions} setFilterState={handleFilterReceiverChange} isOpen={isOpenFilterReceiver} setIsOpen={setIsOpenFilterReceiver} />
                <FiltersBlock filterTitle='Receiver country' isCountry={true} filterOptions={receiverCountryOptions} filterState={filterReceiverCountry} setFilterState={handleFilterReceiverCountryChange} isOpen={isOpenFilterReceiverCountry} setIsOpen={setIsOpenFilterReceiverCountry}/>
            </FiltersContainer>
        </div>
    );
};

export default React.memo(StockMovementsList);
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pagination, Table, TableColumnProps, Tooltip} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@/styles/tables.scss";
import {ColumnType} from "antd/es/table";
import DateInput from "@/components/DateInput";
import {DateRangeType} from "@/types/dashboard";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, {ButtonVariant} from "@/components/Button/Button";
import Head from "next/head";
import {FormFieldTypes} from "@/types/forms";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchField from "@/components/SearchField";
import FiltersBlock from "@/components/FiltersBlock";
import CurrentFilters from "@/components/CurrentFilters";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";
import {ticketStatusColors, TicketType} from "@/types/tickets";
import {FILTER_TYPE} from "@/types/utility";
import {useRouter} from "next/router";
import Icon from "@/components/Icon";


type TicketListType = {
    tickets: TicketType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    handleEditTicket(uuid: string): void;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const TicketList: React.FC<TicketListType> = ({tickets, currentRange, setCurrentRange, handleEditTicket}) => {
    const router = useRouter();

    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect(() => {
    //     const {page, pageSize, periodStart, periodEnd} = query;
    //     if (pageSize) {
    //         setPageSize(+pageSize);
    //     }
    //     if (page) {
    //         setCurrent(+page);
    //     }
    // }, [query]);


    const [fullTextSearch, setFullTextSearch] = useState(true);
    const handleFullTextSearchChange = () => {
        setFullTextSearch(prevState => !prevState)
        if (searchTerm) {
            setCurrent(1);
            //setQuery({addParams: {page:1}})
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

    const calcOrderAmount = useCallback((property: string, value: string) => {
        return tickets.filter(order => order[property].toLowerCase() === value.toLowerCase()).length || 0;
    },[tickets]);


    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const handleFilterStatusChange = (newStatuses: string[]) => {
        setFilterStatus(newStatuses);
        setCurrent(1);
        //setQuery({addParams: {page:1}})
    }
    const uniqueStatuses = useMemo(() => {
        const statuses = tickets.map(order => order.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [tickets]);
    uniqueStatuses.sort();
    const statusOptions = useMemo(() => ([
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
            amount: calcOrderAmount('status', status),
            color: ticketStatusColors.filter(item=>item.value===status)[0]?.color || 'white',
        }))
    ]), [uniqueStatuses]);

    // useEffect(() => {
    //     setFilterStatus(prevState => {
    //         return [...prevState.filter(selectedStatus => uniqueStatuses.includes(selectedStatus))];
    //     })
    // }, [uniqueStatuses]);

    const [filterTopic, setFilterTopic] = useState<string[]>([]);
    const handleFilterTopicChange = (newTopics: string[]) => {
        setFilterTopic(newTopics);
        setCurrent(1);
        //setQuery({addParams: {page:1}})
    }
    const uniqueTopics = useMemo(() => {
        const topics = tickets.map(order => order.topic);
        return Array.from(new Set(topics)).filter(topic => topic).sort();
    }, [tickets]);
    const topicOptions = useMemo(() => ([
        ...uniqueTopics.map(item => ({
            value: item,
            label: item,
            amount: calcOrderAmount('topic', item),
        }))
    ]), [uniqueTopics]);

    const [filterNewMessages, setFilterNewMessages] = useState<string[]>([]);
    const handleFilterNewMessagesChange = (newMessages: string[]) => {
        setFilterNewMessages(newMessages);
        setCurrent(1);
        //setQuery({addParams: {page:1}})
    }
    const newMessagesOptions = useMemo(() => ([
        {
            value: 'Has new messages',
            label: 'Has new messages',
            amount: tickets ? tickets.filter(item=>item.newMessages).length : 0,
        },
        {
            value: "Doesn't have new messages",
            label: "Doesn't have new messages",
            amount: tickets ? tickets.length - tickets.filter(item=>item.newMessages).length : 0,
        },

    ]), [uniqueTopics]);



    const handleClearAllFilters = () => {
        setFilterStatus([]);
        setFilterTopic([]);
        setFilterNewMessages([]);

        setCurrent(1);
        //setQuery({addParams: {page:1}})
        //close filter modal
        //setIsFiltersVisible(false);
    }

    const handleChangePage = (page: number) => {
        setAnimating(true);
        setTimeout(() => {
            setCurrent(page);
            setAnimating(false);
        }, 500);
        //setQuery({addParams: {page: page}});
    };

    const handleChangePageSize = (size: number) => {
        setPageSize(size);
        setCurrent(1);

        //setQuery({addParams: {page:1, pageSize: size}});
    };

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTerm(newSearchTerm);
        setCurrent(1);
        //setQuery({addParams: {page:1}})
    };

    const [sortColumn, setSortColumn] = useState<keyof TicketType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof TicketType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    const filteredOrders = useMemo(() => {
        //setCurrent(1);

        return tickets.filter(ticket => {

            const matchesSearch = !searchTerm.trim() || Object.keys(ticket).some(key => {
                const value = ticket[key];
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
                (filterStatus.includes(ticket.status));
            const matchesTopic = !filterTopic.length ||
                (filterTopic.includes(ticket.topic));
            const matchesNewMessages = !filterNewMessages.length || (filterNewMessages.includes('Has new messages') && ticket.newMessages) ||
                (filterNewMessages.includes("Doesn't have new messages") && !ticket.newMessages);

            return matchesSearch && matchesStatus && matchesTopic && matchesNewMessages;
        }).sort((a, b) => {
            if (!sortColumn) return 0;
            if (sortDirection === 'ascend') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        });
    }, [tickets, searchTerm, filterStatus, filterTopic, filterNewMessages, sortColumn, sortDirection, fullTextSearch, currentRange]);

    useEffect(() => {
        console.log('tickets changed')
    }, [tickets]);

    const handleDateRangeSave = (newRange: DateRangeType) => {
        setCurrentRange(newRange);
        setCurrent(1);
        //setQuery({addParams: {page: 1, periodStart:formatDateToString(newRange.startDate), periodEnd:formatDateToString(newRange.endDate)}})
    };

    //filters
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(prevState => !prevState);
    };
    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
    const [isOpenFilterTopic, setIsOpenFilterTopic] = useState(false);
    const [isOpenFilterNewMessages, setIsOpenFilterNewMessages] = useState(true);

    const columns: TableColumnProps<TicketType>[]  = [
        {
            title: <TitleColumn title="" minWidth="5px" maxWidth="5px" contentPosition="start"/>,
            render: (status: string) => {
                const statusObj = ticketStatusColors.find(s => s.value === status);
                let color = statusObj ? statusObj.color : 'white';
                return (
                    <TableCell
                        minWidth="5px"
                        maxWidth="5px"
                        contentPosition="start"
                        childrenBefore={
                            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                                <div style={{
                                display: 'flex',
                                flex: '0 0 auto',
                                alignItems: 'center',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: color,
                            }}></div></div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="50px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Current ticket status" >
                        <span>Status</span>
                    </Tooltip>
                }
            />,
            render: (status: string) => {
                return (
                    <TableCell value={status} minWidth="50px" maxWidth="80px" contentPosition="start"/>
                );
            },
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="" minWidth="20px" maxWidth="20px" contentPosition="start"
            />,
            render: (text: string, record: TicketType) => (
                <TableCell
                    className='no-padding'
                    minWidth="20px"
                    maxWidth="20px"
                    contentPosition="center"
                    childrenAfter ={
                        <span style={{marginTop:'3px'}}>{record.newMessages ? <Icon name="notification" />: null}</span>}
                >
                </TableCell>

            ),
            dataIndex: 'newMessages',
            key: 'newMessages',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn
                minWidth="70px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Ticket number. Click on the number to view the correspondence" >
                        <span>Ticket #</span>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="70px"
                    maxWidth="80px"
                    contentPosition="start"
                    textColor='var(--color-blue)'
                    cursor='pointer'
                />
            ),
            dataIndex: 'number',
            key: 'number',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => {handleEditTicket(record.uuid)}
                };
            },
        },
        {
            title: <TitleColumn
                minWidth="80px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="When the ticket was created" >
                        <span>Date</span>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={formatDateTimeToStringWithDotWithoutSeconds(text)} minWidth="80px" maxWidth="120px" contentPosition="start"/>
            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
        },
        {
            title: <TitleColumn
                minWidth="90px"
                maxWidth="400px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Ticket subject" >
                        <span>Topic</span>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="90px" maxWidth="400px" contentPosition="start"/>
            ),

            dataIndex: 'topic',
            key: 'topic',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn
                minWidth="115px"
                maxWidth="500px"
                contentPosition="start"
                childrenBefore={
                    <Tooltip title="Ticket title" >
                        <span>Title</span>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="115px" maxWidth="500px" contentPosition="start"/>
            ),

            dataIndex: 'subject',
            key: 'subject',
            sorter: true,
            onHeaderCell: (column: ColumnType<TicketType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof TicketType),
            }),
        },

    ];

    //getting filter from query
    useEffect(() => {
        const { filter } = router.query;
        if (filter) {
            setFilterNewMessages(Array.isArray(filter) ? (filter.length ? filter : []) : [filter]);
            router.replace('/tickets', undefined, { shallow: true });

        }
    }, [router.query]);

    //const setQuery = createSetQueryFunction(router, '/tickets');

    return (
        <div className="table order-list">
            <Head>
                <title>Tickets</title>
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
                    <CurrentFilters title='Status' filterState={filterStatus} options={statusOptions} onClose={()=>handleFilterStatusChange([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)}} />
                    <CurrentFilters title='Topic' filterState={filterTopic} options={topicOptions} onClose={()=>handleFilterTopicChange([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterTopic(true)}} />
                    <CurrentFilters title='New messages' filterState={filterNewMessages} options={newMessagesOptions} onClose={()=>handleFilterNewMessagesChange([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterNewMessages(true)}} />
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
                    dataSource={filteredOrders.slice((current - 1) * pageSize, current * pageSize).map(item => ({
                        ...item,
                        key: item.tableKey,
                    }))}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total tickets:<span className='order-products-total__list-item__value'>{filteredOrders.length}</span></li>
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
                />
            </div>
            <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible} onClearFilters={handleClearAllFilters}>
                <FiltersBlock filterTitle='Status' filterType={FILTER_TYPE.COLORED_CIRCLE} filterOptions={statusOptions} filterState={filterStatus} setFilterState={handleFilterStatusChange} isOpen={isOpenFilterStatus} setIsOpen={setIsOpenFilterStatus}/>
                <FiltersBlock filterTitle='Topic' filterOptions={topicOptions} filterState={filterTopic} setFilterState={handleFilterTopicChange} isOpen={isOpenFilterTopic} setIsOpen={setIsOpenFilterTopic}/>
                <FiltersBlock filterTitle='New messages' filterOptions={newMessagesOptions} filterState={filterNewMessages} setFilterState={handleFilterNewMessagesChange} isOpen={isOpenFilterNewMessages} setIsOpen={setIsOpenFilterNewMessages}/>
            </FiltersContainer>
        </div>
    );
};

export default TicketList;
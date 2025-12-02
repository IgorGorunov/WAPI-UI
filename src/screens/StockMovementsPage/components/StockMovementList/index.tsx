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
import {FormFieldTypes} from "@/types/forms";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchField from "@/components/SearchField";
import {Countries} from "@/types/countries";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import {formatDateStringToDisplayString} from "@/utils/date";
import SimplePopup from "@/components/SimplePopup";
import {useIsTouchDevice} from "@/hooks/useTouchDevice";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import {isTabAllowed} from "@/utils/tabs";
import useAuth from "@/context/authContext";
import SelectField from "@/components/FormBuilder/Select/SelectField";


type StockMovementsListType = {
    docType: STOCK_MOVEMENT_DOC_TYPE;
    docs: StockMovementType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredDocs: React.Dispatch<React.SetStateAction<StockMovementType[]>>;
    handleEditDoc(uuid: string): void;
    forbiddenTabs: string[];
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

const StockMovementsList: React.FC<StockMovementsListType> = ({docType, docs, currentRange, setCurrentRange, setFilteredDocs, handleEditDoc, forbiddenTabs }) => {
    const isTouchDevice = useIsTouchDevice();
    const { needSeller, sellersList } = useAuth();

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
    //sellers filter
    const [selectedSeller, setSelectedSeller] = useState<string | null>('All sellers');
    const calcSellersAmount = useCallback((seller: string) => {
        return docs.filter(order => order.seller.toLowerCase() === seller.toLowerCase()).length || 0;
    },[docs]);

    const sellersOptions = useMemo(()=>{
        return [{label: 'All sellers', value: 'All sellers', amount: docs.length}, ...sellersList.map(item=>({...item, amount: calcSellersAmount(item.value)}))];
    }, [sellersList, calcSellersAmount]);

    const getSellerName = useCallback((sellerUid: string) => {
        const t = sellersList.find(item=>item.value===sellerUid);
        return t ? t.label : ' - ';
    }, [sellersList]);
    
    //other filters
    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
    const [isOpenFilterSenderCountry, setIsOpenFilterSenderCountry] = useState(false);
    const [isOpenFilterSender, setIsOpenFilterSender] = useState(false);
    const [isOpenFilterReceiverCountry, setIsOpenFilterReceiverCountry] = useState(false);
    const [isOpenFilterReceiver, setIsOpenFilterReceiver] = useState(false);
    const [isOpenFilterHasTickets, setIsOpenFilterHasTickets] = useState(false);
    const [isOpenFilterHasOpenTickets, setIsOpenFilterHasOpenTickets] = useState(false);

    const calcOrderAmount = useCallback((property, value) => {
        return docs.filter(doc => doc[property] !== null && doc[property].toLowerCase() === value.toLowerCase() && (selectedSeller==='All sellers' || doc.seller===selectedSeller)).length || 0;
    },[docs, selectedSeller]);

    const calcDocsWithBooleanProperty = useCallback((property: string, value: boolean) => {
        return docs.filter(doc => doc[property] === value && (selectedSeller==='All sellers' || doc.seller===selectedSeller)).length || 0;
    },[docs, selectedSeller]);

    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const handleFilterStatusChange = (newStatuses: string[]) => {
        setFilterStatus(newStatuses);
        setCurrent(1);
    }
    const uniqueStatuses = useMemo(() => {
        const statuses = docs.filter(doc=>selectedSeller==='All sellers' || doc.seller===selectedSeller).map(order => order.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [docs, selectedSeller]);
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
    const handleFilterSenderCountryChange = (newValue: string[]) => {
        setFilterSenderCountry(newValue);
        setCurrent(1);
    }
    const uniqueSenderCountries = useMemo(() => {
        const senderCountries = docs.filter(doc=>selectedSeller==='All sellers' || doc.seller===selectedSeller).map(doc => doc.senderCountry);
        return Array.from(new Set(senderCountries)).filter(senderCountry => senderCountry);
    }, [docs, selectedSeller]);
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

    //Sender
    const [filterSender, setFilterSender] = useState<string[]>([]);
    const handleFilterSenderChange = (newValue: string[]) => {
        setFilterSender(newValue);
        setCurrent(1);
    }
    const uniqueSenders = useMemo(() => {
        const senders = docs.filter(doc=>selectedSeller==='All sellers' || doc.seller===selectedSeller).map(doc => doc.sender);
        return Array.from(new Set(senders)).filter(sender => sender).sort();
    }, [docs, selectedSeller]);
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

    //ReceiverCountry
    const [filterReceiverCountry, setFilterReceiverCountry] = useState<string[]>([]);
    const handleFilterReceiverCountryChange = (newValue: string[]) => {
        setFilterReceiverCountry(newValue);
        setCurrent(1);
    }
    const uniqueReceiverCountries = useMemo(() => {
        const receiverCountries = docs.filter(doc=>selectedSeller==='All sellers' || doc.seller===selectedSeller).map(doc => doc.receiverCountry);
        return Array.from(new Set(receiverCountries)).filter(receiverCountry => receiverCountry);
    }, [docs, selectedSeller]);
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

    //Receiver
    const [filterReceiver, setFilterReceiver] = useState<string[]>([]);
    const handleFilterReceiverChange = (newValue: string[]) => {
        setFilterReceiver(newValue);
        setCurrent(1);
    }
    // const uniqueReceivers = useMemo(() => {
    //     const receivers = docs.filter(doc=>selectedSeller==='All sellers' || doc.seller===selectedSeller).map(doc => doc.receiver);
    //     return Array.from(new Set(receivers)).filter(receiver => receiver).sort();
    // }, [docs, selectedSeller]);
    // uniqueReceivers.sort();

    const receiverOptions = useMemo(() => {
        const receivers = docs.filter(doc=>selectedSeller==='All sellers' || doc.seller===selectedSeller).map(doc => doc.receiver);
        const uniqueReceivers = Array.from(new Set(receivers)).filter(receiver => receiver).sort();

        return [
            ...uniqueReceivers.map(receiver => ({
                value: receiver,
                label: receiver,
                amount: calcOrderAmount('receiver', receiver),
            })),
        ];
    }, [docs, selectedSeller]);

    //tickets
    const [filterHasTickets, setFilterHasTickets] = useState<string[]>([]);
    const handleFilterHasTicketsChange = (newValue: string[]) => {
        setFilterHasTickets(newValue);
        setCurrent(1);
    }
    const hasTicketsOptions = useMemo(() => ([
        {
            value: 'With tickets',
            label: 'With tickets',
            amount:  calcDocsWithBooleanProperty('ticket', true),
        },
        {
            value: "Without tickets",
            label: "Without tickets",
            amount: (docs.filter(doc=>selectedSeller==='All sellers' || doc.seller===selectedSeller).length - calcDocsWithBooleanProperty('ticket', true)),
        },
    ]), [docs, selectedSeller]);

    // open tickets
    const [filterHasOpenTickets, setFilterHasOpenTickets] = useState<string[]>([]);
    const handleFilterHasOpenTicketsChange = (newValue: string[]) => {
        setFilterHasOpenTickets(newValue);
        setCurrent(1);
    }
    const hasOpenTicketsOptions = useMemo(() => ([
        {
            value: 'With open tickets',
            label: 'With open tickets',
            amount:  calcDocsWithBooleanProperty('ticketopen', true),
        },
        {
            value: "Without open tickets",
            label: "Without open tickets",
            amount: (docs.filter(doc=>selectedSeller==='All sellers' || doc.seller===selectedSeller).length - calcDocsWithBooleanProperty('ticketopen', true)),
        },
    ]), [docs, selectedSeller]);

    const docFilters = [
        {
            filterTitle: 'Status',
            icon: 'status',
            filterDescriptions: '',
            filterOptions: transformedStatuses,
            filterState: filterStatus,
            setFilterState: handleFilterStatusChange,
            isOpen: isOpenFilterStatus,
            setIsOpen: setIsOpenFilterStatus,
            onClose: ()=>handleFilterStatusChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterStatus(true)},
        },
        {
            filterTitle: 'Sender',
            icon: 'sender',
            filterDescriptions: '',
            filterOptions: senderOptions,
            filterState: filterSender,
            setFilterState: handleFilterSenderChange,
            isOpen: isOpenFilterSender,
            setIsOpen: setIsOpenFilterSender,
            onClose: ()=>handleFilterSenderChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterSender(true)},
        },
        {
            filterTitle: 'Sender country',
            icon: 'country-out',
            isCountry: true,
            filterDescriptions: '',
            filterOptions: senderCountryOptions,
            filterState: filterSenderCountry,
            setFilterState: handleFilterSenderCountryChange,
            isOpen: isOpenFilterSenderCountry,
            setIsOpen: setIsOpenFilterSenderCountry,
            onClose: ()=>handleFilterSenderCountryChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterSenderCountry(true)},
        },
        {
            filterTitle: 'Receiver',
            icon: 'package-receiver',
            filterDescriptions: '',
            filterOptions: receiverOptions,
            filterState: filterReceiver,
            setFilterState: handleFilterReceiverChange,
            isOpen: isOpenFilterReceiver,
            setIsOpen: setIsOpenFilterReceiver,
            onClose: ()=>handleFilterReceiverChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterReceiver(true)},
        },
        {
            filterTitle: 'Receiver country',
            icon: 'country-in',
            isCountry: true,
            filterDescriptions: '',
            filterOptions: receiverCountryOptions,
            filterState: filterReceiverCountry,
            setFilterState: handleFilterReceiverCountryChange,
            isOpen: isOpenFilterReceiverCountry,
            setIsOpen: setIsOpenFilterReceiverCountry,
            onClose: ()=>handleFilterReceiverCountryChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterReceiverCountry(true)},
        },
        isTabAllowed('Tickets', forbiddenTabs) ? {
            filterTitle: 'Tickets',
            icon: 'ticket-gray',
            // isCountry: true,
            filterDescriptions: '',
            filterOptions: hasTicketsOptions,
            filterState: filterHasTickets,
            setFilterState: handleFilterHasTicketsChange,
            isOpen: isOpenFilterHasTickets,
            setIsOpen: setIsOpenFilterHasTickets,
            onClose: ()=>handleFilterHasTicketsChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterHasTickets(true)},
        } : null,
        isTabAllowed('Tickets', forbiddenTabs) ? {
            filterTitle: 'Tickets (open)',
            icon: 'ticket-open',
            // isCountry: true,
            filterDescriptions: '',
            filterOptions: hasOpenTicketsOptions,
            filterState: filterHasOpenTickets,
            setFilterState: handleFilterHasOpenTicketsChange,
            isOpen: isOpenFilterHasOpenTickets,
            setIsOpen: setIsOpenFilterHasOpenTickets,
            onClose: ()=>handleFilterHasOpenTicketsChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterHasOpenTickets(true)},
        } : null,

    ];


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
            const matchesHasTickets = !filterHasTickets.length || (filterHasTickets.includes('With tickets') && doc.ticket) ||
                (filterHasTickets.includes("Without tickets") && !doc.ticket);
            const matchesHasOpenTickets = !filterHasOpenTickets.length || (filterHasOpenTickets.includes('With open tickets') && doc.ticketopen) ||
                (filterHasOpenTickets.includes("Without open tickets") && !doc.ticketopen);

            const matchesSeller = !selectedSeller || selectedSeller==='All sellers' || doc.seller.toLowerCase() === selectedSeller.toLowerCase();

            return matchesSearch && matchesStatus && matchesSenderCountry && matchesReceiverCountry && matchesReceiver && matchesSender && matchesHasTickets && matchesHasOpenTickets && matchesSeller;
        }).sort((a, b) => {
            if (!sortColumn) return 0;
            if (sortDirection === 'ascend') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        });
    }, [docs, searchTerm, filterStatus, filterSenderCountry, filterReceiverCountry, filterReceiver, filterSender, filterHasTickets, filterHasOpenTickets, sortColumn, sortDirection, fullTextSearch, selectedSeller]);


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
        setFilterHasTickets([]);
        setFilterHasOpenTickets([]);

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

    const SellerColumns: TableColumnProps<StockMovementType>[] = [];
    if (needSeller()) {
        SellerColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="80px"
                maxWidth="100px"
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
                        minWidth="80px"
                        maxWidth="100px"
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
            onHeaderCell: (column: ColumnType<StockMovementType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof StockMovementType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<StockMovementType>);
    }

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
                        <>
                            <span>Status</span>
                            {sortColumn==='status' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                            {sortColumn==='status' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                        </>
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
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={<Tooltip title="When an order was created">
                    <>
                        <span>Date</span>
                        {sortColumn==='incomingDate' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='incomingDate' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                </Tooltip>}
            />,
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
            title: <TitleColumn
                minWidth="75px"
                maxWidth="700px"
                contentPosition="start"
                childrenBefore={<Tooltip title="Document identifier within the WAPI system">
                    <>
                        <span>Number</span>
                        {sortColumn==='number' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='number' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                </Tooltip>
            }/>,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="75px"
                    maxWidth="75px"
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
            title: <TitleColumn
                minWidth="120px"
                maxWidth="200px"
                contentPosition="start"
                childrenBefore={<Tooltip title="Document number in the seller's system">
                    <>
                        <span>Incoming #</span>
                        {sortColumn==='incomingNumber' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='incomingNumber' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                </Tooltip>}
            />,
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
        ...SellerColumns,
        {
            title: <TitleColumn
                minWidth="100px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={<Tooltip title="The source responsible for initiating the movement of products">
                    <>
                        <span>Sender</span>
                        {sortColumn==='sender' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='sender' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                </Tooltip>
            }/>,
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
            title: <TitleColumn
                minWidth="100px"
                maxWidth="120px"
                contentPosition="start"
                childrenBefore={<Tooltip title="The recipient of products">
                    <>
                        <span>Receiver</span>
                        {sortColumn==='receiver' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='receiver' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                </Tooltip>
            }/>,
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
            title: <TitleColumn
                minWidth="80px"
                maxWidth="80px"
                contentPosition="start"
                childrenBefore={<Tooltip title="Estimated arrival time">
                    <>
                        <span>ETA</span>
                        {sortColumn==='estimatedTimeArrives' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='estimatedTimeArrives' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </>
                </Tooltip>}
            />,
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
                    <span style={{display:'flex', alignItems:'center'}}>
                        <span><Icon name={"shopping-cart"}/></span>
                        {sortColumn==='productLines' && sortDirection==='ascend' ? <span className='lm-6'><Icon name='arrow-up-small' /></span> : null}
                        {sortColumn==='productLines' && sortDirection==='descend' ? <span className='lm-6'><Icon name='arrow-down-small' /></span> : null}
                    </span>
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
            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                <div className='search-block'>
                    <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{handleFilterChange("");}} />
                    <FieldBuilder {...fullTextSearchField} />
                </div>
            </SearchContainer>

            {needSeller() ?
                <div className='seller-filter-block'>
                    <SelectField
                        key='seller-filter'
                        name='selectedSeller'
                        label='Seller: '
                        value={selectedSeller}
                        onChange={(val)=>setSelectedSeller(val as  string)}
                        //options={[{label: 'All sellers', value: 'All sellers'}, ...sellersList]}
                        options={sellersOptions}
                        classNames='seller-filter full-sized'
                        isClearable={false}
                    />
                </div>
                : null
            }

            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    <FiltersChosen filters={docFilters.filter(item => item!==null)} />
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
                <FiltersListWithOptions filters={docFilters.filter(item => item!==null)} />
            </FiltersContainer>
        </div>
    );
};

export default React.memo(StockMovementsList);
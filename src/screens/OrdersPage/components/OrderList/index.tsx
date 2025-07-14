import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pagination, Popover, Table, TableColumnProps, Tooltip} from 'antd';
import PageSizeSelector from '@/components/LabelSelect';
import "./styles.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "@/styles/tables.scss";
import Icon from "@/components/Icon";
import getSymbolFromCurrency from 'currency-symbol-map';
import {StatusColors} from '@/screens/DashboardPage/components/OrderStatuses';
import {ColumnType} from "antd/es/table";
import DateInput from "@/components/DateInput";
import {DateRangeType} from "@/types/dashboard";
import {OrderType} from "@/types/orders";
import TitleColumn from "@/components/TitleColumn";
import TableCell from "@/components/TableCell";
import Button, {ButtonVariant} from "@/components/Button/Button";
import {FormFieldTypes} from "@/types/forms";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchField from "@/components/SearchField";
import {Countries} from "@/types/countries";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import {
    formatDateStringToDisplayString,
    formatDateTimeToStringWithDotWithoutSeconds,
    formatTimeStringFromString
} from "@/utils/date";
import {useIsTouchDevice} from "@/hooks/useTouchDevice";
import SimplePopup, {PopupItem} from "@/components/SimplePopup";
import FiltersChosen from "@/components/FiltersChosen";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import useNotifications from "@/context/notificationContext";
import {NotificationType} from "@/types/notifications";
import {isTabAllowed} from "@/utils/tabs";
import useAuth from "@/context/authContext";
import SelectField from "@/components/FormBuilder/Select/SelectField";

type OrderListType = {
    orders: OrderType[];
    currentRange: DateRangeType;
    setCurrentRange: React.Dispatch<React.SetStateAction<DateRangeType>>;
    setFilteredOrders: React.Dispatch<React.SetStateAction<OrderType[]>>;
    handleEditOrder(uuid: string): void;
    handleRefresh: ()=>void;
    current: number;
    setCurrent: (val: number) => void;
    forbiddenTabs: string[] | null;
}

const pageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '1000', label: '1000 per page' },
    { value: '1000000', label: 'All' },
];

const hasCorrectNotifications = (record: OrderType, notifications: NotificationType[]) => {
    if (record.status.toLowerCase().includes('error')) {
        const orderNotifications = notifications && notifications.length ? notifications.filter(item => item.objectUuid === record.uuid && !item.message.toLowerCase().includes('error')) : [];
        return !!orderNotifications.length;
    }
    return true;
}

const OrderList: React.FC<OrderListType> = ({orders, currentRange, setCurrentRange, setFilteredOrders,handleEditOrder, current, setCurrent, forbiddenTabs, handleRefresh}) => {
    const isTouchDevice = useIsTouchDevice();
    const {needSeller, sellersList} = useAuth();

   // const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [animating, setAnimating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [fullTextSearch, setFullTextSearch] = useState(false);
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

    //notifications
    const {notifications} = useNotifications();


    //filters
    //seller filter
    const [selectedSeller, setSelectedSeller] = useState<string>('All sellers');

    const calcSellersAmount = useCallback((seller: string) => {
        return orders.filter(order => order.seller?.uid.toLowerCase() === seller.toLowerCase()).length || 0;
    },[orders]);

    const sellersOptions = useMemo(()=>{
        return [{label: 'All sellers', value: 'All sellers', amount: orders.length}, ...sellersList.map(item=>({...item, amount: calcSellersAmount(item.value)}))];
    }, [sellersList, calcSellersAmount]);

    const calcOrderAmount = useCallback((property: string, value: string) => {
        return orders.filter(order => order[property].toLowerCase() === value.toLowerCase() && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    },[orders, selectedSeller]);

    const calcOrderAllTroubleStatuses = useCallback(() => {
        return orders.filter(order => order.lastTroubleStatus.length  && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    },[orders, selectedSeller]);

    const calcOrderWithoutTroubleStatuses = useCallback(() => {
        return orders.filter(order => order.troubleStatuses.length===0  && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    },[orders, selectedSeller]);

    const calcOrderWithClaims = useCallback(() => {
        return orders.filter(order => order.claimsExist  && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    },[orders, selectedSeller]);

    const calcOrderWithCommentsToCourierService = useCallback(() => {
        return orders.filter(order => order.commentToCourierServiceExist  && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    },[orders, selectedSeller]);

    const calcOrderWithBooleanProperty = useCallback((property: string, value: boolean) => {
        return orders.filter(order => order[property] === value  && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    },[orders, selectedSeller]);

    const calcOrderWithLogisticComment = useCallback(()=> {
        return orders.filter(order => !!order.logisticComment && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    }, [orders, selectedSeller]);

    const calcOrderWithoutNonTroubleStatuses = useCallback(()=> {
        return orders.filter(order => !order.nonTroubleEventsExist && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    }, [orders, selectedSeller]);

    const calcOrderAllNonTroubleStatuses = useCallback(()=> {
        return orders.filter(order => !!order.nonTroubleEventsExist && (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller)).length || 0;
    }, [orders, selectedSeller]);

    const calcOrderAmountWithNonTroubleEvent = useCallback((event: string) => {
        const ordersWithEvent = orders.filter(order => (!selectedSeller || selectedSeller==='All sellers' || order.seller.uid == selectedSeller) && order.nonTroubleEvents.filter(orderEvent=> orderEvent.event==event).length > 0);
        return ordersWithEvent.length || 0;
    }, [orders, selectedSeller]);

    const hasNonTroubleEvents = useCallback((filterArray: string[], order: OrderType) => {
        if (!order.nonTroubleEventsExist) return false;

        const filterSet = new Set(filterArray); // Convert one array to a Set for fast lookups
        return order.nonTroubleEventsByString.split(',').some(item => filterSet.has(item));
    }, []);



    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const handleFilterStatusChange = (newStatuses: string[]) => {
        setFilterStatus(newStatuses);
        setCurrent(1);
    }
    // const allStatuses = orders.map(order => order.status);
    const uniqueStatuses = useMemo(() => {
        const statuses = orders.map(order =>  selectedSeller==='All sellers' || order.seller.uid === selectedSeller ? order.status : null).filter(status => status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [orders, selectedSeller]);
    uniqueStatuses.sort();
    const transformedStatuses = useMemo(() => ([
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
            amount: calcOrderAmount('status', status),
        }))
    ]), [uniqueStatuses]);

    const [filterTroubleStatus, setFilterTroubleStatus] = useState<string[]>([]);
    const handleFilterTroubleStatusChange = (newValue: string[]) => {
        setFilterTroubleStatus(newValue);
        setCurrent(1);
    }
    const uniqueTroubleStatuses = useMemo(() => {
        const statuses = orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).map(order => order.lastTroubleStatus);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [orders, selectedSeller]);
    uniqueTroubleStatuses.sort();
    const transformedTroubleStatuses = useMemo(() => ([
        {
            value: '-NO trouble statuses-',
            label: '-Never had trouble statuses-',
            amount: calcOrderWithoutTroubleStatuses(),
        },
        {
            value: '-All trouble statuses-',
            label: '-All trouble statuses-',
            amount: calcOrderAllTroubleStatuses(),
        },
        ...uniqueTroubleStatuses.map(status => ({
            value: status,
            label: status,
            amount: calcOrderAmount('lastTroubleStatus', status),
        }))
    ]), [uniqueTroubleStatuses]);

    //nonTroubleEventsByString, nonTroubleEvents, nonTroubleEventsExist
    const [filterNonTroubleStatus, setFilterNonTroubleStatus] = useState<string[]>([]);
    const handleFilterNonTroubleStatusChange = (newValue: string[]) => {
        setFilterNonTroubleStatus(newValue);
        setCurrent(1);
    }
    const uniqueNonTroubleStatuses = useMemo(() => {
        const nonTroubleEvents= [];
        orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).forEach(order => order.nonTroubleEventsByString.split(',').forEach(event=>nonTroubleEvents.push(event.trim())));
        return Array.from(new Set(nonTroubleEvents)).filter(nonTroubleEvent => nonTroubleEvent).sort();
    }, [orders, selectedSeller]);
    uniqueNonTroubleStatuses.sort();
    const transformedNonTroubleStatuses = useMemo(() => ([
        {
            value: '-NO non-trouble events-',
            label: '-Never had non-trouble events-',
            amount: calcOrderWithoutNonTroubleStatuses(),
        },
        {
            value: '-All non-trouble events-',
            label: '-All non-trouble events-',
            amount: calcOrderAllNonTroubleStatuses(),
        },
        ...uniqueNonTroubleStatuses.map(event => ({
            value: event,
            label: event,
            amount: calcOrderAmountWithNonTroubleEvent(event) || 0,
        }))
    ]), [uniqueNonTroubleStatuses]);

    const [filterClaims, setFilterClaims] = useState<string[]>([]);
    const handleFilterClaimsChange = (newValue: string[]) => {
        setFilterClaims(newValue);
        setCurrent(1);
    }
    const claimFilterOptions = useMemo(() => ([
        {
            value: 'With claims',
            label: 'With claims',
            amount:  calcOrderWithClaims(),
        },
        {
            value: 'Without claims',
            label: 'Without claims',
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithClaims()),
        },
    ]), [orders, selectedSeller]);

    const [filterLogisticComment, setFilterLogisticComment] = useState<string[]>([]);
    const handleFilterLogisticCommentChange = (newValue: string[]) => {
        setFilterLogisticComment(newValue);
        setCurrent(1);
    }
    const logisticCommentFilterOptions = useMemo(() => ([
        {
            value: 'With order issue',
            label: 'With order issue',
            amount:  calcOrderWithLogisticComment(),
        },
        {
            value: 'Without order issue',
            label: 'Without order issue',
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithLogisticComment()),
        },
    ]), [orders, selectedSeller]);

    const [filterCommentsToCourierService, setFilterCommentsToCourierService] = useState<string[]>([]);
    const handleFilterCommentsToCourierServiceChange = (newValue: string[]) => {
        setFilterCommentsToCourierService(newValue);
        setCurrent(1);
    }
    const commentToCourierServiceFilterOptions = useMemo(() => ([
        {
            value: 'With comments',
            label: 'With comments',
            amount:  calcOrderWithCommentsToCourierService(),
        },
        {
            value: 'Without comments',
            label: 'Without comments',
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithCommentsToCourierService()),
        },
    ]), [orders, selectedSeller]);

    const [filterSelfCollect, setFilterSelfCollect] = useState<string[]>([]);
    const handleFilterSelfCollectChange = (newValue: string[]) => {
        setFilterSelfCollect(newValue);
        setCurrent(1);
    }
    const selfCollectFilterOptions = useMemo(() => ([
        {
            value: 'Self collect',
            label: 'Self collect',
            amount:  calcOrderWithBooleanProperty('selfCollect', true),
        },
        {
            value: 'Not self collect',
            label: 'Not self collect',
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithBooleanProperty('selfCollect', true)),
        },
    ]), [orders, selectedSeller]);

    const [filterSentSMS, setFilterSentSMS] = useState<string[]>([]);
    const handleFilterSentSMSChange = (newValue: string[]) => {
        setFilterSentSMS(newValue);
        setCurrent(1);
    }
    const sentSMSFilterOptions = useMemo(() => ([
        {
            value: 'SMS was sent',
            label: 'SMS was sent',
            amount:  calcOrderWithBooleanProperty('sentSMSExist', true),
        },
        {
            value: "Doesn't have SMS",
            label: "Doesn't have SMS",
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithBooleanProperty('sentSMSExist', true)),
        },
    ]), [orders, selectedSeller]);

    const [filterWarehouse, setFilterWarehouse] = useState<string[]>([]);
    const handleFilterWarehouseChange = (newValue: string[]) => {
        setFilterWarehouse(newValue);
        setCurrent(1);
    }
    // const allWarehouses = orders.map(order => order.warehouse);
    const uniqueWarehouses = useMemo(() => {
        const warehouses = orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).map(order => order.warehouse);
        return Array.from(new Set(warehouses)).filter(warehouse => warehouse).sort();
    }, [orders, selectedSeller]);
    uniqueWarehouses.sort();
    const transformedWarehouses = useMemo(() => ([
        ...uniqueWarehouses.map(warehouse => ({
            value: warehouse,
            label: warehouse,
            amount: calcOrderAmount('warehouse', warehouse),
        }))
    ]), [uniqueWarehouses]);

    const [filterCourierService, setFilterCourierService] = useState<string[]>([]);
    const handleFilterCourierServiceChange = (newValue: string[]) => {
        setFilterCourierService(newValue);
        setCurrent(1);
    }
    // const allCourierServices = orders.map(order => order.courierService);
    const uniqueCourierServices = useMemo(() => {
        const courierServices = orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).map(order => order.courierService);
        return Array.from(new Set(courierServices)).filter(courier => courier).sort();
    }, [orders, selectedSeller]);
    uniqueCourierServices.sort();
    const transformedCourierServices = useMemo(() => ([
        ...uniqueCourierServices.map(courier => ({
            value: courier,
            label: courier,
            amount: calcOrderAmount('courierService', courier),
        }))
    ]), [uniqueCourierServices]);

    //receiver country
    const [filterReceiverCountry, setFilterReceiverCountry] = useState<string[]>([]);
    const handleFilterReceiverCountryChange = (newValue: string[]) => {
        setFilterReceiverCountry(newValue);
        setCurrent(1);
    }
    // const allReceiverCountries = orders.map(order => order.receiverCountry);
    const uniqueReceiverCountries = useMemo(() => {
        const receiverCountries = orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).map(order => order.receiverCountry);
        return Array.from(new Set(receiverCountries)).filter(country => country).sort();
    }, [orders, selectedSeller]);
    uniqueReceiverCountries.sort();
    const transformedReceiverCountries = useMemo(() => ([
        ...uniqueReceiverCountries.map(country => ({
            value: country,
            label: Countries[country] as string || country,
            amount: calcOrderAmount('receiverCountry', country),
        }))
    ].sort((item1, item2) => item1.label < item2.label ? -1 : 1)), [uniqueReceiverCountries]);

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
            amount:  calcOrderWithBooleanProperty('ticket', true),
        },
        {
            value: "Without tickets",
            label: "Without tickets",
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithBooleanProperty('ticket', true)),
        },
    ]), [orders, selectedSeller]);

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
            amount:  calcOrderWithBooleanProperty('ticketopen', true),
        },
        {
            value: "Without open tickets",
            label: "Without open tickets",
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithBooleanProperty('ticketopen', true)),
        },
    ]), [orders, selectedSeller]);

    const [filterPhotos, setFilterPhotos] = useState<string[]>([]);
    const handleFilterPhotosChange = (newValue: string[]) => {
        setFilterPhotos(newValue);
        setCurrent(1);
    }
    const photoFilterOptions = useMemo(() => ([
        {
            value: 'With photos',
            label: 'With photos',
            amount:  calcOrderWithBooleanProperty('WarehouseAssemblyPhotos', true),
        },
        {
            value: 'Without photos',
            label: 'Without photos',
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithBooleanProperty('WarehouseAssemblyPhotos', true)),
        },
    ]), [orders, selectedSeller]);

    //customer returns
    const [filterCustomerReturns, setFilterCustomerReturns] = useState<string[]>([]);
    const handleFilterCustomerReturnsChange = (newValue: string[]) => {
        setFilterCustomerReturns(newValue);
        setCurrent(1);
    }
    const customerReturnsOptions = useMemo(() => ([
        {
            value: 'With customer returns',
            label: 'With customer returns',
            amount:  calcOrderWithBooleanProperty('returnsExist', true),
        },
        {
            value: "Without customer returns",
            label: "Without customer returns",
            amount: (orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).length - calcOrderWithBooleanProperty('returnsExist', true)),
        },
    ]), [orders, selectedSeller]);

    //marketplaces
    const [filterMarketplace, setFilterMarketplace] = useState<string[]>([]);
    const handleFilterMarketplaceChange = (newValue: string[]) => {
        setFilterMarketplace(newValue);
        setCurrent(1);
    }
    const uniqueMarketplaces = useMemo(() => {
        const marketplaces = orders.filter(order => !selectedSeller || selectedSeller==='All sellers' || order.seller.uid===selectedSeller).map(order => order.marketplace);
        return Array.from(new Set(marketplaces)).filter(item => item).sort();
    }, [orders, selectedSeller]);
    uniqueMarketplaces.sort();
    const marketplaceOptions = useMemo(() => ([
        ...uniqueMarketplaces.map(item => ({
            value: item,
            label: item,
            amount: calcOrderAmount('marketplace', item),
        }))
    ].sort((item1, item2) => item1.label < item2.label ? -1 : 1)), [uniqueMarketplaces]);


    const handleClearAllFilters = () => {
        setFilterStatus([]);
        setFilterTroubleStatus([]);
        setFilterClaims([]);
        setFilterLogisticComment([]);
        setFilterWarehouse([]);
        setFilterCourierService([]);
        setFilterReceiverCountry([]);
        setFilterCommentsToCourierService([])
        setFilterSelfCollect([]);
        setFilterSentSMS([]);
        setFilterHasTickets([]);
        setFilterHasOpenTickets([]);
        setFilterNonTroubleStatus([]);
        setFilterPhotos([]);

        setCurrent(1);
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
        setCurrent(1)
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
        //setCurrent(1);
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
                (filterTroubleStatus.includes('-NO trouble statuses-') && order.troubleStatuses.length === 0) || filterTroubleStatus.includes(order.lastTroubleStatus);
            const matchesNonTroubleEvent = !filterNonTroubleStatus.length || (filterNonTroubleStatus.includes('-All non-trouble events-') && order.nonTroubleEvents.length) ||
                (filterNonTroubleStatus.includes('-NO non-trouble events-') && order.nonTroubleEvents.length === 0) || hasNonTroubleEvents(filterNonTroubleStatus, order);
            const matchesClaims = !filterClaims.length || (filterClaims.includes('With claims') && order.claimsExist) ||
                (filterClaims.includes('Without claims') && !order.claimsExist);
            const matchesLogisticComment = !filterLogisticComment.length || (filterLogisticComment.includes('With order issue') && !!order.logisticComment) ||
                (filterLogisticComment.includes('Without order issue') && !order.logisticComment);
            const matchesCommentsToCourierService = !filterCommentsToCourierService.length || (filterCommentsToCourierService.includes('With comments') && order.commentToCourierServiceExist) ||
                (filterCommentsToCourierService.includes('Without comments') && !order.commentToCourierServiceExist);
            const matchesSelfCollect = !filterSelfCollect.length || (filterSelfCollect.includes('Self collect') && order.selfCollect) ||
                (filterSelfCollect.includes('Not self collect') && !order.selfCollect);
            const matchesSentSMS = !filterSentSMS.length || (filterSentSMS.includes('SMS was sent') && order.sentSMSExist) ||
                (filterSentSMS.includes("Doesn't have SMS") && !order.sentSMSExist);
            const matchesHasTickets = !filterHasTickets.length || (filterHasTickets.includes('With tickets') && order.ticket) ||
                (filterHasTickets.includes("Without tickets") && !order.ticket);
            const matchesHasOpenTickets = !filterHasOpenTickets.length || (filterHasOpenTickets.includes('With open tickets') && order.ticketopen) ||
                (filterHasOpenTickets.includes("Without open tickets") && !order.ticketopen);
            const matchesWarehouse = !filterWarehouse.length ||
                filterWarehouse.map(item=>item.toLowerCase()).includes(order.warehouse.toLowerCase());
            const matchesCourierService = !filterCourierService.length ||
                filterCourierService.map(item=>item.toLowerCase()).includes(order.courierService.toLowerCase());
            const matchesReceiverCountry = !filterReceiverCountry.length ||
                filterReceiverCountry.map(item => item.toLowerCase()).includes(order.receiverCountry.toLowerCase());
            const matchesPhotos = !filterPhotos.length || (filterPhotos.includes('With photos') && order.WarehouseAssemblyPhotos) ||
                (filterPhotos.includes('Without photos') && !order.WarehouseAssemblyPhotos);
            const matchesReturns = !filterCustomerReturns.length || (filterCustomerReturns.includes('With customer returns') && order.returnsExist) ||
                (filterCustomerReturns.includes('Without customer returns') && !order.returnsExist);
            const matchesMarketplace = !filterMarketplace.length ||
                filterMarketplace.map(item=>item.toLowerCase()).includes(order.marketplace.toLowerCase());

            const matchesSeller = selectedSeller === 'All sellers' || selectedSeller === order.seller.uid;

            return matchesSearch && matchesStatus && matchesTroubleStatus && matchesNonTroubleEvent && matchesClaims && matchesLogisticComment && matchesCommentsToCourierService && matchesSelfCollect && matchesSentSMS && matchesWarehouse && matchesCourierService && matchesReceiverCountry && matchesHasTickets && matchesHasOpenTickets && matchesPhotos && matchesReturns && matchesMarketplace && matchesSeller;
        }).sort((a, b) => {
            if (!sortColumn) return 0;
            if (sortDirection === 'ascend') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        });
    }, [orders, searchTerm, filterStatus, filterTroubleStatus, filterNonTroubleStatus, filterClaims, filterLogisticComment, filterCommentsToCourierService, filterWarehouse, filterCourierService, filterSelfCollect, filterSentSMS, filterReceiverCountry, sortColumn, sortDirection, fullTextSearch, filterHasTickets, filterHasOpenTickets, filterPhotos, filterCustomerReturns, filterMarketplace, selectedSeller]);

    // useEffect(() => {
    //     setCurrent(1)
    // }, [orders, searchTerm]);
    //const [showDatepicker, setShowDatepicker] = useState(false);

    const handleDateRangeSave = (newRange: DateRangeType) => {
        setCurrentRange(newRange);
        //setShowDatepicker(false);
    };

    //filters
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(prevState => !prevState);
    };
    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
    const [isOpenFilterTroubleStatus, setIsOpenFilterTroubleStatus] = useState(false);
    const [isOpenFilterNonTroubleStatus, setIsOpenFilterNonTroubleStatus] = useState(false);
    const [isOpenFilterClaim, setIsOpenFilterClaim] = useState(false);
    const [isOpenFilterLogisticComment, setIsOpenFilterLogisticComment] = useState(false);
    const [isOpenFilterCommentToCourierService, setIsOpenFilterCommentToCourierService] = useState(false);
    const [isOpenFilterSelfCollect, setIsOpenFilterSelfCollect] = useState(false);
    const [isOpenFilterSentSMS, setIsOpenFilterSentSMS] = useState(false);
    const [isOpenFilterWarehouse, setIsOpenFilterWarehouse] = useState(false);
    const [isOpenFilterCourierStatus, setIsOpenFilterCourierStatus] = useState(false);
    const [isOpenFilterReceiverCountry, setIsOpenFilterReceiverCountry] = useState(false);
    const [isOpenFilterHasTickets, setIsOpenFilterHasTickets] = useState(false);
    const [isOpenFilterHasOpenTickets, setIsOpenFilterHasOpenTickets] = useState(false);
    const [isOpenFilterPhotos, setIsOpenFilterPhotos] = useState(false);
    const [isOpenFilterCustomerReturns, setIsOpenFilterCustomerReturns] = useState(false);
    const [isOpenFilterMarketplaces, setIsOpenFilterMarketplaces] = useState(false);


    const orderFilters = [
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
            filterTitle: 'Trouble status',
            icon: 'trouble',
            filterDescriptions: 'Shows orders where the selected trouble status was the last in the trouble status list',
            filterOptions: transformedTroubleStatuses,
            filterState: filterTroubleStatus,
            setFilterState: handleFilterTroubleStatusChange,
            isOpen: isOpenFilterTroubleStatus,
            setIsOpen: setIsOpenFilterTroubleStatus,
            onClose: ()=>handleFilterTroubleStatusChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterTroubleStatus(true);},
        },
        {
            filterTitle: 'Non-trouble events',
            icon: 'event',
            filterDescriptions: '',
            filterOptions: transformedNonTroubleStatuses,
            filterState: filterNonTroubleStatus,
            setFilterState: handleFilterNonTroubleStatusChange,
            isOpen: isOpenFilterNonTroubleStatus,
            setIsOpen: setIsOpenFilterNonTroubleStatus,
            onClose: ()=>handleFilterNonTroubleStatusChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterNonTroubleStatus(true);},
        },
        isTabAllowed('Claims', forbiddenTabs) ? {
            filterTitle: 'Claims',
            icon: 'complaint',
            filterDescriptions: '',
            filterOptions: claimFilterOptions,
            filterState: filterClaims,
            setFilterState: handleFilterClaimsChange,
            isOpen: isOpenFilterClaim,
            setIsOpen: setIsOpenFilterClaim,
            onClose: ()=>handleFilterClaimsChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterClaim(true)},
        } : null,
        isTabAllowed('Order issues', forbiddenTabs) ? {
            filterTitle: 'Order issues',
            filterDescriptions: '',
            icon: 'issue',
            filterOptions: logisticCommentFilterOptions,
            filterState: filterLogisticComment,
            setFilterState: handleFilterLogisticCommentChange,
            isOpen: isOpenFilterLogisticComment,
            setIsOpen: setIsOpenFilterLogisticComment,
            onClose: ()=>handleFilterLogisticCommentChange([]),
            onClick: ()=>{()=>{setIsFiltersVisible(true); setIsOpenFilterLogisticComment(true)}},
        } : null,
        isTabAllowed('Comment to courier service', forbiddenTabs) ? {
            filterTitle: 'Comments to courier service',
            icon: 'comment',
            filterDescriptions: '',
            filterOptions: commentToCourierServiceFilterOptions,
            filterState: filterCommentsToCourierService,
            setFilterState: handleFilterCommentsToCourierServiceChange,
            isOpen: isOpenFilterCommentToCourierService,
            setIsOpen: setIsOpenFilterCommentToCourierService,
            onClose: ()=>handleFilterCommentsToCourierServiceChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterCommentToCourierService(true)},
        } : null,
        {
            filterTitle: 'Self collect',
            icon: 'self-collect',
            filterDescriptions: '',
            filterOptions: selfCollectFilterOptions,
            filterState: filterSelfCollect,
            setFilterState: handleFilterSelfCollectChange,
            isOpen: isOpenFilterSelfCollect,
            setIsOpen: setIsOpenFilterSelfCollect,
            onClose: ()=>handleFilterSelfCollectChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterSelfCollect(true)},
        },
        isTabAllowed('SMS history', forbiddenTabs) ? {
            filterTitle: 'Sent SMS',
            icon: 'sms',
            filterDescriptions: '',
            filterOptions: sentSMSFilterOptions,
            filterState: filterSentSMS,
            setFilterState: handleFilterSentSMSChange,
            isOpen: isOpenFilterSentSMS,
            setIsOpen: setIsOpenFilterSentSMS,
            onClose: ()=>handleFilterSentSMSChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterSentSMS(true)},
        } : null,
        {
            filterTitle: 'Warehouse',
            icon: 'warehouse',
            filterDescriptions: '',
            filterOptions: transformedWarehouses,
            filterState: filterWarehouse,
            setFilterState: handleFilterWarehouseChange,
            isOpen: isOpenFilterWarehouse,
            setIsOpen: setIsOpenFilterWarehouse,
            onClose: ()=>handleFilterWarehouseChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterWarehouse(true)},
        },
        {
            filterTitle: 'Courier service',
            icon: 'courier-service',
            filterDescriptions: '',
            filterOptions: transformedCourierServices,
            filterState: filterCourierService,
            setFilterState: handleFilterCourierServiceChange,
            isOpen: isOpenFilterCourierStatus,
            setIsOpen: setIsOpenFilterCourierStatus,
            onClose: ()=>handleFilterCourierServiceChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterCourierStatus(true)},
        },
        {
            filterTitle: 'Receiver country',
            icon: 'country-in',
            isCountry: true,
            filterDescriptions: '',
            filterOptions: transformedReceiverCountries,
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
        {
            filterTitle: 'Photos from warehouse',
            // isCountry: true,
            icon: 'webcam',
            filterDescriptions: '',
            filterOptions: photoFilterOptions,
            filterState: filterPhotos,
            setFilterState: handleFilterPhotosChange,
            isOpen: isOpenFilterPhotos,
            setIsOpen: setIsOpenFilterPhotos,
            onClose: ()=>handleFilterPhotosChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterPhotos(true)},
        },
        isTabAllowed('Customer returns', forbiddenTabs) ? {
            filterTitle: 'Customer returns',
            // isCountry: true,
            icon: 'package-return',
            filterDescriptions: '',
            filterOptions: customerReturnsOptions,
            filterState: filterCustomerReturns,
            setFilterState: handleFilterCustomerReturnsChange,
            isOpen: isOpenFilterCustomerReturns,
            setIsOpen: setIsOpenFilterCustomerReturns,
            onClose: ()=>handleFilterCustomerReturnsChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterCustomerReturns(true)},
        } : null,
        {
            filterTitle: 'Marketplaces',
            // isCountry: true,
            icon: 'marketplace',
            filterDescriptions: '',
            filterOptions: marketplaceOptions,
            filterState: filterMarketplace,
            setFilterState: handleFilterMarketplaceChange,
            isOpen: isOpenFilterMarketplaces,
            setIsOpen: setIsOpenFilterMarketplaces,
            onClose: ()=>handleFilterMarketplaceChange([]),
            onClick: ()=>{setIsFiltersVisible(true); setIsOpenFilterMarketplaces(true)},
        }
    ];

    useEffect(() => {
        setFilteredOrders(filteredOrders);

    }, [filteredOrders]);

    const curWidth = useMemo(()=>{
        const displayedData = filteredOrders.slice((current - 1) * pageSize, current * pageSize);
        const maxAmount = displayedData.reduce((acc,item)=> Math.max(acc, item.productLines),0).toString().length;
        const width = 47+maxAmount*9;
        return width.toString()+'px';
    },[current, pageSize, filteredOrders]);


    const ClaimsColumns: TableColumnProps<OrderType>[] = [];
    if (isTabAllowed('Claims', forbiddenTabs)) {
        ClaimsColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="26px"
                maxWidth="26px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="If order has Claims" >
                        <span><Icon name={"complaint"} className='header-icon' /></span>
                    </Tooltip>
                }
            />,
                render: (text: string, record) => {
            return (
                <TableCell
                    className='no-padding'
                    minWidth="26px"
                    maxWidth="26px"
                    contentPosition="center"
                    childrenBefore={
                        record.claimsExist && (
                            <Popover
                                content={record.claims.length ? <SimplePopup
                                    items={record.claims.map(orderItem => ({
                                        uuid: record.uuid,
                                        title: formatDateTimeToStringWithDotWithoutSeconds(orderItem.date),
                                        description: orderItem.status,
                                    }))}
                                /> : null}
                                trigger={isTouchDevice ? 'click' : 'hover'}
                                placement="right"
                                overlayClassName="doc-list-popover"
                            >
                                <div style={{
                                    minHeight: '8px',
                                    minWidth: '8px',
                                    backgroundColor: 'red',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    alignSelf: 'center',
                                }} />
                            </Popover>
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
                responsive: ['lg'],

        } as TableColumnProps<OrderType>);
    }

    const OrderIssueColumns: TableColumnProps<OrderType>[] = [];
    if (isTabAllowed('Order issues', forbiddenTabs)) {
        OrderIssueColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="42px"
                maxWidth="46px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="If order has Order issues" >
                        <span className='table-header-title'>Order issue</span>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="42px"
                        maxWidth="46px"
                        contentPosition="center"
                        childrenBefore={
                            !!record.logisticComment && (
                                <Popover
                                    content={<SimplePopup
                                        items={[{
                                            title: '',
                                            description: record.logisticComment,
                                        }] as PopupItem[]}
                                    />}
                                    trigger={isTouchDevice ? 'click' : 'hover'}
                                    placement="right"
                                    overlayClassName="doc-list-popover"
                                >
                                    <div style={{
                                        minHeight: '8px',
                                        minWidth: '8px',
                                        backgroundColor: 'red',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        alignSelf: 'center',
                                    }} />
                                </Popover>
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'logisticComment',
            key: 'logisticComment',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<OrderType>);
    }

    const SellerColumns: TableColumnProps<OrderType>[] = [];
    if (needSeller()) {
        SellerColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="60px"
                maxWidth="80px"
                contentPosition="left"
                childrenBefore={
                    <Tooltip title="Seller's name" >
                        <span className='table-header-title'>Seller</span>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="60px"
                        maxWidth="80px"
                        contentPosition="left"
                        childrenBefore={
                            <div className="seller-container">
                                {record.seller.description}
                            </div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'seller',
            key: 'seller',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<OrderType>);
    }

    const columns: TableColumnProps<OrderType>[]  = [
        {
            title: <TitleColumn
                    minWidth="50px"
                    maxWidth="50px"
                    contentPosition="center"
                    childrenBefore={<Tooltip title="Sender country ➔ Receiver country"> <Icon  name={"car"}/></Tooltip>}>
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
                        <Popover
                            content={<SimplePopup
                                items={[
                                    { uuid: record.uuid, title: "Country", description: record.receiverCountry } as PopupItem,
                                    { uuid: record.uuid, title: "City", description: record.receiverCity },
                                    { uuid: record.uuid, title: "Zip", description: record.receiverZip },
                                    { uuid: record.uuid, title: "Address", description: record.receiverAddress },
                                    { uuid: record.uuid, title: "Full name", description: record.receiverFullName },
                                    { uuid: record.uuid, title: "Phone", description: record.receiverPhone },
                                    { uuid: record.uuid, title: "E-mail", description: record.receiverEMail },
                                    { uuid: record.uuid, title: "Comment", description: record.receiverComment },
                                ] as PopupItem[]}
                                width={350}
                            />}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="right"
                            overlayClassName="doc-list-popover"
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span className={`fi fi-${record.receiverCountry.toLowerCase()} flag-icon`}/>
                                <div style={{ fontSize: '8px' }}>{record.receiverCountry}</div>
                            </div>
                        </Popover>
                    }
                >
                </TableCell>,
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: <TitleColumn
                className='no-padding'
                minWidth="26px"
                maxWidth="26px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="If order has photos from warehouse" >
                        <span><Icon name={"webcam"} className='header-icon' /></span>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="26px"
                        maxWidth="26px"
                        contentPosition="center"
                        childrenBefore={
                            record?.WarehouseAssemblyPhotos && (
                                <div style={{
                                    minHeight: '8px',
                                    minWidth: '8px',
                                    backgroundColor: 'var(--color-blue)',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    alignSelf: 'center',
                                }} />
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'WarehouseAssemblyPhotos',
            key: 'WarehouseAssemblyPhotos',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        },
        ...ClaimsColumns,
        {
            title: <TitleColumn
                className='no-padding'
                minWidth="26px"
                maxWidth="26px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="If order has Trouble statuses">
                        <span><Icon name={"trouble"} className='header-icon'/></span>
                    </Tooltip>
                }
            />,
            render: (text: string, record) => {
                return (
                    <TableCell
                        className='no-padding'
                        minWidth="26px"
                        maxWidth="26px"
                        contentPosition="center"
                        childrenBefore={
                            record.troubleStatusesExist && (
                                <Popover
                                    content={record.troubleStatuses.length ? <SimplePopup
                                        items={record.troubleStatuses.map(orderItem => ({
                                            uuid: record.uuid,
                                            title: formatDateTimeToStringWithDotWithoutSeconds(orderItem.period),
                                            description: orderItem.troubleStatus + ': ' + orderItem.additionalInfo,
                                        }))}
                                        width={500}
                                        needScroll={true}
                                    /> : null}
                                    trigger={isTouchDevice ? 'click' : 'hover'}
                                    placement="right"
                                    overlayClassName="doc-list-popover"
                                >
                                    <div style={{
                                        minHeight: '8px',
                                        minWidth: '8px',
                                        backgroundColor: 'red',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        alignSelf: 'center',
                                    }} />

                                </Popover>
                            )
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'troubleStatusesExist',
            key: 'troubleStatusesExist',
            sorter: false,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        },
        ...OrderIssueColumns,
        {
            title: <TitleColumn title="" minWidth="20px" maxWidth="20px" contentPosition="start"
            />,
            render: (text: string, record: OrderType) => (
                <TableCell
                    className='no-padding'
                    minWidth="20px"
                    maxWidth="20px"
                    contentPosition="center"
                    childrenAfter ={
                        <span style={{marginTop:'3px'}}>{record.notifications && hasCorrectNotifications(record, notifications) ? <Icon name="notification" />: null}</span>}
                >
                </TableCell>

            ),
            dataIndex: 'notifications',
            key: 'notifications',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="60px" maxWidth="100px" contentPosition="start" childrenBefore={<Tooltip title="Current condition of an order"><span>Status</span></Tooltip>}/>,
            render: (text: string, record) => {
                const underlineColor = getUnderlineColor(record.status==='Error' ? record.status : record.statusGroup);
                return (
                    <TableCell
                        minWidth="50px"
                        maxWidth="90px"
                        contentPosition="start"
                        childrenAfter={
                            <Popover
                                content={<SimplePopup
                                    items={[
                                        {
                                            uuid: record.uuid,
                                            title: formatDateTimeToStringWithDotWithoutSeconds(record.lastUpdateDate),
                                            description: record.statusAdditionalInfo
                                        } as PopupItem,
                                    ]}
                                    width={400}
                                />}
                                trigger={isTouchDevice ? 'click' : 'hover'}
                                placement="right"
                                overlayClassName="doc-list-popover"
                            >
                                <span style={{
                                        borderBottom: `2px solid ${underlineColor}`,
                                        display: 'inline-block',
                                    }}>{text}</span>
                            </Popover>
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
            title: <TitleColumn minWidth="60px" maxWidth="80px" contentPosition="start" childrenBefore={<Tooltip title="When an order was created"><span>Date</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell minWidth="60px" maxWidth="80px" contentPosition="start"
                    childrenAfter={
                        <div className="table-date-time-container">
                            <span className="table-date">{formatDateStringToDisplayString(text)}</span>
                            <span className="table-time">{formatTimeStringFromString(text)}</span>
                        </div>
                    }
                />

            ),
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            onHeaderCell: (column: ColumnType<OrderType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            }),
        },
        {
            title: <TitleColumn minWidth="100px" maxWidth="100px" contentPosition="start" childrenBefore={<Tooltip title="Order identifier within the WAPI system"><span>WH number</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell
                    value={text}
                    minWidth="100px"
                    maxWidth="100px"
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
            title: <TitleColumn minWidth="65px" maxWidth="65px" contentPosition="center" childrenBefore={<Tooltip title="The sum of cash on delivery"><span>COD</span></Tooltip>}/>,
            render: (text: string, record) => {
                if (record.codCurrency) {
                    const currencySymbol = getSymbolFromCurrency(record.codCurrency);
                    return (
                        <TableCell
                            value={`${text} ${currencySymbol}`}
                            minWidth="65px"
                            maxWidth="65px"
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
            title: <TitleColumn minWidth="80px" maxWidth="80px" contentPosition="start" childrenBefore={<Tooltip title="Unique code for order identification in the seller's system"><span>Order ID</span></Tooltip>}/>,
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
        ...SellerColumns,
        {
            title: <TitleColumn minWidth="60px" maxWidth="60px" contentPosition="start" childrenBefore={<Tooltip title="Code of warehouse"><span>Warehouse</span></Tooltip>}/>,
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
            title: <TitleColumn minWidth="75px" maxWidth="75px" contentPosition="start" childrenBefore={<Tooltip title="Service responsible for transporting and delivering packages"><span>Courier</span></Tooltip>}/>,
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
            title: <TitleColumn minWidth="70px" maxWidth="70px" contentPosition="start" childrenBefore={<Tooltip title="Number for monitoring the movement of products during transportation/delivery"><span>Tracking</span></Tooltip>}/>,
            render: (text: string, record) => (
                <TableCell  minWidth="70px" maxWidth="70px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer' childrenBefore={record.trackingNumber && <span  className='track-link' >Track<Icon name='track'/></span> }/>
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
                        if (record.trackingNumber) {
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
                maxWidth="100px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Products" >
                        <span><Icon name={"shopping-cart"}/></span>
                    </Tooltip>
                }
            />,
            render: (text: string, record: OrderType) => (
                <TableCell
                    minWidth="50px"
                    maxWidth="100px"
                    contentPosition="center"
                    childrenAfter = {
                        <Popover
                            content={record.products.length ? <SimplePopup
                                items={record.products.map(item => ({
                                    uuid: record.uuid,
                                    title: item.product,
                                    description: item.quantity,
                                }))}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span style={{width: curWidth}} className="products-cell-style">{text} <Icon name="info" /></span>
                        </Popover>
                    }
                >
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
        <div className="table order-list">
            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                <DateInput handleRangeChange={handleDateRangeSave} currentRange={currentRange} />
                {/*<Button onClick={handleRefresh}>Refresh</Button>*/}
                <div className='search-block'>
                    <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{setSearchTerm(""); handleFilterChange("");}} />
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
                    <FiltersChosen filters={orderFilters.filter(item=>item!==null)} />
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
                    dataSource={filteredOrders.map(item => ({...item, key:item.uuid})).slice((current - 1) * pageSize, current * pageSize)}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                    showSorterTooltip={false}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total orders:<span className='order-products-total__list-item__value'>{filteredOrders.length}</span></li>
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
                <FiltersListWithOptions filters={orderFilters.filter(item=>item!==null)} />
            </FiltersContainer>
        </div>
    );
};

export default React.memo(OrderList);
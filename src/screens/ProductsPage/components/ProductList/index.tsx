import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pagination, Popover, Table, TableColumnProps, Tooltip} from 'antd';
import {ColumnType} from "antd/es/table";

import "./styles.scss";
import "@/styles/tables.scss";

import {ProductType} from "@/types/products";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import {PageOptions} from '@/constants/pagination';
import SearchField from "@/components/SearchField";
import {FormFieldTypes} from "@/types/forms";
import Button, {ButtonVariant} from "@/components/Button/Button";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import SearchContainer from "@/components/SearchContainer";
import FiltersContainer from "@/components/FiltersContainer";
import SimplePopup, {PopupItem} from "@/components/SimplePopup";
import {useIsTouchDevice} from "@/hooks/useTouchDevice";
import FiltersListWithOptions from "@/components/FiltersListWithOptions";
import FiltersChosen from "@/components/FiltersChosen";
import useAuth from "@/context/authContext";
import SelectField from "@/components/FormBuilder/Select/SelectField";
import {getSellerName} from "@/utils/seller";

type ProductListType = {
    products: ProductType[];
    setFilteredProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
    // setProductsData: React.Dispatch<React.SetStateAction<ProductType[]>>;
    handleEditProduct(uuid: string): void;
    reFetchData: ()=>void;
}

const statusFilter = [
    { value: 'All statuses', label: 'All statuses' , color: 'var(--color-light-blue-gray)'},
    { value: 'Approved', label: 'Approved' , color: '#5380F5'},
    { value: 'Declined', label: 'Declined' , color: '#FF4000'},
    { value: 'Draft', label: 'Draft' , color: '#FEDB4F'},
    { value: 'Pending', label: 'Pending' , color: '#FFA500'},
    { value: 'Rejected', label: 'Rejected' , color: '#FF4000'},
    { value: 'Expired', label: 'Expired' , color: '#FF4000'},
];


const extraStatusHints = {
    'Draft' : ' - needs to be send for approve',
}



const ProductList: React.FC<ProductListType> = ({products, setFilteredProducts, handleEditProduct, reFetchData}) => {
    const { needSeller, sellersList } = useAuth();
    const isTouchDevice = useIsTouchDevice();
    const [animating, setAnimating] = useState(false);

    // Popup
    const getPopupItems = useCallback((hoveredProduct) => {
        return hoveredProduct ? hoveredProduct.stock.map(stockItem => ({
            uuid: hoveredProduct.uuid,
            title: stockItem.warehouse,
            description: stockItem.available
        })) : [];
    }, []);

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
    const [sortColumn, setSortColumn] = useState<keyof ProductType | null>(null);
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof ProductType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);

    // Filter and searching
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

    //filters
    //seller filter
    const [selectedSeller, setSelectedSeller] = useState<string>('All sellers');

    const calcSellersAmount = useCallback((seller: string) => {
        return products.filter(order => order.seller.toLowerCase() === seller.toLowerCase()).length || 0;
    },[products]);

    const sellersOptions = useMemo(()=>{
        return [{label: 'All sellers', value: 'All sellers', amount: products.length}, ...sellersList.map(item=>({...item, amount: calcSellersAmount(item.value)}))];
    }, [sellersList, calcSellersAmount]);

    // const getSellerName = useCallback((sellerUid: string) => {
    //     const t = sellersList.find(item=>item.value===sellerUid);
    //     return t ? t.label : ' - ';
    // }, [sellersList]);

    const calcProductAmount = useCallback((property: string, value: string) => {
        return products.filter(product => product[property].toLowerCase() === value.toLowerCase() && (!selectedSeller || selectedSeller==='All sellers' || product.seller == selectedSeller)).length || 0;
    },[products, selectedSeller]);

    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const handleFilterStatusChange = (newStatuses: string[]) => {
        setFilterStatus(newStatuses);
        setCurrent(1);
    }
    const uniqueStatuses = useMemo(() => {
        const statuses = products.filter(product => !selectedSeller || selectedSeller==='All sellers' || product.seller == selectedSeller).map(invoice => invoice.status);
        return Array.from(new Set(statuses)).filter(status => status).sort();
    }, [products, selectedSeller]);
    uniqueStatuses.sort();
    const transformedStatuses = useMemo(() => ([
        ...uniqueStatuses.map(status => ({
            value: status,
            label: status,
            amount: calcProductAmount('status', status),
            color: statusFilter.filter(item=>item.value===status)[0]?.color || 'white',
        }))
    ]), [uniqueStatuses, calcProductAmount]);

    const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);

    const productFilters = [
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
    ];

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTerm(newSearchTerm);
        setCurrent(1);
    };

    const filteredProducts = useMemo(() => {
        //setCurrent(1);
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = products.filter(product => {
            const matchesSearch = !searchTerm || Object.keys(product).some(key => {
                const value = product[key];
                return key !== 'uuid' && typeof value === 'string' && value.toLowerCase().includes(searchTermLower);
            });
            const matchesStatus = !filterStatus.length || filterStatus.map(item=>item.toLowerCase()).includes(product.status.toLowerCase());
            const matchesSeller = !selectedSeller || selectedSeller === 'All sellers' || selectedSeller === product.seller;

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
    }, [products, searchTerm, filterStatus, sortColumn, sortDirection, selectedSeller]);

    useEffect(() => {
        setFilteredProducts(filteredProducts)
    }, [filteredProducts]);

    // Table
    const SellerColumns: TableColumnProps<ProductType>[] = [];
    if (needSeller()) {
        SellerColumns.push({
            title: <TitleColumn
                className='no-padding'
                minWidth="70px"
                maxWidth="90px"
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
                        minWidth="70px"
                        maxWidth="90px"
                        contentPosition="left"
                        childrenBefore={
                            <div className="seller-container">
                                {getSellerName(sellersList, record.seller)}
                            </div>
                        }
                    >
                    </TableCell>
                );
            },
            dataIndex: 'seller',
            key: 'seller',
            sorter: false,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['lg'],
        } as TableColumnProps<ProductType>);
    }

    const columns: ColumnType<ProductType>[] = useMemo(() => [
        // {
        //     title: (
        //         <div style={{width: '30px', justifyContent: 'center', alignItems: 'center'}}>
        //             <FieldBuilder
        //                 name={'selectedAllUnits'}
        //                 fieldType={FormFieldTypes.CHECKBOX}
        //                 checked={isAllSelected}
        //                 //disabled={}
        //                 onChange={(e: ChangeEvent<HTMLInputElement>) => {
        //                     selectAllProducts(e.target.checked);
        //                 }}
        //                 classNames={'no-margin vertical-center'}
        //             /></div>
        //
        //     ),
        //     dataIndex: 'selected',
        //     width: '40px',
        //     key: 'selected',
        //     render: (text: string, record, index) => (
        //         <FieldBuilder
        //             name={`products.${index}.selected`}
        //             fieldType={FormFieldTypes.CHECKBOX}
        //             value={record?.selected || false}
        //             onChange={(e: ChangeEvent<HTMLInputElement>)=>selectProduct(e.target.checked,record)}
        //             classNames={'no-margin vertical-center'}
        //         />
        //     ),
        // },
        {
            width: "33px",
            title: <TitleColumn minWidth="20px" maxWidth="20px" contentPosition="center"/>,
            render: (status: string, record) => {
                const statusObj = statusFilter.find(s => s.value === status);
                let color = statusObj ? statusObj.color : 'white';
                return (
                    <TableCell
                        minWidth="20px"
                        maxWidth="20px"
                        contentPosition="center"
                        childrenAfter={
                            <Popover
                                content={<SimplePopup
                                    items={[{
                                            uuid: record?.uuid || '',
                                            title: record?.status + (extraStatusHints[record?.status] || '') || ''
                                        } as PopupItem]
                                    }
                                    //width={100}
                                />}
                                trigger={isTouchDevice ? 'click' : 'hover'}
                                placement="right"
                                overlayClassName="doc-list-popover"
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: color
                                }}></div>
                            </Popover>
                        }>
                    </TableCell>
                );
            },
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: <TitleColumn title="" minWidth="20px" maxWidth="20px" contentPosition="start"
            />,
            render: (text: string, record: ProductType) => (
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
            title: <TitleColumn minWidth="110px" maxWidth="200px" contentPosition="start" childrenBefore={<Tooltip title="A unique code for tracking each product in inventory"><span>SKU</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="110px" maxWidth="200px" contentPosition="start"/>
            ),
            dataIndex: 'sku',
            key: 'sku',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['sm'],
        },
        {
            title: <TitleColumn title="Name" minWidth="150px" maxWidth="500px" contentPosition="start" />,
            render: (text: string) => (
                <TableCell value={text} minWidth="150px" maxWidth="500px" contentPosition="start" textColor='var(--color-blue)' cursor='pointer'/>
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            onCell: (record) => {
                return {
                    onClick: () => handleEditProduct(record.uuid)
                };
            },
        },
        ...SellerColumns,
        {
            title: <TitleColumn minWidth="100px" maxWidth="100px" contentPosition="center" childrenBefore={<Tooltip title="Length, width, and height in millimeters"><span>Dimension | mm</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="100px" maxWidth="100px" contentPosition="center"/>
            ),
            dataIndex: 'dimension',
            key: 'dimension',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Weight | kg" minWidth="80px" maxWidth="80px" contentPosition="center"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="80px" contentPosition="center"/>
            ),
            dataIndex: 'weight',
            key: 'weight',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn minWidth="100px" maxWidth="300px" contentPosition="start" childrenBefore={<Tooltip title="Alternative names"><span>Aliases</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text.trim().slice(-1)==='|' ? text.trim().slice(0, text.length-2) : text} minWidth="100px" maxWidth="300px" contentPosition="start"/>
            ),
            dataIndex: 'aliases',
            key: 'aliases',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn title="Barcodes" minWidth="100px" maxWidth="300px" contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text.trim().slice(-1)==='|' ? text.trim().slice(0, text.length-2) : text} minWidth="100px" maxWidth="300px" contentPosition="start"/>
            ),
            dataIndex: 'barcodes',
            key: 'barcodes',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="90px" maxWidth="90px" contentPosition="center" childrenBefore={<Tooltip title="Available products for new orders"><span>Available</span></Tooltip>} />,
            render: (text: string, record: ProductType) => (
                <TableCell
                    minWidth="90px"
                    maxWidth="90px"
                    contentPosition="start"
                    childrenAfter={
                        <Popover
                            content={record.stock.length ? <SimplePopup
                                items={getPopupItems(record)}
                                width={150}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span className="stock-cell-style">{text} <Icon name="info" /></span>
                        </Popover>
                    }>
                </TableCell>
            ),
            dataIndex: 'available',
            key: 'available',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductType),
            }),
        },
        ], [handleHeaderCellClick]);   //], [handleHeaderCellClick, isAllSelected]);

    return (
        <div className='table'>
            {/*{isLoading && <Loader />}*/}
            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER}
                        icon={'filter'}></Button>
                <div className='search-block'>
                    <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={() => {
                        setSearchTerm("");
                        handleFilterChange("");
                    }}/>
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
            <div className='product-list__notice'>
                <p>Before sending a new product to our warehouse, please wait until the product receives "Approved" status</p>
            </div>

            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    <FiltersChosen filters={productFilters} />
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
            <div className='product-list__container'>
                <div
                    className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredProducts?.length ? '' : 'is-empty'}`}>
                    <Table
                        dataSource={filteredProducts.map(item => ({
                            ...item,
                            key: item.uuid
                        })).slice((current - 1) * pageSize, current * pageSize)}
                        columns={columns}
                        pagination={false}
                        scroll={{y: 700}}
                        showSorterTooltip={false}
                    />
                    <div className="order-products-total">
                        <ul className='order-products-total__list'>
                            <li className='order-products-total__list-item'>Total products:<span
                                className='order-products-total__list-item__value'>{filteredProducts.length}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={filteredProducts.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>
            <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible}
                              onClearFilters={() => handleFilterStatusChange([])}>
                <FiltersListWithOptions filters={productFilters} />
            </FiltersContainer>
        </div>
    );
};

export default React.memo(ProductList);